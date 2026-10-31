import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import { supabase, isSupabaseConfigured } from './supabase';
import { INITIAL_DEMO_WISHES } from './data/roseData';

// =========================
// IndexedDB Cache Helper สำหรับโหมดเชื่อมต่อ Supabase
// =========================
const DB_NAME = 'Rose19BirthdayWishesDB';
const STORE_NAME = 'wishes_cache_store';
const LOCAL_FALLBACK_KEY = 'rose19_wishes_local_v2';
const WISHES_TABLE = import.meta.env.VITE_SUPABASE_TABLE || 'rose_wishes';

const initDB = () =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e) => {
      e.target.result.createObjectStore(STORE_NAME);
    };
  });

const saveToIDB = async (data) => {
  try {
    if (!window.indexedDB) return;
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(data, 'cache');
  } catch (e) {
    console.warn('IDB save warning:', e);
  }
};

const getFromIDB = async () => {
  try {
    if (!window.indexedDB) return null;
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('IDB Timeout')), 2000)
    );
    const dbPromise = (async () => {
      const db = await initDB();
      return new Promise((resolve, reject) => {
        const req = db
          .transaction(STORE_NAME, 'readonly')
          .objectStore(STORE_NAME)
          .get('cache');
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    })();
    return await Promise.race([dbPromise, timeout]);
  } catch {
    return null;
  }
};

const loadLocalFallbackWishes = () => {
  try {
    const raw = localStorage.getItem(LOCAL_FALLBACK_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('LocalStorage read error:', e);
  }
  localStorage.setItem(LOCAL_FALLBACK_KEY, JSON.stringify(INITIAL_DEMO_WISHES));
  return INITIAL_DEMO_WISHES;
};

const saveLocalFallbackWishes = (items) => {
  try {
    localStorage.setItem(LOCAL_FALLBACK_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn('LocalStorage write error:', e);
  }
};

export default function App() {
  const [wishes, setWishes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const sortWishes = (items) =>
    [...items].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

  // =========================
  // โหลดข้อมูล (รองรับทั้งโหมด Supabase และโหมด Local ทันที)
  // =========================
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      const initial = sortWishes(loadLocalFallbackWishes());
      setWishes(initial);
      setIsLoading(false);

      const onStorage = (e) => {
        if (e.key === LOCAL_FALLBACK_KEY) {
          setWishes(sortWishes(loadLocalFallbackWishes()));
        }
      };
      window.addEventListener('storage', onStorage);
      return () => window.removeEventListener('storage', onStorage);
    }

    let isMounted = true;

    const fetchSupabaseWishes = async () => {
      let hasCache = false;
      const cached = await getFromIDB();
      if (isMounted && Array.isArray(cached) && cached.length > 0) {
        setWishes(cached);
        hasCache = true;
        setIsLoading(false);
      }

      try {
        if (!hasCache && isMounted) setIsLoading(true);
        const { data, error } = await supabase
          .from(WISHES_TABLE)
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching wishes:', error);
          return;
        }

        if (isMounted) {
          const list = data || [];
          setWishes(list);
          saveToIDB(list);
        }
      } catch (err) {
        console.error('Unexpected fetch error:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchSupabaseWishes();

    const channel = supabase
      .channel('rose-wishes-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: WISHES_TABLE },
        async (payload) => {
          const { data } = await supabase
            .from(WISHES_TABLE)
            .select('*')
            .eq('id', payload.new.id)
            .single();
          if (!data) return;
          setWishes((prev) =>
            sortWishes([data, ...prev.filter((w) => w.id !== data.id)])
          );
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: WISHES_TABLE },
        async (payload) => {
          const { data } = await supabase
            .from(WISHES_TABLE)
            .select('*')
            .eq('id', payload.new.id)
            .single();
          if (!data) return;
          setWishes((prev) => {
            const exists = prev.some((w) => w.id === data.id);
            if (exists) {
              return sortWishes(
                prev.map((w) => (w.id === data.id ? data : w))
              );
            }
            return sortWishes([data, ...prev]);
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: WISHES_TABLE },
        (payload) => {
          const deletedId = payload.old?.id;
          if (!deletedId) return;
          setWishes((prev) => prev.filter((w) => w.id !== deletedId));
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  // =========================
  // เพิ่มคำอวยพรใหม่ (ตั้งสถานะเป็น pending เพื่อรอแอดมินอนุมัติ)
  // =========================
  const addWish = async (wishData) => {
    const newPayload = {
      bg: wishData.bg,
      name: wishData.name,
      message: wishData.message,
      img: wishData.img || null,
      status: 'pending',
    };

    if (!isSupabaseConfigured || !supabase) {
      const localRecord = {
        ...newPayload,
        id: Date.now(),
        created_at: new Date().toISOString(),
      };
      setWishes((prev) => {
        const next = sortWishes([localRecord, ...prev]);
        saveLocalFallbackWishes(next);
        return next;
      });
      return true;
    }

    try {
      const { data, error } = await supabase
        .from(WISHES_TABLE)
        .insert([newPayload])
        .select()
        .single();

      if (error) {
        console.error('Error inserting wish:', error);
        alert('เกิดข้อผิดพลาดในการบันทึกคำอวยพร กรุณาลองใหม่อีกครั้ง');
        return false;
      }

      if (data) {
        setWishes((prev) =>
          sortWishes([data, ...prev.filter((w) => w.id !== data.id)])
        );
      }
      return true;
    } catch (err) {
      console.error('Add wish error:', err);
      alert('เกิดข้อผิดพลาดในการบันทึกคำอวยพร');
      return false;
    }
  };

  // =========================
  // อัปเดตสถานะ (approved / hidden) สำหรับหน้า /admin
  // =========================
  const updateWishStatus = async (id, newStatus) => {
    if (!id) return false;

    if (!isSupabaseConfigured || !supabase) {
      setWishes((prev) => {
        const next = prev.map((w) =>
          w.id === id ? { ...w, status: newStatus } : w
        );
        saveLocalFallbackWishes(next);
        return next;
      });
      return true;
    }

    try {
      const { error } = await supabase
        .from(WISHES_TABLE)
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        console.error('Error updating wish status:', error);
        alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
        return false;
      }

      setWishes((prev) =>
        prev.map((w) => (w.id === id ? { ...w, status: newStatus } : w))
      );
      return true;
    } catch (err) {
      console.error('Update status error:', err);
      alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
      return false;
    }
  };

  // =========================
  // ลบคำอวยพร สำหรับหน้า /admin
  // =========================
  const deleteWish = async (id) => {
    if (!id) return false;

    if (!isSupabaseConfigured || !supabase) {
      setWishes((prev) => {
        const next = prev.filter((w) => w.id !== id);
        saveLocalFallbackWishes(next);
        return next;
      });
      return true;
    }

    try {
      const { error } = await supabase.from(WISHES_TABLE).delete().eq('id', id);
      if (error) {
        console.error('Error deleting wish:', error);
        alert('เกิดข้อผิดพลาดในการลบคำอวยพร');
        return false;
      }

      setWishes((prev) => prev.filter((w) => w.id !== id));
      return true;
    } catch (err) {
      console.error('Delete wish error:', err);
      alert('เกิดข้อผิดพลาดในการลบคำอวยพร');
      return false;
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              wishes={wishes}
              addWish={addWish}
              isLoading={isLoading}
            />
          }
        />
        <Route
          path="/admin"
          element={
            <Admin
              wishes={wishes}
              updateWishStatus={updateWishStatus}
              deleteWish={deleteWish}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
