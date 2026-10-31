import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import WishCardView from '../components/WishCardView';
import PixelFrame from '../components/PixelFrame';
import { PixelBunnySprite, PixelIcon } from '../components/PixelSprites';
import { isSupabaseConfigured } from '../supabase';
import { computeAutoBunnyCount } from '../data/roseData';

export default function Admin({
  wishes,
  updateWishStatus,
  deleteWish,
  siteConfig,
  updateSiteConfig,
  uploadPartyVideo,
}) {
  const [tab, setTab] = useState('pending');
  const [search, setSearch] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('roseAdminAuthenticated') === 'true'
  );
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [videoInput, setVideoInput] = useState(siteConfig?.party_video_url || '');
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [configToast, setConfigToast] = useState('');

  useEffect(() => {
    setVideoInput(siteConfig?.party_video_url || '');
  }, [siteConfig?.party_video_url]);

  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'rose19';

  const showSavedNotice = (msg) => {
    setConfigToast(msg);
    setTimeout(() => {
      setConfigToast((prev) => (prev === msg ? '' : prev));
    }, 3000);
  };

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
            สำหรับอนุมัติการ์ด ปรับจำนวนกระต่าย และตั้งค่าวิดีโอหน้าเว็บ
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

          <button
            type="button"
            className="px-btn primary full"
            onClick={handleLogin}
          >
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

  const autoCount = computeAutoBunnyCount(approvedList.length);
  const bunnyMode = siteConfig?.bunny_mode === 'manual' ? 'manual' : 'auto';
  const manualCount = Math.max(
    0,
    Math.min(5, Number(siteConfig?.bunny_manual_count ?? autoCount))
  );
  const activeBunnyCount = bunnyMode === 'manual' ? manualCount : autoCount;

  const handleSetAutoMode = async () => {
    if (!updateSiteConfig) return;
    setIsSavingConfig(true);
    const ok = await updateSiteConfig({ bunny_mode: 'auto' });
    setIsSavingConfig(false);
    if (ok) {
      showSavedNotice(`ตั้งเป็นโหมดอัตโนมัติแล้ว (ขณะนี้ ${activeBunnyCount === autoCount ? autoCount : autoCount} ตัว)`);
    }
  };

  const handleSetManualCount = async (count) => {
    if (!updateSiteConfig) return;
    setIsSavingConfig(true);
    const ok = await updateSiteConfig({
      bunny_mode: 'manual',
      bunny_manual_count: count,
    });
    setIsSavingConfig(false);
    if (ok) {
      showSavedNotice(
        count === 0
          ? 'ปิดการแสดงกระต่ายหน้าเว็บชั่วคราวแล้ว'
          : `ตั้งจำนวนกระต่ายหน้าเว็บเป็น ${count} ตัวแล้ว`
      );
    }
  };

  const handleSaveVideoUrl = async () => {
    if (!updateSiteConfig) return;
    setIsSavingConfig(true);
    const trimmed = videoInput.trim();
    const ok = await updateSiteConfig({ party_video_url: trimmed });
    setIsSavingConfig(false);
    if (ok) {
      showSavedNotice(
        trimmed
          ? 'บันทึกลิงก์วิดีโอช่อง Rose Birthday Party แล้ว'
          : 'กลับไปใช้ภาพปกเริ่มต้นในช่อง Rose Birthday Party แล้ว'
      );
    }
  };

  const handleVideoFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !uploadPartyVideo) return;
    if (file.size > 50 * 1024 * 1024) {
      alert('ไฟล์วิดีโอใหญ่เกิน 50MB กรุณาบีบอัดหรือวางเป็นลิงก์ YouTube / MP4 แทนนะคะ');
      e.target.value = '';
      return;
    }
    setIsUploadingVideo(true);
    const url = await uploadPartyVideo(file);
    setIsUploadingVideo(false);
    e.target.value = '';
    if (url) {
      setVideoInput(url);
      showSavedNotice('อัปโหลดและเปลี่ยนวิดีโอ Rose Birthday Party เรียบร้อยแล้ว!');
    }
  };

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
        {/* แผงตั้งค่าหน้าเว็บ: จำนวนกระต่าย & วิดีโอช่อง Rose Birthday Party */}
        <PixelFrame
          label="Site Settings"
          icon="sparkle"
          tone="lavender"
          className="admin-settings-frame"
          bodyClassName="admin-settings-body"
        >
          {configToast && <div className="admin-toast">✨ {configToast}</div>}

          <div className="admin-settings-grid">
            {/* การ์ดตั้งค่าจำนวนกระต่าย */}
            <div className="admin-cfg-box">
              <div className="admin-cfg-head">
                <PixelBunnySprite variant="pink-rose" frame="hop" size={40} />
                <div>
                  <h3>จำนวนกระต่ายบนหน้าเว็บ</h3>
                  <p>
                    แสดงอยู่ตอนนี้: <strong>{activeBunnyCount} ตัว</strong>{' '}
                    ({bunnyMode === 'auto' ? 'คำนวณอัตโนมัติ' : 'กำหนดเองโดยแอดมิน'})
                  </p>
                </div>
              </div>

              <div className="bunny-mode-row">
                <button
                  type="button"
                  disabled={isSavingConfig}
                  className={`px-tab ${bunnyMode === 'auto' ? 'is-active' : ''}`}
                  onClick={handleSetAutoMode}
                >
                  🪄 อัตโนมัติตามคำอวยพร ({approvedList.length} ใบ → {autoCount} ตัว)
                </button>
              </div>

              <div className="bunny-manual-row">
                <span className="cfg-mini-label">หรือเลือกกำหนดจำนวนเอง (0–5 ตัว):</span>
                <div className="bunny-count-btns">
                  {[0, 1, 2, 3, 4, 5].map((num) => {
                    const selected = bunnyMode === 'manual' && manualCount === num;
                    return (
                      <button
                        key={num}
                        type="button"
                        disabled={isSavingConfig}
                        className={`bunny-num-btn ${selected ? 'is-selected' : ''}`}
                        onClick={() => handleSetManualCount(num)}
                      >
                        {num === 0 ? 'ปิด (0)' : `🐰 ${num}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              <small className="cfg-scale-note">
                เกณฑ์อัตโนมัติ: 0–10 คน = 1 ตัว · 11–20 = 2 ตัว · 21–30 = 3 ตัว · 31–40 = 4 ตัว · 41+ = 5 ตัว (สูงสุด 5 ตัว)
              </small>
            </div>

            {/* การ์ดตั้งค่าวิดีโอช่อง Rose Birthday Party */}
            <div className="admin-cfg-box">
              <div className="admin-cfg-head">
                <PixelIcon name="cake" size={34} />
                <div>
                  <h3>วิดีโอช่อง Rose Birthday Party</h3>
                  <p>
                    {siteConfig?.party_video_url
                      ? '🎬 กำลังแสดงวิดีโออยู่ในหน้าแรก'
                      : '🖼️ กำลังแสดงภาพปกเริ่มต้น (ยังไม่ได้ใส่วิดีโอ)'}
                  </p>
                </div>
              </div>

              <div className="video-cfg-controls">
                <label className="px-btn sm video-upload-btn">
                  {isUploadingVideo
                    ? '⏳ กำลังอัปโหลดวิดีโอ...'
                    : '📤 อัปโหลดไฟล์วิดีโอ (.mp4 / .webm)'}
                  <input
                    type="file"
                    hidden
                    accept="video/mp4,video/webm,video/quicktime"
                    disabled={isUploadingVideo}
                    onChange={handleVideoFileUpload}
                  />
                </label>

                <div className="video-url-row">
                  <input
                    type="url"
                    className="px-input"
                    placeholder="หรือวางลิงก์วิดีโอ .mp4 / YouTube ที่นี่..."
                    value={videoInput}
                    onChange={(e) => setVideoInput(e.target.value)}
                  />
                </div>

                <div className="video-btn-row">
                  <button
                    type="button"
                    className="px-btn primary sm"
                    disabled={isSavingConfig || isUploadingVideo}
                    onClick={handleSaveVideoUrl}
                  >
                    ✔ บันทึกวิดีโอ
                  </button>
                  {siteConfig?.party_video_url && (
                    <button
                      type="button"
                      className="px-btn sm"
                      disabled={isSavingConfig || isUploadingVideo}
                      onClick={async () => {
                        setVideoInput('');
                        setIsSavingConfig(true);
                        const ok = await updateSiteConfig({ party_video_url: '' });
                        setIsSavingConfig(false);
                        if (ok) {
                          showSavedNotice('นำวิดีโอออกและกลับไปใช้ภาพปกเริ่มต้นแล้ว');
                        }
                      }}
                    >
                      ✕ นำวิดีโอออก
                    </button>
                  )}
                </div>
              </div>

              <small className="cfg-scale-note">
                รองรับทั้งการอัปโหลดไฟล์ MP4/WebM (ไม่เกิน 50MB), ลิงก์ตรง .mp4, ลิงก์ YouTube หรือวางไฟล์ที่ <code>public/assets/rose_party.mp4</code>
              </small>
            </div>
          </div>
        </PixelFrame>

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
                      if (
                        window.confirm(
                          `ต้องการลบการ์ดของ "${w.name}" จริงหรือไม่?`
                        )
                      ) {
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
