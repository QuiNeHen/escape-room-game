import React, { useState, useEffect, useRef } from "react";

import RoomBg from "../Img/room3.1.png"
import DoorImage from "../Img/lock3.jpg"

const loadFonts = () => {
  if (!document.querySelector('#room3-fonts')) {
    const link = document.createElement('link');
    link.id = 'room3-fonts';
    link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&family=Noto+Serif:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
};

export default function Room3({ onComplete }) {
  const [stage, setStage] = useState("intro");
  const [lockOpen, setLockOpen] = useState(false);
  const [code, setCode] = useState(["0", "0", "0", "0"]);
  const [hovered, setHovered] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [bookPositions, setBookPositions] = useState({});
  const [booksOnTable, setBooksOnTable] = useState([]);
  const audioRef = useRef(null);

  const correctCode = ["6", "0", "1", "1"];

  const roomBackground = RoomBg;
  const doorImage = DoorImage;

  const books = [
    { id: 1, title: "Ancient Tales", spine: "PA", labelColor: "red", shelfPos: { row: 5, col: 3 } },
    { id: 2, title: "Mystery Novel", spine: "WOR", labelColor: "blue", shelfPos: { row: 3, col: 3 } },
    { id: 3, title: "Dark History", spine: "SSW", labelColor: "red", shelfPos: { row: 5, col: 2 } },
    { id: 4, title: "Poetry Vol. 3", spine: "DIS", labelColor: "blue", shelfPos: { row: 2, col: 4 } },
    { id: 5, title: "Science Facts", spine: "ORDI", labelColor: "red", shelfPos: { row: 3, col: 5 } },
    { id: 6, title: "Old Legends", spine: "NOT", labelColor: "blue", shelfPos: { row: 4, col: 4 } },
    { id: 7, title: "Philosophy", spine: "SSI", labelColor: "red", shelfPos: { row: 4, col: 5 } },
    { id: 8, title: "Art & Design", spine: "THE", labelColor: "blue", shelfPos: { row: 4, col: 6 } },
    { id: 9, title: "World Atlas", spine: "ABC", labelColor: "blue", shelfPos: { row: 4, col: 3 } },
    { id: 10, title: "Cookbook", spine: "XTYEL", labelColor: "red", shelfPos: { row: 2, col: 3 } },
    { id: 11, title: "Medical Guide", spine: "KEY", labelColor: "blue", shelfPos: { row: 3, col: 6 } },
    { id: 12, title: "Dictionary", spine: "DEF", labelColor: "blue", shelfPos: { row: 5, col: 1 } },
    { id: 13, title: "Travel Stories", spine: "EVEN", labelColor: "red", shelfPos: { row: 1, col: 2 } },
    { id: 14, title: "Biography", spine: "AND", labelColor: "blue", shelfPos: { row: 5, col: 6 } },
    { id: 15, title: "Tech Manual", spine: "SER", labelColor: "blue", shelfPos: { row: 1, col: 5 } },
    { id: 16, title: "Fiction Tales", spine: "ZA", labelColor: "blue", shelfPos: { row: 5, col: 4 } },
    { id: 17, title: "History Book", spine: "FOOB", labelColor: "blue", shelfPos: { row: 4, col: 2 } },
    { id: 18, title: "Math Problems", spine: "BA", labelColor: "blue", shelfPos: { row: 3, col: 1 } },
    { id: 19, title: "Language Guide", spine: "QUXY", labelColor: "blue", shelfPos: { row: 2, col: 2 } },
    { id: 20, title: "Adventure", spine: "MO", labelColor: "blue", shelfPos: { row: 3, col: 2 } },
    { id: 21, title: "Mythology", spine: "NIKL", labelColor: "blue", shelfPos: { row: 1, col: 3 } },
    { id: 22, title: "Engineering", spine: "LO", labelColor: "blue", shelfPos: { row: 3, col: 4 } },
    { id: 23, title: "Literature", spine: "JIKS", labelColor: "blue", shelfPos: { row: 1, col: 6 } },
    { id: 24, title: "Astronomy", spine: "VB", labelColor: "blue", shelfPos: { row: 4, col: 1 } },
    { id: 25, title: "Geography", spine: "TYUI", labelColor: "blue", shelfPos: { row: 2, col: 1 } },
    { id: 26, title: "Poetry Collection", spine: "PLM", labelColor: "blue", shelfPos: { row: 1, col: 4 } },
    { id: 27, title: "Self Help", spine: "RF", labelColor: "blue", shelfPos: { row: 2, col: 5 } },
    { id: 28, title: "Business", spine: "TGHY", labelColor: "blue", shelfPos: { row: 1, col: 1 } },
    { id: 29, title: "Cooking Tips", spine: "UJ", labelColor: "blue", shelfPos: { row: 5, col: 5 } },
    { id: 30, title: "Health Book", spine: "IKOL", labelColor: "blue", shelfPos: { row: 2, col: 6 } }
  ];

  useEffect(() => {
    loadFonts();
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    if (stage === "room") {
      setBookPositions(prev => {
        const positions = { ...prev };
        books.forEach(book => {
          if (!positions[book.id] && !booksOnTable.includes(book.id)) {
            const baseLeft = window.innerWidth * 0.05;
            const baseTop = window.innerHeight * 0.05;
            const shelfX = baseLeft + 150 + (book.shelfPos.col - 1) * 100;
            const shelfY = baseTop + 140 + (book.shelfPos.row - 1) * 135;
            positions[book.id] = { x: shelfX, y: shelfY, onShelf: true };
          }
        });
        return positions;
      });

      if (audioRef.current) {
        audioRef.current.volume = 0.25;
        audioRef.current.play().catch(() => {});
      }
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [stage]);

  const handleBookMouseDown = (e, bookId) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(bookId);
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      const clientX = e.clientX || e.touches?.[0]?.clientX;
      const clientY = e.clientY || e.touches?.[0]?.clientY;
      
      if (clientX && clientY) {
        setBookPositions(prev => ({
          ...prev,
          [dragging]: {
            x: clientX,
            y: clientY,
            onShelf: false
          }
        }));
      }
    }
  };

  const handleMouseUp = (e) => {
    if (dragging) {
      const clientX = e.clientX || e.changedTouches?.[0]?.clientX || 0;
      const clientY = e.clientY || e.changedTouches?.[0]?.clientY || 0;
      
      const tableArea = clientY > window.innerHeight * 0.5 && clientX > window.innerWidth * 0.4;
      
      if (tableArea && !booksOnTable.includes(dragging)) {
        setBooksOnTable(prev => [...prev, dragging]);
      } else if (!tableArea && booksOnTable.includes(dragging)) {
        setBooksOnTable(prev => prev.filter(id => id !== dragging));
        
        const book = books.find(b => b.id === dragging);
        if (book) {
          const baseLeft = window.innerWidth * 0.05;
          const baseTop = window.innerHeight * 0.05;
          const shelfX = baseLeft + 150 + (book.shelfPos.col - 1) * 100;
          const shelfY = baseTop + 140 + (book.shelfPos.row - 1) * 135;
          setBookPositions(prev => ({
            ...prev,
            [dragging]: { x: shelfX, y: shelfY, onShelf: true }
          }));
        }
      }
      
      setDragging(null);
    }
  };

  const handleBookDoubleClick = (bookId) => {
    if (!booksOnTable.includes(bookId)) {
      setBooksOnTable(prev => [...prev, bookId]);
    }
  };

  useEffect(() => {
    if (dragging) {
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
  }, [dragging]);

  const adjustCode = (index, direction) => {
    const newCode = [...code];
    let num = parseInt(newCode[index]);
    if (direction === "up") num = (num + 1) % 10;
    else num = (num - 1 + 10) % 10;
    newCode[index] = num.toString();
    setCode(newCode);
  };

  const checkCode = () => {
    if (code.join("") === correctCode.join("")) {
      setStage("win");
      audioRef.current?.pause();
      setTimeout(() => onComplete?.(), 3000);
    } else {
      setLockOpen(false);
      setCode(["0", "0", "0", "0"]);
      setStage("lose");
      audioRef.current?.pause();
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
            <h2 style={styles.introTitle}>PHÒNG 3 - THƯ VIỆN BỊ LÃNG QUÊN</h2>
            <p style={styles.storyText}>Bạn bước vào một căn phòng đầy bụi...</p>
            <p style={styles.storyText}>Một kệ sách cổ kính với những cuốn sách bí ẩn.</p>
            <p style={styles.storyText}>Trên những cuốn sách có những nhãn dán kì lạ...</p>
            <button style={styles.continueBtn} onClick={() => setStage("room")}>
              KHÁM PHÁ →
            </button>
          </div>
        </div>
      )}

      {stage === "room" && (
        <>
          <div style={styles.roomContainer}>
            <div style={{
              ...styles.background,
              backgroundImage: roomBackground ? `url(${roomBackground})` : 'none'
            }}></div>
            
            <div style={styles.fog}></div>
            <div style={styles.vignette}></div>

            <div style={styles.ceilingLampWrapper}>
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
                filter: hovered === "door"
                  ? "brightness(1.15) drop-shadow(0 0 80px rgba(0,0,139,0.8))"
                  : "none",
                transform: hovered === "door"
                  ? "translate(-50%, 0) scale(1.02)"
                  : "translate(-50%, 0)",
              }}
              onClick={() => setLockOpen(true)}
              onMouseEnter={() => setHovered("door")}
              onMouseLeave={() => setHovered(null)}
            >
              {!doorImage && (
                <>
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
                </>
              )}
            </div>

            <div style={styles.mainBookshelf}>
              <div style={styles.shelfBack}></div>
              <div style={styles.shelfFrame}></div>
              <div style={{...styles.shelfPlank, top: "16.5vh"}}></div>
              <div style={{...styles.shelfPlank, top: "33vh"}}></div>
              <div style={{...styles.shelfPlank, top: "49.5vh"}}></div>
              <div style={{...styles.shelfPlank, top: "66vh"}}></div>
              <div style={{...styles.shelfPlank, top: "82.5vh"}}></div>
            </div>

            {books.map(book => {
              const isOnTable = booksOnTable.includes(book.id);
              const isDraggingThis = dragging === book.id;
              const pos = bookPositions[book.id];
              
              if (!pos && !isOnTable) return null;
              
              let displayX, displayY;
              
              if (isDraggingThis && pos) {
                displayX = pos.x;
                displayY = pos.y;
              } else if (isOnTable) {
                const tableIndex = booksOnTable.indexOf(book.id);
                displayX = window.innerWidth * 0.5 + (tableIndex - booksOnTable.length / 2) * 90;
                displayY = window.innerHeight * 0.82;
              } else if (pos) {
                displayX = pos.x;
                displayY = pos.y;
              } else {
                return null;
              }

              return (
                <div
                  key={book.id}
                  style={{
                    ...styles.book,
                    left: `${displayX}px`,
                    top: `${displayY}px`,
                    transform: isDraggingThis ? "translate(-50%, -50%) scale(1.1)" : "translate(-50%, -50%) scale(1)",
                    cursor: isDraggingThis ? "grabbing" : "grab",
                    zIndex: isDraggingThis ? 1000 : (isOnTable ? 100 : 50),
                    opacity: isDraggingThis ? 0.9 : 1,
                    filter: hovered === book.id && !isDraggingThis ? "brightness(1.3)" : "brightness(1)",
                    transition: isDraggingThis ? "none" : "all 0.3s ease",
                    pointerEvents: "auto"
                  }}
                  onMouseDown={(e) => handleBookMouseDown(e, book.id)}
                  onTouchStart={(e) => handleBookMouseDown(e, book.id)}
                  onDoubleClick={() => handleBookDoubleClick(book.id)}
                  onMouseEnter={() => setHovered(book.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div style={styles.bookSpine}>
                    <div style={styles.bookTitle}>{book.title}</div>
                    <div style={{
                      ...styles.bookLabel,
                      background: book.labelColor === "red" 
                        ? "linear-gradient(135deg, #8B0000, #DC143C)"
                        : "linear-gradient(135deg, #00008B, #4169E1)"
                    }}>
                      {book.spine}
                    </div>
                  </div>
                  <div style={styles.bookShadow}></div>
                </div>
              );
            })}

            <div style={styles.readingTable}>
              <div style={styles.tableShadow}></div>
              <div style={styles.tableTop}>
                <div style={styles.tableEdge}></div>
              </div>
            </div>

            <div style={styles.instructionBox}>
              💡 Kéo thả hoặc nhấn đúp sách để xem trên bàn
            </div>
          </div>

          {lockOpen && (
            <div style={styles.lockModal} onClick={() => setLockOpen(false)}>
              <div style={styles.lockPanel} onClick={e => e.stopPropagation()}>
                <div style={styles.lockPanelTitle}>NHẬP MẬT KHẨU</div>
                <div style={styles.codeDisplay}>
                  {code.map((digit, i) => (
                    <div key={i} style={styles.digitWrapper}>
                      <button style={styles.arrowBtn} onClick={() => adjustCode(i, "up")}>▲</button>
                      <div style={styles.digit}>{digit}</div>
                      <button style={styles.arrowBtn} onClick={() => adjustCode(i, "down")}>▼</button>
                    </div>
                  ))}
                </div>
                <button style={styles.unlockBtn} onClick={checkCode}>MỞ KHÓA</button>
                <button style={styles.cancelBtn} onClick={() => { setLockOpen(false); setCode(["0","0","0","0"]); }}>
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
            <h1 style={styles.winTitle}>🎉 HOÀN THÀNH!</h1>
            <p style={styles.winText}>
              Mật khẩu: <span style={styles.correctAnswer}>6 0 1 1</span>
            </p>
            <p style={styles.winSubtext}>PASSWORD IS SIXTY ELEVEN</p>
            <p style={styles.winSubtext}>= 60 11 = 6011</p>
            <div style={styles.sparkles}>✨ 📚 ✨ 📖 ✨</div>
          </div>
        </div>
      )}

      {stage === "lose" && (
        <div style={{...styles.screen, animation: "flicker 0.3s ease-in-out 5"}}>
          <div style={styles.loseBox}>
            <h1 style={styles.loseTitle}>❌ SAI MẬT KHẨU</h1>
            <p style={styles.loseSubtext}>Quan sát kỹ hơn các cuốn sách...</p>
            <button style={styles.retryBtn} onClick={() => {
              setStage("room");
              setLockOpen(false);
              setCode(["0", "0", "0", "0"]);
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
  background: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(180deg, #151a1f 0%, #0a0f14 30%, #03050a 60%, #000 100%)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    zIndex: 1
  },
  fog: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(ellipse at 50% 80%, rgba(50,70,80,0.15) 0%, transparent 60%)",
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
    border: "4px solid rgba(0,0,139,0.6)",
    borderRadius: "15px",
    boxShadow: "0 25px 80px rgba(0,0,0,0.95)"
  },
  introTitle: {
    fontSize: "2.5rem",
    color: "#00008B",
    marginBottom: "30px",
    textShadow: "0 0 35px rgba(0, 0, 139, 0.8)",
    fontFamily: "'Noto Serif', Georgia, serif"
  },
  storyText: {
    fontSize: "1.35rem",
    lineHeight: "2",
    marginBottom: "25px",
    color: "#999",
    fontFamily: "'Noto Serif', Georgia, serif"
  },
  continueBtn: {
    marginTop: "30px",
    background: "linear-gradient(135deg, rgba(0,0,139,0.8), rgba(0,0,80,0.9))",
    border: "3px solid rgba(0,0,139,0.8)",
    color: "#fff",
    padding: "16px 45px",
    fontSize: "1.2rem",
    cursor: "pointer",
    borderRadius: "10px",
    transition: "all 0.3s ease",
    fontWeight: "bold",
    fontFamily: "'Noto Sans', Arial, sans-serif"
  },
  
  ceilingLampWrapper: {
    position: "absolute",
    top: "3vh",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 8
  },
  lampCord: {
    width: "3px",
    height: "6vh",
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
    background: "linear-gradient(135deg, #20252a, #151a1f)",
    borderRadius: "50%",
    margin: "0 auto",
    boxShadow: "0 5px 20px rgba(0,0,0,0.8)"
  },
  lampBottom: {
    width: "100px",
    height: "50px",
    background: "linear-gradient(135deg, #30353a 0%, #20252a 50%, #151a1f 100%)",
    borderRadius: "0 0 50% 50%",
    boxShadow: "0 10px 40px rgba(0,0,0,0.9)",
    border: "2px solid #000",
    margin: "0 auto"
  },
  lampGlow: {
    width: "15vw",
    height: "15vw",
    background: "radial-gradient(circle, rgba(140,180,200,0.15), transparent 70%)",
    position: "absolute",
    bottom: "-6vh",
    left: "50%",
    transform: "translateX(-50%)",
    animation: "lightFlicker 4s ease-in-out infinite",
    pointerEvents: "none"
  },
  
  doorWrapper: {
    position: "absolute",
    bottom: "11vh",
    right: "9vw",
    width: "14vw",
    height: "20vh",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
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
    background: "linear-gradient(to bottom, #000 0%, #0a0f14 60%, #151a1f 100%)",
    borderRadius: "10px 10px 0 0",
    boxShadow: "0 8px 25px rgba(0,0,0,0.95)"
  },
  doorFrameLeft: {
    position: "absolute",
    left: "0",
    top: "0",
    width: "15px",
    height: "100%",
    background: "linear-gradient(to right, #000 0%, #0a0f14 60%, #151a1f 100%)",
    borderRadius: "10px 0 0 8px",
    boxShadow: "inset -5px 0 15px rgba(0,0,0,0.9)"
  },
  doorFrameRight: {
    position: "absolute",
    right: "0",
    top: "0",
    width: "15px",
    height: "100%",
    background: "linear-gradient(to left, #000 0%, #0a0f14 60%, #151a1f 100%)",
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
    background: "linear-gradient(135deg, #252a2f 0%, #151a1f 15%, #0a0f14 35%, #03050a 50%, #0a0f14 65%, #151a1f 85%, #252a2f 100%)",
    border: "6px solid #151a1f",
    borderRadius: "12px 12px 2px 2px",
    boxShadow: "inset 0 3px 20px rgba(0,0,0,0.95), 0 12px 50px rgba(0,0,0,0.9)"
  },
  doorLine1: {
    position: "absolute",
    width: "calc(100% - 25px)",
    height: "2px",
    top: "38%",
    left: "12px",
    background: "linear-gradient(90deg, transparent, #0a0f14 20%, #0a0f14 80%, transparent)",
    opacity: 0.6
  },
  doorLine2: {
    position: "absolute",
    width: "2px",
    height: "calc(100% - 25px)",
    left: "50%",
    top: "12px",
    background: "linear-gradient(180deg, transparent, #0a0f14 20%, #0a0f14 80%, transparent)",
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
    background: "linear-gradient(135deg, #30353a 0%, #20252a 15%, #151a1f 100%)",
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
    border: "3px solid #30353a",
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
  
  mainBookshelf: {
    position: "absolute",
    top: "5vh",
    left: "5vw",
    width: "35vw",
    height: "75vh",
    zIndex: 6
  },
  shelfBack: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(135deg, #252a2f 0%, #151a1f 30%, #0a0f14 60%, #03050a 100%)",
    borderRadius: "12px",
    boxShadow: "0 20px 70px rgba(0,0,0,0.98), inset 0 8px 40px rgba(0,0,0,0.95)",
    border: "8px solid #000"
  },
  shelfFrame: {
    position: "absolute",
    inset: "25px",
    border: "4px solid #0a0f14",
    borderRadius: "8px",
    pointerEvents: "none"
  },
  shelfPlank: {
    position: "absolute",
    width: "calc(100% - 3.5vw)",
    height: "1.2vh",
    left: "1.75vw",
    background: "linear-gradient(to bottom, #30353a, #20252a, #151a1f)",
    borderRadius: "5px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.9), inset 0 -4px 16px rgba(0,0,0,0.8)",
    border: "2px solid #000"
  },
  
  book: {
    position: "absolute",
    width: "70px",
    height: "150px",
    transition: "all 0.3s ease",
    zIndex: 50
  },
  bookSpine: {
    width: "100%",
    height: "100%",
    background: "linear-gradient(135deg, #35404a 0%, #252a2f 50%, #151a1f 100%)",
    border: "3px solid #000",
    borderRadius: "5px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.9), inset -3px 0 16px rgba(0,0,0,0.7)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 6px",
    position: "relative"
  },
  bookTitle: {
    fontSize: "0.7rem",
    color: "#96b8c9",
    writingMode: "vertical-rl",
    textOrientation: "mixed",
    letterSpacing: "1px",
    fontWeight: "bold",
    textShadow: "0 1px 3px rgba(0,0,0,0.8)",
    textAlign: "center",
    fontFamily: "'Noto Sans', Arial, sans-serif"
  },
  bookLabel: {
    width: "45px",
    height: "55px",
    borderRadius: "5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#fff",
    textShadow: "0 2px 6px rgba(0,0,0,0.9)",
    boxShadow: "0 4px 16px rgba(0,0,0,0.9), inset 0 2px 10px rgba(255,255,255,0.2)",
    border: "2px solid rgba(0,0,0,0.6)",
    fontFamily: "monospace",
    letterSpacing: "1px"
  },
  bookShadow: {
    position: "absolute",
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.6)",
    filter: "blur(8px)",
    zIndex: -1,
    left: "6px",
    top: "6px",
    borderRadius: "5px"
  },
  
  readingTable: {
    position: "absolute",
    bottom: "5vh",
    left: "50%",
    transform: "translateX(-50%)",
    width: "45vw",
    height: "15vh",
    zIndex: 7
  },
  tableShadow: {
    position: "absolute",
    width: "100%",
    height: "100%",
    background: "radial-gradient(ellipse, rgba(0,0,0,0.7) 0%, transparent 70%)",
    filter: "blur(20px)",
    top: "20px"
  },
  tableTop: {
    position: "relative",
    width: "100%",
    height: "100%",
    background: "linear-gradient(135deg, #252a2f 0%, #151a1f 30%, #0a0f14 70%, #03050a 100%)",
    borderRadius: "20px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.95), inset 0 4px 30px rgba(0,0,0,0.9)",
    border: "6px solid #000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  tableEdge: {
    position: "absolute",
    inset: "15px",
    border: "3px solid #0a0f14",
    borderRadius: "16px",
    pointerEvents: "none",
    opacity: 0.4
  },
  
  instructionBox: {
    position: "absolute",
    bottom: "0.5vh",
    left: "50%",
    transform: "translateX(-50%)",
    background: "rgba(10, 10, 10, 0.92)",
    border: "3px solid rgba(0,0,139,0.5)",
    borderRadius: "10px",
    padding: "10px 20px",
    fontSize: "0.9rem",
    color: "#999",
    textAlign: "center",
    boxShadow: "0 5px 25px rgba(0,0,0,0.8)",
    zIndex: 100,
    fontFamily: "'Noto Sans', Arial, sans-serif"
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
    background: "linear-gradient(135deg, #0a0f14 0%, #000 50%, #0a0f14 100%)",
    border: "4px solid rgba(0,0,139,0.6)",
    borderRadius: "20px",
    padding: "40px",
    textAlign: "center",
    color: "#666",
    boxShadow: "0 25px 100px rgba(0,0,0,0.98)",
    minWidth: "400px"
  },
  lockPanelTitle: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    marginBottom: "30px",
    textShadow: "0 0 25px rgba(0, 0,139,0.8)",
    color: "#00008B",
    fontFamily: "'Noto Serif', Georgia, serif"
  },
  codeDisplay: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginBottom: "30px"
  },
  digitWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px"
  },
  arrowBtn: {
    background: "linear-gradient(135deg, rgba(20,20,20,0.9), rgba(10,10,10,0.95))",
    border: "2px solid rgba(0,0,139,0.5)",
    color: "#666",
    width: "45px",
    height: "32px",
    cursor: "pointer",
    fontSize: "0.9rem",
    borderRadius: "6px",
    fontWeight: "bold",
    transition: "all 0.2s ease",
    fontFamily: "'Noto Sans', Arial, sans-serif"
  },
  digit: {
    width: "55px",
    height: "70px",
    background: "linear-gradient(135deg, #0a0f14 0%, #000 40%, #05050a 70%, #000 100%)",
    border: "3px solid rgba(0,0,139,0.6)",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2.5rem",
    color: "#00008B",
    fontWeight: "bold",
    boxShadow: "inset 0 3px 15px rgba(0,0,0,0.99)",
    textShadow: "0 0 20px rgba(0,0,139,0.8)",
    fontFamily: "'Noto Sans', Arial, sans-serif"
  },
  unlockBtn: {
    background: "linear-gradient(135deg, rgba(0,0,139,0.8), rgba(0,0,100,0.9))",
    border: "3px solid rgba(0,0,139,0.8)",
    color: "#fff",
    padding: "18px 45px",
    fontSize: "1.3rem",
    cursor: "pointer",
    borderRadius: "12px",
    fontWeight: "bold",
    marginBottom: "15px",
    width: "100%",
    boxShadow: "0 8px 30px rgba(0,0,139,0.6)",
    transition: "all 0.3s ease",
    fontFamily: "'Noto Sans', Arial, sans-serif"
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
    fontFamily: "'Noto Sans', Arial, sans-serif"
  },
  
  winBox: {
    textAlign: "center",
    position: "relative"
  },
  winTitle: {
    fontSize: "4rem",
    color: "#00008B",
    textShadow: "0 0 60px rgba(0,0,139,0.9)",
    marginBottom: "30px",
    animation: "bounce 1s ease infinite",
    fontFamily: "'Noto Serif', Georgia, serif"
  },
  winText: {
    fontSize: "1.8rem",
    marginBottom: "20px",
    color: "#999",
    fontFamily: "'Noto Serif', Georgia, serif"
  },
  correctAnswer: {
    color: "#00008B",
    fontSize: "2.5rem",
    fontWeight: "bold",
    textShadow: "0 0 40px rgba(0,0,139,0.9)"
  },
  winSubtext: {
    fontSize: "1.3rem",
    color: "#666",
    marginTop: "15px",
    marginBottom: "10px",
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
    color: "#00008B",
    textShadow: "0 0 60px rgba(0,0,139,0.9)",
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
    background: "linear-gradient(135deg, rgba(0,0,139,0.8), rgba(0,0,80,0.9))",
    border: "3px solid rgba(0,0,139,0.8)",
    color: "#fff",
    padding: "18px 50px",
    fontSize: "1.3rem",
    cursor: "pointer",
    borderRadius: "12px",
    fontWeight: "bold",
    letterSpacing: "2px",
    boxShadow: "0 10px 35px rgba(0,0,139,0.7)",
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
  
  button:hover {
    transform: scale(1.05);
  }
`;
document.head.appendChild(styleSheet);