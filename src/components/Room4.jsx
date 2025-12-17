import React, { useState, useEffect, useRef } from "react";
import couplePhoto from "../Img/13256cf29b0072efda5b57ca671b02b0.jpg"

export default function Room4({ onComplete }) {
  const [stage, setStage] = useState("intro");
  const [lockOpen, setLockOpen] = useState(false);
  const [selectedStandards, setSelectedStandards] = useState(new Set());
  const [hovered, setHovered] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [notebookPage, setNotebookPage] = useState(1);
  const audioRef = useRef(null);

  const correctAnswer = new Set([3, 4, 5, 6, 8, 10]);

  const standards = [
    { id: 1, text: "Không uống rượu" },
    { id: 2, text: "Gan dạ" },
    { id: 3, text: "Có tính tiết kiệm" },
    { id: 4, text: "Không hay khóc" },
    { id: 5, text: "Thích vận động" },
    { id: 6, text: "Không nhuộm tóc" },
    { id: 7, text: "Cao trên 1m7" },
    { id: 8, text: "Có bệnh sạch sẽ" },
    { id: 9, text: "Không hút thuốc" },
    { id: 10, text: "Biết rap" }
  ];

  const notebookPages = [
    {
      title: "10 TIÊU CHUẨN BẠN TRAI HOÀN HẢO TRONG TRUYỀN THUYẾT",
      content: `1. Không uống rượu
2. Gan dạ
3. Có tính tiết kiệm
4. Không hay khóc
5. Thích vận động
6. Không nhuộm tóc
7. Cao trên 1m7
8. Có bệnh sạch sẽ
9. Không hút thuốc
10. Biết rap
`
    },
    {
      title: "Nhật Ký - Ngày 15/03",
      content: `Hôm nay tôi lại cố tình chọc anh ấy khóc bằng cách xem những thước phim buồn nhất.

Tôi đã chuẩn bị sẵn khăn giấy, tưởng anh ấy sẽ khóc...

Nhưng không, anh ấy vẫn cứng rắn như thường lệ. Thật khó hiểu!`
    },
    {
      title: "Nhật Ký - Ngày 22/03",
      content: `Tôi thử một lần nữa, lần này tôi kể cho anh ấy nghe về chú chó cưng của tôi đã mất.

Tôi khóc rất nhiều khi nhớ lại...

Anh ấy ôm tôi, an ủi tôi, nhưng bản thân anh ấy không hề rơi một giọt nước mắt nào.

Anh ấy thật mạnh mẽ.`
    },
    {
      title: "Kế Hoạch Tuần Sau",
      content: `Thứ 2: Đi siêu thị mua đồ
Thứ 3: Xem phim chiều tối
Thứ 4: Nghỉ ngơi ở nhà
Thứ 5: Đi ăn tối
Thứ 6: Tập gym cùng nhau
Thứ 7: Đi dạo
Chủ Nhật: Gặp bạn bè`
    }
  ];

  const items = [
    // Hóa đơn
    { id: "receipt1", icon: "🧾", position: { left: "15%", top: "25%" }, 
      detail: { title: "HÓA ĐƠN MUA HÀNG", content: "Siêu thị CoopMart\n\nBia Tiger - 6 lon\nGiá: 150.000đ\n\nNgày: 10/03/2024\n14:30" }
    },
    { id: "receipt2", icon: "🧾", position: { left: "75%", top: "30%" }, 
      detail: { title: "HÓA ĐƠN MUA HÀNG", content: "Cửa hàng rượu ABC\n\nRượu vang đỏ\nKhuyến mãi: MUA 3 TẶNG 1\nGiá gốc: 280.000đ/chai\nSố lượng: 4 chai (chỉ tính 3)\nThành tiền: 840.000đ\n\nNgày: 15/03/2024\n19:15" }
    },
    { id: "receipt3", icon: "🧾", position: { left: "20%", top: "55%" }, 
      detail: { title: "HÓA ĐƠN MUA HÀNG", content: "Tiệm bánh Như Lan\n\nBánh kem dâu\nGiá gốc: 170.000đ\nGIẢM GIÁ 50%\nThành tiền: 85.000đ\n\nNgày: 18/03/2024\n20:00" }
    },
    
    // Vé xem phim
    { id: "ticket1", icon: "🎫", position: { left: "80%", top: "50%" }, 
      detail: { title: "VÉ XEM PHIM", content: "Rạp CGV Vincom\n\nPhim: 'Hạnh Phúc Của Một Gia Đình'\nThể loại: Tình cảm\nSuất: 19:30 - 12/03/2024\nGhế: E5, E6", verified: true }
    },
    { id: "ticket2", icon: "🎫", position: { left: "25%", top: "70%" }, 
      detail: { title: "VÉ XEM PHIM", content: "Rạp Lotte Cinema\n\nPhim: 'Nơi Ta Thuộc Về'\nThể loại: Tình cảm, Lãng mạn\nSuất: 20:00 - 16/03/2024\nGhế: F7, F8", verified: true }
    },
    { id: "ticket3", icon: "🎫", position: { left: "70%", top: "65%" }, 
      detail: { title: "VÉ XEM PHIM", content: "Rạp BHD Star\n\nPhim: 'Mùa Hè Của Em'\nThể loại: Tình cảm, Thanh xuân\nSuất: 18:45 - 20/03/2024\nGhế: G3, G4", verified: true }
    },
    { id: "ticket4", icon: "🎫", position: { left: "12%", top: "40%" }, 
      detail: { title: "VÉ XEM PHIM", content: "Rạp Galaxy Cinema\n\nPhim: 'Ác Mộng Đêm Hè'\nThể loại: Kinh dị, Giật gân\nSuất: 21:30 - 25/03/2024\nGhế: H5, H6", verified: false }
    },

    // Thẻ gym - dạng thẻ có chữ GYM
    { id: "gym", type: "card", position: { left: "78%", top: "18%" }, 
      detail: { title: "THẺ HỘI VIÊN GYM", content: "FITNESS CENTER PREMIUM\n\nHọ tên: Nguyễn Thành Đạt\nLoại thẻ: VIP Premium\nHạn sử dụng: 12 tháng\n(Từ 01/01/2025 đến 31/12/2025)" }
    },

    // Ảnh đôi - dạng icon ảnh, bấm vào hiện ảnh thật
    { id: "photo", icon: "🖼️", type: "photo", position: { left: "18%", top: "15%" }, 
      // Thay URL này bằng link ảnh thật của bạn
      photoUrl: couplePhoto,
      detail: { title: "ẢNH KỶ NIỆM" }
    },

    // Áo sơ mi
    { id: "shirt", icon: "👔", position: { left: "85%", top: "70%" }, 
      detail: { title: "ÁO SƠ MI NAM", content: "Thương hiệu: Aristino\nMàu: Trắng\nSize: M\n\nPhù hợp với:\nChiều cao: 160-165cm\nCân nặng: 55-65kg" }
    },

    // Cốc đôi - icon cốc nhỏ, bấm vào hiện cốc to
    { id: "cup", icon: "☕", type: "dirtyCup", position: { left: "72%", top: "40%" }, 
      detail: { title: "CỐC TÌNH NHÂN" }
    }
  ];

  useEffect(() => {
    if (stage === "room" && audioRef.current) {
      audioRef.current.volume = 0.25;
      audioRef.current.play().catch(() => {});
    }
  }, [stage]);

  const handleItemClick = (item) => {
    if (item.id === "notebook") {
      setNotebookPage(1);
    }
    setSelectedItem(item);
  };

  const toggleStandard = (id) => {
    setSelectedStandards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const checkAnswer = () => {
    const isCorrect = 
      selectedStandards.size === correctAnswer.size &&
      [...selectedStandards].every(id => correctAnswer.has(id));

    if (isCorrect) {
      setStage("win");
      audioRef.current?.pause();
      setTimeout(() => onComplete?.(), 3000);
    } else {
      setStage("lose");
      audioRef.current?.pause();
    }
  };

  const nextPage = () => {
    if (notebookPage < notebookPages.length) {
      setNotebookPage(notebookPage + 1);
    }
  };

  const prevPage = () => {
    if (notebookPage > 1) {
      setNotebookPage(notebookPage - 1);
    }
  };

  return (
    <div style={styles.container}>
      <audio ref={audioRef} loop>
        <source src="https://assets.mixkit.co/sfx/preview/mixkit-creepy-ambience-1099.mp3" type="audio/mpeg" />
      </audio>

      {stage === "intro" && (
        <div style={styles.screen}>
          <div style={styles.storyBox}>
            <h2 style={styles.introTitle}>PHÒNG 4 - BÍ MẬT TÌNH YÊU</h2>
            <p style={styles.storyText}>Bạn bước vào một căn phòng đầy kỷ niệm...</p>
            <p style={styles.storyText}>Những vật dụng nằm rải rác khắp nơi.</p>
            <p style={styles.storyText}>Một cuốn sổ ...</p>
            <button style={styles.continueBtn} onClick={() => setStage("room")}>
              ĐIỀU TRA →
            </button>
          </div>
        </div>
      )}

      {stage === "room" && (
        <>
          <div style={styles.roomContainer}>
            <div style={styles.roomBg}></div>
            <div style={styles.fog}></div>
            <div style={styles.vignette}></div>

            {/* Đèn trần */}
            <div style={styles.ceilingLamp}>
              <div style={styles.lampCord}></div>
              <div style={styles.lampShade}>
                <div style={styles.lampTop}></div>
                <div style={styles.lampBottom}></div>
                <div style={styles.lampGlow}></div>
              </div>
            </div>

            {/* Cửa */}
            <div
              style={{
                ...styles.doorWrapper,
                cursor: 'pointer',
                filter: hovered === "door"
                  ? "brightness(1.15) drop-shadow(0 0 80px rgba(139,0,0,0.8))"
                  : "none",
                transform: hovered === "door"
                  ? "translateX(-50%) scale(1.02)"
                  : "translateX(-50%)",
                transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
              }}
              onClick={() => setLockOpen(true)}
              onMouseEnter={() => setHovered("door")}
              onMouseLeave={() => setHovered(null)}
            >
              <div style={styles.doorFrame}>
                <div style={styles.doorFrameTop}></div>
                <div style={styles.doorFrameLeft}></div>
                <div style={styles.doorFrameRight}></div>
              </div>
              <div style={styles.door3D}>
                <div style={styles.doorPanel}>
                  <div style={styles.doorLine1}></div>
                  <div style={styles.doorLine2}></div>
                </div>
                <div style={styles.doorLock}>
                  <div style={styles.lockShackle}></div>
                  <div style={styles.lockBody}>
                    <div style={styles.lockKeyhole}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bàn ở giữa với cuốn sổ lớn */}
            <div style={styles.centerTable}>
              <div style={styles.centerTableShadow}></div>
              <div style={styles.centerTableTop}>
                {/* Cuốn sổ lớn */}
                <div
                  style={{
                    ...styles.notebook,
                    transform: hovered === "notebook" ? "scale(1.08)" : "scale(1)",
                    filter: hovered === "notebook" 
                      ? "brightness(1.3) drop-shadow(0 0 40px rgba(139,0,0,0.8))" 
                      : "brightness(1)"
                  }}
                  onClick={() => handleItemClick({ id: "notebook", icon: "📖" })}
                  onMouseEnter={() => setHovered("notebook")}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div style={styles.notebookCover}>📖</div>
                  <div style={styles.notebookTitle}>Cuốn Sổ</div>
                </div>
              </div>
            </div>

            {/* Các vật phẩm rải rác */}
            {items.map(item => {
              // Render theo loại vật phẩm
              if (item.type === "card") {
                // Thẻ GYM
                return (
                  <div
                    key={item.id}
                    style={{
                      ...styles.gymCard,
                      left: item.position.left,
                      top: item.position.top,
                      transform: hovered === item.id ? "scale(1.15)" : "scale(1)",
                      filter: hovered === item.id 
                        ? "brightness(1.3) drop-shadow(0 0 30px rgba(139,0,0,0.7))" 
                        : "brightness(1)"
                    }}
                    onClick={() => handleItemClick(item)}
                    onMouseEnter={() => setHovered(item.id)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <div style={styles.gymCardTitle}>GYM</div>
                    <div style={styles.gymCardSubtitle}>VIP</div>
                  </div>
                );
              } 
              
              // Tất cả các vật phẩm có icon đều render như nhau
              if (item.icon) {
                return (
                  <div
                    key={item.id}
                    style={{
                      ...styles.item,
                      left: item.position.left,
                      top: item.position.top,
                      transform: hovered === item.id ? "scale(1.2)" : "scale(1)",
                      filter: hovered === item.id 
                        ? "brightness(1.4) drop-shadow(0 0 25px rgba(139,0,0,0.7))" 
                        : "brightness(1)"
                    }}
                    onClick={() => handleItemClick(item)}
                    onMouseEnter={() => setHovered(item.id)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <div style={styles.itemIcon}>{item.icon}</div>
                  </div>
                );
              }
              
              return null;
            })}

            {/* Panel hiển thị chi tiết vật phẩm */}
            {selectedItem && selectedItem.id !== "notebook" && selectedItem.type !== "photo" && selectedItem.type !== "dirtyCup" && (
              <div style={styles.itemDetailModal} onClick={() => setSelectedItem(null)}>
                <div style={styles.itemDetailPanel} onClick={e => e.stopPropagation()}>
                  <button style={styles.closeBtn} onClick={() => setSelectedItem(null)}>✕</button>
                  {selectedItem.detail.verified !== undefined && selectedItem.detail.verified && (
                    <div style={styles.verifiedStamp}>✓ ĐÃ XEM</div>
                  )}
                  <div style={styles.itemDetailIcon}>{selectedItem.icon}</div>
                  <h3 style={styles.itemDetailTitle}>{selectedItem.detail.title}</h3>
                  <pre style={styles.itemDetailText}>{selectedItem.detail.content}</pre>
                </div>
              </div>
            )}

            {/* Panel hiển thị ảnh đôi - Hiện ảnh thật từ URL */}
            {selectedItem && selectedItem.type === "photo" && (
              <div style={styles.itemDetailModal} onClick={() => setSelectedItem(null)}>
                <div style={styles.photoZoomPanel} onClick={e => e.stopPropagation()}>
                  <button style={styles.closeBtn} onClick={() => setSelectedItem(null)}>✕</button>
                  <div style={styles.photoZoomFrame}>
                    <img 
                      src={selectedItem.photoUrl} 
                      alt="Ảnh đôi"
                      style={styles.realPhotoImage}
                      onError={(e) => {
                        // Nếu load ảnh lỗi, hiện placeholder
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    {/* Placeholder nếu ảnh không load được */}
                    <div style={styles.photoPlaceholder}>
                      <div style={styles.photoZoomCouple}>
                        <div style={styles.photoZoomPerson}>
                          <div style={styles.personBody}>👨</div>
                          <div style={styles.hairIndicator}>⬇️ Tóc đen</div>
                        </div>
                        <div style={styles.photoZoomPerson}>
                          <div style={styles.personBody}>👩</div>
                          <div style={styles.hairIndicator}>⬇️ Tóc đen</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Panel hiển thị cốc dơ - Icon cốc BỰ ở giữa */}
            {selectedItem && selectedItem.type === "dirtyCup" && (
              <div style={styles.itemDetailModal} onClick={() => setSelectedItem(null)}>
                <div style={styles.cupZoomPanel} onClick={e => e.stopPropagation()}>
                  <button style={styles.closeBtn} onClick={() => setSelectedItem(null)}>✕</button>
                  
                  {/* Icon cốc to ở giữa màn hình */}
                  <div style={styles.bigCupContainer}>
                    <div style={styles.bigCupIcon}>☕</div>
                    
                    {/* Các icon trang trí xung quanh cốc */}
                    <div style={{...styles.dirtyIcon, top: "15%", left: "20%"}}>🕸️</div>
                    <div style={{...styles.dirtyIcon, top: "25%", right: "15%", fontSize: "2rem"}}>🕸️</div>
                    <div style={{...styles.dirtyIcon, bottom: "30%", left: "15%", fontSize: "1.8rem"}}>🕸️</div>
                    
                    {/* Các chấm bụi bẩn */}
                    <div style={{...styles.dirtDot, top: "40%", left: "35%"}}>•</div>
                    <div style={{...styles.dirtDot, top: "55%", right: "30%"}}>•</div>
                    <div style={{...styles.dirtDot, bottom: "25%", left: "40%"}}>•</div>
                    <div style={{...styles.dirtDot, top: "45%", right: "35%"}}>•</div>
                    
                    {/* Vết bẩn */}
                    <div style={{...styles.stainIcon, top: "30%", left: "25%"}}>💧</div>
                    <div style={{...styles.stainIcon, bottom: "35%", right: "25%", opacity: 0.6}}>💧</div>
                  </div>
                </div>
              </div>
            )}

            {/* Panel hiển thị cuốn sổ với nhiều trang */}
            {selectedItem && selectedItem.id === "notebook" && (
              <div style={styles.itemDetailModal} onClick={() => setSelectedItem(null)}>
                <div style={styles.notebookPanel} onClick={e => e.stopPropagation()}>
                  <button style={styles.closeBtn} onClick={() => setSelectedItem(null)}>✕</button>
                  <div style={styles.notebookContent}>
                    <h3 style={styles.notebookPageTitle}>{notebookPages[notebookPage - 1].title}</h3>
                    <pre style={styles.notebookPageText}>{notebookPages[notebookPage - 1].content}</pre>
                  </div>
                  <div style={styles.notebookNav}>
                    <button 
                      style={{...styles.pageBtn, opacity: notebookPage === 1 ? 0.3 : 1}} 
                      onClick={prevPage}
                      disabled={notebookPage === 1}
                    >
                      ← Trang trước
                    </button>
                    <div style={styles.pageIndicator}>
                      Trang {notebookPage}/{notebookPages.length}
                    </div>
                    <button 
                      style={{...styles.pageBtn, opacity: notebookPage === notebookPages.length ? 0.3 : 1}} 
                      onClick={nextPage}
                      disabled={notebookPage === notebookPages.length}
                    >
                      Trang sau →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal khóa tiêu chuẩn */}
          {lockOpen && (
            <div style={styles.lockModal} onClick={() => setLockOpen(false)}>
              <div style={styles.lockPanel} onClick={e => e.stopPropagation()}>
                <div style={styles.lockPanelTitle}>Hãy nhập mật khẩu đúng !</div>
                {/* <div style={styles.lockInstructions}>
                  Chọn những tiêu chuẩn mà anh ấy ĐÁP ỨNG được
                </div> */}
                
                <div style={styles.standardsRow}>
                  {standards.map(standard => (
                    <div
                      key={standard.id}
                      style={{
                        ...styles.standardBox,
                        background: selectedStandards.has(standard.id)
                          ? "linear-gradient(135deg, rgba(139,0,0,0.4), rgba(100,0,0,0.5))"
                          : "rgba(30,30,30,0.7)",
                        boxShadow: selectedStandards.has(standard.id)
                          ? "0 0 30px rgba(139,0,0,0.8), inset 0 0 20px rgba(139,0,0,0.3)"
                          : "0 5px 20px rgba(0,0,0,0.8)"
                      }}
                      onClick={() => toggleStandard(standard.id)}
                    >
                      <div style={styles.standardNumber}>{standard.id}</div>
                      {selectedStandards.has(standard.id) && (
                        <div style={styles.standardCheckmark}>✓</div>
                      )}
                    </div>
                  ))}
                </div>

                <div style={styles.selectedCount}>
                  Đã chọn: {selectedStandards.size}
                </div>

                <button style={styles.unlockBtn} onClick={checkAnswer}>
                  🔓 XÁC NHẬN
                </button>
                <button style={styles.cancelBtn} onClick={() => setLockOpen(false)}>
                  HỦY BỎ
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {stage === "win" && (
        <div style={styles.screen}>
          <div style={styles.winBox}>
            <h1 style={styles.winTitle}>💕 CHÍNH XÁC!</h1>
            {/* <p style={styles.winText}>
              Các tiêu chuẩn anh ấy đáp ứng:
            </p> */}
            {/* <div style={styles.answerList}>
              <div style={styles.answerItem}>✓ 3. Có tính tiết kiệm</div>
              <div style={styles.answerItem}>✓ 4. Không hay khóc</div>
              <div style={styles.answerItem}>✓ 5. Thích vận động</div>
              <div style={styles.answerItem}>✓ 6. Không nhuộm tóc</div>
              <div style={styles.answerItem}>✓ 8. Có ý thức sạch sẽ (KHÔNG)</div>
              <div style={styles.answerItem}>✓ 10. Biết rap</div>
            </div> */}
            {/* <p style={styles.winSubtext}>Bạn đã hiểu rõ về anh ấy!</p> */}
            <div style={styles.sparkles}>💖 ✨ 💕 ✨ 💖</div>
          </div>
        </div>
      )}

      {stage === "lose" && (
        <div style={{...styles.screen, animation: "flicker 0.3s ease-in-out 5"}}>
          <div style={styles.loseBox}>
            <h1 style={styles.loseTitle}>❌ CHƯA ĐÚNG</h1>
            {/* <p style={styles.loseText}>Có vẻ bạn chưa hiểu rõ về anh ấy...</p> */}
            <p style={styles.loseSubtext}>Điều tra kỹ hơn các vật phẩm và suy luận lại!</p>
            <button style={styles.retryBtn} onClick={() => {
              setStage("room");
              setLockOpen(false);
              setSelectedStandards(new Set());
              audioRef.current?.play();
            }}>
              THỬ LẠI
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    fontFamily: "Georgia, serif",
    position: "relative",
    userSelect: "none",
    background: "#000"
  },
  roomBg: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(180deg, #1a1015 0%, #0f0a0d 30%, #050305 60%, #000 100%)",
    zIndex: 1
  },
  fog: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(ellipse at 50% 80%, rgba(60,40,50,0.15) 0%, transparent 60%)",
    animation: "fogMove 20s ease-in-out infinite",
    pointerEvents: "none",
    zIndex: 2
  },
  vignette: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(ellipse at center, transparent 15%, rgba(0,0,0,0.85) 100%)",
    pointerEvents: "none",
    zIndex: 3
  },
  screen: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#666",
    animation: "fadeIn 0.8s ease-in",
    zIndex: 100
  },
  storyBox: {
    maxWidth: "700px",
    textAlign: "center",
    padding: "40px",
    background: "rgba(10, 10, 10, 0.95)",
    border: "4px solid rgba(139,0,0,0.6)",
    borderRadius: "15px",
    boxShadow: "0 25px 80px rgba(0,0,0,0.95)"
  },
  introTitle: {
    fontSize: "2.5rem",
    color: "#DC143C",
    marginBottom: "30px",
    textShadow: "0 0 35px rgba(220, 20, 60, 0.8)"
  },
  storyText: {
    fontSize: "1.3rem",
    lineHeight: "2",
    marginBottom: "20px",
    color: "#999"
  },
  continueBtn: {
    marginTop: "30px",
    background: "linear-gradient(135deg, rgba(139,0,0,0.8), rgba(80,0,0,0.9))",
    border: "3px solid rgba(139,0,0,0.8)",
    color: "#fff",
    padding: "16px 45px",
    fontSize: "1.2rem",
    cursor: "pointer",
    borderRadius: "10px",
    transition: "all 0.3s ease",
    fontWeight: "bold",
    fontFamily: "Arial, sans-serif"
  },
  roomContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
    overflow: "hidden"
  },
  ceilingLamp: {
    position: "absolute",
    top: "3%",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 8
  },
  lampCord: {
    width: "3px",
    height: "60px",
    background: "linear-gradient(to bottom, #222, #000)",
    margin: "0 auto",
    boxShadow: "0 2px 8px rgba(0,0,0,0.9)"
  },
  lampShade: {
    position: "relative",
    width: "100px",
    height: "50px"
  },
  lampTop: {
    width: "40px",
    height: "10px",
    background: "linear-gradient(135deg, #2a2520, #1a1510)",
    borderRadius: "50%",
    margin: "0 auto",
    boxShadow: "0 5px 20px rgba(0,0,0,0.8)"
  },
  lampBottom: {
    width: "100px",
    height: "50px",
    background: "linear-gradient(135deg, #3a3025 0%, #2a2520 50%, #1a1510 100%)",
    borderRadius: "0 0 50% 50%",
    boxShadow: "0 10px 40px rgba(0,0,0,0.9)",
    border: "2px solid #000",
    margin: "0 auto"
  },
  lampGlow: {
    width: "200px",
    height: "200px",
    background: "radial-gradient(circle, rgba(200,150,180,0.12), transparent 70%)",
    position: "absolute",
    bottom: "-60px",
    left: "50%",
    transform: "translateX(-50%)",
    animation: "lightFlicker 4s ease-in-out infinite",
    pointerEvents: "none"
  },
  doorWrapper: {
    position: "absolute",
    top: "8%",
    right: "8%",
    zIndex: 10
  },
  doorFrame: {
    position: "absolute",
    width: "200px",
    height: "280px",
    top: "-15px",
    left: "-15px",
    zIndex: -1
  },
  doorFrameTop: {
    position: "absolute",
    left: "0",
    top: "0",
    width: "100%",
    height: "15px",
    background: "linear-gradient(to bottom, #000 0%, #0a0a0a 60%, #1a1510 100%)",
    borderRadius: "10px 10px 0 0",
    boxShadow: "0 8px 25px rgba(0,0,0,0.95)"
  },
  doorFrameLeft: {
    position: "absolute",
    left: "0",
    top: "0",
    width: "15px",
    height: "100%",
    background: "linear-gradient(to right, #000 0%, #0a0a0a 60%, #1a1510 100%)",
    borderRadius: "10px 0 0 8px",
    boxShadow: "inset -5px 0 15px rgba(0,0,0,0.9)"
  },
  doorFrameRight: {
    position: "absolute",
    right: "0",
    top: "0",
    width: "15px",
    height: "100%",
    background: "linear-gradient(to left, #000 0%, #0a0a0a 60%, #1a1510 100%)",
    borderRadius: "0 10px 8px 0",
    boxShadow: "inset 5px 0 15px rgba(0,0,0,0.9)"
  },
  door3D: {
    position: "relative",
    width: "170px",
    height: "260px"
  },
  doorPanel: {
    position: "relative",
    width: "100%",
    height: "100%",
    background: "linear-gradient(135deg, #2a2520 0%, #1a1510 15%, #0f0a08 35%, #050302 50%, #0f0a08 65%, #1a1510 85%, #2a2520 100%)",
    border: "6px solid #1a1510",
    borderRadius: "12px 12px 2px 2px",
    boxShadow: "inset 0 3px 20px rgba(0,0,0,0.95), 0 12px 50px rgba(0,0,0,0.9)"
  },
  doorLine1: {
    position: "absolute",
    width: "calc(100% - 25px)",
    height: "2px",
    top: "38%",
    left: "12px",
    background: "linear-gradient(90deg, transparent, #0f0a08 20%, #0f0a08 80%, transparent)",
    opacity: 0.6
  },
  doorLine2: {
    position: "absolute",
    width: "2px",
    height: "calc(100% - 25px)",
    left: "50%",
    top: "12px",
    background: "linear-gradient(180deg, transparent, #0f0a08 20%, #0f0a08 80%, transparent)",
    opacity: 0.6
  },
  doorLock: {
    position: "absolute",
    top: "50%",
    left: "80%",
    transform: "translate(-50%, -50%)",
    transition: "all 0.4s ease",
    cursor: "pointer",
    zIndex: 20
  },
  lockBody: {
    width: "30px",
    height: "40px",
    background: "linear-gradient(135deg, #3a3530 0%, #2a2520 15%, #1a1510 100%)",
    borderRadius: "6px",
    boxShadow: "inset 0 2px 8px rgba(0,0,0,0.9), 0 4px 15px rgba(0,0,0,0.9)",
    border: "2px solid #000",
    position: "relative"
  },
  lockShackle: {
    position: "absolute",
    width: "16px",
    height: "18px",
    top: "-15px",
    left: "50%",
    transform: "translateX(-50%)",
    border: "3px solid #3a3530",
    borderBottom: "none",
    borderRadius: "8px 8px 0 0",
    boxShadow: "inset 0 2px 6px rgba(0,0,0,0.9)"
  },
  lockKeyhole: {
    position: "absolute",
    width: "6px",
    height: "10px",
    background: "#000",
    borderRadius: "50% 50% 0 0",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    boxShadow: "inset 0 2px 6px rgba(0,0,0,1)"
  },
  centerTable: {
    position: "absolute",
    bottom: "15%",
    left: "50%",
    transform: "translateX(-50%)",
    width: "500px",
    height: "300px",
    zIndex: 5
  },
  centerTableShadow: {
    position: "absolute",
    width: "100%",
    height: "100%",
    background: "radial-gradient(ellipse, rgba(0,0,0,0.7) 0%, transparent 70%)",
    filter: "blur(25px)",
    top: "25px"
  },
  centerTableTop: {
    position: "relative",
    width: "100%",
    height: "100%",
    background: "linear-gradient(135deg, #2a2520 0%, #1a1510 30%, #0f0a08 70%, #050302 100%)",
    borderRadius: "25px",
    boxShadow: "0 25px 70px rgba(0,0,0,0.95), inset 0 5px 35px rgba(0,0,0,0.9)",
    border: "8px solid #000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  notebook: {
    width: "200px",
    height: "250px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #3a2820 0%, #2a1810 50%, #1a1008 100%)",
    borderRadius: "12px",
    border: "4px solid #000",
    boxShadow: "0 15px 50px rgba(0,0,0,0.9), inset 0 3px 20px rgba(0,0,0,0.7)"
  },
  notebookCover: {
    fontSize: "5rem",
    marginBottom: "15px",
    filter: "drop-shadow(0 5px 20px rgba(139,0,0,0.6))"
  },
  notebookTitle: {
    fontSize: "1.2rem",
    color: "#c9b896",
    fontWeight: "bold",
    textShadow: "0 2px 10px rgba(0,0,0,0.9)",
    fontFamily: "Georgia, serif"
  },
  item: {
    position: "absolute",
    cursor: "pointer",
    transition: "all 0.3s ease",
    zIndex: 10
  },
  itemIcon: {
    fontSize: "3.5rem",
    filter: "drop-shadow(0 5px 15px rgba(0,0,0,0.9))"
  },
  gymCard: {
    position: "absolute",
    width: "100px",
    height: "140px",
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    border: "4px solid #000",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.9), inset 0 2px 10px rgba(255,255,255,0.1)",
    zIndex: 10
  },
  gymCardTitle: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#00ff00",
    textShadow: "0 0 20px #00ff00, 0 2px 8px rgba(0,0,0,0.9)",
    fontFamily: "Arial, sans-serif",
    letterSpacing: "3px"
  },
  gymCardSubtitle: {
    fontSize: "1.2rem",
    color: "#ffcc00",
    fontWeight: "bold",
    marginTop: "5px",
    fontFamily: "Arial, sans-serif",
    letterSpacing: "2px"
  },
  photoFrame: {
    position: "absolute",
    width: "120px",
    height: "150px",
    background: "linear-gradient(135deg, #2a2520 0%, #1a1510 100%)",
    border: "8px solid #0f0a08",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 10px 35px rgba(0,0,0,0.95), inset 0 2px 10px rgba(60,50,40,0.2)",
    zIndex: 10,
    overflow: "hidden"
  },
  photoImage: {
    width: "100%",
    height: "100%",
    background: "linear-gradient(135deg, #f5f5dc 0%, #e8e8d0 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative"
  },
  photoCouple: {
    display: "flex",
    gap: "15px",
    marginBottom: "10px"
  },
  photoPerson: {
    fontSize: "3rem",
    filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))"
  },
  photoHairNote: {
    fontSize: "0.65rem",
    color: "#333",
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    background: "rgba(255,255,255,0.8)",
    padding: "3px 8px",
    borderRadius: "4px"
  },
  dirtyCup: {
    position: "absolute",
    width: "70px",
    height: "80px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    zIndex: 10,
    display: "flex",
    alignItems: "center"
  },
  cupBody: {
    width: "50px",
    height: "60px",
    background: "linear-gradient(135deg, #8B7355 0%, #6B5344 50%, #4B3934 100%)",
    border: "3px solid #2a1810",
    borderRadius: "8px 8px 12px 12px",
    position: "relative",
    boxShadow: "0 8px 25px rgba(0,0,0,0.9), inset 0 -15px 20px rgba(0,0,0,0.5)"
  },
  cupStain: {
    position: "absolute",
    top: "10px",
    left: "8px",
    width: "30px",
    height: "35px",
    background: "radial-gradient(circle, rgba(40,20,10,0.8) 0%, rgba(60,40,20,0.6) 50%, transparent 80%)",
    borderRadius: "50%",
    filter: "blur(2px)"
  },
  cupWeb: {
    position: "absolute",
    top: "5px",
    right: "5px",
    fontSize: "1rem",
    opacity: 0.6,
    filter: "grayscale(1)"
  },
  cupHandle: {
    width: "25px",
    height: "35px",
    border: "3px solid #2a1810",
    borderLeft: "none",
    borderRadius: "0 50% 50% 0",
    position: "absolute",
    right: "-15px",
    top: "15px",
    background: "linear-gradient(to right, transparent, #6B5344)",
    boxShadow: "inset -3px 0 8px rgba(0,0,0,0.7)"
  },
  photoZoomPanel: {
    background: "rgba(0,0,0,0.98)",
    borderRadius: "20px",
    padding: "40px",
    maxWidth: "600px",
    width: "90%",
    boxShadow: "0 30px 100px rgba(0,0,0,0.98)",
    position: "relative"
  },
  photoZoomFrame: {
    width: "100%",
    maxWidth: "600px",
    height: "600px",
    margin: "0 auto",
    background: "linear-gradient(135deg, #2a2520 0%, #1a1510 100%)",
    border: "20px solid #0f0a08",
    borderRadius: "15px",
    boxShadow: "0 25px 80px rgba(0,0,0,0.95), inset 0 5px 20px rgba(60,50,40,0.2)",
    overflow: "hidden",
    position: "relative"
  },
  realPhotoImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block"
  },
  photoPlaceholder: {
    width: "100%",
    height: "100%",
    background: "linear-gradient(135deg, #f5f5dc 0%, #e8e8d0 100%)",
    display: "none",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    left: 0
  },
  photoZoomImage: {
    width: "100%",
    height: "100%",
    background: "linear-gradient(135deg, #f5f5dc 0%, #e8e8d0 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative"
  },
  photoZoomCouple: {
    display: "flex",
    gap: "60px"
  },
  photoZoomPerson: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px"
  },
  personBody: {
    fontSize: "8rem",
    filter: "drop-shadow(0 5px 20px rgba(0,0,0,0.3))"
  },
  hairIndicator: {
    fontSize: "1.5rem",
    color: "#000",
    fontWeight: "bold",
    background: "rgba(255,255,255,0.9)",
    padding: "10px 20px",
    borderRadius: "8px",
    border: "3px solid #000",
    fontFamily: "Arial, sans-serif"
  },
  cupZoomPanel: {
    background: "rgba(0,0,0,0.98)",
    borderRadius: "20px",
    padding: "50px",
    boxShadow: "0 30px 100px rgba(0,0,0,0.98)",
    position: "relative"
  },
  bigCupContainer: {
    width: "500px",
    height: "500px",
    margin: "0 auto",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  bigCupIcon: {
    fontSize: "20rem",
    filter: "drop-shadow(0 20px 60px rgba(0,0,0,0.9)) hue-rotate(20deg) saturate(0.6) brightness(0.7)",
    position: "relative",
    zIndex: 1
  },
  dirtyIcon: {
    position: "absolute",
    fontSize: "2.5rem",
    opacity: 0.8,
    filter: "grayscale(1) brightness(0.6)",
    textShadow: "0 3px 12px rgba(0,0,0,0.9)",
    animation: "float 3s ease-in-out infinite",
    zIndex: 2
  },
  dirtDot: {
    position: "absolute",
    fontSize: "3rem",
    color: "#3a2820",
    opacity: 0.7,
    textShadow: "0 2px 8px rgba(0,0,0,0.8)",
    zIndex: 2
  },
  stainIcon: {
    position: "absolute",
    fontSize: "2rem",
    opacity: 0.5,
    filter: "hue-rotate(30deg) brightness(0.5)",
    textShadow: "0 2px 10px rgba(0,0,0,0.9)",
    zIndex: 2
  },
  itemDetailModal: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.95)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
    animation: "fadeIn 0.3s ease",
    backdropFilter: "blur(10px)"
  },
  itemDetailPanel: {
    background: "linear-gradient(135deg, #1a1510 0%, #0f0a08 50%, #050302 100%)",
    border: "5px solid rgba(139,0,0,0.7)",
    borderRadius: "20px",
    padding: "40px",
    maxWidth: "600px",
    width: "90%",
    boxShadow: "0 30px 100px rgba(0,0,0,0.98)",
    position: "relative",
    maxHeight: "80vh",
    overflowY: "auto"
  },
  verifiedStamp: {
    position: "absolute",
    top: "60px",
    right: "50px",
    fontSize: "2rem",
    color: "#00ff00",
    fontWeight: "bold",
    textShadow: "0 0 20px #00ff00",
    border: "4px solid #00ff00",
    padding: "10px 20px",
    borderRadius: "10px",
    transform: "rotate(15deg)",
    background: "rgba(0,255,0,0.1)",
    boxShadow: "0 0 30px rgba(0,255,0,0.5)",
    fontFamily: "Arial, sans-serif"
  },
  closeBtn: {
    position: "absolute",
    top: "15px",
    right: "15px",
    width: "40px",
    height: "40px",
    background: "linear-gradient(135deg, rgba(139,0,0,0.8), rgba(80,0,0,0.9))",
    border: "3px solid #000",
    borderRadius: "50%",
    color: "#fff",
    fontSize: "1.5rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    fontFamily: "Arial, sans-serif",
    zIndex: 10
  },
  itemDetailIcon: {
    fontSize: "5rem",
    textAlign: "center",
    marginBottom: "20px",
    filter: "drop-shadow(0 5px 15px rgba(139,0,0,0.6))"
  },
  itemDetailTitle: {
    fontSize: "2rem",
    color: "#DC143C",
    textAlign: "center",
    marginBottom: "25px",
    textShadow: "0 0 25px rgba(220,20,60,0.8)",
    fontFamily: "Georgia, serif"
  },
  itemDetailText: {
    fontSize: "1.2rem",
    color: "#c9b896",
    lineHeight: "1.8",
    whiteSpace: "pre-wrap",
    fontFamily: "Georgia, serif",
    textAlign: "left"
  },
  notebookPanel: {
    background: "linear-gradient(135deg, #3a2820 0%, #2a1810 50%, #1a1008 100%)",
    border: "6px solid rgba(139,0,0,0.7)",
    borderRadius: "20px",
    padding: "50px",
    maxWidth: "700px",
    width: "90%",
    boxShadow: "0 30px 100px rgba(0,0,0,0.98)",
    position: "relative",
    minHeight: "500px",
    display: "flex",
    flexDirection: "column"
  },
  notebookContent: {
    flex: 1,
    marginBottom: "30px"
  },
  notebookPageTitle: {
    fontSize: "2.2rem",
    color: "#DC143C",
    textAlign: "center",
    marginBottom: "30px",
    textShadow: "0 0 25px rgba(220,20,60,0.8)",
    fontFamily: "Georgia, serif",
    borderBottom: "3px solid rgba(139,0,0,0.5)",
    paddingBottom: "15px"
  },
  notebookPageText: {
    fontSize: "1.3rem",
    color: "#c9b896",
    lineHeight: "2",
    whiteSpace: "pre-wrap",
    fontFamily: "Georgia, serif",
    textAlign: "left"
  },
  notebookNav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "20px",
    borderTop: "2px solid rgba(139,0,0,0.3)",
    paddingTop: "20px"
  },
  pageBtn: {
    background: "linear-gradient(135deg, rgba(139,0,0,0.7), rgba(80,0,0,0.8))",
    border: "3px solid rgba(139,0,0,0.7)",
    color: "#fff",
    padding: "12px 25px",
    fontSize: "1rem",
    cursor: "pointer",
    borderRadius: "10px",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    fontFamily: "Arial, sans-serif"
  },
  pageIndicator: {
    fontSize: "1.2rem",
    color: "#999",
    fontWeight: "bold",
    fontFamily: "Arial, sans-serif"
  },
  lockModal: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.96)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3000,
    animation: "fadeIn 0.3s ease",
    backdropFilter: "blur(12px)"
  },
  lockPanel: {
    background: "linear-gradient(135deg, #0a0a0a 0%, #000 50%, #0a0a0a 100%)",
    border: "4px solid rgba(139,0,0,0.6)",
    borderRadius: "20px",
    padding: "40px",
    textAlign: "center",
    color: "#666",
    boxShadow: "0 25px 100px rgba(0,0,0,0.98)",
    width: "800px",
    maxHeight: "85vh",
    overflowY: "auto"
  },
  lockPanelTitle: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "15px",
    textShadow: "0 0 25px rgba(220,20,60,0.8)",
    color: "#DC143C"
  },
  lockInstructions: {
    fontSize: "1rem",
    color: "#999",
    marginBottom: "35px",
    fontFamily: "Arial, sans-serif"
  },
  standardsRow: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginBottom: "30px",
    flexWrap: "wrap"
  },
  standardBox: {
    width: "80px",
    height: "80px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    position: "relative",
    border: "3px solid rgba(80,80,80,0.5)"
  },
  standardNumber: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#DC143C",
    textShadow: "0 0 20px rgba(220,20,60,0.8)",
    fontFamily: "Arial, sans-serif"
  },
  standardCheckmark: {
    position: "absolute",
    top: "5px",
    right: "5px",
    fontSize: "1.5rem",
    color: "#00ff00",
    textShadow: "0 0 15px #00ff00"
  },
  selectedCount: {
    fontSize: "1.2rem",
    color: "#999",
    marginBottom: "25px",
    fontFamily: "Arial, sans-serif"
  },
  unlockBtn: {
    background: "linear-gradient(135deg, rgba(139,0,0,0.8), rgba(100,0,0,0.9))",
    border: "3px solid rgba(139,0,0,0.8)",
    color: "#fff",
    padding: "18px 45px",
    fontSize: "1.3rem",
    cursor: "pointer",
    borderRadius: "12px",
    fontWeight: "bold",
    marginBottom: "15px",
    width: "100%",
    boxShadow: "0 8px 30px rgba(139,0,0,0.6)",
    transition: "all 0.3s ease",
    fontFamily: "Arial, sans-serif"
  },
  cancelBtn: {
    background: "transparent",
    border: "2px solid rgba(80,80,80,0.5)",
    color: "#555",
    padding: "12px 35px",
    fontSize: "1rem",
    cursor: "pointer",
    borderRadius: "10px",
    width: "100%",
    transition: "all 0.3s ease",
    fontFamily: "Arial, sans-serif"
  },
  winBox: {
    textAlign: "center",
    position: "relative",
    maxWidth: "700px"
  },
  winTitle: {
    fontSize: "4rem",
    color: "#DC143C",
    textShadow: "0 0 60px rgba(220,20,60,0.9)",
    marginBottom: "30px",
    animation: "bounce 1s ease infinite"
  },
  winText: {
    fontSize: "1.6rem",
    marginBottom: "25px",
    color: "#999"
  },
  answerList: {
    textAlign: "left",
    background: "rgba(20,20,20,0.8)",
    border: "3px solid rgba(139,0,0,0.5)",
    borderRadius: "15px",
    padding: "25px",
    marginBottom: "25px"
  },
  answerItem: {
    fontSize: "1.2rem",
    color: "#c9b896",
    marginBottom: "12px",
    lineHeight: "1.8",
    fontFamily: "Arial, sans-serif"
  },
  winSubtext: {
    fontSize: "1.3rem",
    color: "#666",
    marginTop: "20px",
    marginBottom: "15px"
  },
  sparkles: {
    fontSize: "2.5rem",
    marginTop: "30px",
    marginBottom: "35px",
    animation: "twinkle 1s ease-in-out infinite"
  },
  loseBox: {
    textAlign: "center"
  },
  loseTitle: {
    fontSize: "4rem",
    color: "#8B0000",
    textShadow: "0 0 60px rgba(139,0,0,0.9)",
    marginBottom: "30px"
  },
  loseText: {
    fontSize: "1.5rem",
    marginBottom: "20px",
    color: "#999"
  },
  loseSubtext: {
    fontSize: "1.2rem",
    color: "#666",
    marginBottom: "40px"
  },
  retryBtn: {
    background: "linear-gradient(135deg, rgba(139,0,0,0.8), rgba(80,0,0,0.9))",
    border: "3px solid rgba(139,0,0,0.8)",
    color: "#fff",
    padding: "18px 50px",
    fontSize: "1.3rem",
    cursor: "pointer",
    borderRadius: "12px",
    fontWeight: "bold",
    letterSpacing: "2px",
    boxShadow: "0 10px 35px rgba(139,0,0,0.7)",
    transition: "all 0.3s ease",
    fontFamily: "Arial, sans-serif"
  }
};

