import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import { supabase, isSupabaseConfigured } from './supabase';
import { INITIAL_DEMO_WISHES, ROSE_TIMELINE } from './data/roseData';

// =========================
// IndexedDB & Local Fallback Helpers
// =========================
const DB_NAME = 'Rose19BirthdayWishesDB';
const STORE_NAME = 'wishes_cache_store';
const LOCAL_FALLBACK_KEY = 'rose19_wishes_local_v2';
const LOCAL_CONFIG_KEY = 'rose19_site_config_v1';
const LOCAL_TIMELINE_KEY = 'rose19_timeline_items_v2';
const WISHES_TABLE = import.meta.env.VITE_SUPABASE_TABLE || 'rose_wishes';
const SETTINGS_TABLE = 'rose_settings';
const PARTY_MEDIA_BUCKET = 'rose-party-media';

export const DEFAULT_SITE_CONFIG = {
  bunny_mode: 'auto', // 'auto' | 'manual'
  bunny_manual_count: 3, // 0..5
  party_video_url: '',
  bgm_enabled: true,
  bgm_auto_start_on_scroll: true,
};

const loadLocalTimeline = () => {
  try {
    const raw = localStorage.getItem(LOCAL_TIMELINE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return ROSE_TIMELINE;
};

const saveLocalTimeline = (items) => {
  try {
    localStorage.setItem(LOCAL_TIMELINE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
};

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

const loadLocalSiteConfig = () => {
  try {
    const raw = localStorage.getItem(LOCAL_CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return { ...DEFAULT_SITE_CONFIG, ...parsed };
      }
    }
  } catch {
    // ignore
  }
  return DEFAULT_SITE_CONFIG;
};

const saveLocalSiteConfig = (cfg) => {
  try {
    localStorage.setItem(LOCAL_CONFIG_KEY, JSON.stringify(cfg));
  } catch {
    // ignore
  }
};

export default function App() {
  const [wishes, setWishes] = useState([]);
  const [siteConfig, setSiteConfig] = useState(loadLocalSiteConfig);
  const [timelineItems, setTimelineItems] = useState(loadLocalTimeline);
  const [isLoading, setIsLoading] = useState(true);

  const sortWishes = (items) =>
    [...items].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

  // =========================
  // โหลดข้อมูลคำอวยพร + ตั้งค่าเว็บ (กระต่าย & วิดีโอ) + ไทม์ไลน์ แบบ Real-time
  // =========================
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      const initial = sortWishes(loadLocalFallbackWishes());
      setWishes(initial);
      setSiteConfig(loadLocalSiteConfig());
      setTimelineItems(loadLocalTimeline());
      setIsLoading(false);

      const onStorage = (e) => {
        if (e.key === LOCAL_FALLBACK_KEY) {
          setWishes(sortWishes(loadLocalFallbackWishes()));
        }
        if (e.key === LOCAL_CONFIG_KEY) {
          setSiteConfig(loadLocalSiteConfig());
        }
        if (e.key === LOCAL_TIMELINE_KEY) {
          setTimelineItems(loadLocalTimeline());
        }
      };
      window.addEventListener('storage', onStorage);
      return () => window.removeEventListener('storage', onStorage);
    }

    let isMounted = true;

    const fetchInitialData = async () => {
      let hasCache = false;
      const cached = await getFromIDB();
      if (isMounted && Array.isArray(cached) && cached.length > 0) {
        setWishes(cached);
        hasCache = true;
        setIsLoading(false);
      }

      try {
        if (!hasCache && isMounted) setIsLoading(true);
        const [wishesRes, settingsRes, timelineRes] = await Promise.all([
          supabase
            .from(WISHES_TABLE)
            .select('*')
            .order('created_at', { ascending: false }),
          supabase
            .from(SETTINGS_TABLE)
            .select('value')
            .eq('key', 'site_config')
            .maybeSingle(),
          supabase
            .from(SETTINGS_TABLE)
            .select('value')
            .eq('key', 'timeline_items')
            .maybeSingle(),
        ]);

        if (!wishesRes.error && isMounted) {
          const list = wishesRes.data || [];
          setWishes(list);
          saveToIDB(list);
        }

        if (!settingsRes.error && settingsRes.data?.value && isMounted) {
          const merged = { ...DEFAULT_SITE_CONFIG, ...settingsRes.data.value };
          setSiteConfig(merged);
          saveLocalSiteConfig(merged);
        }

        if (
          !timelineRes.error &&
          Array.isArray(timelineRes.data?.value) &&
          timelineRes.data.value.length > 0 &&
          isMounted
        ) {
          setTimelineItems(timelineRes.data.value);
          saveLocalTimeline(timelineRes.data.value);
        }
      } catch (err) {
        console.error('Unexpected fetch error:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchInitialData();

    const channel = supabase
      .channel('rose-live-sync')
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
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: SETTINGS_TABLE },
        (payload) => {
          if (payload.new?.key === 'site_config' && payload.new?.value) {
            const merged = { ...DEFAULT_SITE_CONFIG, ...payload.new.value };
            setSiteConfig(merged);
            saveLocalSiteConfig(merged);
          }
          if (
            payload.new?.key === 'timeline_items' &&
            Array.isArray(payload.new?.value)
          ) {
            setTimelineItems(payload.new.value);
            saveLocalTimeline(payload.new.value);
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  // =========================
  // อัปเดตตั้งค่าเว็บจากหน้า /admin (จำนวนกระต่าย & วิดีโอ Rose Birthday Party)
  // =========================
  const updateSiteConfig = async (patch) => {
    const nextConfig = { ...siteConfig, ...patch };
    setSiteConfig(nextConfig);
    saveLocalSiteConfig(nextConfig);

    if (!isSupabaseConfigured || !supabase) {
      return true;
    }

    try {
      const { error } = await supabase.from(SETTINGS_TABLE).upsert(
        {
          key: 'site_config',
          value: nextConfig,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      );
      if (error) {
        console.error('Error saving site_config:', error);
        alert('บันทึกการตั้งค่าไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
        return false;
      }
      return true;
    } catch (err) {
      console.error('Save site_config error:', err);
      return false;
    }
  };

  // อัปโหลดไฟล์วิดีโอขึ้น Supabase Storage โดยตรงจากหน้า /admin
  const uploadPartyVideo = async (file) => {
    if (!file) return null;
    if (!isSupabaseConfigured || !supabase) {
      alert('โหมดออฟไลน์ไม่รองรับการอัปโหลดวิดีโอขึ้นเซิร์ฟเวอร์');
      return null;
    }

    const ext = (file.name.split('.').pop() || 'mp4').toLowerCase();
    const filePath = `party_${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from(PARTY_MEDIA_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type || 'video/mp4',
      });

    if (error) {
      console.error('Upload video error:', error);
      alert('อัปโหลดวิดีโอไม่สำเร็จ (ตรวจสอบขนาดไฟล์ไม่เกิน 50MB)');
      return null;
    }

    const { data } = supabase.storage
      .from(PARTY_MEDIA_BUCKET)
      .getPublicUrl(filePath);

    if (data?.publicUrl) {
      await updateSiteConfig({ party_video_url: data.publicUrl });
      return data.publicUrl;
    }
    return null;
  };

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
      const { error } = await supabase
        .from(WISHES_TABLE)
        .delete()
        .eq('id', id);
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

  // =========================
  // อัปเดตข้อมูล Timeline จากหน้า /admin
  // =========================
  const updateTimelineItems = async (nextItems) => {
    setTimelineItems(nextItems);
    saveLocalTimeline(nextItems);

    if (!isSupabaseConfigured || !supabase) {
      return true;
    }

    try {
      const { error } = await supabase.from(SETTINGS_TABLE).upsert(
        {
          key: 'timeline_items',
          value: nextItems,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      );
      if (error) {
        console.error('Error saving timeline_items:', error);
        alert('บันทึก Timeline ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
        return false;
      }
      return true;
    } catch (err) {
      console.error('Save timeline_items error:', err);
      return false;
    }
  };

  // อัปโหลดรูปภาพความทรงจำ Timeline ขึ้น Supabase Storage
  const uploadTimelineImage = async (file, chapter) => {
    if (!file) return null;
    if (!isSupabaseConfigured || !supabase) {
      return null;
    }

    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const filePath = `timeline_ch${chapter || 'x'}_${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from(PARTY_MEDIA_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type || 'image/jpeg',
      });

    if (error) {
      console.error('Upload timeline image error:', error);
      alert('อัปโหลดรูปไม่สำเร็จ (ตรวจสอบขนาดไฟล์ไม่เกิน 25MB)');
      return null;
    }

    const { data } = supabase.storage
      .from(PARTY_MEDIA_BUCKET)
      .getPublicUrl(filePath);

    return data?.publicUrl || null;
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
              siteConfig={siteConfig}
              timelineItems={timelineItems}
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
              siteConfig={siteConfig}
              updateSiteConfig={updateSiteConfig}
              uploadPartyVideo={uploadPartyVideo}
              timelineItems={timelineItems}
              updateTimelineItems={updateTimelineItems}
              uploadTimelineImage={uploadTimelineImage}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
