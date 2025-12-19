import React, { useState, useEffect, useRef } from "react";

// ========== IMPORT CÁC HÌNH ẢNH TẠI ĐÂY ==========
import RoomBg from "../Img/room4.png"
import DoorImg from "../Img/lock4-Photoroom.png"
import NotebookImg from "../Img/book4.png"
import Receipt1Img from "../Img/note4.png"
import Receipt2Img from "../Img/note4.png"
import Receipt3Img from "../Img/note4.png"
import Ticket1Img from "../Img/ticket4.png"
import Ticket2Img from "../Img/ticket4.png"
import Ticket3Img from "../Img/ticket4.png"
import Ticket4Img from "../Img/ticket4.png"
import GymCardImg from "../Img/thegym4.png"
import CouplePhotoImg from "../Img/13256cf29b0072efda5b57ca671b02b0.jpg"
import ShirtImg from "../Img/somi4.png"
import CupImg from "../Img/cup4.png"

const loadFonts = () => {
  if (!document.querySelector('#room4-fonts')) {
    const link = document.createElement('link');
    link.id = 'room4-fonts';
    link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&family=Noto+Serif:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
};

export default function Room4({ onComplete }) {
  const [stage, setStage] = useState("intro");
  const [lockOpen, setLockOpen] = useState(false);
  const [selectedStandards, setSelectedStandards] = useState(new Set());
  const [hovered, setHovered] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [notebookPage, setNotebookPage] = useState(1);
  const audioRef = useRef(null);

  const correctAnswer = new Set([3, 4, 5, 6, 8, 10]);

  const roomBackground = RoomBg;
  const doorImage = DoorImg;
  const notebookImage = NotebookImg;

  const standards = [
    { id: 1, text: "Không uống rượu" },
    { id: 2, text: "Gan dạ" },
    { id: 3, text: "Có tính tiết kiệm" },
    { id: 4, text: "Không hay khóc" },
    { id: 5, text: "Thích vận động" },
    { id: 6, text: "Không nhuộm tóc" },
    { id: 7, text: "Cao trên 1m7" },
    { id: 8, text: "Không có bệnh sạch sẽ" },
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
8. Không có bệnh sạch sẽ
9. Không hút thuốc
10. Biết rap`
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

  // Danh sách vật phẩm với ảnh thật
  const items = [
    { id: "receipt1", img: Receipt1Img, position: { left: "15vw", top: "80vh" }, 
      detail: { title: "HÓA ĐƠN MUA HÀNG", content: "Siêu thị CoopMart\n\nBia Tiger - 6 lon\nGiá: 150.000đ\n\nNgày: 10/03/2024\n14:30" }
    },
    { id: "receipt2", img: Receipt2Img, position: { left: "60vw", top: "80vh" }, 
      detail: { title: "HÓA ĐƠN MUA HÀNG", content: "Cửa hàng rượu ABC\n\nRượu vang đỏ\nKhuyến mãi: MUA 3 TẶNG 1\nGiá gốc: 280.000đ/chai\nSố lượng: 4 chai (chỉ tính 3)\nThành tiền: 840.000đ\n\nNgày: 15/03/2024\n19:15" }
    },
    { id: "receipt3", img: Receipt3Img, position: { left: "30vw", top: "60vh" }, 
      detail: { title: "HÓA ĐƠN MUA HÀNG", content: "Tiệm bánh Như Lan\n\nBánh kem dâu\nGiá gốc: 170.000đ\nGIẢM GIÁ 50%\nThành tiền: 85.000đ\n\nNgày: 18/03/2024\n20:00" }
    },
    { id: "ticket1", img: Ticket1Img, position: { left: "10vw", top: "70vh" }, 
      detail: { title: "VÉ XEM PHIM", content: "Rạp CGV Vincom\n\nPhim: 'Hạnh Phúc Của Một Gia Đình'\nThể loại: Tình cảm\nSuất: 19:30 - 12/03/2024\nGhế: E5, E6", verified: true }
    },
    { id: "ticket2", img: Ticket2Img, position: { left: "25vw", top: "70vh" }, 
      detail: { title: "VÉ XEM PHIM", content: "Rạp Lotte Cinema\n\nPhim: 'Nơi Ta Thuộc Về'\nThể loại: Tình cảm, Lãng mạn\nSuất: 20:00 - 16/03/2024\nGhế: F7, F8", verified: true }
    },
    { id: "ticket3", img: Ticket3Img, position: { left: "72vw", top: "40vh" }, 
      detail: { title: "VÉ XEM PHIM", content: "Rạp BHD Star\n\nPhim: 'Mùa Hè Của Em'\nThể loại: Tình cảm, Thanh xuân\nSuất: 18:45 - 20/03/2024\nGhế: G3, G4", verified: true }
    },
    { id: "ticket4", img: Ticket4Img, position: { left: "12vw", top: "40vh" }, 
      detail: { title: "VÉ XEM PHIM", content: "Rạp Galaxy Cinema\n\nPhim: 'Ác Mộng Đêm Hè'\nThể loại: Kinh dị, Giật gân\nSuất: 21:30 - 25/03/2024\nGhế: H5, H6", verified: false }
    },
    { id: "gym", img: GymCardImg, type: "card", position: { left: "45vw", top: "60vh" }, 
      detail: { title: "THẺ HỘI VIÊN GYM", content: "FITNESS CENTER PREMIUM\n\nHọ tên: GỌI TÔI LÀ DEMO\nLoại thẻ: VIP Premium\nHạn sử dụng: 12 tháng\n(Từ 01/01/2025 đến 31/12/2025)" }
    },
    { id: "photo", img: CouplePhotoImg, type: "photo", position: { left: "55vw", top: "45vh" }, 
      photoUrl: CouplePhotoImg,
      detail: { title: "ẢNH KỶ NIỆM" }
    },
    { id: "shirt", img: ShirtImg, position: { left: "55vw", top: "70vh" }, 
      detail: { title: "ÁO SƠ MI NAM", content: "Thương hiệu: Aristino\nMàu: Xanh\nSize: M\n\nPhù hợp với:\nChiều cao: 160-165cm\nCân nặng: 55-65kg" }
    },
    { id: "cup", img: CupImg, type: "dirtyCup", position: { left: "70vw", top: "70vh" }, 
      detail: { title: "CỐC TÌNH NHÂN" }
    }
  ];

  useEffect(() => {
    loadFonts();
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    if (stage === "room" && audioRef.current) {
      audioRef.current.volume = 0.25;
      audioRef.current.play().catch(() => {});
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
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

      {/* ==================== MÀN HÌNH INTRO ==================== */}
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

      {/* ==================== PHÒNG CHƠI ==================== */}
      {stage === "room" && (
        <>
          <div style={styles.roomContainer}>
            <div style={{
              ...styles.roomBg,
              backgroundImage: roomBackground ? `url(${roomBackground})` : 'none'
            }}></div>
            <div style={styles.fog}></div>
            <div style={styles.vignette}></div>

            <div style={styles.ceilingLamp}>
              <div style={styles.lampCord}></div>
              <div style={styles.lampShade}>
                <div style={styles.lampTop}></div>
                <div style={styles.lampBottom}></div>
                <div style={styles.lampGlow}></div>
              </div>
            </div>

            <div
              style={{
                ...styles.doorWrapper,
                backgroundImage: doorImage ? `url(${doorImage})` : 'none',
                backgroundSize: doorImage ? 'contain' : 'auto',
                backgroundPosition: doorImage ? 'center' : 'auto',
                backgroundRepeat: doorImage ? 'no-repeat' : 'auto',
                cursor: 'pointer',
                filter: hovered === "door"
                  ? "brightness(1.15) drop-shadow(0 0 80px rgba(139,0,0,0.8))"
                  : "none",
                transform: hovered === "door"
                  ? "translate(-50%, 0) scale(1.02)"
                  : "translate(-50%, 0)",
                transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
              }}
              onClick={() => setLockOpen(true)}
              onMouseEnter={() => setHovered("door")}
              onMouseLeave={() => setHovered(null)}
            />

            {/* Cuốn sổ nằm trực tiếp trên sàn (không có bàn) */}
            <div
              style={{
                ...styles.notebook,
                backgroundImage: notebookImage ? `url(${notebookImage})` : 'none',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                transform: hovered === "notebook" ? "scale(1.08)" : "scale(1)",
                filter: hovered === "notebook" 
                  ? "brightness(1.3) drop-shadow(0 0 40px rgba(139,0,0,0.8))" 
                  : "brightness(1)"
              }}
              onClick={() => handleItemClick({ id: "notebook" })}
              onMouseEnter={() => setHovered("notebook")}
              onMouseLeave={() => setHovered(null)}
            />

            {/* Các vật phẩm khác - chỉ dùng ảnh thật */}
            {items.map(item => (
              <div
                key={item.id}
                style={{
                  ...styles.item,
                  left: item.position.left,
                  top: item.position.top,
                  backgroundImage: `url(${item.img})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  transform: hovered === item.id ? "scale(1.2)" : "scale(1)",
                  filter: hovered === item.id 
                    ? "brightness(1.4) drop-shadow(0 0 25px rgba(139,0,0,0.7))" 
                    : "brightness(1)",
                  cursor: "pointer"
                }}
                onClick={() => handleItemClick(item)}
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
              />
            ))}

            {/* ==================== CHI TIẾT VẬT PHẨM KHI ZOOM ==================== */}
            {selectedItem && selectedItem.id !== "notebook" && selectedItem.type !== "photo" && selectedItem.type !== "dirtyCup" && (
              <div style={styles.itemDetailModal} onClick={() => setSelectedItem(null)}>
                <div style={{
                  ...styles.itemDetailPanel,
                  background: selectedItem.id.startsWith("receipt") ? "#ffffff" : 
                              selectedItem.id.startsWith("ticket") ? "#fffacd" : 
                              selectedItem.id === "gym" ? "#ffffff" : 
                              selectedItem.id === "shirt" ? "#ffffff" : "#ffffff",
                  color: selectedItem.id.startsWith("receipt") ? "#000000" : 
                         selectedItem.id.startsWith("ticket") ? "#8b4513" : 
                         selectedItem.id === "gym" ? "#000000" : 
                         selectedItem.id === "shirt" ? "#000000" : "#000000",
                  // NOTE: Chỉnh kích thước hóa đơn ở đây
                  // width = chiều ngang, height/minHeight = chiều dọc
                  width: selectedItem.id.startsWith("receipt") ? "420px" : "600px",   // <-- to hơn trước
                  minHeight: selectedItem.id.startsWith("receipt") ? "720px" : "auto", // <-- dài dọc hơn
                  padding: selectedItem.id.startsWith("receipt") ? "50px" : "40px"
                }} onClick={e => e.stopPropagation()}>
                  <button style={styles.closeBtn} onClick={() => setSelectedItem(null)}>✕</button>
                  {selectedItem.detail.verified !== undefined && selectedItem.detail.verified && (
                    <div style={styles.verifiedStamp}>✓ ĐÃ XEM</div>
                  )}
                  <h3 style={{
                    ...styles.itemDetailTitle,
                    color: selectedItem.id.startsWith("receipt") ? "#000000" : 
                           selectedItem.id.startsWith("ticket") ? "#8b4513" : 
                           selectedItem.id === "gym" ? "#000000" : 
                           selectedItem.id === "shirt" ? "#000000" : "#000000"
                  }}>{selectedItem.detail.title}</h3>
                  <pre style={{
                    ...styles.itemDetailText,
                    color: selectedItem.id.startsWith("receipt") ? "#000000" : 
                           selectedItem.id.startsWith("ticket") ? "#8b4513" : 
                           selectedItem.id === "gym" ? "#000000" : 
                           selectedItem.id === "shirt" ? "#000000" : "#000000",
                    fontSize: selectedItem.id.startsWith("receipt") ? "1.5rem" : "1.4rem" // <-- chữ to hơn
                  }}>{selectedItem.detail.content}</pre>
                  {selectedItem.id === "shirt" && (
                    <img 
                      src={ShirtImg} 
                      alt="Áo sơ mi"
                      style={styles.shirtImage}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Ảnh đôi */}
            {selectedItem && selectedItem.type === "photo" && (
              <div style={styles.itemDetailModal} onClick={() => setSelectedItem(null)}>
                <div style={styles.photoZoomPanel} onClick={e => e.stopPropagation()}>
                  <button style={styles.closeBtn} onClick={() => setSelectedItem(null)}>✕</button>
                  <div style={styles.photoZoomFrame}>
                    <img 
                      src={selectedItem.photoUrl} 
                      alt="Ảnh đôi"
                      style={styles.realPhotoImage}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Cốc bẩn */}
            {selectedItem && selectedItem.type === "dirtyCup" && (
              <div style={styles.itemDetailModal} onClick={() => setSelectedItem(null)}>
                <div style={styles.cupZoomPanel} onClick={e => e.stopPropagation()}>
                  <button style={styles.closeBtn} onClick={() => setSelectedItem(null)}>✕</button>
                  <div style={styles.bigCupContainer}>
                    <div style={styles.bigCupIcon}>☕</div>
                    <div style={{...styles.dirtyIcon, top: "15%", left: "20%"}}>🕸️</div>
                    <div style={{...styles.dirtyIcon, top: "25%", right: "15%", fontSize: "2rem"}}>🕸️</div>
                    <div style={{...styles.dirtyIcon, bottom: "30%", left: "15%", fontSize: "1.8rem"}}>🕸️</div>
                    <div style={{...styles.dirtDot, top: "40%", left: "35%"}}>•</div>
                    <div style={{...styles.dirtDot, top: "55%", right: "30%"}}>•</div>
                    <div style={{...styles.dirtDot, bottom: "25%", left: "40%"}}>•</div>
                    <div style={{...styles.dirtDot, top: "45%", right: "35%"}}>•</div>
                    <div style={{...styles.stainIcon, top: "30%", left: "25%"}}>💧</div>
                    <div style={{...styles.stainIcon, bottom: "35%", right: "25%", opacity: 0.6}}>💧</div>
                  </div>
                </div>
              </div>
            )}

            {/* Cuốn sổ khi zoom */}
            {selectedItem && selectedItem.id === "notebook" && (
              <div style={styles.itemDetailModal} onClick={() => setSelectedItem(null)}>
                <div style={{...styles.notebookPanel, background: "#fff5f5", color: "#8b4513"}} onClick={e => e.stopPropagation()}>
                  <button style={styles.closeBtn} onClick={() => setSelectedItem(null)}>✕</button>
                  <div style={styles.notebookContent}>
                    <h3 style={{...styles.notebookPageTitle, color: "#8b4513"}}>{notebookPages[notebookPage - 1].title}</h3>
                    <pre style={{...styles.notebookPageText, color: "#8b4513", fontSize: "1.5rem"}}>{notebookPages[notebookPage - 1].content}</pre>
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

          {/* ==================== MẬT KHẨU ==================== */}
          {lockOpen && (
            <div style={styles.lockModal} onClick={() => setLockOpen(false)}>
              <div style={{...styles.lockPanel, background: "linear-gradient(135deg, #008080 0%, #000000 100%)"}} onClick={e => e.stopPropagation()}>
                {/* <div style={{...styles.lockPanelTitle, color: "#ffffff"}}>Hãy nhập mật khẩu đúng !</div> */}
                
                <div style={styles.standardsRow}>
                  {standards.map(standard => (
                    <div
                      key={standard.id}
                      style={{
                        ...styles.standardBox,
                        background: selectedStandards.has(standard.id)
                          ? "linear-gradient(135deg, rgba(0,128,128,0.4), rgba(0,0,0,0.5))"
                          : "rgba(0,0,0,0.7)",
                        boxShadow: selectedStandards.has(standard.id)
                          ? "0 0 30px rgba(0,128,128,0.8), inset 0 0 20px rgba(0,128,128,0.3)"
                          : "0 5px 20px rgba(0,0,0,0.8)"
                      }}
                      onClick={() => toggleStandard(standard.id)}
                    >
                      <div style={{...styles.standardNumber, color: "#ffffff"}}>{standard.id}</div>
                      {selectedStandards.has(standard.id) && (
                        <div style={{...styles.standardCheckmark, color: "#ffffff"}}>✓</div>
                      )}
                    </div>
                  ))}
                </div>

                <div style={{...styles.selectedCount, color: "#ffffff"}}>
                  Đã chọn: {selectedStandards.size}
                </div>

                <button style={{...styles.unlockBtn, background: "linear-gradient(135deg, #008080, #000000)"}} onClick={checkAnswer}>
                 XÁC NHẬN
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
            <div style={styles.sparkles}>💖 ✨ 💕 ✨ 💖</div>
          </div>
        </div>
      )}

      {stage === "lose" && (
        <div style={{...styles.screen, animation: "flicker 0.3s ease-in-out 5"}}>
          <div style={styles.loseBox}>
            <h1 style={styles.loseTitle}>❌ CHƯA ĐÚNG</h1>
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
    fontFamily: "'Noto Serif', Georgia, serif",
    position: "relative",
    userSelect: "none",
    background: "#000"
  },
  roomContainer: {
    position: "absolute",
    inset: 0
  },
  roomBg: {
    position: "absolute",
    inset: 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
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

  // ==================== MÀN HÌNH INTRO ====================
  // NOTE: Chỉnh màu intro ở đây
  // - border: viền khung
  // - color trong introTitle: màu chữ tiêu đề
  // - background trong storyBox: nền hộp thoại
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
    border: "6px solid #cd853f",           // <-- viền nâu
    borderRadius: "15px",
    boxShadow: "0 25px 80px rgba(0,0,0,0.95)"
  },
  introTitle: {
    fontSize: "2.5rem",
    color: "#deb887",                      // <-- chữ nâu sáng (burlywood)
    marginBottom: "30px",
    textShadow: "0 0 35px rgba(205,133,63,0.8)",
    fontFamily: "'Noto Serif', Georgia, serif"
  },
  storyText: {
    fontSize: "1.3rem",
    lineHeight: "2",
    marginBottom: "20px",
    color: "#deb887",                      // <-- chữ nâu sáng cho nội dung
    fontFamily: "'Noto Serif', Georgia, serif"
  },
  continueBtn: {
    marginTop: "30px",
    background: "linear-gradient(135deg, #cd853f, #8b4513)", // nâu nhạt → nâu đậm
    border: "3px solid #cd853f",
    color: "#fff",
    padding: "16px 45px",
    fontSize: "1.2rem",
    cursor: "pointer",
    borderRadius: "10px",
    transition: "all 0.3s ease",
    fontWeight: "bold",
    fontFamily: "'Noto Serif', Georgia, serif"
  },

  // ==================== CÁC PHẦN KHÁC ====================
  ceilingLamp: {
    position: "fixed",
    top: "30px",
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
    position: "fixed",
    top: "53vh",
    right: "3.5vw",
    width: "7vw",       // giảm chiều rộng để không bị dư
  height: "auto",      // quan trọng: để height tự động theo tỷ lệ ảnh
  aspectRatio: "3 / 4", // giữ tỷ lệ ảnh gốc (bạn chỉnh theo ảnh thật của bạn)
  // zIndex: 10,
  cursor: "pointer",
    zIndex: 10
  },

  // NOTE: Cuốn sổ nằm trên sàn - chỉnh vị trí/size ở đây
  notebook: {
    position: "fixed",
    bottom: "10vh",
    left: "38%",
    transform: "translateX(-50%)",
    width: "12vw",
    height: "16vh",
    cursor: "pointer",
    transition: "all 0.3s ease",
    zIndex: 9
  },

  // NOTE: Các vật phẩm trên sàn - chỉnh size ở đây (width/height)
  item: {
    position: "fixed",
    width: "8vw",
    height: "10vh",
    cursor: "pointer",
    transition: "all 0.3s ease",
    zIndex: 10
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

  // NOTE: Chỉnh kích thước + màu khi zoom vật phẩm ở đây
  // - width/minHeight/padding: kích thước panel
  // - background/color: nền và chữ
  itemDetailPanel: {
    border: "none",
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
    fontFamily: "'Noto Serif', Georgia, serif"
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
    fontFamily: "'Noto Serif', Georgia, serif",
    zIndex: 10
  },
  itemDetailTitle: {
    fontSize: "2.2rem",
    textAlign: "center",
    marginBottom: "30px",
    fontFamily: "'Noto Serif', Georgia, serif"
  },
  itemDetailText: {
    fontSize: "1.4rem",
    lineHeight: "2",
    whiteSpace: "pre-wrap",
    fontFamily: "'Noto Serif', Georgia, serif",
    textAlign: "left"
  },
  shirtImage: {
    width: "250px",
    height: "auto",
    marginTop: "20px",
    marginLeft: "20px",
    float: "right",
    borderRadius: "10px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
  },

  photoZoomPanel: {
    background: "rgba(0,0,0,0.98)",
    borderRadius: "20px",
    padding: "40px",
    maxWidth: "800px",
    width: "100%",
    boxShadow: "0 30px 100px rgba(0,0,0,0.98)",
    position: "relative"
  },
  photoZoomFrame: {
    width: "100%",
    maxWidth: "700px",
    height: "700px",
    margin: "0 auto",
    background: "linear-gradient(135deg, #2a2520 0%, #1a1510 100%)",
    borderRadius: "15px",
    boxShadow: "0 25px 80px rgba(0,0,0,0.95)",
    overflow: "hidden",
    position: "relative"
  },
  realPhotoImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block"
  },

  cupZoomPanel: {
    background: "rgba(0,0,0,0.98)",
    borderRadius: "20px",
    padding: "50px",
    boxShadow: "0 30px 100px rgba(0,0,0,0.98)",
    position: "relative"
  },
  bigCupContainer: {
    width: "600px",
    height: "600px",
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

  notebookPanel: {
    background: "#fff5f5",
    border: "none",
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
    fontSize: "2.4rem",
    color: "#8b4513",
    textAlign: "center",
    marginBottom: "30px",
    fontFamily: "'Noto Serif', Georgia, serif",
    borderBottom: "3px solid rgba(139,71,38,0.5)",
    paddingBottom: "15px"
  },
  notebookPageText: {
    fontSize: "1.5rem",
    color: "#8b4513",
    lineHeight: "2.2",
    whiteSpace: "pre-wrap",
    fontFamily: "'Noto Serif', Georgia, serif",
    textAlign: "left"
  },
  notebookNav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "20px",
    borderTop: "2px solid rgba(139,71,38,0.3)",
    paddingTop: "20px"
  },
  pageBtn: {
    background: "linear-gradient(135deg, rgba(139,71,38,0.7), rgba(80,40,20,0.8))",
    border: "3px solid rgba(139,71,38,0.7)",
    color: "#fff",
    padding: "12px 25px",
    fontSize: "1rem",
    cursor: "pointer",
    borderRadius: "10px",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    fontFamily: "'Noto Serif', Georgia, serif"
  },
  pageIndicator: {
    fontSize: "1.2rem",
    color: "#8b4513",
    fontWeight: "bold",
    fontFamily: "'Noto Serif', Georgia, serif"
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
    background: "linear-gradient(135deg, #008080 0%, #000 50%, #008080 100%)",
    border: "none",
    borderRadius: "20px",
    padding: "40px",
    textAlign: "center",
    color: "#ffffff",
    boxShadow: "0 25px 100px rgba(0,0,0,0.98)",
    width: "800px",
    maxWidth: "90vw",
    maxHeight: "85vh",
    overflowY: "auto"
  },
  lockPanelTitle: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "15px",
    textShadow: "0 0 25px rgba(0,128,128,0.8)",
    color: "#ffffff",
    fontFamily: "'Noto Serif', Georgia, serif"
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
    color: "#ffffff",
    textShadow: "0 0 20px rgba(0,128,128,0.8)",
    fontFamily: "'Noto Serif', Georgia, serif"
  },
  standardCheckmark: {
    position: "absolute",
    top: "5px",
    right: "5px",
    fontSize: "1.5rem",
    color: "#ffffff",
    textShadow: "0 0 15px #ffffff"
  },
  selectedCount: {
    fontSize: "1.2rem",
    color: "#ffffff",
    marginBottom: "25px",
    fontFamily: "'Noto Serif', Georgia, serif"
  },
  unlockBtn: {
    background: "linear-gradient(135deg, #008080, #000000)",
    border: "none",
    color: "#ffffff",
    padding: "18px 45px",
    fontSize: "1.3rem",
    cursor: "pointer",
    borderRadius: "12px",
    fontWeight: "bold",
    marginBottom: "15px",
    width: "100%",
    boxShadow: "0 8px 30px rgba(0,128,128,0.6)",
    transition: "all 0.3s ease",
    fontFamily: "'Noto Serif', Georgia, serif"
  },
  cancelBtn: {
    background: "transparent",
    border: "2px solid rgba(80,80,80,0.5)",
    color: "#ffffff",
    padding: "12px 35px",
    fontSize: "1rem",
    cursor: "pointer",
    borderRadius: "10px",
    width: "100%",
    transition: "all 0.3s ease",
    fontFamily: "'Noto Serif', Georgia, serif"
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
    animation: "bounce 1s ease infinite",
    fontFamily: "'Noto Serif', Georgia, serif"
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
    marginBottom: "30px",
    fontFamily: "'Noto Serif', Georgia, serif"
  },
  loseSubtext: {
    fontSize: "1.2rem",
    color: "#666",
    marginBottom: "40px",
    fontFamily: "'Noto Serif', Georgia, serif"
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
    fontFamily: "'Noto Sans', Arial, sans-serif"
  }
};

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
  
  .closeBtn:hover {
    transform: rotate(90deg) scale(1.1);
  }
  
  .pageBtn:disabled {
    cursor: not-allowed;
  }
`;
document.head.appendChild(styleSheet);