import React, { useState, useEffect, useRef } from "react";

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

  useEffect(() => {
    loadFonts();
    
    // Prevent scrollbars
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    if (deckOpen) {
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
    }
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [deckOpen]);

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
        <div style={styles.roomBg}></div>
        <div style={styles.fog}></div>
        <div style={styles.vignette}></div>
        <div style={styles.crackOverlay}></div>
        
        <div style={{...styles.bloodStain, top: "15%", left: "20%", width: "clamp(60px, 8vw, 80px)", height: "clamp(60px, 8vw, 80px)"}}></div>
        <div style={{...styles.bloodStain, top: "60%", right: "15%", width: "clamp(90px, 12vw, 120px)", height: "clamp(45px, 6vw, 60px)", opacity: 0.3}}></div>

        {!deckOpen && (
          <>
            <div style={{...styles.chains, top: "8%", left: "12%", animationDelay: "0s"}}>⛓️</div>
            <div style={{...styles.chains, top: "12%", right: "10%", animationDelay: "1s"}}>⛓️</div>

            <div style={styles.ceilingLamp}>
              <div style={styles.lampCord}></div>
              <div style={styles.lampShade}>
                <div style={styles.lampTop}></div>
                <div style={styles.lampBottom}></div>
                <div style={styles.lampGlow}></div>
              </div>
            </div>

            <div style={styles.mirror3D}>
              <div style={styles.mirrorFrame}></div>
              <div style={styles.mirrorGlass}>
                <div style={styles.mirrorReflection}></div>
                <div style={styles.mirrorCrack}></div>
              </div>
            </div>

            <div style={styles.bookshelf3D}>
              <div style={styles.shelfBack}></div>
              <div style={styles.shelfSide}></div>
              <div style={styles.shelf1}></div>
              <div style={styles.shelf2}></div>
              <div style={styles.shelf3}></div>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{...styles.book, left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%`}}></div>
              ))}
              <div style={styles.cobweb}>🕸️</div>
            </div>

            <div style={styles.vase3D}>
              <div style={styles.vaseBody}></div>
              <div style={styles.vaseNeck}></div>
              <div style={styles.vaseShadow}></div>
            </div>

            <div style={styles.wallCrack}></div>
            <div style={{...styles.wallCrack, top: "35%", left: "60%", transform: "rotate(-45deg)"}}></div>

            <div
              style={{
                ...styles.doorWrapper,
                filter: hoveredObject === "door" ? "brightness(1.15) drop-shadow(0 0 80px rgba(139,0,0,0.8))" : "none",
                transform: hoveredObject === "door" 
                  ? "translateX(-50%) perspective(2000px) rotateY(0deg) scale(1.02)" 
                  : "translateX(-50%) perspective(2000px) rotateY(0deg)",
                transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
              }}
              onMouseEnter={() => setHoveredObject("door")}
              onMouseLeave={() => setHoveredObject(null)}
              onClick={() => setLockOpen(true)}
            >
              <div style={styles.doorFrame}>
                <div style={styles.doorFrameTop}></div>
                <div style={styles.doorFrameLeft}></div>
                <div style={styles.doorFrameRight}></div>
              </div>
              <div style={styles.door3D}>
                <div style={styles.doorShadow}></div>
                <div style={styles.doorPanel3D}>
                  <div style={styles.doorPanelInner}>
                    <div style={styles.doorLine1}></div>
                    <div style={styles.doorLine2}></div>
                  </div>
                  <div style={styles.doorBloodDrip}>🩸</div>
                </div>
                <div style={styles.doorLock3D}>
                  <div style={styles.lockShackle3D}></div>
                  <div style={styles.lockBody3D}>
                    <div style={styles.lockKeyhole}></div>
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.tableWrapper3D}>
              <div style={styles.tableShadow3D}></div>
              <div style={styles.table3D}>
                <div style={styles.tableTopEdge}></div>
                <div style={styles.tableTop3D}>
                  <div style={styles.woodGrain1}></div>
                  <div style={styles.woodGrain2}></div>
                </div>
                <div style={styles.tableFront}></div>
              </div>
              <div style={styles.tableLeg} data-pos="fl"></div>
              <div style={styles.tableLeg} data-pos="fr"></div>
              <div style={styles.tableLeg} data-pos="bl"></div>
              <div style={styles.tableLeg} data-pos="br"></div>
            </div>

            <div
              style={{
                ...styles.cardDeck3D,
                filter: hoveredObject === "deck" ? "brightness(1.3) drop-shadow(0 0 100px rgba(139,0,0,0.9))" : "none",
                transform: hoveredObject === "deck"
                  ? "translate(-50%, -50%) perspective(1500px) rotateX(30deg) scale(1.15) rotateZ(8deg)"
                  : "translate(-50%, -50%) perspective(1500px) rotateX(30deg)",
                transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
              }}
              onMouseEnter={() => setHoveredObject("deck")}
              onMouseLeave={() => setHoveredObject(null)}
              onClick={() => setDeckOpen(true)}
            >
              <div style={styles.deckShadow3D}></div>
              <div style={styles.deckBody3D}>
                <div style={styles.deckTop3D}>🂠</div>
                <div style={styles.deckSide}></div>
              </div>
            </div>
          </>
        )}

        {deckOpen && (
          <div style={styles.deckOpenView}>
            <div style={styles.deckOpenBg}></div>
            <div style={{position: "absolute", top: "clamp(10px, 2vh, 20px)", left: "clamp(10px, 2vw, 20px)", zIndex: 999}}>
              <button style={styles.closeDeckBtn} onClick={() => setDeckOpen(false)}>
                ← Đóng khay bài
              </button>
              <div style={{fontSize: "clamp(0.7rem, 1.5vw, 0.9rem)", marginTop: "clamp(4px, 1vh, 8px)", color: "#666", opacity: 0.8, fontFamily: "'Noto Sans', Arial, sans-serif"}}>
                Kéo thả • Double-click = ẩn/hiện lá bài.
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
                    transform: `translate(-50%, -50%) rotate(${pos.rotation}deg) ${dragging === card.id ? "scale(1.1)" : ""}`,
                    opacity: isElim ? 0.2 : 1,
                    filter: isElim ? "grayscale(1)" : "none",
                    cursor: dragging === card.id ? "grabbing" : "grab",
                    zIndex: dragging === card.id ? 1000 : 50,
                    transition: dragging ? "none" : "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                  }}
                  onMouseDown={(e) => handleCardDrag(e, card.id)}
                  onTouchStart={(e) => handleCardDrag(e, card.id)}
                  onDoubleClick={() => toggleEliminate(card.id)}
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

        {!deckOpen && !notePickedUp && (
          <div
            style={{
              ...styles.noteOnFloor3D,
              filter: hoveredObject === "note" ? "brightness(1.4) drop-shadow(0 0 70px rgba(139,0,0,0.9))" : "none",
              transform: hoveredObject === "note" 
                ? "translateY(-20px) rotate(12deg) scale(1.15)" 
                : "translateY(0) rotate(0deg)",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
            }}
            onMouseEnter={() => setHoveredObject("note")}
            onMouseLeave={() => setHoveredObject(null)}
            onClick={() => {setNotePickedUp(true); setNoteOpen(true);}}
          >
            <div style={styles.notePaper3D}>📄</div>
            <div style={styles.noteGlow3D}></div>
          </div>
        )}

        {notePickedUp && (
          <>
            {!noteOpen && (
              <div
                style={{
                  position: "absolute",
                  bottom: "clamp(20px, 4vh, 30px)",
                  right: "clamp(20px, 4vw, 30px)",
                  width: "clamp(60px, 8vw, 80px)",
                  height: "clamp(75px, 10vh, 100px)",
                  background: "rgba(40,35,30,0.95)",
                  border: "4px solid rgba(139,0,0,0.6)",
                  borderRadius: "8px",
                  cursor: "pointer",
                  boxShadow: "0 10px 40px rgba(139,0,0,0.8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "clamp(2rem, 3vw, 2.5rem)",
                  zIndex: 200
                }}
                onClick={() => setNoteOpen(true)}
              >
                📄
              </div>
            )}

            {noteOpen && (
              <div
                style={{
                  ...styles.notePanel3D,
                  left: `calc(50% + ${notePos.x}px)`,
                  top: `calc(50% + ${notePos.y}px)`,
                  cursor: noteDragging ? "grabbing" : "grab"
                }}
                onMouseDown={() => setNoteDragging(true)}
                onTouchStart={() => setNoteDragging(true)}
              >
                <button style={styles.closeNote} onClick={(e) => {e.stopPropagation(); setNoteOpen(false);}}>✕</button>
                <div style={styles.noteTitle}>📋 GHI CHÚ ĐIỀU TRA</div>
                <pre style={styles.noteContent}>{noteContent}</pre>
              </div>
            )}
          </>
        )}

        {lockOpen && (
          <div style={styles.lockModal} onClick={() => setLockOpen(false)}>
            <div style={styles.lockPanel3D} onClick={e => e.stopPropagation()}>
              <div style={styles.lockPanelTitle}>🔐 NHẬP MẬT KHẨU</div>
              <div style={styles.lockInstructions}>Nhập 4 chữ số theo thứ tự</div>
              <div style={styles.codeDisplay}>
                {code.map((digit, i) => (
                  <div key={i} style={styles.digitWrapper}>
                    <button style={styles.arrowBtn} onClick={() => adjustCode(i, "up")}>▲</button>
                    <div style={styles.digit3D}>{digit}</div>
                    <button style={styles.arrowBtn} onClick={() => adjustCode(i, "down")}>▼</button>
                  </div>
                ))}
              </div>
              <button style={styles.unlockBtn} onClick={checkCode}>🔓 MỞ KHÓA</button>
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
  roomBg: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(180deg, #000000 0%, #0a0a0a 30%, #050505 60%, #000 100%)",
    zIndex: 1
  },
  fog: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(ellipse at 50% 80%, rgba(40,40,60,0.25) 0%, transparent 60%)",
    animation: "fogMove 15s ease-in-out infinite",
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
  crackOverlay: {
    position: "absolute",
    inset: 0,
    backgroundImage: `
      linear-gradient(${Math.random() * 360}deg, transparent 30%, rgba(0,0,0,0.3) 31%, transparent 32%),
      linear-gradient(${Math.random() * 360}deg, transparent 45%, rgba(0,0,0,0.2) 46%, transparent 47%)
    `,
    opacity: 0.5,
    pointerEvents: "none",
    zIndex: 4
  },
  bloodStain: {
    position: "absolute",
    background: "radial-gradient(ellipse, rgba(139,0,0,0.4) 0%, rgba(80,0,0,0.2) 40%, transparent 70%)",
    borderRadius: "50%",
    filter: "blur(8px)",
    pointerEvents: "none",
    zIndex: 5,
    animation: "pulse 8s ease-in-out infinite"
  },
  chains: {
    position: "absolute",
    fontSize: "clamp(1.2rem, 2vw, 1.5rem)",
    color: "#333",
    opacity: 0.3,
    textShadow: "0 2px 8px rgba(0,0,0,0.9)",
    animation: "swing 3s ease-in-out infinite",
    zIndex: 6
  },
  
  ceilingLamp: { 
    position: "absolute", 
    top: "3%", 
    right: "15%", 
    zIndex: 9,
    filter: "drop-shadow(0 0 30px rgba(139,0,0,0.3))",
    transform: "scale(clamp(0.7, 1vw, 1))"
  },
  lampCord: { 
    width: "2px", 
    height: "clamp(60px, 8vh, 80px)", 
    background: "linear-gradient(180deg, #222, #000)", 
    margin: "0 auto", 
    boxShadow: "0 0 8px rgba(0,0,0,0.9)" 
  },
  lampShade: { 
    position: "relative", 
    width: "clamp(80px, 10vw, 100px)", 
    height: "clamp(64px, 8vh, 80px)" 
  },
  lampTop: { 
    width: "clamp(32px, 4vw, 40px)", 
    height: "clamp(8px, 1vh, 10px)", 
    background: "linear-gradient(135deg, #2a2520, #1a1510)", 
    borderRadius: "50%", 
    margin: "0 auto", 
    boxShadow: "0 5px 20px rgba(0,0,0,0.8), inset 0 -3px 10px rgba(0,0,0,0.5)" 
  },
  lampBottom: { 
    width: "clamp(80px, 10vw, 100px)", 
    height: "clamp(56px, 7vh, 70px)", 
    background: "linear-gradient(135deg, #3a3025 0%, #2a2520 50%, #1a1510 100%)", 
    clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)", 
    boxShadow: "0 15px 50px rgba(0,0,0,0.9), inset 0 -15px 40px rgba(0,0,0,0.6)" 
  },
  lampGlow: { 
    position: "absolute", 
    bottom: "-40px", 
    left: "50%", 
    transform: "translateX(-50%)", 
    width: "clamp(144px, 18vw, 180px)", 
    height: "clamp(144px, 18vh, 180px)", 
    background: "radial-gradient(circle, rgba(139,0,0,0.2), transparent 70%)", 
    animation: "lightFlicker 4s ease-in-out infinite", 
    pointerEvents: "none" 
  },
  
  mirror3D: { 
    position: "absolute", 
    top: "12%", 
    left: "8%", 
    width: "clamp(112px, 14vw, 140px)", 
    height: "clamp(160px, 20vh, 200px)", 
    transform: "perspective(1200px) rotateY(-20deg) scale(clamp(0.8, 1vw, 1))", 
    zIndex: 8 
  },
  mirrorFrame: { 
    position: "absolute", 
    inset: "clamp(-12px, -1.5vw, -15px)", 
    background: "linear-gradient(135deg, #1a1510 0%, #0f0a08 50%, #050302 100%)", 
    borderRadius: "15px", 
    boxShadow: "0 20px 70px rgba(0,0,0,0.95), inset 0 5px 25px rgba(0,0,0,0.9)", 
    border: "3px solid #000" 
  },
  mirrorGlass: { 
    position: "absolute", 
    inset: 0, 
    background: "linear-gradient(135deg, rgba(20, 20, 30, 0.6) 0%, rgba(10, 10, 20, 0.5) 50%, rgba(5, 5, 15, 0.6) 100%)", 
    borderRadius: "8px", 
    boxShadow: "inset 0 0 60px rgba(0,0,0,0.8), inset 0 0 100px rgba(20,20,40,0.3)" 
  },
  mirrorReflection: { 
    position: "absolute", 
    inset: 0, 
    background: "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.05) 30%, transparent 60%)", 
    transform: "rotate(-45deg)", 
    animation: "shimmer 8s ease-in-out infinite" 
  },
  mirrorCrack: {
    position: "absolute",
    top: "20%",
    left: "30%",
    width: "60%",
    height: "2px",
    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
    transform: "rotate(-35deg)",
    opacity: 0.6
  },
  
  bookshelf3D: { 
    position: "absolute", 
    bottom: "8%", 
    right: "6%", 
    width: "clamp(176px, 22vw, 220px)", 
    height: "clamp(360px, 45vh, 450px)", 
    transform: "perspective(1500px) rotateY(18deg) scale(clamp(0.8, 1vw, 1))", 
    zIndex: 4 
  },
  shelfBack: { 
    position: "absolute", 
    inset: 0, 
    background: "linear-gradient(135deg, #1a1510 0%, #0f0a08 50%, #050302 100%)", 
    borderRadius: "12px", 
    boxShadow: "0 25px 80px rgba(0,0,0,0.98), inset 0 10px 50px rgba(0,0,0,0.95)" 
  },
  shelfSide: { 
    position: "absolute", 
    right: "clamp(-20px, -2.5vw, -25px)", 
    top: "0", 
    width: "clamp(20px, 2.5vw, 25px)", 
    height: "100%", 
    background: "linear-gradient(to right, #0f0a08, #000)", 
    borderRadius: "0 8px 8px 0", 
    boxShadow: "inset 5px 0 20px rgba(0,0,0,0.9)" 
  },
  shelf1: { 
    position: "absolute", 
    width: "calc(100% - clamp(24px, 3vw, 30px))", 
    height: "clamp(10px, 1.2vh, 12px)", 
    left: "clamp(12px, 1.5vw, 15px)", 
    top: "25%", 
    background: "linear-gradient(to bottom, #2a2520, #1a1510)", 
    borderRadius: "4px", 
    boxShadow: "0 8px 25px rgba(0,0,0,0.9), inset 0 -3px 10px rgba(0,0,0,0.8)" 
  },
  shelf2: { 
    position: "absolute", 
    width: "calc(100% - clamp(24px, 3vw, 30px))", 
    height: "clamp(10px, 1.2vh, 12px)", 
    left: "clamp(12px, 1.5vw, 15px)", 
    top: "50%", 
    background: "linear-gradient(to bottom, #2a2520, #1a1510)", 
    borderRadius: "4px", 
    boxShadow: "0 8px 25px rgba(0,0,0,0.9), inset 0 -3px 10px rgba(0,0,0,0.8)" 
  },
  shelf3: { 
    position: "absolute", 
    width: "calc(100% - clamp(24px, 3vw, 30px))", 
    height: "clamp(10px, 1.2vh, 12px)", 
    left: "clamp(12px, 1.5vw, 15px)", 
    top: "75%", 
    background: "linear-gradient(to bottom, #2a2520, #1a1510)", 
    borderRadius: "4px", 
    boxShadow: "0 8px 25px rgba(0,0,0,0.9), inset 0 -3px 10px rgba(0,0,0,0.8)" 
  },
  book: { 
    position: "absolute", 
    width: "clamp(20px, 2.5vw, 25px)", 
    height: "clamp(64px, 8vh, 80px)", 
    background: "linear-gradient(135deg, #2a1810, #1a1008, #0a0504)", 
    border: "1px solid #000", 
    borderRadius: "2px", 
    boxShadow: "0 4px 15px rgba(0,0,0,0.9), inset -2px 0 10px rgba(0,0,0,0.7)" 
  },
  cobweb: {
    position: "absolute",
    top: "-10px",
    right: "-10px",
    fontSize: "clamp(1.6rem, 2vw, 2rem)",
    opacity: 0.4,
    filter: "grayscale(1)",
    animation: "swing 4s ease-in-out infinite"
  },
  
  vase3D: { 
    position: "absolute", 
    bottom: "12%", 
    left: "10%", 
    width: "clamp(72px, 9vw, 90px)", 
    height: "clamp(128px, 16vh, 160px)",
    transform: "scale(clamp(0.8, 1vw, 1))",
    zIndex: 4 
  },
  vaseBody: { 
    position: "absolute", 
    bottom: "0", 
    left: "50%", 
    transform: "translateX(-50%)", 
    width: "clamp(72px, 9vw, 90px)", 
    height: "clamp(112px, 14vh, 140px)", 
    background: "linear-gradient(135deg, #1a1a20 0%, #0f0f18 40%, #050508 100%)", 
    borderRadius: "45px 45px 20px 20px", 
    boxShadow: "0 20px 60px rgba(0,0,0,0.95), inset -15px 0 40px rgba(0,0,0,0.7), inset 15px 0 40px rgba(255,255,255,0.05)" 
  },
  vaseNeck: { 
    position: "absolute", 
    top: "0", 
    left: "50%", 
    transform: "translateX(-50%)", 
    width: "clamp(32px, 4vw, 40px)", 
    height: "clamp(28px, 3.5vh, 35px)", 
    background: "linear-gradient(to bottom, #0f0f18, #050508)", 
    borderRadius: "20px 20px 0 0", 
    boxShadow: "0 -5px 20px rgba(0,0,0,0.8), inset 0 -10px 25px rgba(0,0,0,0.6)" 
  },
  vaseShadow: { 
    position: "absolute", 
    bottom: "clamp(-12px, -1.5vh, -15px)", 
    left: "50%", 
    transform: "translateX(-50%)", 
    width: "clamp(88px, 11vw, 110px)", 
    height: "clamp(24px, 3vh, 30px)", 
    background: "radial-gradient(ellipse, rgba(0,0,0,0.9), transparent)", 
    filter: "blur(12px)" 
  },
  
  wallCrack: { 
    position: "absolute", 
    top: "18%", 
    left: "22%", 
    width: "clamp(224px, 28vw, 280px)", 
    height: "clamp(3px, 0.4vh, 4px)", 
    background: "linear-gradient(90deg, transparent, #000 20%, #0a0a0a 50%, #000 80%, transparent)", 
    transform: "rotate(28deg)", 
    boxShadow: "0 0 20px rgba(0,0,0,0.95), inset 0 1px 4px rgba(0,0,0,0.9)", 
    opacity: 0.8, 
    zIndex: 2 
  },
  
  doorWrapper: { 
    position: "absolute", 
    top: "6%", 
    left: "50%", 
    transform: "translateX(-50%) perspective(2000px) scale(clamp(0.7, 1vw, 1))", 
    zIndex: 10, 
    cursor: "pointer" 
  },
  doorFrame: { 
    position: "absolute", 
    width: "clamp(208px, 26vw, 260px)", 
    height: "clamp(320px, 40vh, 400px)", 
    top: "clamp(-20px, -2.5vh, -25px)", 
    left: "clamp(-24px, -3vw, -30px)", 
    zIndex: -1 
  },
  doorFrameTop: { 
    position: "absolute", 
    left: "0", 
    top: "0", 
    width: "100%", 
    height: "clamp(20px, 2.5vh, 25px)", 
    background: "linear-gradient(to bottom, #000 0%, #0a0a0a 60%, #1a1510 100%)", 
    borderRadius: "15px 15px 0 0", 
    boxShadow: "0 8px 30px rgba(0,0,0,0.95), inset 0 -5px 20px rgba(0,0,0,0.9)" 
  },
  doorFrameLeft: { 
    position: "absolute", 
    left: "0", 
    top: "0", 
    width: "clamp(20px, 2.5vw, 25px)", 
    height: "100%", 
    background: "linear-gradient(to right, #000 0%, #0a0a0a 60%, #1a1510 100%)", 
    borderRadius: "15px 0 0 8px", 
    boxShadow: "inset -5px 0 20px rgba(0,0,0,0.9), 5px 0 25px rgba(0,0,0,0.8)" 
  },
  doorFrameRight: { 
    position: "absolute", 
    right: "0", 
    top: "0", 
    width: "clamp(20px, 2.5vw, 25px)", 
    height: "100%", 
    background: "linear-gradient(to left, #000 0%, #0a0a0a 60%, #1a1510 100%)", 
    borderRadius: "0 15px 8px 0", 
    boxShadow: "inset 5px 0 20px rgba(0,0,0,0.9), -5px 0 25px rgba(0,0,0,0.8)" 
  },
  door3D: { 
    position: "relative", 
    width: "clamp(176px, 22vw, 220px)", 
    height: "clamp(296px, 37vh, 370px)" 
  },
  doorShadow: { 
    position: "absolute", 
    inset: 0, 
    background: "linear-gradient(135deg, transparent 0%, rgba(0,0,0,0.8) 100%)", 
    borderRadius: "18px 18px 6px 6px", 
    transform: "translateZ(-5px)" 
  },
  doorPanel3D: { 
    position: "relative", 
    width: "100%", 
    height: "100%", 
    background: "linear-gradient(135deg, #2a2520 0%, #1a1510 15%, #0f0a08 35%, #050302 50%, #0f0a08 65%, #1a1510 85%, #2a2520 100%)", 
    border: "clamp(10px, 1.2vw, 12px) solid #1a1510", 
    borderRadius: "18px 18px 6px 6px", 
    boxShadow: "0 30px 90px rgba(0,0,0,0.98), inset 0 6px 40px rgba(0,0,0,0.95), inset 0 -4px 25px rgba(60,50,40,0.08)", 
    transform: "rotateX(4deg)" 
  },
  doorPanelInner: { 
    position: "absolute", 
    width: "calc(100% - clamp(44px, 5.5vw, 55px))", 
    height: "calc(100% - clamp(44px, 5.5vh, 55px))", 
    top: "clamp(22px, 2.7vh, 27px)", 
    left: "clamp(22px, 2.7vw, 27px)", 
    border: "clamp(4px, 0.5vw, 5px) solid #0f0a08", 
    borderRadius: "12px", 
    opacity: 0.5, 
    boxShadow: "inset 0 3px 20px rgba(0,0,0,0.9)" 
  },
  doorLine1: { 
    position: "absolute", 
    width: "calc(100% - clamp(28px, 3.5vw, 35px))", 
    height: "3px", 
    top: "38%", 
    left: "clamp(14px, 1.7vw, 17px)", 
    background: "linear-gradient(90deg, transparent, #0f0a08 20%, #0f0a08 80%, transparent)", 
    opacity: 0.7 
  },
  doorLine2: { 
    position: "absolute", 
    width: "3px", 
    height: "calc(100% - clamp(28px, 3.5vh, 35px))", 
    left: "50%", 
    top: "clamp(14px, 1.7vh, 17px)", 
    background: "linear-gradient(180deg, transparent, #0f0a08 20%, #0f0a08 80%, transparent)", 
    opacity: 0.7 
  },
  doorBloodDrip: {
    position: "absolute",
    bottom: "15%",
    right: "20%",
    fontSize: "clamp(1.2rem, 1.5vw, 1.5rem)",
    opacity: 0.6,
    animation: "drip 3s ease-in-out infinite"
  },
  doorLock3D: { 
    position: "absolute", 
    top: "50%", 
    left: "78%", 
    transform: "translate(-50%, -50%) scale(clamp(0.8, 1vw, 1))", 
    transition: "all 0.4s ease", 
    zIndex: 25 
  },
  lockShackle3D: { 
    position: "absolute", 
    width: "clamp(27px, 3.4vw, 34px)", 
    height: "clamp(30px, 3.8vh, 38px)", 
    top: "clamp(-26px, -3.2vh, -32px)", 
    left: "50%", 
    transform: "translateX(-50%)", 
    border: "clamp(6px, 0.8vw, 8px) solid #3a3530", 
    borderBottom: "none", 
    borderRadius: "17px 17px 0 0", 
    background: "linear-gradient(to right, #2a2520 0%, #3a3530 50%, #2a2520 100%)", 
    boxShadow: "inset 0 4px 15px rgba(0,0,0,0.9), inset 0 -3px 10px rgba(255,255,255,0.05), 0 5px 20px rgba(0,0,0,0.9)" 
  },
  lockBody3D: { 
    position: "relative", 
    width: "clamp(42px, 5.2vw, 52px)", 
    height: "clamp(51px, 6.4vh, 64px)", 
    background: "linear-gradient(135deg, #3a3530 0%, #2a2520 15%, #1a1510 35%, #0f0a08 65%, #050302 100%)", 
    borderRadius: "12px", 
    border: "4px solid #000", 
    boxShadow: "0 12px 40px rgba(0,0,0,0.98), inset 0 5px 20px rgba(0,0,0,0.9), inset 0 -3px 15px rgba(255,255,255,0.05)", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center" 
  },
  lockKeyhole: { 
    width: "clamp(10px, 1.2vw, 12px)", 
    height: "clamp(22px, 2.8vh, 28px)", 
    background: "#000", 
    borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", 
    boxShadow: "inset 0 4px 12px rgba(0,0,0,1), 0 2px 8px rgba(139,0,0,0.3)" 
  },
  
  tableWrapper3D: { 
    position: "absolute", 
    bottom: "3%", 
    left: "50%", 
    transform: "translateX(-50%) perspective(2000px) rotateX(32deg) scale(clamp(0.6, 1vw, 1))", 
    zIndex: 5 
  },
  tableShadow3D: { 
    position: "absolute", 
    width: "clamp(800px, 100vw, 1000px)", 
    height: "clamp(560px, 70vh, 700px)", 
    top: "clamp(32px, 4vh, 40px)", 
    left: "50%", 
    transform: "translateX(-50%)", 
    background: "radial-gradient(ellipse, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, transparent 75%)", 
    filter: "blur(30px)", 
    zIndex: -1 
  },
  table3D: { 
    position: "relative", 
    width: "clamp(760px, 95vw, 950px)", 
    height: "clamp(520px, 65vh, 650px)" 
  },
  tableTopEdge: { 
    position: "absolute", 
    width: "100%", 
    height: "100%", 
    background: "linear-gradient(135deg, #2a2520 0%, #1a1510 15%, #0f0a08 35%, #050302 50%, #0f0a08 65%, #1a1510 85%, #2a2520 100%)", 
    border: "clamp(5px, 0.6vw, 6px) solid #000", 
    borderRadius: "clamp(28px, 3.5vw, 35px)", 
    boxShadow: "0 40px 100px rgba(0,0,0,0.99), inset 0 8px 35px rgba(0,0,0,0.95), inset 0 -4px 20px rgba(60,50,40,0.1)" 
  },
  tableTop3D: { 
    position: "absolute", 
    width: "calc(100% - clamp(40px, 5vw, 50px))", 
    height: "calc(100% - clamp(40px, 5vh, 50px))", 
    top: "clamp(20px, 2.5vh, 25px)", 
    left: "clamp(20px, 2.5vw, 25px)", 
    background: "linear-gradient(135deg, #1a1510 0%, #0f0a08 30%, #050302 50%, #0f0a08 70%, #1a1510 100%)", 
    borderRadius: "clamp(22px, 2.8vw, 28px)", 
    boxShadow: "inset 0 12px 50px rgba(0,0,0,0.99), inset 0 -6px 25px rgba(60,50,40,0.05)" 
  },
  woodGrain1: { 
    position: "absolute", 
    width: "100%", 
    height: "3px", 
    top: "28%", 
    background: "linear-gradient(90deg, transparent, rgba(40,30,20,0.3) 30%, rgba(40,30,20,0.25) 70%, transparent)", 
    opacity: 0.4 
  },
  woodGrain2: { 
    position: "absolute", 
    width: "100%", 
    height: "3px", 
    top: "72%", 
    background: "linear-gradient(90deg, transparent, rgba(40,30,20,0.3) 30%, rgba(40,30,20,0.25) 70%, transparent)", 
    opacity: 0.4 
  },
  tableFront: { 
    position: "absolute", 
    width: "100%", 
    height: "clamp(24px, 3vh, 30px)", 
    bottom: "clamp(-24px, -3vh, -30px)", 
    left: "0", 
    background: "linear-gradient(to bottom, #0f0a08 0%, #050302 50%, #000 100%)", 
    borderRadius: "0 0 30px 30px", 
    boxShadow: "inset 0 8px 25px rgba(0,0,0,0.9)" 
  },
  tableLeg: { 
    position: "absolute", 
    width: "clamp(68px, 8.5vw, 85px)", 
    height: "clamp(256px, 32vh, 320px)", 
    background: "linear-gradient(to bottom, #2a2520 0%, #1a1510 15%, #0f0a08 40%, #050302 70%, #000 100%)", 
    borderRadius: "14px", 
    boxShadow: "0 25px 70px rgba(0,0,0,0.98), inset 4px 0 18px rgba(0,0,0,0.8), inset -4px 0 18px rgba(60,50,40,0.08)", 
    transform: "perspective(1000px) rotateX(-22deg)" 
  },
  
  cardDeck3D: { 
    position: "absolute", 
    top: "50%", 
    left: "50%", 
    cursor: "pointer", 
    zIndex: 20 
  },
  deckShadow3D: { 
    position: "absolute", 
    width: "clamp(136px, 17vw, 170px)", 
    height: "clamp(184px, 23vh, 230px)", 
    background: "rgba(0,0,0,0.9)", 
    borderRadius: "18px", 
    filter: "blur(25px)", 
    top: "clamp(20px, 2.5vh, 25px)", 
    left: "50%", 
    transform: "translateX(-50%)" 
  },
  deckBody3D: { 
    position: "relative", 
    width: "clamp(136px, 17vw, 170px)", 
    height: "clamp(192px, 24vh, 240px)", 
    background: "linear-gradient(135deg, #0a0a0a 0%, #000 35%, #050505 70%, #000 100%)", 
    border: "clamp(5px, 0.6vw, 6px) solid rgba(139,0,0,0.4)", 
    borderRadius: "18px", 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    justifyContent: "center", 
    boxShadow: "0 18px 60px rgba(139,0,0,0.6), inset 0 4px 20px rgba(139,0,0,0.15), inset 0 -4px 15px rgba(0,0,0,0.8)", 
    animation: "float 3.5s ease-in-out infinite" 
  },
  deckTop3D: { 
    fontSize: "clamp(4.4rem, 5.5vw, 5.5rem)", 
    marginBottom: "clamp(12px, 1.5vh, 15px)", 
    filter: "drop-shadow(0 0 25px rgba(139,0,0,0.6))", 
    animation: "flickerGlow 3s ease-in-out infinite" 
  },
  deckSide: { 
    position: "absolute", 
    right: "clamp(-6px, -0.8vw, -8px)", 
    top: "clamp(6px, 0.8vh, 8px)", 
    width: "clamp(6px, 0.8vw, 8px)", 
    height: "calc(100% - clamp(13px, 1.6vh, 16px))", 
    background: "linear-gradient(to right, #000, #050505)", 
    borderRadius: "0 18px 18px 0", 
    boxShadow: "inset 3px 0 12px rgba(0,0,0,0.9)" 
  },
  
  deckOpenView: { 
    position: "fixed", 
    inset: 0, 
    background: "radial-gradient(ellipse at center, #0a0a0a 0%, #000 70%)", 
    zIndex: 200 
  },
  deckOpenBg: { 
    position: "absolute", 
    inset: 0, 
    background: "radial-gradient(circle at 50% 50%, rgba(10,10,10,0.8), #000)" 
  },
  closeDeckBtn: { 
    background: "linear-gradient(135deg, rgba(20,20,20,0.9), rgba(10,10,10,0.95))", 
    border: "4px solid rgba(139,0,0,0.6)", 
    color: "#666", 
    padding: "clamp(10px, 1.2vh, 12px) clamp(24px, 3vw, 30px)", 
    fontSize: "clamp(0.9rem, 1.5vw, 1.05rem)", 
    cursor: "pointer", 
    borderRadius: "10px", 
    fontWeight: "bold", 
    boxShadow: "0 8px 30px rgba(0,0,0,0.9)", 
    transition: "all 0.3s ease",
    fontFamily: "'Noto Sans', Arial, sans-serif"
  },
  card3D: { 
    position: "absolute", 
    width: "clamp(104px, 13vw, 130px)", 
    height: "clamp(148px, 18.5vh, 185px)", 
    background: "linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 50%, #d5d5d5 100%)", 
    border: "clamp(3px, 0.4vw, 4px) solid #1a1a1a", 
    borderRadius: "14px", 
    boxShadow: "0 12px 40px rgba(0,0,0,0.9), inset 0 2px 10px rgba(255,255,255,0.5), inset 0 -2px 10px rgba(0,0,0,0.3)", 
    padding: "clamp(10px, 1.2vw, 12px)", 
    boxSizing: "border-box",
    fontFamily: "'Noto Sans', Arial, sans-serif"
  },
  cardBevel: { 
    position: "absolute", 
    inset: "clamp(6px, 0.8vw, 8px)", 
    border: "2px solid rgba(0,0,0,0.1)", 
    borderRadius: "10px", 
    pointerEvents: "none" 
  },
  cardCorner: { 
    position: "absolute", 
    top: "clamp(10px, 1.2vh, 12px)", 
    left: "clamp(10px, 1.2vw, 12px)", 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    gap: "clamp(2px, 0.3vh, 3px)" 
  },
  cardValue: { 
    fontSize: "clamp(1.6rem, 2vw, 2rem)", 
    fontWeight: "bold", 
    lineHeight: "1", 
    textShadow: "0 1px 4px rgba(0,0,0,0.3)" 
  },
  cardSuitSmall: { 
    fontSize: "clamp(1.1rem, 1.4vw, 1.4rem)", 
    lineHeight: "1" 
  },
  cardSuitLarge: { 
    position: "absolute", 
    top: "50%", 
    left: "50%", 
    transform: "translate(-50%, -50%)", 
    fontSize: "clamp(4rem, 5vw, 5rem)", 
    opacity: 0.15, 
    fontWeight: "bold" 
  },
  cardCode: { 
    position: "absolute", 
    bottom: "clamp(10px, 1.2vh, 12px)", 
    left: "50%", 
    transform: "translateX(-50%)", 
    fontSize: "clamp(0.7rem, 0.9vw, 0.9rem)", 
    color: "#444", 
    fontWeight: "bold", 
    letterSpacing: "clamp(3px, 0.4vw, 4px)", 
    borderTop: "2px solid #ccc", 
    paddingTop: "clamp(6px, 0.8vh, 8px)", 
    width: "calc(100% - clamp(19px, 2.4vw, 24px))", 
    textAlign: "center",
    fontFamily: "monospace"
  },
  
  noteOnFloor3D: { 
    position: "absolute", 
    bottom: "16%", 
    left: "18%", 
    cursor: "pointer", 
    zIndex: 15, 
    animation: "float 3.5s ease-in-out infinite",
    transform: "scale(clamp(0.8, 1vw, 1))"
  },
  notePaper3D: { 
    fontSize: "clamp(3.2rem, 4vw, 4rem)", 
    filter: "drop-shadow(0 10px 35px rgba(139,0,0,0.8))", 
    textShadow: "0 0 25px rgba(139,0,0,0.6)" 
  },
  noteGlow3D: { 
    position: "absolute", 
    width: "clamp(64px, 8vw, 80px)", 
    height: "clamp(64px, 8vh, 80px)", 
    top: "50%", 
    left: "50%", 
    transform: "translate(-50%, -50%)", 
    background: "radial-gradient(circle, rgba(139,0,0,0.5) 0%, transparent 70%)", 
    animation: "flickerGlow 3s ease-in-out infinite", 
    pointerEvents: "none" 
  },
  notePanel3D: { 
    position: "fixed", 
    width: "clamp(450px, 60vw, 700px)", 
    maxHeight: "85vh", 
    background: "linear-gradient(135deg, #2a2520 0%, #1a1510 35%, #0f0a08 70%, #050302 100%)", 
    border: "clamp(5px, 0.6vw, 6px) solid rgba(139,0,0,0.6)", 
    borderRadius: "15px", 
    padding: "clamp(35px, 5vw, 50px)", 
    boxShadow: "0 30px 100px rgba(0,0,0,0.98), inset 0 2px 0 rgba(60,50,40,0.3), inset 0 -2px 15px rgba(0,0,0,0.5)", 
    transform: "translate(-50%, -50%)", 
    overflowY: "auto", 
    zIndex: 300 
  },
  closeNote: { 
    position: "absolute", 
    top: "clamp(12px, 1.5vh, 15px)", 
    right: "clamp(12px, 1.5vw, 15px)", 
    width: "clamp(30px, 3.8vw, 38px)", 
    height: "clamp(30px, 3.8vh, 38px)", 
    background: "linear-gradient(135deg, rgba(139,0,0,0.8), rgba(80,0,0,0.9))", 
    border: "3px solid #000", 
    borderRadius: "50%", 
    color: "#fff", 
    fontSize: "clamp(1.1rem, 1.4vw, 1.4rem)", 
    cursor: "pointer", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    boxShadow: "0 6px 20px rgba(0,0,0,0.8)", 
    transition: "all 0.3s ease", 
    zIndex: 10,
    fontFamily: "'Noto Sans', Arial, sans-serif"
  },
  noteTitle: { 
    fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)", 
    fontWeight: "bold", 
    color: "#8B0000", 
    marginBottom: "clamp(18px, 2.5vh, 25px)", 
    textAlign: "center", 
    borderBottom: "4px solid rgba(139,0,0,0.6)", 
    paddingBottom: "clamp(12px, 1.5vh, 15px)", 
    letterSpacing: "1px",
    textShadow: "0 0 20px rgba(139,0,0,0.8)",
    fontFamily: "'Noto Serif', Georgia, serif"
  },
  noteContent: { 
    fontSize: "clamp(1rem, 1.5vw, 1.3rem)", 
    color: "#999", 
    lineHeight: "clamp(1.7, 2vh, 2)", 
    whiteSpace: "pre-wrap", 
    fontFamily: "'Noto Serif', Georgia, serif" 
  },
  
  lockModal: { 
    position: "fixed", 
    inset: 0, 
    background: "rgba(0,0,0,0.96)", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    zIndex: 400, 
    backdropFilter: "blur(12px)" 
  },
  lockPanel3D: { 
    width: "clamp(400px, 60vw, 600px)", 
    background: "linear-gradient(135deg, #0a0a0a 0%, #000 50%, #0a0a0a 100%)", 
    border: "clamp(6px, 0.8vw, 8px) solid rgba(139,0,0,0.6)", 
    borderRadius: "clamp(22px, 2.8vw, 28px)", 
    padding: "clamp(35px, 5vw, 50px)", 
    textAlign: "center", 
    color: "#666", 
    boxShadow: "0 45px 120px rgba(0,0,0,0.99), inset 0 3px 35px rgba(139,0,0,0.2)",
    fontFamily: "'Noto Serif', Georgia, serif"
  },
  lockPanelTitle: { 
    fontSize: "clamp(1.8rem, 3vw, 2.5rem)", 
    marginBottom: "clamp(20px, 3vh, 30px)", 
    textShadow: "0 0 40px rgba(139,0,0,0.9)", 
    fontWeight: "bold", 
    letterSpacing: "clamp(2px, 0.3vw, 3px)",
    color: "#8B0000"
  },
  lockInstructions: { 
    fontSize: "clamp(0.9rem, 1.3vw, 1.1rem)", 
    color: "#555", 
    marginBottom: "clamp(30px, 4vh, 40px)", 
    fontStyle: "italic" 
  },
  codeDisplay: { 
    display: "flex", 
    justifyContent: "center", 
    gap: "clamp(20px, 3vw, 30px)", 
    marginBottom: "clamp(35px, 5vh, 50px)" 
  },
  digitWrapper: { 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    gap: "clamp(10px, 1.5vh, 15px)" 
  },
  arrowBtn: { 
    width: "clamp(52px, 6.5vw, 65px)", 
    height: "clamp(42px, 5.2vh, 52px)", 
    background: "linear-gradient(135deg, rgba(20,20,20,0.9), rgba(10,10,10,0.95))", 
    border: "4px solid rgba(139,0,0,0.5)", 
    color: "#666", 
    fontSize: "clamp(1.3rem, 1.8vw, 1.6rem)", 
    borderRadius: "12px", 
    cursor: "pointer", 
    fontWeight: "bold", 
    transition: "all 0.3s ease", 
    boxShadow: "0 6px 20px rgba(0,0,0,0.8), inset 0 2px 0 rgba(139,0,0,0.15)",
    fontFamily: "'Noto Sans', Arial, sans-serif"
  },
  digit3D: { 
    width: "clamp(76px, 9.5vw, 95px)", 
    height: "clamp(92px, 11.5vh, 115px)", 
    background: "linear-gradient(135deg, #0a0a0a 0%, #000 40%, #050505 70%, #000 100%)", 
    border: "clamp(5px, 0.6vw, 6px) solid rgba(139,0,0,0.6)", 
    borderRadius: "clamp(16px, 2vw, 20px)", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    fontSize: "clamp(3.2rem, 4.5vw, 4.2rem)", 
    color: "#8B0000", 
    fontWeight: "bold", 
    boxShadow: "inset 0 8px 35px rgba(0,0,0,0.99), 0 10px 40px rgba(139,0,0,0.4)", 
    textShadow: "0 0 40px rgba(139,0,0,0.95), 0 0 70px rgba(139,0,0,0.6)",
    fontFamily: "'Noto Sans', Arial, sans-serif"
  },
  unlockBtn: { 
    width: "100%", 
    background: "linear-gradient(135deg, rgba(139,0,0,0.8) 0%, rgba(100,0,0,0.9) 35%, rgba(80,0,0,0.95) 70%, rgba(60,0,0,1) 100%)", 
    border: "clamp(5px, 0.6vw, 6px) solid rgba(139,0,0,0.8)", 
    color: "#fff", 
    padding: "clamp(18px, 2.4vh, 24px)", 
    fontSize: "clamp(1.2rem, 1.8vw, 1.6rem)", 
    borderRadius: "clamp(14px, 1.8vw, 18px)", 
    cursor: "pointer", 
    fontWeight: "bold", 
    letterSpacing: "clamp(3px, 0.4vw, 4px)", 
    marginBottom: "clamp(16px, 2.2vh, 22px)", 
    boxShadow: "0 15px 50px rgba(139,0,0,0.8), inset 0 3px 15px rgba(255,255,255,0.2)", 
    transition: "all 0.3s ease",
    textShadow: "0 2px 8px rgba(0,0,0,0.9)",
    fontFamily: "'Noto Sans', Arial, sans-serif"
  },
  cancelBtn: { 
    width: "100%", 
    background: "transparent", 
    border: "4px solid rgba(80,80,80,0.5)", 
    color: "#555", 
    padding: "clamp(14px, 1.8vh, 18px)", 
    fontSize: "clamp(0.95rem, 1.3vw, 1.15rem)", 
    borderRadius: "clamp(12px, 1.5vw, 15px)", 
    cursor: "pointer", 
    fontWeight: "bold", 
    transition: "all 0.3s ease",
    fontFamily: "'Noto Sans', Arial, sans-serif"
  }
};

// CSS Animations
const animationStyles = document.createElement("style");
animationStyles.textContent = `
  @keyframes lightFlicker {
    0%, 100% { 
      opacity: 1; 
      filter: drop-shadow(0 0 25px rgba(139,0,0,0.6)); 
    }
    10% { opacity: 0.2; }
    12% { opacity: 1; }
    20% { opacity: 0.3; }
    22% { opacity: 1; }
    50% { 
      opacity: 0.8; 
      filter: drop-shadow(0 0 40px rgba(139,0,0,0.9)); 
    }
    60% { opacity: 0.4; }
    62% { opacity: 1; }
    70% { opacity: 0.5; }
    72% { opacity: 1; }
  }
  @keyframes flickerGlow {
    0%, 100% { opacity: 1; filter: drop-shadow(0 0 25px rgba(139,0,0,0.6)); }
    50% { opacity: 0.8; filter: drop-shadow(0 0 40px rgba(139,0,0,0.9)); }
  }
  @keyframes drip {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(10px); }
  }
  @keyframes fogMove {
    0%, 100% { transform: translateX(0) scale(1); }
    50% { transform: translateX(20px) scale(1.05); }
  }
  @keyframes shimmer {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.8; }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.8; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-18px) rotate(4deg); }
  }
  @keyframes swing {
    0%, 100% { transform: rotate(-2deg); }
    50% { transform: rotate(2deg); }
  }
  
  [data-pos="fl"] { left: clamp(128px, 16vw, 160px); top: 100%; }
  [data-pos="fr"] { right: clamp(128px, 16vw, 160px); top: 100%; }
  [data-pos="bl"] { left: clamp(144px, 18vw, 180px); top: 92%; opacity: 0.45; filter: blur(3px); }
  [data-pos="br"] { right: clamp(144px, 18vw, 180px); top: 92%; opacity: 0.45; filter: blur(3px); }
  
  button:hover {
    transform: scale(1.05);
  }
  
  .arrow-btn:hover {
    transform: scale(1.12);
    box-shadow: 0 10px 35px rgba(139,0,0,0.7);
    background: linear-gradient(135deg, rgba(30,0,0,0.9), rgba(20,0,0,0.95));
    border-color: rgba(139,0,0,0.8);
  }
  
  .unlock-btn:hover {
    transform: translateY(-7px);
    box-shadow: 0 22px 70px rgba(139,0,0,0.95);
    background: linear-gradient(135deg, rgba(180,0,0,0.9), rgba(139,0,0,0.95));
  }
  
  .cancel-btn:hover {
    background: rgba(40,40,40,0.3);
    transform: scale(1.03);
    border-color: rgba(100,100,100,0.6);
  }
  
  button[style*="closeNote"]:hover {
    transform: rotate(90deg) scale(1.1);
    background: linear-gradient(135deg, rgba(180,0,0,0.9), rgba(120,0,0,0.95));
  }
  
  button[style*="closeDeckBtn"]:hover {
    transform: translateX(-12px);
    box-shadow: 0 18px 50px rgba(139,0,0,0.7);
    background: linear-gradient(135deg, rgba(30,0,0,0.9), rgba(20,0,0,0.95));
    border-color: rgba(139,0,0,0.8);
  }
`;
document.head.appendChild(animationStyles);