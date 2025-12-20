import React, { useState, useEffect, useRef } from "react";

// ========== IMPORT CÁC HÌNH ẢNH TẠI ĐÂY ==========
import Bg1 from "../Img/room8.png"
import NoteImg1 from "../Img/note8.png"
import LockImg1 from "../Img/lock8.png" // Icon ổ khóa
import BoardIconImg1 from "../Img/notepanel8.png" // Icon bảng ghép hình

const RoomBg = Bg1;
const NoteImg = NoteImg1;
const LockImg = LockImg1; // Thêm ảnh ổ khóa vào đây
const BoardIconImg = BoardIconImg1; // Thêm ảnh icon bảng vào đây

const loadFonts = () => {
  if (!document.querySelector('#room8-fonts')) {
    const link = document.createElement('link');
    link.id = 'room8-fonts';
    link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&family=Noto+Serif:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
};

export default function Room8({ onComplete }) {
  const [stage, setStage] = useState("intro");
  const [notePickedUp, setNotePickedUp] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [lockOpen, setLockOpen] = useState(false);
  const [boardOpen, setBoardOpen] = useState(false);
  
  const correctCode = ["P", "X", "L", "D"];
  
  const [wheels, setWheels] = useState([
  ["P", "B", "K", "H", "T", "Y"],
  ["Z", "T", "X", "N", "V", "D"],
  ["S", "L", "M", "R", "A", "Q"],
  ["V", "S", "J", "D", "C", "G"]
]);
  
  const [currentIndices, setCurrentIndices] = useState([0, 0, 0, 0]);
  
  const [dragging, setDragging] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const [board, setBoard] = useState(
    Array(5).fill(null).map(() => Array(5).fill(null))
  );
  
  const allPieces = [
  "L", "Phòng băng", "Xanh", "Tiệm hoa", "Đồ thể thao", 
  "Váy đầm", "Trắng", "Tiệm bánh", "S", "Đen", "Đỏ", "Quần jean", 
  "Phòng Yoga", "Áo sơ mi", "M", "XXXL"
];
  
  const [pieces, setPieces] = useState(
    allPieces.map((text, i) => ({
      id: i,
      text,
      placed: false,
      x: 0,
      y: 0
    }))
  );
  
  const [notePosition, setNotePosition] = useState({ x: window.innerWidth / 2 - 300, y: window.innerHeight / 2 - 300 });
  const [draggingNote, setDraggingNote] = useState(false);
  const [noteDragOffset, setNoteDragOffset] = useState({ x: 0, y: 0 });
  
  const boardRef = useRef(null);
  const audioRef = useRef(null);
  const initializedPieces = useRef(false);

  const noteContent = `Là nhân viên trong tiệm đồ nữ chúng ta nhất định phải thông minh.
Kiểm tra bạn nhé.
4 chủ tiệm của khu thương mại mua quần áo ở tiệm tôi, đều được để ở trong cửa tiệm.
Nhà của họ đều ở các căn lần lượt dưới lầu. Lát nữa bạn gửi đồ đến nhà cho họ.
Nhưng phải biết mật khẩu cửa vào tiệm.
Phải phân rõ mọi người mua quần áo màu gì, size gì. Không mở được cửa cửa tiệm, không gửi hàng đi được, ngày mai không cần đến làm nữa.

Chủ tiệm mua áo màu trắng, ở bên phải nhà chủ tiệm mua đồ thể thao.
Ông chủ mua áo màu đen, sát về bên phải hơn so với nhà ông chủ mua áo màu trắng.
Ông chủ mua áo màu đỏ, ở giữa nhà của ông chủ mua áo đen và ông chủ mua áo trắng.
Ông chủ mua áo màu xanh lục vừa không ở bên cạnh nhà ông chủ mua áo màu đen, cũng không ở cạnh nhà của người mua áo sơ mi.
Bà chủ phòng tập Yoga mua chiếc váy liền.
Bà chủ mua chiếc váy liền, ở nhà số hai từ bên trái, nhưng lại không ở bên cạnh nhà của bà chủ mua áo size S.
Hai nhà bên cạnh trái và phải của bà chủ tiệm hoa, một người mặc size M, một người mua quần Jean.
Người mặc size XXXL ở nhà số 2 từ bên phải.
Ông chủ phòng băng mua chiếc áo size L tặng cho mẹ ông ấy.
Chủ tiệm bánh mua áo sơ mi ở tiệm cách vách bên phải chủ tiệm.

Mật khẩu cửa tiệm là những chữ viết tắt của tên cửa tiệm đầu tiên bên trái, size và màu sắc của quần áo đã mua. Các chữ viết tắt của các thông tin trên là thông tin!`;

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

  // Initialize pieces only once when board first opens
  useEffect(() => {
    if (boardOpen && !initializedPieces.current) {
      const piecesPerRow = 4;
      const startX = 100;
      const startY = window.innerHeight - 400;
      
      setPieces(prev => prev.map((p, i) => {
        const col = i % piecesPerRow;
        const row = Math.floor(i / piecesPerRow);
        return {
          ...p,
          x: col * 160 + startX,
          y: row * 90 + startY
        };
      }));
      
      initializedPieces.current = true;
      console.log('Pieces initialized:', pieces.length);
    }
  }, [boardOpen]);

  const handlePieceMouseDown = (e, pieceId) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Clicked piece ID:', pieceId);
    
    const piece = pieces.find(p => p.id === pieceId);
    if (!piece) {
      console.error('Piece not found:', pieceId);
      return;
    }
    
    console.log('Piece found:', piece);
    
    const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;
    
    setDragging(pieceId);
    setDragOffset({
      x: clientX - piece.x,
      y: clientY - piece.y
    });
    
    // Remove from board if it's placed
    if (piece.placed) {
      setBoard(prev => {
        const newBoard = prev.map(r => [...r]);
        for (let r = 0; r < 5; r++) {
          for (let c = 0; c < 5; c++) {
            if (newBoard[r][c] === pieceId) {
              newBoard[r][c] = null;
            }
          }
        }
        return newBoard;
      });
      
      setPieces(prev => prev.map(p => 
        p.id === pieceId ? { ...p, placed: false } : p
      ));
    }
  };

  const handleMouseMove = (e) => {
    if (dragging !== null) {
      e.preventDefault();
      const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
      const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;
      
      console.log('Dragging piece:', dragging, 'to', clientX, clientY);
      
      setPieces(prev => prev.map(p => 
        p.id === dragging 
          ? { ...p, x: clientX - dragOffset.x, y: clientY - dragOffset.y }
          : p
      ));
    } else if (draggingNote) {
      e.preventDefault();
      const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
      const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;
      
      setNotePosition({
        x: clientX - noteDragOffset.x,
        y: clientY - noteDragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    if (dragging !== null) {
      if (!boardRef.current) {
        setDragging(null);
        return;
      }
      
      const piece = pieces.find(p => p.id === dragging);
      const boardRect = boardRef.current.getBoundingClientRect();
      
      const cellWidth = boardRect.width / 5;
      const cellHeight = boardRect.height / 5;
      
      const relX = piece.x - boardRect.left;
      const relY = piece.y - boardRect.top;
      
      const col = Math.floor(relX / cellWidth);
      const row = Math.floor(relY / cellHeight);
      
      if (row >= 1 && row <= 4 && col >= 1 && col <= 4) {
        const snapThreshold = 50;
        const cellCenterX = boardRect.left + (col + 0.5) * cellWidth;
        const cellCenterY = boardRect.top + (row + 0.5) * cellHeight;
        
        const distance = Math.sqrt(
          Math.pow(piece.x - cellCenterX, 2) + 
          Math.pow(piece.y - cellCenterY, 2)
        );
        
        if (distance < snapThreshold) {
          const oldPieceId = board[row][col];
          if (oldPieceId !== null) {
            setPieces(prev => prev.map(p => 
              p.id === oldPieceId ? { ...p, placed: false } : p
            ));
          }
          
          setBoard(prev => {
            const newBoard = prev.map(r => [...r]);
            newBoard[row][col] = dragging;
            return newBoard;
          });
          
          setPieces(prev => prev.map(p => 
            p.id === dragging 
              ? { ...p, placed: true, x: cellCenterX, y: cellCenterY }
              : p
          ));
        }
      }
      
      setDragging(null);
    } else if (draggingNote) {
      setDraggingNote(false);
    }
  };

  useEffect(() => {
    if (dragging !== null || draggingNote) {
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
  }, [dragging, draggingNote, dragOffset, noteDragOffset, pieces, board, notePosition]);

  const handleNoteMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;
    
    setDraggingNote(true);
    setNoteDragOffset({
      x: clientX - notePosition.x,
      y: clientY - notePosition.y
    });
  };

  const rotateWheel = (wheelIndex, direction) => {
    setCurrentIndices(prev => {
      const newIndices = [...prev];
      const wheelSize = wheels[wheelIndex].length;
      if (direction === "up") {
        newIndices[wheelIndex] = (newIndices[wheelIndex] - 1 + wheelSize) % wheelSize;
      } else {
        newIndices[wheelIndex] = (newIndices[wheelIndex] + 1) % wheelSize;
      }
      return newIndices;
    });
  };

  const checkCode = () => {
    const currentCode = currentIndices.map((idx, i) => wheels[i][idx]);
    if (JSON.stringify(currentCode) === JSON.stringify(correctCode)) {
      setStage("win");
      audioRef.current?.pause();
      setTimeout(() => onComplete?.(), 3000);
    } else {
      setStage("lose");
      audioRef.current?.pause();
    }
  };

  const rowHeaders = ["Vị trí", "Tiệm", "Màu", "Size", "Trang phục"];
  const colHeaders = ["", "Nhà 1", "Nhà 2", "Nhà 3", "Nhà 4"];

  return (
    <div style={styles.container}>
      <audio ref={audioRef} loop>
        <source src="https://assets.mixkit.co/sfx/preview/mixkit-creepy-ambience-1099.mp3" type="audio/mpeg" />
      </audio>

      {/* ==================== MÀN HÌNH INTRO ==================== */}
      {stage === "intro" && (
        <div style={styles.screen}>
          <div style={styles.storyBox}>
            <h2 style={styles.introTitle}>PHÒNG 8 - BÍ MẬT TIỆM ĐỒ</h2>
            <p style={styles.storyText}>Bạn bước vào một căn phòng đầy quần áo...</p>
            <p style={styles.storyText}>Một tờ giấy ghi chú nằm trên sàn...</p>
            <p style={styles.storyText}>Hãy giải mã bí ẩn và tìm ra mật khẩu!</p>
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
              backgroundImage: RoomBg ? `url(${RoomBg})` : 'none'
            }}></div>
            <div style={styles.fog}></div>
            <div style={styles.vignette}></div>

            {/* Note on floor - không có khung */}
            {!notePickedUp && (
              <div
                style={{
                  ...styles.noteOnFloor,
                  backgroundImage: NoteImg ? `url(${NoteImg})` : 'none',
                  backgroundColor: NoteImg ? 'transparent' : 'rgba(255,192,203,0.3)',
                  filter: hovered === "note" 
                    ? "brightness(1.5) drop-shadow(0 0 70px rgba(255,182,193,0.9))" 
                    : "brightness(1) drop-shadow(0 10px 30px rgba(0,0,0,0.8))",
                  transform: hovered === "note" ? "rotate(5deg) scale(1.15)" : "rotate(5deg) scale(1)",
                }}
                onMouseEnter={() => setHovered("note")}
                onMouseLeave={() => setHovered(null)}
                onClick={() => {setNotePickedUp(true); setNoteOpen(true);}}
              >
                {!NoteImg && <div style={{color: '#FFB6C1', fontSize: '3rem', textShadow: '0 0 20px rgba(255,182,193,0.8)'}}>📄</div>}
              </div>
            )}

            {/* Icon bảng ghép hình */}
            <div
              style={{
                ...styles.boardIcon,
                backgroundImage: BoardIconImg ? `url(${BoardIconImg})` : 'none',
                backgroundColor: BoardIconImg ? 'transparent' : 'rgba(219,112,147,0.8)',
                filter: hovered === "boardIcon" 
                  ? "brightness(1.3) drop-shadow(0 0 50px rgba(255,182,193,0.9))" 
                  : "brightness(1) drop-shadow(0 8px 25px rgba(0,0,0,0.8))",
                transform: hovered === "boardIcon" ? "scale(1.1)" : "scale(1)"
              }}
              onMouseEnter={() => setHovered("boardIcon")}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setBoardOpen(true)}
            >
              {!BoardIconImg && <div style={{fontSize: '3rem', color: '#FFF'}}>📋</div>}
            </div>

            {/* Icon ổ khóa */}
            <div
              style={{
                ...styles.lockIcon,
                backgroundImage: LockImg ? `url(${LockImg})` : 'none',
                backgroundColor: LockImg ? 'transparent' : 'rgba(219,112,147,0.8)',
                filter: hovered === "lock" 
                  ? "brightness(1.3) drop-shadow(0 0 50px rgba(255,182,193,0.9))" 
                  : "brightness(1) drop-shadow(0 8px 25px rgba(0,0,0,0.8))",
                transform: hovered === "lock" ? "scale(1.1)" : "scale(1)"
              }}
              onMouseEnter={() => setHovered("lock")}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setLockOpen(true)}
            >
              {!LockImg && <div style={{fontSize: '4rem', color: '#FFF'}}>🔒</div>}
            </div>

            {/* Note inventory icon - nhỏ ở góc phải dưới */}
            {notePickedUp && !noteOpen && (
              <div
                style={{
                  ...styles.noteInventory,
                  backgroundImage: NoteImg ? `url(${NoteImg})` : 'none',
                  backgroundColor: NoteImg ? 'transparent' : 'rgba(255,192,203,0.5)',
                  zIndex: boardOpen || lockOpen ? 501 : 200
                }}
                onClick={() => setNoteOpen(true)}
              >
                {!NoteImg && <span style={{fontSize: '2rem', color: '#FFB6C1'}}>📄</span>}
              </div>
            )}

            {/* Board modal overlay */}
            {boardOpen && (
              <div style={styles.boardModal}>
                <div style={styles.boardModalContent}>
                  <button style={styles.closeBoardBtn} onClick={() => setBoardOpen(false)}>✕</button>
                  
                  {/* Board */}
                  <div ref={boardRef} style={styles.board}>
                    {Array(5).fill(0).map((_, row) => (
                      <div key={row} style={styles.boardRow}>
                        {Array(5).fill(0).map((_, col) => {
                          const isHeader = row === 0 || col === 0;
                          const isEmpty = board[row]?.[col] === null;
                          const pieceId = board[row]?.[col];
                          const piece = pieces.find(p => p.id === pieceId);
                          
                          return (
                            <div
                              key={col}
                              style={{
                                ...styles.cell,
                                backgroundColor: isHeader ? '#DB7093' : (isEmpty ? '#FFE4E1' : '#FFF'),
                                color: isHeader ? '#FFF' : '#8B4789',
                                fontWeight: isHeader ? 'bold' : 'normal',
                                border: '2px solid #DB7093'
                              }}
                            >
                              {isHeader && (row === 0 ? colHeaders[col] : (col === 0 ? rowHeaders[row] : ''))}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>

                  {/* Draggable pieces */}
                  {pieces.map(piece => (
                    <div
                      key={piece.id}
                      style={{
                        ...styles.piece,
                        left: piece.x,
                        top: piece.y,
                        cursor: dragging === piece.id ? 'grabbing' : 'grab',
                        zIndex: dragging === piece.id ? 1000 : 100,
                        pointerEvents: 'auto'
                      }}
                      onMouseDown={(e) => handlePieceMouseDown(e, piece.id)}
                      onTouchStart={(e) => handlePieceMouseDown(e, piece.id)}
                    >
                      {piece.text}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lock modal */}
            {lockOpen && (
              <div style={styles.lockModal} onClick={() => setLockOpen(false)}>
                <div style={styles.lockPanel} onClick={e => e.stopPropagation()}>
                  <div style={styles.lockTitle}>NHẬP MẬT KHẨU</div>
                  <div style={styles.wheelContainer}>
                    {currentIndices.map((idx, wheelIdx) => (
                      <div key={wheelIdx} style={styles.wheelWrapper}>
                        <button style={styles.wheelBtn} onClick={() => rotateWheel(wheelIdx, "up")}>▲</button>
                        <div style={styles.wheel}>
                          {wheels[wheelIdx].map((char, charIdx) => {
                            const offset = charIdx - idx;
                            const normalizedOffset = ((offset % wheels[wheelIdx].length) + wheels[wheelIdx].length) % wheels[wheelIdx].length;
                            const displayOffset = normalizedOffset > wheels[wheelIdx].length / 2 
                              ? normalizedOffset - wheels[wheelIdx].length 
                              : normalizedOffset;
                            
                            return (
                              <div
                                key={charIdx}
                                style={{
                                  ...styles.wheelChar,
                                  transform: `translateY(${displayOffset * 60}px)`,
                                  opacity: Math.abs(displayOffset) === 0 ? 1 : Math.max(0.2, 1 - Math.abs(displayOffset) * 0.3),
                                  fontSize: Math.abs(displayOffset) === 0 ? '2.5rem' : '1.5rem',
                                  fontWeight: Math.abs(displayOffset) === 0 ? 'bold' : 'normal'
                                }}
                              >
                                {char}
                              </div>
                            );
                          })}
                        </div>
                        <button style={styles.wheelBtn} onClick={() => rotateWheel(wheelIdx, "down")}>▼</button>
                      </div>
                    ))}
                  </div>
                  <button style={styles.unlockBtn} onClick={checkCode}>XÁC NHẬN</button>
                  <button style={styles.cancelBtn} onClick={() => setLockOpen(false)}>HỦY</button>
                </div>
              </div>
            )}

            {/* Note panel - now draggable and not full screen */}
            {noteOpen && (
              <div 
                style={{
                  ...styles.notePanel,
                  position: 'fixed',
                  left: notePosition.x,
                  top: notePosition.y,
                  width: '600px',
                  maxWidth: '80vw',
                  maxHeight: '80vh',
                  zIndex: 510,
                  cursor: draggingNote ? 'grabbing' : 'default',
                  padding: 0
                }}
              >
                <div 
                  style={{
                    ...styles.noteTitle,
                    position: 'sticky',
                    top: 0,
                    zIndex: 2,
                    background: '#fff5f5',
                    margin: 0,
                    padding: '20px 60px 20px 40px',
                    borderBottom: '3px solid rgba(219,112,147,0.5)',
                    borderRadius: '20px 20px 0 0'
                  }} 
                  onMouseDown={handleNoteMouseDown}
                  onTouchStart={handleNoteMouseDown}
                >
                  GHI CHÚ ĐIỀU TRA
                  <button 
                    style={{
                      ...styles.closeNote,
                      position: 'absolute',
                      top: '50%',
                      right: '15px',
                      transform: 'translateY(-50%)'
                    }} 
                    onClick={(e) => {
                      e.stopPropagation();
                      setNoteOpen(false);
                    }}
                  >
                    ✕
                  </button>
                </div>
                <pre style={{...styles.noteContent, padding: '40px'}}>{noteContent}</pre>
              </div>
            )}
          </div>
        </>
      )}

      {/* ==================== MÀN HÌNH WIN ==================== */}
      {stage === "win" && (
        <div style={styles.screen}>
          <div style={styles.winBox}>
            <h1 style={styles.winTitle}>💕 CHÍNH XÁC!</h1>
            <div style={styles.sparkles}>💖 ✨ 💕 ✨ 💖</div>
            <p style={styles.winSubtext}>Bạn đã giải mã thành công!</p>
          </div>
        </div>
      )}

      {/* ==================== MÀN HÌNH LOSE ==================== */}
      {stage === "lose" && (
        <div style={{...styles.screen, animation: "flicker 0.3s ease-in-out 5"}}>
          <div style={styles.loseBox}>
            <h1 style={styles.loseTitle}>❌ CHƯA ĐÚNG</h1>
            <p style={styles.loseSubtext}>Kiểm tra lại bảng logic và thử lại!</p>
            <button style={styles.retryBtn} onClick={() => {
              setStage("room");
              setLockOpen(false);
              setCurrentIndices([0, 0, 0, 0]);
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
    background: "radial-gradient(ellipse at 50% 80%, rgba(255,182,193,0.1) 0%, transparent 60%)",
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
    animation: "fadeIn 0.8s ease-in",
    zIndex: 100
  },
  storyBox: {
    maxWidth: "700px",
    textAlign: "center",
    padding: "40px",
    background: "rgba(10, 10, 10, 0.95)",
    border: "6px solid #DB7093",
    borderRadius: "15px",
    boxShadow: "0 25px 80px rgba(219,112,147,0.8)"
  },
  introTitle: {
    fontSize: "2.5rem",
    color: "#FFB6C1",
    marginBottom: "30px",
    textShadow: "0 0 35px rgba(255,182,193,0.8)",
    fontFamily: "'Noto Serif', Georgia, serif"
  },
  storyText: {
    fontSize: "1.3rem",
    lineHeight: "2",
    marginBottom: "20px",
    color: "#FFB6C1",
    fontFamily: "'Noto Serif', Georgia, serif"
  },
  continueBtn: {
    marginTop: "30px",
    background: "linear-gradient(135deg, #DB7093, #C71585)",
    border: "3px solid #DB7093",
    color: "#fff",
    padding: "16px 45px",
    fontSize: "1.2rem",
    cursor: "pointer",
    borderRadius: "10px",
    transition: "all 0.3s ease",
    fontWeight: "bold",
    fontFamily: "'Noto Serif', Georgia, serif"
  },
  noteOnFloor: {
    position: "fixed",
    bottom: "12vh",
    left: "15vw",
    width: "120px",
    height: "120px",
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    transition: "all 0.4s ease"
  },
  noteInventory: {
    position: "fixed",
    bottom: "3vh",
    right: "3vw",
    width: "70px",
    height: "70px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    transition: "all 0.3s ease"
  },
  notePanel: {
    background: "#fff5f5",
    padding: "40px",
    boxShadow: "0 30px 100px rgba(219,112,147,0.8)",
    overflowY: "auto",
    borderRadius: "20px",
    border: "4px solid #DB7093",
    position: "relative"
  },
  closeNote: {
    position: "absolute",
    top: "15px",
    right: "15px",
    width: "40px",
    height: "40px",
    background: "linear-gradient(135deg, rgba(219,112,147,0.9), rgba(199,21,133,0.9))",
    border: "3px solid #8B4789",
    borderRadius: "50%",
    color: "#fff",
    fontSize: "1.4rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    fontFamily: "'Noto Sans', Arial, sans-serif",
    fontWeight: "bold"
  },
  noteTitle: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#C71585",
    marginBottom: "25px",
    textAlign: "center",
    borderBottom: "3px solid rgba(219,112,147,0.5)",
    paddingBottom: "15px",
    fontFamily: "'Noto Serif', Georgia, serif",
    textShadow: "0 0 20px rgba(219,112,147,0.3)",
    cursor: "grab"
  },
  noteContent: {
    fontSize: "1.2rem",
    color: "#8B4789",
    lineHeight: "2",
    whiteSpace: "pre-wrap",
    fontFamily: "'Noto Serif', Georgia, serif",
    textAlign: "left"
  },

  boardIcon: {
    position: "fixed",
    top: "80%",
    left: "75vw",
    transform: "translateY(-50%)",
    width: "250px",
    height: "250px",
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    transition: "all 0.4s ease",
    borderRadius: "15px"
  },

  lockIcon: {
    position: "fixed",
    top: "42%",
    right: "38vw",
    transform: "translateY(-50%)",
    width: "260px",
    height: "250px",
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    transition: "all 0.4s ease",
    borderRadius: "15px"
  },

  boardModal: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.92)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 500,
    backdropFilter: "blur(10px)"
  },
  boardModalContent: {
    position: "relative",
    width: "90vw",
    height: "90vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  closeBoardBtn: {
    position: "absolute",
    top: "20px",
    right: "20px",
    width: "50px",
    height: "50px",
    background: "linear-gradient(135deg, rgba(219,112,147,0.9), rgba(199,21,133,0.9))",
    border: "3px solid #8B4789",
    borderRadius: "50%",
    color: "#fff",
    fontSize: "1.8rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    fontFamily: "'Noto Sans', Arial, sans-serif",
    fontWeight: "bold",
    zIndex: 600
  },
  board: {
    width: "800px",
    height: "600px",
    maxWidth: "85vw",
    maxHeight: "65vh",
    background: "#FFF",
    border: "5px solid #DB7093",
    borderRadius: "15px",
    boxShadow: "0 25px 80px rgba(219,112,147,0.7)",
    display: "flex",
    flexDirection: "column"
  },
  boardRow: {
    display: "flex",
    flex: 1
  },
  cell: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
    textAlign: "center",
    padding: "5px",
    fontFamily: "'Noto Sans', Arial, sans-serif"
  },
  piece: {
    position: "fixed",
    width: "140px",
    padding: "12px",
    background: "linear-gradient(135deg, #FFE4E1, #FFF)",
    border: "3px solid #DB7093",
    borderRadius: "10px",
    textAlign: "center",
    fontSize: "1rem",
    fontWeight: "bold",
    boxShadow: "0 6px 20px rgba(219,112,147,0.5)",
    transform: "translate(-50%, -50%)",
    color: "#8B4789",
    fontFamily: "'Noto Sans', Arial, sans-serif"
  },

  lockModal: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.92)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 400,
    backdropFilter: "blur(10px)"
  },
  lockPanel: {
    width: "550px",
    maxWidth: "90vw",
    background: "linear-gradient(135deg, #2a1520, #1a1015)",
    border: "5px solid #DB7093",
    borderRadius: "20px",
    padding: "45px 35px",
    textAlign: "center",
    boxShadow: "0 40px 120px rgba(219,112,147,0.8)"
  },
  lockTitle: {
    fontSize: "2.2rem",
    fontWeight: "bold",
    color: "#FFB6C1",
    marginBottom: "35px",
    letterSpacing: "3px",
    textShadow: "0 0 30px rgba(255,182,193,0.8)",
    fontFamily: "'Noto Serif', Georgia, serif"
  },
  wheelContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "28px",
    marginBottom: "35px"
  },
  wheelWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px"
  },
  wheelBtn: {
    width: "55px",
    height: "45px",
    background: "linear-gradient(135deg, rgba(219,112,147,0.8), rgba(199,21,133,0.8))",
    border: "3px solid #8B4789",
    color: "#FFF",
    fontSize: "1.3rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    fontFamily: "'Noto Sans', Arial, sans-serif"
  },
  wheel: {
    width: "75px",
    height: "130px",
    background: "linear-gradient(135deg, #1a1015, #0f0a0d)",
    border: "4px solid #DB7093",
    borderRadius: "12px",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "inset 0 0 20px rgba(0,0,0,0.8)"
  },
  wheelChar: {
    position: "absolute",
    color: "#FFB6C1",
    transition: "all 0.3s ease",
    textShadow: "0 0 15px rgba(255,182,193,0.6)",
    fontFamily: "'Noto Sans', Arial, sans-serif"
  },
  unlockBtn: {
    width: "100%",
    padding: "18px",
    fontSize: "1.4rem",
    fontWeight: "bold",
    background: "linear-gradient(135deg, #DB7093, #C71585)",
    color: "#FFF",
    border: "4px solid #8B4789",
    borderRadius: "12px",
    cursor: "pointer",
    marginBottom: "18px",
    transition: "all 0.3s ease",
    fontFamily: "'Noto Sans', Arial, sans-serif",
    letterSpacing: "2px",
    boxShadow: "0 8px 30px rgba(219,112,147,0.6)"
  },
  cancelBtn: {
    width: "100%",
    padding: "14px",
    fontSize: "1.1rem",
    background: "transparent",
    color: "#FFB6C1",
    border: "3px solid rgba(219,112,147,0.5)",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontFamily: "'Noto Sans', Arial, sans-serif"
  },

  winBox: {
    textAlign: "center",
    position: "relative",
    maxWidth: "700px"
  },
  winTitle: {
    fontSize: "4rem",
    color: "#FF69B4",
    textShadow: "0 0 60px rgba(255,105,180,0.9)",
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
  winSubtext: {
    fontSize: "1.3rem",
    color: "#FFB6C1",
    fontFamily: "'Noto Serif', Georgia, serif"
  },

  loseBox: {
    textAlign: "center"
  },
  loseTitle: {
    fontSize: "4rem",
    color: "#DC143C",
    textShadow: "0 0 60px rgba(220,20,60,0.9)",
    marginBottom: "30px",
    fontFamily: "'Noto Serif', Georgia, serif"
  },
  loseSubtext: {
    fontSize: "1.2rem",
    color: "#FFB6C1",
    marginBottom: "40px",
    fontFamily: "'Noto Serif', Georgia, serif"
  },
  retryBtn: {
    background: "linear-gradient(135deg, rgba(219,112,147,0.9), rgba(199,21,133,0.9))",
    border: "3px solid rgba(219,112,147,0.8)",
    color: "#fff",
    padding: "18px 50px",
    fontSize: "1.3rem",
    cursor: "pointer",
    borderRadius: "12px",
    fontWeight: "bold",
    letterSpacing: "2px",
    boxShadow: "0 10px 35px rgba(219,112,147,0.7)",
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
  
  .closeNote:hover, .closeBoardBtn:hover {
    transform: rotate(90deg) scale(1.1);
  }
  
  .continueBtn:hover {
    box-shadow: 0 15px 50px rgba(219,112,147,1);
    background: linear-gradient(135deg, #FF69B4, #FF1493);
  }
  
  .unlockBtn:hover {
    box-shadow: 0 12px 40px rgba(219,112,147,0.9);
    background: linear-gradient(135deg, #FF69B4, #FF1493);
  }
  
  .wheelBtn:hover {
    background: linear-gradient(135deg, rgba(255,105,180,0.9), rgba(255,20,147,0.9));
  }
  
  .cancelBtn:hover {
    border-color: rgba(219,112,147,0.8);
    color: #DB7093;
  }
  
  .retryBtn:hover {
    background: linear-gradient(135deg, rgba(255,105,180,1), rgba(255,20,147,1));
  }
  
  *::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  
  *::-webkit-scrollbar-track {
    background: rgba(0,0,0,0.3);
    border-radius: 10px;
  }
  
  *::-webkit-scrollbar-thumb {
    background: rgba(219,112,147,0.6);
    border-radius: 10px;
  }
  
  *::-webkit-scrollbar-thumb:hover {
    background: rgba(219,112,147,0.8);
  }
`;
document.head.appendChild(styleSheet);