import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import WishCardView from '../components/WishCardView';
import PixelFrame from '../components/PixelFrame';
import { PixelBunnySprite, PixelIcon, TimelineChapterArt } from '../components/PixelSprites';
import { isSupabaseConfigured } from '../supabase';
import { computeAutoBunnyCount, ROSE_TIMELINE } from '../data/roseData';

function compressImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('File read failed'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Image decode failed'));
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        const maxSize = 1200;
        if (width > height) {
          if (width > maxSize) {
            height = Math.round(height * (maxSize / width));
            width = maxSize;
          }
        } else if (height > maxSize) {
          width = Math.round(width * (maxSize / height));
          height = maxSize;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function Admin({
  wishes,
  updateWishStatus,
  deleteWish,
  siteConfig,
  updateSiteConfig,
  uploadPartyVideo,
  timelineItems = [],
  updateTimelineItems,
  uploadTimelineImage,
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

  // Local state สำหรับแก้ไข Timeline
  const [timelineList, setTimelineList] = useState(
    Array.isArray(timelineItems) && timelineItems.length > 0
      ? timelineItems
      : ROSE_TIMELINE
  );
  const [uploadingChapterIdx, setUploadingChapterIdx] = useState(null);
  const [isSavingTimeline, setIsSavingTimeline] = useState(false);

  useEffect(() => {
    setVideoInput(siteConfig?.party_video_url || '');
  }, [siteConfig?.party_video_url]);

  useEffect(() => {
    if (Array.isArray(timelineItems) && timelineItems.length > 0) {
      setTimelineList(timelineItems);
    }
  }, [timelineItems]);

  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'rose19';

  const showSavedNotice = (msg) => {
    setConfigToast(msg);
    setTimeout(() => {
      setConfigToast((prev) => (prev === msg ? '' : prev));
    }, 3200);
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
            สำหรับอนุมัติการ์ด ปรับจำนวนกระต่าย แก้ไข Timeline และตั้งค่าวิดีโอหน้าเว็บ
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
              <PixelIcon name={showPassword ? 'eye-off' : 'eye'} size={18} />
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
            <PixelIcon name="arrow-left" size={14} />
            <span>กลับหน้าแรก</span>
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
      showSavedNotice(`ตั้งเป็นโหมดอัตโนมัติแล้ว (ขณะนี้ ${autoCount} ตัว)`);
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
          : 'นำวิดีโอออกเรียบร้อยแล้ว'
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

  // =========================
  // ฟังก์ชันจัดการ Timeline
  // =========================
  const handleTimelineFieldChange = (index, field, value) => {
    setTimelineList((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleSaveChapter = async (index) => {
    if (!updateTimelineItems) return;
    setIsSavingTimeline(true);
    const ok = await updateTimelineItems(timelineList);
    setIsSavingTimeline(false);
    if (ok) {
      const ch = timelineList[index];
      showSavedNotice(`บันทึก ${ch?.seasonLabel || `บทที่ ${index + 1}`} เรียบร้อยแล้ว!`);
    }
  };

  const handleUploadChapterPhoto = async (index, file) => {
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) {
      alert('ไฟล์รูปใหญ่เกิน 25MB กรุณาเลือกไฟล์ขนาดไม่เกิน 25MB นะคะ');
      return;
    }

    setUploadingChapterIdx(index);
    try {
      let finalUrl = null;
      if (uploadTimelineImage) {
        finalUrl = await uploadTimelineImage(file, timelineList[index]?.chapter || index + 1);
      }
      if (!finalUrl) {
        // Local fallback: compress to Data URL
        finalUrl = await compressImageFile(file);
      }

      const nextList = [...timelineList];
      nextList[index] = { ...nextList[index], img: finalUrl };
      setTimelineList(nextList);
      if (updateTimelineItems) {
        await updateTimelineItems(nextList);
      }
      showSavedNotice(`อัปเดตรูปภาพสำหรับ ${nextList[index]?.seasonLabel || `บทที่ ${index + 1}`} สำเร็จแล้ว!`);
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ');
    } finally {
      setUploadingChapterIdx(null);
    }
  };

  const handleRemoveChapterPhoto = async (index) => {
    const nextList = [...timelineList];
    nextList[index] = { ...nextList[index], img: '' };
    setTimelineList(nextList);
    if (updateTimelineItems) {
      await updateTimelineItems(nextList);
    }
    showSavedNotice(`นำรูปออกและคืนค่าเป็นภาพพิกเซลเรียบร้อยแล้ว`);
  };

  const handleAddChapter = async () => {
    const nextNum = timelineList.length + 1;
    const newChapter = {
      chapter: nextNum,
      seasonLabel: `Memory ${String(nextNum).padStart(2, '0')}`,
      date: '2026',
      title: 'ความทรงจำใหม่ของโรส',
      body: 'พิมพ์ข้อความเรื่องราวความประทับใจของโรสตรงนี้...',
      polaroidNote: 'Rose BNK48 19th',
      img: '',
      scene: 'birthday19',
      tape: 'pink-plaid',
    };
    const nextList = [...timelineList, newChapter];
    setTimelineList(nextList);
    if (updateTimelineItems) {
      await updateTimelineItems(nextList);
    }
    showSavedNotice(`เพิ่มความทรงจำ Memory ${nextNum} เรียบร้อยแล้ว`);
  };

  const handleDeleteChapter = async (index) => {
    const ch = timelineList[index];
    if (
      !window.confirm(
        `ต้องการลบ "${ch?.seasonLabel || `บทที่ ${index + 1}`} - ${ch?.title}" จริงหรือไม่?`
      )
    ) {
      return;
    }
    const filtered = timelineList
      .filter((_, i) => i !== index)
      .map((item, i) => ({
        ...item,
        chapter: i + 1,
      }));
    setTimelineList(filtered);
    if (updateTimelineItems) {
      await updateTimelineItems(filtered);
    }
    showSavedNotice('ลบความทรงจำเรียบร้อยแล้ว');
  };

  const handleResetTimelineToDefault = async () => {
    if (
      !window.confirm(
        'ต้องการรีเซ็ตข้อมูล Timeline กลับเป็น 9 บทเริ่มต้นของโรสหรือไม่?'
      )
    ) {
      return;
    }
    setTimelineList(ROSE_TIMELINE);
    if (updateTimelineItems) {
      await updateTimelineItems(ROSE_TIMELINE);
    }
    showSavedNotice('คืนค่า Timeline เป็น 9 บทเริ่มต้นเรียบร้อยแล้ว');
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
    { key: 'pending', label: 'รออนุมัติ', icon: 'clock', count: pendingList.length },
    { key: 'approved', label: 'อนุมัติแล้ว', icon: 'check', count: approvedList.length },
    { key: 'hidden', label: 'ซ่อนไว้', icon: 'eye-off', count: hiddenList.length },
    { key: 'timeline', label: 'ไทม์ไลน์ความทรงจำ', icon: 'rose', count: timelineList.length },
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
            <PixelIcon
              name={isSupabaseConfigured ? 'status-dot' : 'rose'}
              size={14}
            />
            <span>
              {isSupabaseConfigured
                ? 'เชื่อมต่อ Supabase แล้ว'
                : 'โหมดบันทึกในเครื่อง'}
            </span>
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
          {configToast && (
            <div className="admin-toast">
              <PixelIcon name="star" size={16} />
              <span>{configToast}</span>
            </div>
          )}

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
                  <PixelIcon name="wand" size={15} />
                  <em>
                    อัตโนมัติตามคำอวยพร ({approvedList.length} ใบ · {autoCount} ตัว)
                  </em>
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
                        {num === 0 ? (
                          'ปิด (0)'
                        ) : (
                          <>
                            <PixelIcon name="bunny" size={15} />
                            <span>{num}</span>
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <small className="cfg-scale-note">
                เกณฑ์อัตโนมัติ: การ์ด 7 ใบต่อกระต่าย 1 ตัว (1–7 ใบ = 1 ตัว · 8–14 = 2 ตัว · 15–21 = 3 ตัว · 22–28 = 4 ตัว · 29+ = 5 ตัว สูงสุด 5 ตัว)
              </small>
            </div>

            {/* การ์ดตั้งค่าวิดีโอช่อง Rose Birthday Party */}
            <div className="admin-cfg-box">
              <div className="admin-cfg-head">
                <PixelIcon name="cake" size={34} />
                <div>
                  <h3>วิดีโอช่อง Rose Birthday Party</h3>
                  <p className="cfg-status-line">
                    <PixelIcon
                      name={siteConfig?.party_video_url ? 'video' : 'image'}
                      size={15}
                    />
                    <span>
                      {siteConfig?.party_video_url
                        ? 'กำลังแสดงวิดีโออยู่ในหน้าแรก'
                        : 'กำลังแสดงภาพปกเริ่มต้น (ยังไม่ได้ใส่วิดีโอ)'}
                    </span>
                  </p>
                </div>
              </div>

              <div className="video-cfg-controls">
                <label className="px-btn sm video-upload-btn">
                  <PixelIcon
                    name={isUploadingVideo ? 'clock' : 'upload'}
                    size={16}
                  />
                  <span>
                    {isUploadingVideo
                      ? 'กำลังอัปโหลดวิดีโอ...'
                      : 'อัปโหลดไฟล์วิดีโอ (.mp4 / .webm)'}
                  </span>
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
                    <PixelIcon name="check" size={15} />
                    <span>บันทึกวิดีโอ</span>
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
                          showSavedNotice('นำวิดีโอออกเรียบร้อยแล้ว');
                        }
                      }}
                    >
                      <PixelIcon name="close" size={14} />
                      <span>นำวิดีโอออก</span>
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

        {/* แถบควบคุมแท็บ: รออนุมัติ | อนุมัติแล้ว | ซ่อนไว้ | ไทม์ไลน์ความทรงจำ */}
        <div className="admin-top">
          <div>
            <h2 className="admin-title">
              {tab === 'timeline'
                ? 'จัดการไทม์ไลน์เส้นทางของโรส'
                : 'จัดการการ์ดคำอวยพร'}
            </h2>
            <p className="admin-sub">
              {tab === 'timeline'
                ? 'เพิ่ม แก้ไขรูปภาพ วันที่ หัวข้อ และข้อความความทรงจำของโรสได้อย่างอิสระ'
                : 'การ์ดใหม่ทุกใบจะอยู่ในหมวด "รออนุมัติ" ก่อนแสดงบนหน้าเว็บ'}
            </p>
          </div>
          {tab === 'pending' && pendingList.length > 0 && (
            <button
              type="button"
              className="px-btn primary sm"
              onClick={handleApproveAllPending}
            >
              <PixelIcon name="check" size={15} />
              <span>อนุมัติทั้งหมด ({pendingList.length})</span>
            </button>
          )}
          {tab === 'timeline' && (
            <div className="admin-tl-actions">
              <button
                type="button"
                className="px-btn primary sm"
                onClick={handleAddChapter}
              >
                <PixelIcon name="check" size={14} />
                <span>+ เพิ่มความทรงจำใหม่</span>
              </button>
              <button
                type="button"
                className="px-btn sm"
                onClick={handleResetTimelineToDefault}
              >
                <span>↺ คืนค่า 9 บทเริ่มต้น</span>
              </button>
            </div>
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
                <PixelIcon name={t.icon} size={14} />
                <em>{t.label}</em>
                <span>{t.count}</span>
              </button>
            ))}
          </div>
          {tab !== 'timeline' && (
            <div className="admin-search-wrap">
              <PixelIcon name="search" size={16} className="admin-search-icon" />
              <input
                type="text"
                className="px-input admin-search"
                placeholder="ค้นหาชื่อหรือข้อความ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* แท็บที่ 4: จัดการไทม์ไลน์เส้นทางการเติบโตของโรส */}
        {tab === 'timeline' ? (
          <div className="admin-tl-list">
            {timelineList.map((ch, idx) => (
              <PixelFrame
                key={ch.chapter || idx}
                label={`Chapter ${ch.chapter || idx + 1}: ${ch.seasonLabel || `Memory ${idx + 1}`}`}
                icon="rose"
                tone="pink"
                bodyClassName="admin-tl-card-body"
              >
                <div className="admin-tl-grid">
                  {/* คอลัมน์ซ้าย: พรีวิวรูป + อัปโหลดรูปภาพ */}
                  <div className="admin-tl-preview-col">
                    <div className="admin-tl-photo-box">
                      {ch.img ? (
                        <img src={ch.img} alt={ch.title} />
                      ) : (
                        <TimelineChapterArt
                          scene={ch.scene || 'birth'}
                          chapter={ch.chapter || idx + 1}
                        />
                      )}
                    </div>

                    <div className="admin-tl-photo-actions">
                      <label className="px-btn primary sm">
                        <PixelIcon name="upload" size={15} />
                        <span>
                          {uploadingChapterIdx === idx
                            ? 'กำลังอัปโหลด...'
                            : ch.img
                            ? 'เปลี่ยนรูปถ่าย'
                            : 'อัปโหลดรูปถ่ายจริง'}
                        </span>
                        <input
                          type="file"
                          hidden
                          accept="image/png,image/jpeg,image/webp"
                          disabled={uploadingChapterIdx === idx}
                          onChange={(e) =>
                            handleUploadChapterPhoto(idx, e.target.files?.[0])
                          }
                        />
                      </label>

                      {ch.img && (
                        <button
                          type="button"
                          className="px-btn sm"
                          onClick={() => handleRemoveChapterPhoto(idx)}
                        >
                          <PixelIcon name="close" size={14} />
                          <span>นำรูปออก (ใช้ภาพพิกเซล)</span>
                        </button>
                      )}

                      <input
                        type="url"
                        className="px-input"
                        placeholder="หรือวาง URL รูปภาพ..."
                        value={ch.img || ''}
                        onChange={(e) =>
                          handleTimelineFieldChange(idx, 'img', e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* คอลัมน์ขวา: ฟิลด์แก้ไขข้อความ */}
                  <div className="admin-tl-fields-col">
                    <div className="admin-tl-row2">
                      <div className="admin-tl-field">
                        <label>ป้ายช่วงเวลา (Season Label)</label>
                        <input
                          type="text"
                          className="px-input"
                          placeholder="เช่น Memory 01"
                          value={ch.seasonLabel || ''}
                          onChange={(e) =>
                            handleTimelineFieldChange(idx, 'seasonLabel', e.target.value)
                          }
                        />
                      </div>
                      <div className="admin-tl-field">
                        <label>วันที่ / ยุคสมัย (Date)</label>
                        <input
                          type="text"
                          className="px-input"
                          placeholder="เช่น 1 November 2007"
                          value={ch.date || ''}
                          onChange={(e) =>
                            handleTimelineFieldChange(idx, 'date', e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="admin-tl-field">
                      <label>หัวข้อความทรงจำ (Title)</label>
                      <input
                        type="text"
                        className="px-input"
                        placeholder="หัวข้อความทรงจำของโรส..."
                        value={ch.title || ''}
                        onChange={(e) =>
                          handleTimelineFieldChange(idx, 'title', e.target.value)
                        }
                      />
                    </div>

                    <div className="admin-tl-field">
                      <label>เนื้อหาเรื่องราว (Story Body)</label>
                      <textarea
                        className="px-input px-textarea"
                        style={{ minHeight: '100px' }}
                        placeholder="พิมพ์เรื่องราวความประทับใจของโรส..."
                        value={ch.body || ''}
                        onChange={(e) =>
                          handleTimelineFieldChange(idx, 'body', e.target.value)
                        }
                      />
                    </div>

                    <div className="admin-tl-field">
                      <label>ข้อความป้ายแถบด้านล่าง (Polaroid Note)</label>
                      <input
                        type="text"
                        className="px-input"
                        placeholder="เช่น Little Rose · Nakhon Pathom"
                        value={ch.polaroidNote || ''}
                        onChange={(e) =>
                          handleTimelineFieldChange(idx, 'polaroidNote', e.target.value)
                        }
                      />
                    </div>

                    <div className="admin-tl-btn-row">
                      <button
                        type="button"
                        className="act-btn delete"
                        style={{ flex: 'none', padding: '7px 14px' }}
                        onClick={() => handleDeleteChapter(idx)}
                      >
                        ลบบทนี้
                      </button>

                      <div className="admin-tl-btn-group">
                        <button
                          type="button"
                          className="px-btn primary sm"
                          disabled={isSavingTimeline}
                          onClick={() => handleSaveChapter(idx)}
                        >
                          <PixelIcon name="check" size={15} />
                          <span>บันทึกบทนี้</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </PixelFrame>
            ))}
          </div>
        ) : filteredWishes.length === 0 ? (
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
                      <PixelIcon name="check" size={14} />
                      <span>อนุมัติ</span>
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
