import React, { useState, useEffect, useRef } from "react";

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

  // Danh sách sách - các nhãn đỏ ghép lại thành "PASSWORD IS SIXTY ELEVEN"
  // Nhãn xanh được thiết kế để nhiễu: có thể ghép thành các từ giống nhưng sai
  const books = [
    { id: 1, title: "Ancient Tales", spine: "PA", labelColor: "red", shelfPos: { row: 1, col: 1 } },
    { id: 2, title: "Mystery Novel", spine: "WOR", labelColor: "blue", shelfPos: { row: 1, col: 2 } },
    { id: 3, title: "Dark History", spine: "SSW", labelColor: "red", shelfPos: { row: 1, col: 3 } },
    { id: 4, title: "Poetry Vol. 3", spine: "DIS", labelColor: "blue", shelfPos: { row: 1, col: 4 } },
    { id: 5, title: "Science Facts", spine: "ORD", labelColor: "red", shelfPos: { row: 2, col: 1 } },
    { id: 6, title: "Old Legends", spine: "NOT", labelColor: "blue", shelfPos: { row: 2, col: 2 } },
    { id: 7, title: "Philosophy", spine: "IS", labelColor: "red", shelfPos: { row: 2, col: 3 } },
    { id: 8, title: "Art & Design", spine: "THE", labelColor: "blue", shelfPos: { row: 2, col: 4 } },
    { id: 9, title: "World Atlas", spine: "SIX", labelColor: "red", shelfPos: { row: 3, col: 1 } },
    { id: 10, title: "Cookbook", spine: "TY", labelColor: "red", shelfPos: { row: 3, col: 2 } },
    { id: 11, title: "Medical Guide", spine: "KEY", labelColor: "blue", shelfPos: { row: 3, col: 3 } },
    { id: 12, title: "Dictionary", spine: "ELE", labelColor: "red", shelfPos: { row: 3, col: 4 } },
    { id: 13, title: "Travel Stories", spine: "VEN", labelColor: "red", shelfPos: { row: 4, col: 1 } },
    { id: 14, title: "Biography", spine: "AND", labelColor: "blue", shelfPos: { row: 4, col: 2 } },
    { id: 15, title: "Tech Manual", spine: "SER", labelColor: "blue", shelfPos: { row: 4, col: 3 } }
  ];

  useEffect(() => {
    if (stage === "room") {
      // Tính vị trí ban đầu cho sách trên kệ (chỉ khi chưa có position)
      setBookPositions(prev => {
        const positions = { ...prev };
        books.forEach(book => {
          if (!positions[book.id] && !booksOnTable.includes(book.id)) {
            // Vị trí tính từ góc kệ sách (150, 100) + margin 40px
            // Mỗi sách cách nhau 110px ngang, 175px dọc
            const shelfX = 190 + (book.shelfPos.col - 1) * 110;
            const shelfY = 140 + (book.shelfPos.row - 1) * 175;
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
      
      // Kiểm tra nếu thả vào vùng bàn (dưới màn hình)
      const tableArea = clientY > window.innerHeight * 0.5;
      
      if (tableArea && !booksOnTable.includes(dragging)) {
        // Thêm sách vào bàn
        setBooksOnTable(prev => [...prev, dragging]);
      } else if (!tableArea && booksOnTable.includes(dragging)) {
        // Trả lại kệ
        setBooksOnTable(prev => prev.filter(id => id !== dragging));
        
        // Reset vị trí về kệ
        const book = books.find(b => b.id === dragging);
        if (book) {
          const shelfX = 190 + (book.shelfPos.col - 1) * 110;
          const shelfY = 140 + (book.shelfPos.row - 1) * 175;
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

  const getBookData = (bookId) => books.find(b => b.id === bookId);

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
            <p style={styles.storyText}>Trên gáy sách có những nhãn dán màu sắc khác nhau...</p>
            <button style={styles.continueBtn} onClick={() => setStage("room")}>
              KHÁM PHÁ →
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

            {/* Kệ sách */}
            <div style={styles.mainBookshelf}>
              <div style={styles.shelfBack}></div>
              <div style={styles.shelfFrame}></div>
              
              {/* Các tầng kệ - Mỗi tầng cao 175px, sách cao 200px nên nằm từ dưới tầng lên */}
              <div style={{...styles.shelfPlank, top: "210px"}}></div>
              <div style={{...styles.shelfPlank, top: "385px"}}></div>
              <div style={{...styles.shelfPlank, top: "560px"}}></div>
              <div style={{...styles.shelfPlank, top: "735px"}}></div>

              {/* Mạng nhện */}
              <div style={{...styles.cobweb, top: "10px", left: "10px"}}>🕸️</div>
              <div style={{...styles.cobweb, top: "20px", right: "20px"}}>🕸️</div>
            </div>

            {/* Sách trên kệ và bàn */}
            {books.map(book => {
              const isOnTable = booksOnTable.includes(book.id);
              const isDraggingThis = dragging === book.id;
              const pos = bookPositions[book.id];
              
              // Nếu không có position và không trên bàn thì không hiển thị
              if (!pos && !isOnTable) return null;
              
              // Tính vị trí hiển thị
              let displayX, displayY;
              
              if (isDraggingThis && pos) {
                // Đang kéo - dùng vị trí từ mouse
                displayX = pos.x;
                displayY = pos.y;
              } else if (isOnTable) {
                // Trên bàn - xếp theo thứ tự
                const tableIndex = booksOnTable.indexOf(book.id);
                displayX = window.innerWidth * 0.15 + tableIndex * 90;
                displayY = window.innerHeight * 0.72;
              } else if (pos) {
                // Trên kệ - dùng vị trí kệ
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

            {/* Bàn đọc sách */}
            <div style={styles.readingTable}>
              <div style={styles.tableShadow}></div>
              <div style={styles.tableTop}>
                <div style={styles.tableEdge}></div>
                {booksOnTable.length === 0 && (
                  <div style={styles.tableHint}>
                    Kéo sách lên đây hoặc nhấn đúp vào sách để xem
                  </div>
                )}
              </div>
            </div>

            {/* Hướng dẫn */}
            <div style={styles.instructionBox}>
              💡 Kéo thả hoặc nhấn đúp sách để xem trên bàn
            </div>
          </div>

          {/* Modal mật khẩu */}
          {lockOpen && (
            <div style={styles.lockModal} onClick={() => setLockOpen(false)}>
              <div style={styles.lockPanel} onClick={e => e.stopPropagation()}>
                <div style={styles.lockPanelTitle}>🔐 NHẬP MẬT KHẨU</div>
                <div style={styles.lockInstructions}>
                  Nhập 4 chữ số
                </div>
                <div style={styles.codeDisplay}>
                  {code.map((digit, i) => (
                    <div key={i} style={styles.digitWrapper}>
                      <button style={styles.arrowBtn} onClick={() => adjustCode(i, "up")}>▲</button>
                      <div style={styles.digit}>{digit}</div>
                      <button style={styles.arrowBtn} onClick={() => adjustCode(i, "down")}>▼</button>
                    </div>
                  ))}
                </div>
                <button style={styles.unlockBtn} onClick={checkCode}>🔓 MỞ KHÓA</button>
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
            <p style={styles.winSubtext}>Bạn đã giải mã thành công!</p>
            <div style={styles.sparkles}>✨ 📚 ✨ 📖 ✨</div>
          </div>
        </div>
      )}

      {stage === "lose" && (
        <div style={{...styles.screen, animation: "flicker 0.3s ease-in-out 5"}}>
          <div style={styles.loseBox}>
            <h1 style={styles.loseTitle}>❌ SAI MẬT KHẨU</h1>
            <p style={styles.loseText}>Sách vở rơi xuống...</p>
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
    fontFamily: "Georgia, serif",
    position: "relative",
    userSelect: "none",
    background: "#000"
  },
  roomBg: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(180deg, #1a1510 0%, #0f0a08 30%, #050302 60%, #000 100%)",
    zIndex: 1
  },
  fog: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(ellipse at 50% 80%, rgba(80,70,50,0.15) 0%, transparent 60%)",
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
    color: "#8B0000",
    marginBottom: "30px",
    textShadow: "0 0 35px rgba(139, 0, 0, 0.8)"
  },
  storyText: {
    fontSize: "1.35rem",
    lineHeight: "2",
    marginBottom: "25px",
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
    background: "radial-gradient(circle, rgba(200,180,140,0.15), transparent 70%)",
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
  // ============================================
  // CSS KỆ SÁCH - ĐIỀU CHỈNH TẠI ĐÂY
  // ============================================
  mainBookshelf: {
    position: "absolute",
    top: "50px",           // Vị trí từ trên xuống
    left: "150px",         // Vị trí từ trái sang
    width: "520px",        // Chiều rộng kệ: 4 cuốn x 110px + 2 margin x 40px = 520px
    height: "780px",       // Chiều cao kệ: 4 hàng x 175px + 2 margin x 40px = 780px
    zIndex: 6
  },
  shelfBack: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(135deg, #2a2520 0%, #1a1510 30%, #0f0a08 60%, #050302 100%)",
    borderRadius: "15px",
    boxShadow: "0 30px 100px rgba(0,0,0,0.98), inset 0 10px 50px rgba(0,0,0,0.95)",
    border: "10px solid #000"
  },
  shelfFrame: {
    position: "absolute",
    inset: "30px",
    border: "5px solid #0f0a08",
    borderRadius: "10px",
    pointerEvents: "none"
  },
  shelfPlank: {
    position: "absolute",
    width: "calc(100% - 70px)",
    height: "18px",
    left: "35px",
    background: "linear-gradient(to bottom, #3a3025, #2a2520, #1a1510)",
    borderRadius: "6px",
    boxShadow: "0 12px 35px rgba(0,0,0,0.9), inset 0 -5px 20px rgba(0,0,0,0.8)",
    border: "2px solid #000"
  },
  book: {
    position: "absolute",
    width: "80px",
    height: "200px",
    transition: "all 0.3s ease",
    zIndex: 50
  },
  bookSpine: {
    width: "100%",
    height: "100%",
    background: "linear-gradient(135deg, #4a3520 0%, #3a2810 50%, #2a1808 100%)",
    border: "3px solid #000",
    borderRadius: "6px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.9), inset -4px 0 20px rgba(0,0,0,0.7)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "15px 8px",
    position: "relative"
  },
  bookTitle: {
    fontSize: "0.75rem",
    color: "#c9b896",
    writingMode: "vertical-rl",
    textOrientation: "mixed",
    letterSpacing: "1px",
    fontWeight: "bold",
    textShadow: "0 1px 4px rgba(0,0,0,0.8)",
    textAlign: "center"
  },
  bookLabel: {
    width: "50px",
    height: "65px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.4rem",
    fontWeight: "bold",
    color: "#fff",
    textShadow: "0 2px 8px rgba(0,0,0,0.9)",
    boxShadow: "0 5px 20px rgba(0,0,0,0.9), inset 0 3px 12px rgba(255,255,255,0.2)",
    border: "3px solid rgba(0,0,0,0.6)",
    fontFamily: "monospace",
    letterSpacing: "2px"
  },
  bookShadow: {
    position: "absolute",
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.6)",
    filter: "blur(10px)",
    zIndex: -1,
    left: "8px",
    top: "8px",
    borderRadius: "6px"
  },
  cobweb: {
    position: "absolute",
    fontSize: "2.5rem",
    opacity: 0.3,
    filter: "grayscale(1)",
    animation: "swing 4s ease-in-out infinite",
    pointerEvents: "none"
  },
  readingTable: {
    position: "absolute",
    bottom: "50px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "700px",
    height: "180px",
    zIndex: 5
  },
  tableShadow: {
    position: "absolute",
    width: "100%",
    height: "100%",
    background: "radial-gradient(ellipse, rgba(0,0,0,0.7) 0%, transparent 70%)",
    filter: "blur(25px)",
    top: "25px"
  },
  tableTop: {
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
  tableEdge: {
    position: "absolute",
    inset: "20px",
    border: "4px solid #0f0a08",
    borderRadius: "20px",
    pointerEvents: "none",
    opacity: 0.4
  },
  tableHint: {
    fontSize: "1.1rem",
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
    fontFamily: "Arial, sans-serif"
  },
  instructionBox: {
    position: "absolute",
    top: "30px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "rgba(10, 10, 10, 0.92)",
    border: "3px solid rgba(139,0,0,0.5)",
    borderRadius: "10px",
    padding: "12px 25px",
    fontSize: "1rem",
    color: "#999",
    textAlign: "center",
    boxShadow: "0 5px 25px rgba(0,0,0,0.8)",
    zIndex: 100,
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
    minWidth: "400px"
  },
  lockPanelTitle: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    marginBottom: "15px",
    textShadow: "0 0 25px rgba(139,0,0,0.8)",
    color: "#8B0000"
  },
  lockInstructions: {
    fontSize: "0.95rem",
    color: "#555",
    marginBottom: "30px",
    fontFamily: "Arial, sans-serif"
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
    border: "2px solid rgba(139,0,0,0.5)",
    color: "#666",
    width: "45px",
    height: "32px",
    cursor: "pointer",
    fontSize: "0.9rem",
    borderRadius: "6px",
    fontWeight: "bold",
    transition: "all 0.2s ease",
    fontFamily: "Arial, sans-serif"
  },
  digit: {
    width: "55px",
    height: "70px",
    background: "linear-gradient(135deg, #0a0a0a 0%, #000 40%, #050505 70%, #000 100%)",
    border: "3px solid rgba(139,0,0,0.6)",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2.5rem",
    color: "#8B0000",
    fontWeight: "bold",
    boxShadow: "inset 0 3px 15px rgba(0,0,0,0.99)",
    textShadow: "0 0 20px rgba(139,0,0,0.8)",
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
    position: "relative"
  },
  winTitle: {
    fontSize: "4rem",
    color: "#8B0000",
    textShadow: "0 0 60px rgba(139,0,0,0.9)",
    marginBottom: "30px",
    animation: "bounce 1s ease infinite"
  },
  winText: {
    fontSize: "1.8rem",
    marginBottom: "20px",
    color: "#999"
  },
  correctAnswer: {
    color: "#8B0000",
    fontSize: "2.5rem",
    fontWeight: "bold",
    textShadow: "0 0 40px rgba(139,0,0,0.9)"
  },
  winSubtext: {
    fontSize: "1.3rem",
    color: "#666",
    marginTop: "15px",
    marginBottom: "10px"
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
  @keyframes swing {
    0%, 100% { transform: rotate(-3deg); }
    50% { transform: rotate(3deg); }
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
  
  .arrowBtn:hover {
    background: linear-gradient(135deg, rgba(30,0,0,0.9), rgba(20,0,0,0.95));
    border-color: rgba(139,0,0,0.7);
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
`;
document.head.appendChild(styleSheet);