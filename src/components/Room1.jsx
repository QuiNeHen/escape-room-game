import React, { useState, useEffect, useRef } from "react";
import Bg from "../Img/room.png"
import Labai from "../Img/labai-Photoroom.png"
import note from "../Img/note-Photoroom.png"
import lock from "../Img/locks.png"
import deckBg from "../Img/bgdeck.jpg"  // ← Nền khi mở khay bài
import notePanelBg from "../Img/BGNote.png" // ← Nền của panel note
// import cardBg from "../Img/ImgCard.png" 

// Load Google Fonts hỗ trợ tiếng Việt
const loadFonts = () => {
  if (!document.querySelector('#room1-fonts')) {
    const link = document.createElement('link');
    link.id = 'room1-fonts';
    link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&family=Noto+Serif:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
};

export default function Room1({ onComplete }) {
  const [deckOpen, setDeckOpen] = useState(false);
  const [notePickedUp, setNotePickedUp] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [cardPositions, setCardPositions] = useState({});
  const [dragging, setDragging] = useState(null);
  const [noteDragging, setNoteDragging] = useState(false);
  const [notePos, setNotePos] = useState({ x: 300, y: -150 });
  const [lockOpen, setLockOpen] = useState(false);
  const [code, setCode] = useState(["0", "0", "0", "0"]);
  const audioRef = useRef(null);
  const [eliminatedCards, setEliminatedCards] = useState(new Set());
  const [hoveredObject, setHoveredObject] = useState(null);
  const [isFirstOpen, setIsFirstOpen] = useState(true); // Track first open
  const correctCode = ["7", "3", "2", "9"];

  const cards = [
    { id: 1, name: "A♥", suit: "♥", color: "#8B0000", code: ["4", "1", "8", "5"] },
    { id: 2, name: "Q♥", suit: "♥", color: "#8B0000", code: ["9", "2", "7", "3"] },
    { id: 3, name: "4♥", suit: "♥", color: "#8B0000", code: ["5", "8", "1", "6"] },
    { id: 4, name: "J♠", suit: "♠", color: "#1a1a1a", code: ["2", "9", "4", "7"] },
    { id: 5, name: "8♠", suit: "♠", color: "#1a1a1a", code: ["6", "3", "5", "1"] },
    { id: 6, name: "4♠", suit: "♠", color: "#1a1a1a", code: ["8", "7", "2", "4"] },
    { id: 7, name: "2♠", suit: "♠", color: "#1a1a1a", code: ["3", "5", "9", "8"] },
    { id: 8, name: "7♠", suit: "♠", color: "#1a1a1a", code: ["1", "4", "6", "2"] },
    { id: 9, name: "3♠", suit: "♠", color: "#1a1a1a", code: ["5", "8", "3", "9"] },
    { id: 10, name: "K♣", suit: "♣", color: "#1a1a1a", code: ["9", "1", "7", "4"] },
    { id: 11, name: "Q♣", suit: "♣", color: "#1a1a1a", code: ["2", "6", "8", "5"] },
    { id: 12, name: "5♣", suit: "♣", color: "#1a1a1a", code: ["4", "9", "3", "1"] },
    { id: 13, name: "4♣", suit: "♣", color: "#1a1a1a", code: ["7", "2", "5", "8"] },
    { id: 14, name: "6♣", suit: "♣", color: "#1a1a1a", code: ["3", "8", "1", "6"] },
    { id: 15, name: "A♦", suit: "♦", color: "#8B0000", code: ["8", "5", "4", "2"] },
    { id: 16, name: "5♦", suit: "♦", color: "#8B0000", code: ["7", "3", "2", "9"] }
  ];

  const noteContent = `GHI CHÚ CỦA NGƯỜI ĐI TRƯỚC

Tôi tìm được bằng chứng cho thấy chủ nhân căn phòng này đã ép hai người, gọi là A và B, tham gia một trò suy luận kỳ quái để mở cửa bí mật.

Trên bàn có 16 lá bài kỳ lạ.
Mỗi lá đều có:
- 1 ký tự (số hoặc chữ)
- 1 dãy 4 số MẬT KHẨU dán bên dưới
- 1 chất bài (♣ ♥ ♠ ♦)

Luật: A chỉ xem KÝ TỰ. B chỉ xem CHẤT.
Không ai xem mật khẩu ẩn.

Đoạn hội thoại:

A: "Tôi không biết là lá bài nào."
B: "Tôi biết chắc là cậu không thể biết. Nhưng tôi cũng không biết."
A: "Nếu vậy... thì giờ tôi biết rồi."
B: "Vậy thì tôi cũng biết rồi."

MẬT KHẨU = 4 SỐ DƯỚI LÁ BÀI ĐÓ.

HÃY TÌM THẤY NÓ TRƯỚC KHI MỌI CHUYỆN TỆ HƠN!`;

  // ========== IMPORT CÁC HÌNH ẢNH TẠI ĐÂY ==========
  // import Bg from "../Img/room.png"
  // import Labai from "../Img/labai-Photoroom.png"
  // import note from "../Img/note-Photoroom.png"
  // import lock from "../Img/locks.png"
  // import deckBg from "../Img/deck-background.png"  // ← Nền khi mở khay bài
  // import notePanelBg from "../Img/note-panel-bg.png" // ← Nền của panel note
  // import noteInventoryBg from "../Img/note-icon-bg.png" // ← Icon note góc phải
  // import lockModalBg from "../Img/lock-modal-bg.png" // ← Nền modal khóa
  
  const backgroundImage = Bg; // Bg - Hình nền phòng chính
  const doorImage = lock; // lock - Hình cửa/khóa
  const deckImage = Labai; // Labai - Hình khay bài
  const noteImage = note; // note - Hình giấy note trên sàn
  
  const deckOpenBackground = deckBg; // ← Nền khi zoom khay bài (màn hình đen mở bài)
  const notePanelBackground = notePanelBg; // ← Nền của panel note (khi mở note lớn)
  const noteInventoryIcon = note; // ← Icon note góc phải dưới
  const lockModalBackground = ""; // ← Nền modal nhập mật khẩu

  useEffect(() => {
    loadFonts();
    
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    // CHỈ khởi tạo vị trí vòng tròn khi MỞ LẦN ĐẦU
    if (deckOpen && isFirstOpen) {
      const positions = {};
      cards.forEach((card, i) => {
        const angle = (i / cards.length) * Math.PI * 2;
        const radius = Math.min(window.innerWidth, window.innerHeight) * 0.3;
        positions[card.id] = {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          rotation: (Math.random() - 0.5) * 30
        };
      });
      setCardPositions(positions);
      setIsFirstOpen(false); // Đánh dấu đã mở lần đầu
    }
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [deckOpen]); // Chỉ phụ thuộc vào deckOpen

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.25;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  const handleCardDrag = (e, cardId) => {
    if (e.type === "mousedown" || e.type === "touchstart") {
      e.stopPropagation();
      setDragging(cardId);
    }
  };

  const handleMouseMove = (e) => {
    const clientX = e.clientX || (e.touches?.[0]?.clientX);
    const clientY = e.clientY || (e.touches?.[0]?.clientY);

    if (dragging && deckOpen) {
      setCardPositions(prev => ({
        ...prev,
        [dragging]: {
          ...prev[dragging],
          x: clientX - window.innerWidth / 2,
          y: clientY - window.innerHeight / 2
        }
      }));
    }

    if (noteDragging && noteOpen) {
      setNotePos({
        x: clientX - window.innerWidth / 2,
        y: clientY - window.innerHeight / 2
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
    setNoteDragging(false);
  };

  useEffect(() => {
    if (dragging || noteDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleMouseMove);
      window.addEventListener("touchend", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("touchmove", handleMouseMove);
        window.removeEventListener("touchend", handleMouseUp);
      };
    }
  }, [dragging, noteDragging]);

  const toggleEliminate = (cardId) => {
    setEliminatedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) newSet.delete(cardId);
      else newSet.add(cardId);
      return newSet;
    });
  };

  const adjustCode = (index, direction) => {
    const newCode = [...code];
    let num = parseInt(newCode[index]);
    num = direction === "up" ? (num + 1) % 10 : (num - 1 + 10) % 10;
    newCode[index] = num.toString();
    setCode(newCode);
  };

  const checkCode = () => {
    if (code.join("") === correctCode.join("")) {
      audioRef.current?.pause();
      onComplete();
    } else {
      setLockOpen(false);
      setCode(["0", "0", "0", "0"]);
    }
  };

  return (
    <div style={styles.container} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      <audio ref={audioRef} loop>
        <source src="https://assets.mixkit.co/sfx/preview/mixkit-creepy-ambience-1099.mp3" type="audio/mpeg" />
      </audio>

      <div style={styles.roomContainer}>
        {/* HÌNH NỀN PHÒNG CHÍNH */}
        <div style={{
          ...styles.background,
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 30%, #1f1f1f 60%, #151515 100%)',
        }}></div>

        {!deckOpen && (
          <>
            {/* CÁNH CỬA */}
            <div
              style={{
                ...styles.doorWrapper,
                backgroundImage: doorImage ? `url(${doorImage})` : 'none',
                backgroundColor: doorImage ? 'transparent' : '#2a2520',
                filter: hoveredObject === "door" ? "brightness(1.15) drop-shadow(0 0 80px rgba(139,0,0,0.8))" : "none",
                transform: hoveredObject === "door" ? "translateX(-50%) scale(1.05)" : "translateX(-50%) scale(1)",
                transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
              }}
              onMouseEnter={() => setHoveredObject("door")}
              onMouseLeave={() => setHoveredObject(null)}
              onClick={() => setLockOpen(true)}
            >
              {!doorImage && <div style={{color: '#666', fontSize: '16px'}}>Cửa (Import hình)</div>}
            </div>

            {/* KHAY BÀI */}
            <div
              style={{
                ...styles.deckWrapper,
                backgroundImage: deckImage ? `url(${deckImage})` : 'none',
                backgroundColor: deckImage ? 'transparent' : '#0a0a0a',
                filter: hoveredObject === "deck" ? "brightness(1.3) drop-shadow(0 0 100px rgba(139,0,0,0.9))" : "none",
                transform: hoveredObject === "deck" ? "rotate(20deg) scale(1.15)" : "rotate(20deg) scale(1)",
                transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
              }}
              onMouseEnter={() => setHoveredObject("deck")}
              onMouseLeave={() => setHoveredObject(null)}
              onClick={() => setDeckOpen(true)}
            >
              {!deckImage && <div style={{color: '#666', fontSize: '16px'}}>🂠<br/>Khay bài</div>}
            </div>

            {/* GIẤY NOTE TRÊN SÀN */}
            {!notePickedUp && (
              <div
                style={{
                  ...styles.noteOnFloor,
                  backgroundImage: noteImage ? `url(${noteImage})` : 'none',
                  backgroundColor: noteImage ? 'transparent' : 'rgba(255,255,200,0.3)',
                  filter: hoveredObject === "note" ? "brightness(1.4) drop-shadow(0 0 70px rgba(139,0,0,0.9))" : "none",
                  transform: hoveredObject === "note" ? "rotate(5deg) scale(1.15)" : "rotate(5deg) scale(1)",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                }}
                onMouseEnter={() => setHoveredObject("note")}
                onMouseLeave={() => setHoveredObject(null)}
                onClick={() => {setNotePickedUp(true); setNoteOpen(true);}}
              >
                {!noteImage && <div style={{color: '#666', fontSize: '16px'}}>📄<br/>Note</div>}
              </div>
            )}
          </>
        )}

        {/* ========== MÀN HÌNH MỞ KHAY BÀI ========== */}
        {deckOpen && (
          <div style={{
            ...styles.deckOpenView,
            backgroundImage: deckOpenBackground ? `url(${deckOpenBackground})` : 'none'
          }}>
            <div style={styles.deckOpenBg}></div>
            <div style={{position: "absolute", top: "20px", left: "20px", zIndex: 999}}>
              <button style={styles.closeDeckBtn} onClick={() => setDeckOpen(false)}>
                ← Đóng khay bài
              </button>
              <div style={{fontSize: "0.9rem", marginTop: "8px", color: "#999", fontFamily: "'Noto Sans', Arial, sans-serif"}}>
                Kéo thả các lá bài
              </div>
              <div style={{fontSize: "0.9rem", marginTop: "4px", color: "#999", fontFamily: "'Noto Sans', Arial, sans-serif"}}>
                Double-click = ẩn/hiện lá bài
              </div>
            </div>

            {cards.map(card => {
              const pos = cardPositions[card.id] || { x: 0, y: 0, rotation: 0 };
              const isElim = eliminatedCards.has(card.id);

              return (
                <div
                  key={card.id}
                  style={{
                    ...styles.card3D,
                    left: `calc(50% + ${pos.x}px)`,
                    top: `calc(50% + ${pos.y}px)`,
                    transform: `translate(-50%, -50%) rotate(${pos.rotation}deg) ${dragging === card.id ? "scale(1.15)" : ""}`,
                    opacity: isElim ? 0.2 : 1,
                    filter: isElim ? "grayscale(1)" : "drop-shadow(0 8px 25px rgba(0,0,0,0.8))",
                    cursor: dragging === card.id ? "grabbing" : "grab",
                    zIndex: dragging === card.id ? 1000 : 50,
                    transition: dragging ? "none" : "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                  }}
                  onMouseDown={(e) => handleCardDrag(e, card.id)}
                  onTouchStart={(e) => handleCardDrag(e, card.id)}
                  onDoubleClick={() => toggleEliminate(card.id)}
                  onMouseEnter={(e) => {
                    if (!dragging && !isElim) {
                      e.currentTarget.style.transform = `translate(-50%, -50%) rotate(${pos.rotation}deg) scale(1.08)`;
                      e.currentTarget.style.filter = "drop-shadow(0 12px 35px rgba(139,0,0,0.6))";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!dragging) {
                      e.currentTarget.style.transform = `translate(-50%, -50%) rotate(${pos.rotation}deg)`;
                      e.currentTarget.style.filter = isElim ? "grayscale(1)" : "drop-shadow(0 8px 25px rgba(0,0,0,0.8))";
                    }
                  }}
                >
                  <div style={styles.cardBevel}></div>
                  <div style={styles.cardCorner}>
                    <div style={{...styles.cardValue, color: card.color}}>
                      {card.name.replace(/[♥♠♣♦]/g, '')}
                    </div>
                    <div style={{...styles.cardSuitSmall, color: card.color}}>
                      {card.suit}
                    </div>
                  </div>
                  <div style={{...styles.cardSuitLarge, color: card.color}}>
                    {card.suit}
                  </div>
                  <div style={styles.cardCode}>{card.code.join(' ')}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* ========== NOTE PANEL ========== */}
        {notePickedUp && (
          <>
            {/* ICON NOTE GÓC PHẢI DƯỚI (khi đã nhặt nhưng đóng lại) */}
            {!noteOpen && (
              <div
                style={{
                  ...styles.noteInventory,
                  backgroundImage: noteInventoryIcon ? `url(${noteInventoryIcon})` : 'none'
                }}
                onClick={() => setNoteOpen(true)}
              >
                {!noteInventoryIcon && "📄"}
              </div>
            )}

            {/* PANEL NOTE LỚN (khi mở) */}
            {noteOpen && (
              <div
                style={{
                  ...styles.notePanel3D,
                  left: `calc(50% + ${notePos.x}px)`,
                  top: `calc(50% + ${notePos.y}px)`,
                  cursor: noteDragging ? "grabbing" : "grab",
                  backgroundImage: notePanelBackground ? `url(${notePanelBackground})` : 'none'
                }}
                onMouseDown={() => setNoteDragging(true)}
                onTouchStart={() => setNoteDragging(true)}
              >
                <button style={styles.closeNote} onClick={(e) => {e.stopPropagation(); setNoteOpen(false);}}>✕</button>
                <div style={styles.noteTitle}>GHI CHÚ ĐIỀU TRA</div>
                <pre style={styles.noteContent}>{noteContent}</pre>
              </div>
            )}
          </>
        )}

        {/* ========== MODAL NHẬP MẬT KHẨU ========== */}
        {lockOpen && (
          <div style={{
            ...styles.lockModal,
            backgroundImage: lockModalBackground ? `url(${lockModalBackground})` : 'none'
          }} onClick={() => setLockOpen(false)}>
            <div style={styles.lockPanel3D} onClick={e => e.stopPropagation()}>
              <div style={styles.lockPanelTitle}>NHẬP MẬT KHẨU</div>
              {/* <div style={styles.lockInstructions}>Nhập 4 chữ số theo thứ tự</div> */}
              <div style={styles.codeDisplay}>
                {code.map((digit, i) => (
                  <div key={i} style={styles.digitWrapper}>
                    <button style={styles.arrowBtn} onClick={() => adjustCode(i, "up")}>▲</button>
                    <div style={styles.digit3D}>{digit}</div>
                    <button style={styles.arrowBtn} onClick={() => adjustCode(i, "down")}>▼</button>
                  </div>
                ))}
              </div>
              <button style={styles.unlockBtn} onClick={checkCode}>MỞ KHÓA</button>
              <button style={styles.cancelBtn} onClick={() => {setLockOpen(false); setCode(["0","0","0","0"]);}}>HỦY BỎ</button>
            </div>
          </div>
        )}
      </div>
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
  background: {
    position: "absolute",
    inset: 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
    zIndex: 1
  },
  
  // CỬA - HOÀN TOÀN CỐ ĐỊNH
  doorWrapper: { 
    position: "fixed",      // ← fixed thay vì absolute
    top: "30vh",
    left: "58vw",
    transform: "translate(-50%, 0)",
    width: "14vw",
    height: "20vh",
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10
  },
  
  // KHAY BÀI - HOÀN TOÀN CỐ ĐỊNH
  deckWrapper: { 
    position: "fixed",      // ← fixed thay vì absolute
    top: "70vh",
    left: "26vw",
    transform: "rotate(20deg)",
    width: "25vw",
    height: "25vh",
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    zIndex: 20
  },
  
  // NOTE TRÊN SÀN - HOÀN TOÀN CỐ ĐỊNH
  noteOnFloor: { 
    position: "fixed",      // ← fixed thay vì absolute
    bottom: "5vh",
    left: "80vw",
    transform: "translate(-50%, 0) rotate(5deg)",
    width: "13vw",
    height: "12vh",
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 15
  },
  
  // ICON NOTE GÓC PHẢI DƯỚI
  noteInventory: {
    position: "fixed",      // ← fixed
    bottom: "3vh",
    right: "3vw",
    width: "5vw",
    height: "10vh",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2.5rem",
    zIndex: 200,
    backgroundSize: "cover",
    backgroundPosition: "center"
  },
  
  // NỀN MÀN HÌNH MỞ KHAY BÀI
  deckOpenView: { 
    position: "fixed", 
    inset: 0, 
    background: "radial-gradient(ellipse at center, #1a1a1a 0%, #0a0a0a 70%)", 
    backgroundSize: "cover",
    backgroundPosition: "center",
    zIndex: 200 
  },
  deckOpenBg: { 
    position: "absolute", 
    inset: 0, 
    background: "radial-gradient(circle at 50% 50%, rgba(30,30,30,0.8), #0a0a0a)" 
  },
  closeDeckBtn: { 
    background: "linear-gradient(135deg, rgba(20,20,20,0.9), rgba(10,10,10,0.95))", 
    border: "0.3vw solid rgba(139,0,0,0.6)", 
    color: "#999", 
    padding: "1.2vh 2vw", 
    fontSize: "1rem", 
    cursor: "pointer", 
    borderRadius: "1vw", 
    fontWeight: "bold", 
    boxShadow: "0 0.8vh 3vh rgba(0,0,0,0.9)", 
    transition: "all 0.3s ease",
    fontFamily: "'Noto Sans', Arial, sans-serif"
  },
  
  // CARD - GIỮ NGUYÊN PX VÌ ĐÃ Ở TRONG DECK OPEN VIEW
  card3D: { 
    position: "absolute", 
    width: "120px", 
    height: "170px", 
    background: "linear-gradient(135deg, #ffffff 0%, #f5f5f5 50%, #e8e8e8 100%)", 
    border: "3px solid #1a1a1a", 
    borderRadius: "14px", 
    boxShadow: "0 15px 50px rgba(0,0,0,0.95), inset 0 3px 15px rgba(255,255,255,0.7), inset 0 -3px 15px rgba(0,0,0,0.4)", 
    padding: "12px", 
    boxSizing: "border-box",
    fontFamily: "'Noto Sans', Arial, sans-serif"
  },
  cardBevel: { 
    position: "absolute", 
    inset: "8px", 
    border: "2px solid rgba(0,0,0,0.15)", 
    borderRadius: "10px", 
    pointerEvents: "none",
    background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)"
  },
  cardCorner: { 
    position: "absolute", 
    top: "12px", 
    left: "12px", 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    gap: "3px" 
  },
  cardValue: { 
    fontSize: "1.8rem", 
    fontWeight: "bold", 
    lineHeight: "1", 
    textShadow: "0 2px 6px rgba(0,0,0,0.4)" 
  },
  cardSuitSmall: { 
    fontSize: "1.3rem", 
    lineHeight: "1" 
  },
  cardSuitLarge: { 
    position: "absolute", 
    top: "50%", 
    left: "50%", 
    transform: "translate(-50%, -50%)", 
    fontSize: "4.5rem", 
    opacity: 0.12, 
    fontWeight: "bold" 
  },
  cardCode: { 
    position: "absolute", 
    bottom: "12px", 
    left: "50%", 
    transform: "translateX(-50%)", 
    fontSize: "0.85rem", 
    color: "#444", 
    fontWeight: "bold", 
    letterSpacing: "4px", 
    borderTop: "2px solid #ccc", 
    paddingTop: "8px", 
    width: "calc(100% - 24px)", 
    textAlign: "center",
    fontFamily: "monospace"
  },
  
  // PANEL NOTE LỚN
  notePanel3D: { 
    position: "fixed", 
    width: "40vw",      // ← Giảm từ 50vw xuống 40vw (hẹp hơn)
    maxWidth: "700px",  // ← Thêm giới hạn tối đa
    minWidth: "350px",  // ← Thêm giới hạn tối thiểu
    maxHeight: "85vh", 
    background: "linear-gradient(135deg, #2a2520 0%, #1a1510 35%, #0f0a08 70%, #050302 100%)", 
    padding: "4vh 3vw", 
    boxShadow: "0 3vh 10vh rgba(0,0,0,0.98)", 
    transform: "translate(-50%, -50%)", 
    overflowY: "auto", 
    zIndex: 300,
    backgroundSize: "cover",
    backgroundPosition: "center"
  },
  closeNote: { 
    position: "absolute", 
    top: "1.5vh", 
    right: "1.5vw", 
    width: "3vw", 
    height: "3vw", 
    minWidth: "35px",
    minHeight: "35px",
    background: "linear-gradient(135deg, rgba(139,0,0,0.8), rgba(80,0,0,0.9))", 
    border: "0.2vw solid #000", 
    borderRadius: "50%", 
    color: "#fff", 
    fontSize: "1.4rem", 
    cursor: "pointer", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    boxShadow: "0 0.6vh 2vh rgba(0,0,0,0.8)", 
    transition: "all 0.3s ease",
    fontFamily: "'Noto Sans', Arial, sans-serif"
  },
  noteTitle: { 
    fontSize: "2.2rem", 
    fontWeight: "bold", 
    color: "#8B0000", 
    marginBottom: "2.5vh", 
    textAlign: "center", 
    borderBottom: "0.3vh solid rgba(139,0,0,0.6)", 
    paddingBottom: "1.5vh", 
    letterSpacing: "1px",
    textShadow: "0 0 2vh rgba(139,0,0,0.8)",
    fontFamily: "'Noto Serif', Georgia, serif"
  },
  noteContent: { 
    fontSize: "1.3rem", 
    color: "#000000ff", 
    lineHeight: "2", 
    whiteSpace: "pre-wrap", 
    fontFamily: "'Noto Serif', Georgia, serif" 
  },
  
  // MODAL NHẬP MẬT KHẨU
  lockModal: {
    position: "fixed",
    inset: 0,
    background: "rgba(15,25,30,0.92)",  // ← Màu xanh xám tối thay vì đen
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 400,
    backdropFilter: "blur(12px)",
    backgroundSize: "cover",
    backgroundPosition: "center"
  },
  lockPanel3D: {
    width: "35vw",
    maxWidth: "550px",
    minWidth: "380px",
    background: "linear-gradient(135deg, #1a2832 0%, #0f1a21 50%, #0a1419 100%)",  // ← Gradient xanh xám cũ kỹ
    border: "4px solid rgba(60,80,90,0.6)",  // ← Viền xanh xám thay vì đỏ
    borderRadius: "15px",
    padding: "40px 30px",
    textAlign: "center",
    color: "#b0b8c0",  // ← Chữ xám nhạt
    boxShadow: "0 45px 120px rgba(0,0,0,0.99), inset 0 3px 35px rgba(40,60,70,0.3)",  // ← Shadow xanh nhạt
    fontFamily: "'Noto Serif', Georgia, serif"
  },
  lockPanelTitle: {
    fontSize: "2.2rem",
    marginBottom: "25px",
    textShadow: "0 0 30px rgba(80,110,130,0.8)",  // ← Glow xanh xám
    fontWeight: "bold",
    letterSpacing: "3px",
    color: "#a0b0c0"  // ← Xám xanh nhạt thay vì đỏ
  },
  lockInstructions: {
    fontSize: "1rem",
    color: "#8090a0",  // ← Xám trung bình
    marginBottom: "35px",
    fontStyle: "italic"
  },
  codeDisplay: {
    display: "flex",
    justifyContent: "center",
    gap: "25px",
    marginBottom: "40px"
  },
  digitWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px"
  },
  arrowBtn: {
    width: "60px",
    height: "50px",
    background: "linear-gradient(135deg, rgba(40,50,60,0.9), rgba(25,35,45,0.95))",  // ← Xanh xám tối
    border: "3px solid rgba(70,90,100,0.5)",  // ← Viền xanh xám
    color: "#b0b8c0",  // ← Chữ xám nhạt
    fontSize: "1.4rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    boxShadow: "0 6px 20px rgba(0,0,0,0.8)",
    fontFamily: "'Noto Sans', Arial, sans-serif"
  },
  digit3D: {
    width: "85px",
    height: "100px",
    background: "linear-gradient(135deg, #0f1a21 0%, #0a1419 40%, #060d12 70%, #000 100%)",  // ← Gradient xanh đen
    border: "4px solid rgba(60,80,95,0.6)",  // ← Viền xanh xám
    borderRadius: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "3.8rem",
    color: "#90a5b5",  // ← Số màu xám xanh nhạt thay vì đỏ
    fontWeight: "bold",
    boxShadow: "inset 0 8px 35px rgba(0,0,0,0.99), 0 10px 40px rgba(50,70,80,0.4)",  // ← Shadow xanh
    textShadow: "0 0 40px rgba(100,130,150,0.7), 0 0 70px rgba(80,110,130,0.4)",  // ← Glow xanh xám
    fontFamily: "'Noto Sans', Arial, sans-serif"
  },
  unlockBtn: {
    width: "100%",
    background: "linear-gradient(135deg, rgba(50,70,85,0.8) 0%, rgba(40,60,75,0.9) 35%, rgba(30,50,65,0.95) 70%, rgba(20,40,55,1) 100%)",  // ← Gradient xanh xám
    border: "4px solid rgba(60,85,100,0.8)",  // ← Viền xanh
    color: "#d0d8e0",  // ← Chữ xám rất nhạt
    padding: "20px 0",
    fontSize: "1.5rem",
    borderRadius: "15px",
    cursor: "pointer",
    fontWeight: "bold",
    letterSpacing: "3px",
    marginBottom: "20px",
    boxShadow: "0 15px 50px rgba(40,60,75,0.6), inset 0 3px 15px rgba(100,120,140,0.2)",  // ← Shadow xanh
    transition: "all 0.3s ease",
    textShadow: "0 2px 8px rgba(0,0,0,0.9)",
    fontFamily: "'Noto Sans', Arial, sans-serif"
  },
  cancelBtn: {
    width: "100%",
    background: "transparent",
    border: "3px solid rgba(80,95,110,0.5)",  // ← Viền xám xanh
    color: "#8090a0",  // ← Chữ xám trung bình
    padding: "15px 0",
    fontSize: "1.05rem",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    fontFamily: "'Noto Sans', Arial, sans-serif"
  }
};

// CSS Animations
const animationStyles = document.createElement("style");
animationStyles.textContent = `
  button:hover {
    transform: scale(1.05);
  }
`;
document.head.appendChild(animationStyles);