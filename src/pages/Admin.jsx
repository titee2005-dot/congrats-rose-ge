import { useState } from 'react';
import { Link } from 'react-router-dom';
import WishCardView from '../components/WishCardView';
import PixelFrame from '../components/PixelFrame';
import { PixelBunnySprite, PixelIcon } from '../components/PixelSprites';
import { isSupabaseConfigured } from '../supabase';

export default function Admin({ wishes, updateWishStatus, deleteWish }) {
  const [tab, setTab] = useState('pending');
  const [search, setSearch] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('roseAdminAuthenticated') === 'true'
  );
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'rose19';

  const handleLogin = () => {
    if (password === adminPassword) {
      sessionStorage.setItem('roseAdminAuthenticated', 'true');
      setIsAuthenticated(true);
      setPassword('');
    } else {
      alert('รหัสผ่านแอดมินไม่ถูกต้องนะคะ');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('roseAdminAuthenticated');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="px-page admin-login-page">
        <PixelFrame
          label="Admin Login"
          icon="bunny"
          tone="pink"
          className="admin-login-frame"
          bodyClassName="admin-login-body"
        >
          <PixelBunnySprite variant="pink-rose" frame="hop" size={64} />
          <h2>เข้าสู่ระบบแอดมิน</h2>
          <p className="admin-login-hint">
            สำหรับอนุมัติ ซ่อน หรือลบการ์ดคำอวยพรก่อนขึ้นกำแพง
          </p>

          <div className="admin-pw-wrap">
            <input
              type={showPassword ? 'text' : 'password'}
              className="px-input"
              placeholder="รหัสผ่านแอดมิน..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleLogin();
              }}
            />
            <button
              type="button"
              className="pw-eye-btn"
              onClick={() => setShowPassword((prev) => !prev)}
              title={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
            >
              {showPassword ? '🙈' : '👁'}
            </button>
          </div>

          <button type="button" className="px-btn primary full" onClick={handleLogin}>
            เข้าสู่ระบบ
          </button>

          <Link to="/" className="admin-back-link">
            ← กลับหน้าแรก
          </Link>
        </PixelFrame>
      </div>
    );
  }

  const pendingList = wishes.filter((w) => w.status === 'pending');
  const approvedList = wishes.filter((w) => w.status === 'approved');
  const hiddenList = wishes.filter((w) => w.status === 'hidden');

  const filteredWishes = wishes
    .filter((w) => w.status === tab)
    .filter((w) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        (w.name || '').toLowerCase().includes(q) ||
        (w.message || '').toLowerCase().includes(q)
      );
    });

  const handleApproveAllPending = async () => {
    if (pendingList.length === 0) return;
    if (
      !window.confirm(
        `ต้องการอนุมัติการ์ดที่รออยู่ทั้งหมด (${pendingList.length} ใบ) เลยหรือไม่?`
      )
    ) {
      return;
    }
    for (const item of pendingList) {
      await updateWishStatus(item.id, 'approved');
    }
  };

  const TABS = [
    { key: 'pending', label: '⏳ รออนุมัติ', count: pendingList.length },
    { key: 'approved', label: '✔ อนุมัติแล้ว', count: approvedList.length },
    { key: 'hidden', label: '🙈 ซ่อนไว้', count: hiddenList.length },
  ];

  return (
    <div className="px-page admin-page">
      <div className="px-header-wrap is-scrolled">
        <header className="px-header">
          <Link to="/" className="px-brand">
            <span className="px-brand-icon">
              <PixelIcon name="rose" size={24} />
            </span>
            <span className="px-brand-text">
              <strong>ROSE</strong>
              <em>Admin</em>
            </span>
          </Link>

          <span className="admin-db-pill">
            {isSupabaseConfigured
              ? '🟢 เชื่อมต่อ Supabase แล้ว'
              : '🌸 โหมดบันทึกในเครื่อง'}
          </span>

          <div className="admin-head-actions">
            <Link to="/" className="px-btn sm">
              ดูหน้าเว็บ
            </Link>
            <button type="button" className="px-btn sm" onClick={handleLogout}>
              ออกจากระบบ
            </button>
          </div>
        </header>
      </div>

      <main className="px-main admin-main">
        <div className="admin-top">
          <div>
            <h2 className="admin-title">จัดการการ์ดคำอวยพร</h2>
            <p className="admin-sub">
              การ์ดใหม่ทุกใบจะอยู่ในหมวด &ldquo;รออนุมัติ&rdquo; ก่อนแสดงบนหน้าเว็บ
            </p>
          </div>
          {tab === 'pending' && pendingList.length > 0 && (
            <button
              type="button"
              className="px-btn primary sm"
              onClick={handleApproveAllPending}
            >
              ✔ อนุมัติทั้งหมด ({pendingList.length})
            </button>
          )}
        </div>

        <div className="admin-controls">
          <div className="admin-tabs">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                className={`px-tab ${tab === t.key ? 'is-active' : ''}`}
                onClick={() => setTab(t.key)}
              >
                {t.label} <span>{t.count}</span>
              </button>
            ))}
          </div>
          <input
            type="text"
            className="px-input admin-search"
            placeholder="🔍 ค้นหาชื่อหรือข้อความ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filteredWishes.length === 0 ? (
          <PixelFrame tone="cream" bodyClassName="empty-body">
            <PixelBunnySprite variant="white-ribbon" frame="idle" size={56} />
            <h3>ไม่มีการ์ดในหมวดนี้</h3>
          </PixelFrame>
        ) : (
          <div className="wall-grid">
            {filteredWishes.map((w, idx) => (
              <div key={w.id || idx} className="admin-card">
                <WishCardView
                  bg={w.bg}
                  name={w.name}
                  message={w.message}
                  img={w.img}
                  letterNumber={`#${w.id}`}
                />
                <div className="admin-actions">
                  {tab !== 'approved' && (
                    <button
                      type="button"
                      className="act-btn approve"
                      onClick={() => updateWishStatus(w.id, 'approved')}
                    >
                      ✔ อนุมัติ
                    </button>
                  )}
                  {tab !== 'hidden' && (
                    <button
                      type="button"
                      className="act-btn hide"
                      onClick={() => updateWishStatus(w.id, 'hidden')}
                    >
                      ซ่อน
                    </button>
                  )}
                  <button
                    type="button"
                    className="act-btn delete"
                    onClick={() => {
                      if (window.confirm(`ต้องการลบการ์ดของ "${w.name}" จริงหรือไม่?`)) {
                        deleteWish(w.id);
                      }
                    }}
                  >
                    ลบ
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