// CSS Animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes lightFlicker {
    0%, 100% { opacity: 1; }
    10% { opacity: 0.3; }
    12% { opacity: 1; }
    50% { opacity: 0.7; }
    70% { opacity: 0.4; }
    72% { opacity: 1; }
  }
  @keyframes fogMove {
    0%, 100% { transform: translateX(0) scale(1); }
    50% { transform: translateX(30px) scale(1.08); }
  }
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }
  @keyframes twinkle {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.9); }
  }
  @keyframes flicker {
    0%, 100% { opacity: 1; }
    25% { opacity: 0.1; }
    50% { opacity: 0.8; }
    75% { opacity: 0.2; }
  }
  
  button:hover:not(:disabled) {
    transform: scale(1.05);
  }
  
  .unlockBtn:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(139,0,0,0.8);
  }
  
  .cancelBtn:hover {
    background: rgba(40,40,40,0.3);
    border-color: rgba(100,100,100,0.6);
  }
  
  .retryBtn:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 50px rgba(139,0,0,0.9);
  }
  
  .continueBtn:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 40px rgba(139,0,0,0.8);
  }
  
  .closeBtn:hover {
    transform: rotate(90deg) scale(1.1);
    background: linear-gradient(135deg, rgba(180,0,0,0.9), rgba(120,0,0,0.95));
  }
  
  .pageBtn:hover:not(:disabled) {
    transform: scale(1.1);
    box-shadow: 0 8px 25px rgba(139,0,0,0.8);
  }
  
  .pageBtn:disabled {
    cursor: not-allowed;
  }
`;
document.head.appendChild(styleSheet);