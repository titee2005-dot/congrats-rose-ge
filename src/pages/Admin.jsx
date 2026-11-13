import SiteTextEditor from '../components/SiteTextEditor';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import WishCardView from '../components/WishCardView';
import PixelFrame from '../components/PixelFrame';
import {
  PixelBunnySprite,
  PixelIcon,
  TimelineChapterArt,
} from '../components/PixelSprites';
import { isSupabaseConfigured } from '../supabase';
import {
  computeAutoBunnyCount,
  ROSE_TIMELINE,
  ROSE_PLAYLIST,
  DEFAULT_GE_MILESTONE,
} from '../data/roseData';

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
  toggleFeaturedWish,
  deleteWish,
  siteConfig,
  updateSiteConfig,
  uploadPartyVideo,
  timelineItems = [],
  updateTimelineItems,
  uploadTimelineImage,
  geMilestone,
  updateGeMilestone,
}) {
  const [tab, setTab] = useState('pending');
  const [search, setSearch] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('roseGEAdminAuthenticated') === 'true'
  );
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [videoInput, setVideoInput] = useState(
    siteConfig?.party_video_url || ''
  );
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [configToast, setConfigToast] = useState('');

  // Local state สำหรับแก้ไขป้ายรางวัล GE
  const [msForm, setMsForm] = useState({
    ...DEFAULT_GE_MILESTONE,
    ...(geMilestone || {}),
  });
  const [isSavingMilestone, setIsSavingMilestone] = useState(false);
  const [isUploadingMilestone, setIsUploadingMilestone] = useState(false);

  const handleMilestonePhoto = async (file) => {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 25 * 1024 * 1024) {
      alert('กรุณาเลือกภาพ JPG, PNG หรือ WEBP ขนาดไม่เกิน 25MB');
      return;
    }
    setIsUploadingMilestone(true);
    try {
      let imageUrl;
      if (isSupabaseConfigured) {
        imageUrl = await uploadTimelineImage?.(file, 'milestone');
        if (!imageUrl) throw new Error('Upload failed');
      } else {
        imageUrl = await compressImageFile(file);
      }
      setMsForm((previous) => ({ ...previous, imageUrl }));
      showSavedNotice('เลือกรูปแล้ว กดบันทึกป้ายรางวัล GE เพื่อแสดงบนหน้าเว็บ');
    } catch {
      alert('อัปโหลดภาพไม่สำเร็จ กรุณาลองใหม่');
    } finally {
      setIsUploadingMilestone(false);
    }
  };

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
    if (geMilestone) {
      setMsForm({ ...DEFAULT_GE_MILESTONE, ...geMilestone });
    }
  }, [geMilestone]);

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
      sessionStorage.setItem('roseGEAdminAuthenticated', 'true');
      setIsAuthenticated(true);
      setPassword('');
    } else {
      alert('รหัสผ่านแอดมินไม่ถูกต้องนะคะ');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('roseGEAdminAuthenticated');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="px-page admin-login-page">
        <PixelFrame
          label="GE Admin Login"
          icon="crown"
          tone="pink"
          className="admin-login-frame"
          bodyClassName="admin-login-body"
        >
          <PixelBunnySprite variant="crown-ge" frame="hop" size={64} />
          <h2>เข้าสู่ระบบแอดมิน (เว็บแสดงความยินดี GE)</h2>
          <p className="admin-login-hint">
            สำหรับอนุมัติการ์ด ปักหมุด Hall of Fame ตั้งค่ารางวัล GE และจัดการหน้าเว็บ
            (ข้อมูลแยกจากเว็บวันเกิด 100%)
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
          ? 'บันทึกลิงก์วิดีโอช่อง Rose Victory Stage แล้ว'
          : 'นำวิดีโอออกเรียบร้อยแล้ว'
      );
    }
  };

  const handleVideoFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !uploadPartyVideo) return;
    if (file.size > 50 * 1024 * 1024) {
      alert(
        'ไฟล์วิดีโอใหญ่เกิน 50MB กรุณาบีบอัดหรือวางเป็นลิงก์ YouTube / MP4 แทนนะคะ'
      );
      e.target.value = '';
      return;
    }
    setIsUploadingVideo(true);
    const url = await uploadPartyVideo(file);
    setIsUploadingVideo(false);
    e.target.value = '';
    if (url) {
      setVideoInput(url);
      showSavedNotice(
        'อัปโหลดและเปลี่ยนวิดีโอ Rose Victory Stage เรียบร้อยแล้ว!'
      );
    }
  };

  const handleSaveMilestone = async () => {
    if (!updateGeMilestone) return;
    setIsSavingMilestone(true);
    const ok = await updateGeMilestone({
      ...msForm,
      goalTarget: Math.max(50, Number(msForm.goalTarget) || 500),
    });
    setIsSavingMilestone(false);
    if (ok) {
      showSavedNotice('บันทึกข้อมูลป้ายประกาศรางวัล GE เรียบร้อยแล้ว!');
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
      showSavedNotice(
        `บันทึก ${ch?.seasonLabel || `บทที่ ${index + 1}`} เรียบร้อยแล้ว!`
      );
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
        finalUrl = await uploadTimelineImage(
          file,
          timelineList[index]?.chapter || index + 1
        );
      }
      if (!finalUrl) {
        finalUrl = await compressImageFile(file);
      }

      const nextList = [...timelineList];
      nextList[index] = { ...nextList[index], img: finalUrl };
      setTimelineList(nextList);
      if (updateTimelineItems) {
        const saved = await updateTimelineItems(nextList);
      if (!saved) { alert('บันทึกการ์ดไม่สำเร็จ กรุณาลองอีกครั้ง'); return; }
      }
      showSavedNotice(
        `อัปเดตรูปภาพสำหรับ ${nextList[index]?.seasonLabel || `บทที่ ${index + 1}`} สำเร็จแล้ว!`
      );
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
    showSavedNotice('นำรูปออกและคืนค่าเป็นภาพพิกเซลเรียบร้อยแล้ว');
  };

  const handleAddChapter = async () => {
    const nextNum = timelineList.length + 1;
    const newChapter = {
      chapter: nextNum,
      seasonLabel: `Milestone ${String(nextNum).padStart(2, '0')}`,
      date: '2026',
      title: 'ก้าวสำคัญใหม่ของโรส',
      body: 'พิมพ์ข้อความเรื่องราวความประทับใจของโรสตรงนี้...',
      polaroidNote: 'Congrats Rose BNK48',
      img: '',
      scene: 'victory',
      tape: 'pink-plaid',
    };
    const nextList = [...timelineList, newChapter];
    setTimelineList(nextList);
    if (updateTimelineItems) {
      await updateTimelineItems(nextList);
    }
    showSavedNotice(`เพิ่ม Milestone ${nextNum} เรียบร้อยแล้ว`);
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
    showSavedNotice('ลบบทความทรงจำเรียบร้อยแล้ว');
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
    {
      key: 'pending',
      label: 'รออนุมัติ',
      icon: 'clock',
      count: pendingList.length,
    },
    {
      key: 'approved',
      label: 'อนุมัติแล้ว',
      icon: 'check',
      count: approvedList.length,
    },
    {
      key: 'hidden',
      label: 'ซ่อนไว้',
      icon: 'eye-off',
      count: hiddenList.length,
    },
    {
      key: 'timeline',
      label: 'ไทม์ไลน์เส้นทาง GE',
      icon: 'rose',
      count: timelineList.length,
    },
  ];

  return (
    <div className="px-page admin-page">
      <div className="px-header-wrap is-scrolled">
        <header className="px-header">
          <Link to="/" className="px-brand">
            <span className="px-brand-icon">
              <PixelIcon name="crown" size={24} />
            </span>
            <span className="px-brand-text">
              <strong>ROSE GE</strong>
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
                ? 'เชื่อมต่อตาราง rose_ge_wishes แล้ว'
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
        <SiteTextEditor siteConfig={siteConfig} updateSiteConfig={updateSiteConfig} />
        {/* แผงตั้งค่าหน้าเว็บ */}
        <PixelFrame
          label="GE Celebration Settings"
          icon="trophy"
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
            {/* การ์ดตั้งค่าป้ายรางวัล & เกียรติยศ GE */}
            <div className="admin-cfg-box">
              <div className="admin-cfg-head">
                <PixelIcon name="trophy" size={34} />
                <div>
                  <h3>ตั้งค่าป้ายรางวัล & อันดับ GE</h3>
                  <p>ตั้งค่าอันดับ ภาพโรส และข้อความขอบคุณบนการ์ดหลัก</p>
                </div>
              </div>

              <div className="admin-tl-row2">
                <div className="admin-tl-field">
                  <label>อันดับ GE (เช่น 15 หรือ GE เมื่อยังไม่ประกาศ)</label>
                  <input
                    type="text"
                    className="px-input"
                    value={msForm.rankNumber || ''}
                    onChange={(e) =>
                      setMsForm((p) => ({ ...p, rankNumber: e.target.value }))
                    }
                  />
                </div>
                <div className="admin-tl-field">
                  <label>เป้าหมายดอกไม้รวม (ครั้ง)</label>
                  <input
                    type="number"
                    className="px-input"
                    value={msForm.goalTarget || 500}
                    onChange={(e) =>
                      setMsForm((p) => ({ ...p, goalTarget: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="admin-tl-field">
                <label>หัวข้อรางวัลหลัก (Rank Badge)</label>
                <input
                  type="text"
                  className="px-input"
                  value={msForm.rankBadge || ''}
                  onChange={(e) =>
                    setMsForm((p) => ({ ...p, rankBadge: e.target.value }))
                  }
                />
              </div>

              <div className="admin-tl-row2">
                <div className="admin-tl-field">
                  <label>ชื่องาน (Event Title)</label>
                  <input
                    type="text"
                    className="px-input"
                    value={msForm.eventTitle || ''}
                    onChange={(e) =>
                      setMsForm((p) => ({ ...p, eventTitle: e.target.value }))
                    }
                  />
                </div>
                <div className="admin-tl-field">
                  <label>คะแนนโหวต / พลังซัพพอร์ต</label>
                  <input
                    type="text"
                    className="px-input"
                    value={msForm.voteScore || ''}
                    onChange={(e) =>
                      setMsForm((p) => ({ ...p, voteScore: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="admin-tl-field">
                <label htmlFor="milestone-quote">ข้อความที่โรสพูดขอบคุณ</label>
                <textarea
                  id="milestone-quote"
                  className="px-input px-textarea"
                  style={{ minHeight: '72px' }}
                  value={msForm.quote || ''}
                  onChange={(e) =>
                    setMsForm((p) => ({ ...p, quote: e.target.value }))
                  }
                />
              </div>

              <div className="admin-tl-field">
                <label htmlFor="milestone-image-url">ภาพบนการ์ดอันดับ (แสดงในวงกลม)</label>
                {msForm.imageUrl && <img className="admin-result-preview" src={msForm.imageUrl} alt="ตัวอย่างภาพบนการ์ดอันดับ" />}
                <input id="milestone-image-url" type="url" className="px-input" placeholder="https://... หรือเลือกอัปโหลดภาพด้านล่าง" value={msForm.imageUrl || ''} disabled={isUploadingMilestone} onChange={(e) => setMsForm((p) => ({ ...p, imageUrl: e.target.value }))} />
                <label htmlFor="milestone-image-file">อัปโหลดภาพ JPG, PNG, WEBP ไม่เกิน 25MB</label>
                <input id="milestone-image-file" type="file" accept="image/jpeg,image/png,image/webp" disabled={isUploadingMilestone || isSavingMilestone} onChange={(e) => { handleMilestonePhoto(e.target.files?.[0]); e.target.value = ''; }} />
                {isUploadingMilestone && <span role="status">กำลังอัปโหลดภาพ...</span>}
                {msForm.imageUrl && <button type="button" className="px-btn sm" disabled={isUploadingMilestone} onClick={() => setMsForm((p) => ({ ...p, imageUrl: '' }))}>นำภาพออก</button>}
              </div>

              <button
                type="button"
                className="px-btn primary sm"
                disabled={isSavingMilestone || isUploadingMilestone}
                onClick={handleSaveMilestone}
              >
                <PixelIcon name="check" size={15} />
                <span>
                  {isSavingMilestone ? 'กำลังบันทึก...' : 'บันทึกป้ายรางวัล GE'}
                </span>
              </button>
            </div>

            {/* การ์ดตั้งค่าจำนวนกระต่าย */}
            <div className="admin-cfg-box">
              <div className="admin-cfg-head">
                <PixelBunnySprite variant="crown-ge" frame="hop" size={40} />
                <div>
                  <h3>จำนวนกระต่ายบนหน้าเว็บ</h3>
                  <p>
                    แสดงอยู่ตอนนี้: <strong>{activeBunnyCount} ตัว</strong> (
                    {bunnyMode === 'auto'
                      ? 'คำนวณอัตโนมัติ'
                      : 'กำหนดเองโดยแอดมิน'}
                    )
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
                    อัตโนมัติตามการ์ด ({approvedList.length} ใบ · {autoCount}{' '}
                    ตัว)
                  </em>
                </button>
              </div>

              <div className="bunny-manual-row">
                <span className="cfg-mini-label">
                  หรือเลือกกำหนดจำนวนเอง (0–5 ตัว):
                </span>
                <div className="bunny-count-btns">
                  {[0, 1, 2, 3, 4, 5].map((num) => {
                    const selected =
                      bunnyMode === 'manual' && manualCount === num;
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
                เกณฑ์อัตโนมัติ: การ์ด 7 ใบต่อกระต่าย 1 ตัว (สูงสุด 5 ตัว)
              </small>
            </div>

            {/* การ์ดตั้งค่าวิดีโอช่อง Rose Victory Stage */}
            <div className="admin-cfg-box">
              <div className="admin-cfg-head">
                <PixelIcon name="crown" size={34} />
                <div>
                  <h3>วิดีโอช่อง Rose Victory Stage</h3>
                  <p className="cfg-status-line">
                    <PixelIcon
                      name={siteConfig?.party_video_url ? 'video' : 'image'}
                      size={15}
                    />
                    <span>
                      {siteConfig?.party_video_url
                        ? 'กำลังแสดงวิดีโออยู่ในหน้าแรก'
                        : 'กำลังใช้วิดีโอเริ่มต้น'}
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
                        const ok = await updateSiteConfig({
                          party_video_url: '',
                        });
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
            </div>

            {/* การ์ดเพลงประจำเว็บ (BGM Playlist) */}
            <div className="admin-cfg-box">
              <div className="admin-cfg-head">
                <div className="admin-cfg-icon-box">
                  <PixelIcon name="disc" size={32} />
                </div>
                <div>
                  <h3>เพลงประจำเว็บฉลอง GE (Rose Playlist)</h3>
                  <p>รันเพลงที่น้องโรสมีส่วนร่วมวนลูปเป็น BGM ประจำเว็บ</p>
                </div>
              </div>

              <div className="admin-bgm-summary-list">
                {ROSE_PLAYLIST.map((song, i) => (
                  <div
                    key={song.id}
                    className={`admin-bgm-row ${i === 0 ? 'is-main-track' : ''}`}
                  >
                    <span className="admin-bgm-idx">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="admin-bgm-meta">
                      <strong>{song.title}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PixelFrame>

        {/* แถบควบคุมแท็บ */}
        <div className="admin-top">
          <div>
            <h2 className="admin-title">
              {tab === 'timeline'
                ? 'จัดการไทม์ไลน์เส้นทางของโรส'
                : 'จัดการการ์ดแสดงความยินดี & หอเกียรติยศ'}
            </h2>
            <p className="admin-sub">
              {tab === 'timeline'
                ? 'เพิ่ม แก้ไขรูปภาพ วันที่ หัวข้อ และข้อความความทรงจำของโรสได้อย่างอิสระ'
                : 'สามารถกด "ติดดาว Hall of Fame" เพื่อให้การ์ดแสดงเด่นในหมวดหอเกียรติยศได้'}
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
                <span>+ เพิ่มการ์ดเส้นทางของโรส</span>
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

        {tab === 'timeline' ? (
          <div className="admin-tl-list">
            {timelineList.map((ch, idx) => (
              <PixelFrame
                key={ch.chapter || idx}
                label={`Chapter ${ch.chapter || idx + 1}: ${ch.seasonLabel || `Milestone ${idx + 1}`}`}
                icon="rose"
                tone="pink"
                bodyClassName="admin-tl-card-body"
              >
                <div className="admin-tl-grid">
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

                  <div className="admin-tl-fields-col">
                    <div className="admin-tl-row2">
                      <div className="admin-tl-field">
                        <label>ป้ายช่วงเวลา (Season Label)</label>
                        <input
                          type="text"
                          className="px-input"
                          placeholder="เช่น Milestone 01"
                          value={ch.seasonLabel || ''}
                          onChange={(e) =>
                            handleTimelineFieldChange(
                              idx,
                              'seasonLabel',
                              e.target.value
                            )
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
                        placeholder="เช่น Congrats Rose BNK48"
                        value={ch.polaroidNote || ''}
                        onChange={(e) =>
                          handleTimelineFieldChange(
                            idx,
                            'polaroidNote',
                            e.target.value
                          )
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
                        ลบการ์ดนี้
                      </button>

                      <div className="admin-tl-btn-group">
                        <button
                          type="button"
                          className="px-btn primary sm"
                          disabled={isSavingTimeline}
                          onClick={() => handleSaveChapter(idx)}
                        >
                          <PixelIcon name="check" size={15} />
                          <span>บันทึกการ์ดนี้</span>
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
            <PixelBunnySprite variant="crown-ge" frame="idle" size={56} />
            <h3>ไม่มีการ์ดในหมวดนี้</h3>
          </PixelFrame>
        ) : (
          <div className="wall-grid">
            {filteredWishes.map((w, idx) => (
              <div key={w.id || idx} className="admin-card">
                <WishCardView
                  bg={w.bg}
                  stamp={w.stamp}
                  name={w.name}
                  message={w.message}
                  img={w.img}
                  likes={w.likes || 0}
                  isFeatured={Boolean(w.is_featured)}
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
                  <button
                    type="button"
                    className={`act-btn ${w.is_featured ? 'approve' : ''}`}
                    onClick={() =>
                      toggleFeaturedWish?.(w.id, !Boolean(w.is_featured))
                    }
                    title="ปักหมุดขึ้นหอเกียรติยศ (Hall of Fame)"
                  >
                    <PixelIcon name="crown" size={13} />
                    <span>{w.is_featured ? 'ติดดาวแล้ว' : 'ติดดาว'}</span>
                  </button>
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
