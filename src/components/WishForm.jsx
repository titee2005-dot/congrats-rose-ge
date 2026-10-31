import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import html2canvas from 'html2canvas';
import { CARD_THEMES } from '../data/roseData';
import ScrollReveal from './ScrollReveal';
import WishCardView from './WishCardView';
import PixelFrame, { SectionHeading } from './PixelFrame';
import { PixelBunnySprite, PixelIcon } from './PixelSprites';

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
        const maxSize = 1000;

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
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function WishForm({ onAddWish }) {
  const [selectedCard, setSelectedCard] = useState(CARD_THEMES[0].id);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [previewImgUrl, setPreviewImgUrl] = useState('');
  const [fileObj, setFileObj] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [popupMsg, setPopupMsg] = useState(null);
  const [recapData, setRecapData] = useState(null);

  useEffect(() => {
    const anyModal = showPreviewModal || showSuccessModal || Boolean(popupMsg);
    document.body.style.overflow = anyModal ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showPreviewModal, showSuccessModal, popupMsg]);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 25 * 1024 * 1024) {
      setPopupMsg('ไฟล์รูปใหญ่เกินไป กรุณาเลือกไฟล์ขนาดไม่เกิน 25MB นะคะ');
      return;
    }
    setFileObj(f);
    setPreviewImgUrl(URL.createObjectURL(f));
  };

  const clearSelectedFile = () => {
    setFileObj(null);
    setPreviewImgUrl('');
  };

  const handleSubmit = async () => {
    if (!name.trim() || !message.trim()) {
      setPopupMsg('กรุณากรอกชื่อผู้ส่งและข้อความอวยพรให้ครบถ้วนนะคะ');
      return;
    }

    setIsSubmitting(true);
    try {
      let compressedImg = '';
      if (fileObj) compressedImg = await compressImageFile(fileObj);

      const ok = await onAddWish({
        bg: selectedCard,
        name: name.trim(),
        message: message.trim(),
        img: compressedImg,
      });

      if (!ok) {
        setIsSubmitting(false);
        return;
      }

      setRecapData({
        bg: selectedCard,
        name: name.trim(),
        message: message.trim(),
        img: compressedImg || previewImgUrl || '',
      });

      setName('');
      setMessage('');
      setFileObj(null);
      setPreviewImgUrl('');
      setShowPreviewModal(false);
      setShowSuccessModal(true);
    } catch (err) {
      console.error(err);
      setPopupMsg('เกิดข้อผิดพลาดในการเตรียมรูปภาพ กรุณาลองใหม่อีกครั้งนะคะ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadRecap = async () => {
    const el = document.getElementById('rose-recap-card');
    if (!el || !recapData) return;
    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        backgroundColor: '#fff4f8',
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `rose_19th_card_${recapData.name}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการบันทึกรูปการ์ด');
    }
  };

  return (
    <>
      <section className="px-section" id="wish">
        <ScrollReveal>
          <SectionHeading
            chip="WRITE A WISH"
            icon="envelope"
            title="เขียนการ์ดอวยพรวันเกิดให้โรส"
            desc="เลือกการ์ดที่ชอบ เขียนคำอวยพรจากใจ แล้วส่งถึงโรสได้เลย (การ์ดทุกใบจะรอแอดมินตรวจสอบก่อนขึ้นกำแพงนะคะ)"
          />
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <div className="wish-layout">
            {/* ฟอร์มเขียนการ์ด */}
            <PixelFrame
              label="Wish Letter"
              icon="envelope"
              tone="pink"
              bodyClassName="wish-form-body"
            >
              <div className="field">
                <span className="field-label">
                  <i>1</i> เลือกแบบการ์ด
                </span>
                <div className="card-picker">
                  {CARD_THEMES.map((t) => {
                    const active = selectedCard === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        className={`card-pick ${active ? 'is-active' : ''}`}
                        style={{
                          '--pick-head': t.headerTone,
                          '--pick-accent': t.accent,
                          '--pick-bg': t.softBg,
                        }}
                        onClick={() => setSelectedCard(t.id)}
                        title={t.sub || t.name}
                        aria-label={t.sub || t.name}
                      >
                        <span className={`pick-swatch sw-${t.variant}`}>
                          <span>
                            <PixelIcon name={t.iconName || 'rose'} size={18} />
                          </span>
                        </span>
                        {active && (
                          <span className="pick-check">
                            <PixelIcon name="check" size={13} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="field">
                <label className="field-label" htmlFor="sender-name-inp">
                  <i>2</i> ชื่อ / นามแฝงผู้ส่ง
                </label>
                <input
                  id="sender-name-inp"
                  type="text"
                  className="px-input"
                  maxLength={40}
                  placeholder="เช่น กระต่ายน้อยของโรส"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="field">
                <div className="field-label-row">
                  <label className="field-label" htmlFor="wish-msg-inp">
                    <i>3</i> คำอวยพร
                  </label>
                  <span
                    className={`char-count ${message.length >= 460 ? 'near' : ''}`}
                  >
                    {message.length}/500
                  </span>
                </div>
                <textarea
                  id="wish-msg-inp"
                  className="px-input px-textarea"
                  maxLength={500}
                  placeholder="อยากบอกอะไรกับโรสในวันเกิดครบ 19 ปี..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div className="field">
                <span className="field-label">
                  <i>4</i> แนบรูป (ไม่บังคับ)
                </span>
                {!previewImgUrl ? (
                  <label className="upload-drop">
                    <PixelIcon name="gift" size={26} />
                    <strong>คลิกเพื่อเลือกรูปภาพ</strong>
                    <small>JPG, PNG, WEBP ไม่เกิน 25MB</small>
                    <input
                      type="file"
                      hidden
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleFileChange}
                    />
                  </label>
                ) : (
                  <div className="upload-picked">
                    <img src={previewImgUrl} alt="ตัวอย่างรูปแนบ" />
                    <button
                      type="button"
                      className="px-btn sm"
                      onClick={clearSelectedFile}
                    >
                      <PixelIcon name="close" size={14} />
                      <span>นำรูปออก</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="wish-actions">
                <button
                  type="button"
                  className="px-btn primary grow"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                >
                  <PixelIcon name="heart" size={16} />
                  <span>{isSubmitting ? 'กำลังส่งการ์ด...' : 'ส่งการ์ดให้โรส'}</span>
                </button>
                <button
                  type="button"
                  className="px-btn"
                  onClick={() => setShowPreviewModal(true)}
                >
                  ดูการ์ดเต็มใบ
                </button>
              </div>
            </PixelFrame>

            {/* พรีวิวการ์ดแบบสด */}
            <div className="wish-preview-col">
              <PixelFrame
                label="Preview"
                icon="sparkle"
                tone="lavender"
                bodyClassName="wish-preview-body"
              >
                <WishCardView
                  bg={selectedCard}
                  name={name}
                  message={message}
                  img={previewImgUrl}
                  letterNumber="Happy 19th Rose"
                />
                <div className="preview-bunny" aria-hidden="true">
                  <PixelBunnySprite variant="pink-rose" frame="idle" size={44} />
                  <span>การ์ดจะหน้าตาแบบนี้นะ!</span>
                </div>
              </PixelFrame>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Modal ดูตัวอย่างเต็มใบ (Portal ออกนอก main เพื่อไม่ให้ติด Navbar) */}
      {showPreviewModal &&
        createPortal(
          <div
            className="px-modal-backdrop"
            onClick={() => setShowPreviewModal(false)}
          >
            <div className="px-modal" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="px-modal-close"
                onClick={() => setShowPreviewModal(false)}
                aria-label="ปิด"
              >
                <PixelIcon name="close" size={16} />
              </button>
              <WishCardView
                bg={selectedCard}
                name={name}
                message={message}
                img={previewImgUrl}
                letterNumber="ตัวอย่างการ์ดของคุณ"
              />
            </div>
          </div>,
          document.body
        )}

      {/* Modal ส่งสำเร็จ + ดาวน์โหลด PNG */}
      {showSuccessModal &&
        recapData &&
        createPortal(
          <div
            className="px-modal-backdrop"
            onClick={() => setShowSuccessModal(false)}
          >
            <div className="px-modal wide" onClick={(e) => e.stopPropagation()}>
              <PixelFrame
                label="Sent!"
                icon="heart"
                tone="mint"
                bodyClassName="success-body"
              >
                <PixelBunnySprite variant="party-19" frame="hop" size={56} />
                <h3>ส่งการ์ดถึงโรสเรียบร้อยแล้ว!</h3>
                <p className="success-note">
                  การ์ดของคุณกำลังรอแอดมินตรวจสอบก่อนขึ้นกำแพงคำอวยพร
                  บันทึกรูปการ์ดเก็บไว้แชร์ได้เลยนะ
                </p>

                <div id="rose-recap-card" className="recap-capture">
                  <WishCardView
                    bg={recapData.bg}
                    name={recapData.name}
                    message={recapData.message}
                    img={recapData.img}
                    letterNumber="Happy 19th Birthday Rose"
                  />
                </div>

                <div className="success-actions">
                  <button
                    type="button"
                    className="px-btn primary"
                    onClick={handleDownloadRecap}
                  >
                    <PixelIcon name="download" size={16} />
                    <span>บันทึกรูปการ์ด (PNG)</span>
                  </button>
                  <button
                    type="button"
                    className="px-btn"
                    onClick={() => setShowSuccessModal(false)}
                  >
                    ปิด
                  </button>
                </div>
              </PixelFrame>
            </div>
          </div>,
          document.body
        )}

      {/* Modal แจ้งเตือน */}
      {popupMsg &&
        createPortal(
          <div className="px-modal-backdrop" onClick={() => setPopupMsg(null)}>
            <div
              className="px-modal narrow"
              onClick={(e) => e.stopPropagation()}
            >
              <PixelFrame
                label="Notice"
                icon="bunny"
                tone="butter"
                bodyClassName="alert-body"
              >
                <PixelBunnySprite variant="pink-rose" frame="idle" size={52} />
                <p>{popupMsg}</p>
                <button
                  type="button"
                  className="px-btn primary"
                  onClick={() => setPopupMsg(null)}
                >
                  ตกลง
                </button>
              </PixelFrame>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
