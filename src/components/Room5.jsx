import React, { useState, useEffect, useRef } from "react";

export default function Room5({ onComplete }) {
  const [stage, setStage] = useState("intro");
  const [noteOpen, setNoteOpen] = useState(false);
  const [selectedCells, setSelectedCells] = useState({});
  const [hovered, setHovered] = useState(null);
  const [isWrong, setIsWrong] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const audioRef = useRef(null);

  // Đáp án đúng: grid1=(3,4), grid2=(2,3), grid3=(3,4), grid4=(5,4)
  const correctAnswer = {
    1: { row: 3, col: 3 }, // HẾT (index 0-based)
    2: { row: 1, col: 2 }, // DÁM
    3: { row: 2, col: 3 }, // YÊU
    4: { row: 4, col: 3 }  // AI
  };

  // 4 lưới 6x6, mỗi ô có chữ
  const grids = [
    {
      id: 1,
      cells: [
        ["MỘT", "HAI", "BA", "BỐN", "NĂM", "SÁU"],
        ["BẢY", "VỊ", "TÁM", "CHÍN", "MƯỜI", "CAM"],
        ["KIA", "ĐÂY", "NÀY", "ĐỂ", "KHI", "NÀO"],
        ["ĐÃ", "VẪN", "CHƯA", "HẾT", "LÀM", "SAO"],
        ["NHƯ", "THẾ", "VỊ", "SAO", "CÒN", "VẬY"],
        ["NỮA", "RỒI", "ĐI", "ĐẾN", "LẠI", "CAM"]
      ]
    },
    {
      id: 2,
      cells: [
        ["LÀ", "ĐƯỢC", "DÂY", "KHÔNG", "CÓ", "NÓ"],
        ["VỊ", "HỌ", "DÁM", "ĐẤY", "MÀ", "DỨA"],
        ["GÌ", "ĐÂU", "KHÔ", "VỀ", "THÔI", "NHÉ"],
        ["PHẢI", "CHỈ", "CHANH", "MỚI", "CŨ", "HAY"],
        ["THÌ", "ĐÓ", "VỊ", "HẾT", "SAY", "VÀ"],
        ["HƠN", "NHÉ", "NẾU", "NHƯ", "THẾ", "TỐT"]
      ]
    },
    {
      id: 3,
      cells: [
        ["CÁI", "NÀY", "KHI", "NÀO", "VẬY", "TÁO"],
        ["THẾ", "VỊ", "NÀO", "ĐÂY", "KIA", "MÀ"],
        ["LÀM", "SAO", "ĐI", "YÊU", "ĐỂ", "VỀ"],
        ["NÓI", "GÌ", "THẾ", "NHỈ", "VẬY", "XANH"],
        ["HẢ", "HỞ", "ĐÓ", "ĐÂU", "NÓ", "CÒN"],
        ["CHỨ", "RỒI", "SAO", "LẠI", "THÌ", "ĐẤY"]
      ]
    },
    {
      id: 4,
      cells: [
        ["THẾ", "NÀO", "VẬY", "HẢ", "NÓI", "GÌ"],
        ["ĐÓ", "MÀ", "CHỨ", "SAO", "LẠI", "THÌ"],
        ["CÁI", "KHI", "NÀO", "ĐÃ", "RỒI", "KIA"],
        ["LÀ", "VỊ", "ĐƯỢC", "KHÔNG", "VỊ", "CÓ"],
        ["HỌ", "ĐẤY", "MỚI", "AI", "CŨ", "HAY"],
        ["PHẢI", "CHỈ", "NHO", "MÀ", "VÀ", "NHO"]
      ]
    }
  ];

  const noteContent = `GHI CHÚ VỀ NGƯỜI CHỦ CŨ

Tôi phát hiện người chủ cũ của căn phòng này có sở thích kỳ lạ về nước ép trái cây.

Người đó đã ghi chú:

"Tôi thích uống nước ép trái cây mỗi ngày:

- Thứ Hai: Nước ép VỊ CAM
- Thứ Ba: Nước ép VỊ DỨA CHANH DÂY 
- Thứ Tư: Nước ép TÁO XANH
- Thứ Năm: Nước ép VỊ NHO
`;

  useEffect(() => {
    if (stage === "room" && audioRef.current) {
      audioRef.current.volume = 0.25;
      audioRef.current.play().catch(() => {});
    }
  }, [stage]);

  const handleCellClick = (gridId, row, col) => {
    setSelectedCells(prev => ({
      ...prev,
      [gridId]: { row, col }
    }));
  };

  const handleKeyDown = (e, gridId) => {
    if (!selectedCells[gridId]) {
      setSelectedCells(prev => ({ ...prev, [gridId]: { row: 0, col: 0 } }));
      return;
    }

    const current = selectedCells[gridId];
    let newRow = current.row;
    let newCol = current.col;

    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        newRow = Math.max(0, current.row - 1);
        break;
      case "ArrowDown":
        e.preventDefault();
        newRow = Math.min(5, current.row + 1);
        break;
      case "ArrowLeft":
        e.preventDefault();
        newCol = Math.max(0, current.col - 1);
        break;
      case "ArrowRight":
        e.preventDefault();
        newCol = Math.min(5, current.col + 1);
        break;
      default:
        return;
    }

    setSelectedCells(prev => ({
      ...prev,
      [gridId]: { row: newRow, col: newCol }
    }));
  };

  useEffect(() => {
    // Kiểm tra tự động khi đủ 4 ô
    if (Object.keys(selectedCells).length === 4) {
      const checkCorrect = Object.keys(correctAnswer).every(gridId => {
        const selected = selectedCells[gridId];
        const correct = correctAnswer[gridId];
        return selected && selected.row === correct.row && selected.col === correct.col;
      });

      if (checkCorrect) {
        setIsCorrect(true);
        setIsWrong(false);
        setTimeout(() => {
          setStage("win");
          audioRef.current?.pause();
          setTimeout(() => onComplete?.(), 3000);
        }, 1500);
      } else {
        setIsWrong(true);
        setIsCorrect(false);
        setTimeout(() => {
          setIsWrong(false);
        }, 1500);
      }
    } else {
      if (!isCorrect) {
        setIsWrong(false);
      }
    }
  }, [selectedCells]);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (stage === "room" && !noteOpen) {
        // Xử lý phím cho grid đầu tiên có selection
        const firstGridWithSelection = grids.find(g => selectedCells[g.id]);
        if (firstGridWithSelection) {
          handleKeyDown(e, firstGridWithSelection.id);
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [stage, noteOpen, selectedCells]);

  return (
    <div style={styles.container}>
      <audio ref={audioRef} loop>
        <source src="https://assets.mixkit.co/sfx/preview/mixkit-creepy-ambience-1099.mp3" type="audio/mpeg" />
      </audio>

      {stage === "intro" && (
        <div style={styles.screen}>
          <div style={styles.storyBox}>
            <h2 style={styles.introTitle}>PHÒNG 5 - MÃ HÓA BÍ ẨN</h2>
            <p style={styles.storyText}>Bạn bước vào một căn phòng lạ lẫm...</p>
            <p style={styles.storyText}>Trên tường có 4 bảng lưới chữ cái khổng lồ.</p>
            <p style={styles.storyText}>Một tờ giấy note nằm trên bàn...</p>
            <p style={styles.storyText}>Liệu đây có phải là chìa khóa để thoát ra?</p>
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

            {/* Chains */}
            <div style={{...styles.chains, top: "5%", left: "5%"}}>⛓️</div>
            <div style={{...styles.chains, top: "5%", right: "5%"}}>⛓️</div>

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
                filter: isWrong
                  ? "brightness(1.3) drop-shadow(0 0 100px rgba(255,0,0,0.9))"
                  : isCorrect
                  ? "brightness(1.3) drop-shadow(0 0 100px rgba(0,255,0,0.9))"
                  : "brightness(0.7)",
                transition: "all 0.5s ease"
              }}
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
                <div style={{
                  ...styles.doorLock,
                  opacity: isCorrect ? 0 : 1,
                  animation: isWrong
                    ? "shake 0.5s ease"
                    : isCorrect
                    ? "unlocking 1s ease-out"
                    : "none"
                }}>
                  <div style={styles.lockShackle}></div>
                  <div style={styles.lockBody}>
                    <div style={styles.lockKeyhole}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 lưới chữ nằm ngang */}
            <div style={styles.gridsContainer}>
              {grids.map((grid) => {
                const selected = selectedCells[grid.id];
                
                return (
                  <div key={grid.id} style={styles.gridWrapper}>
                    <div style={styles.grid}>
                      {grid.cells.map((row, rowIndex) => (
                        <div key={rowIndex} style={styles.gridRow}>
                          {row.map((cell, colIndex) => (
                            <div
                              key={colIndex}
                              style={styles.gridCell}
                              onClick={() => handleCellClick(grid.id, rowIndex, colIndex)}
                            >
                              {cell}
                            </div>
                          ))}
                        </div>
                      ))}
                      
                      {/* Khung chọn - chỉ hiện khi có selection */}
                      {selected && (
                        <div
                          style={{
                            ...styles.selector,
                            top: `${selected.row * (100 / 6)}%`,
                            left: `${selected.col * (100 / 6)}%`,
                            width: `${100 / 6}%`,
                            height: `${100 / 6}%`
                          }}
                        >
                          <div style={styles.selectorInner}></div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Hướng dẫn */}
            {/* <div style={styles.instruction}>
              💡 Click vào ô để chọn • Phím mũi tên để di chuyển
            </div> */}

            {/* Note ở góc trái dưới */}
            <div style={styles.noteWrapper}>
              <div style={styles.noteShadow}></div>
              <div
                style={{
                  ...styles.noteIcon,
                  transform: hovered === "note" ? "scale(1.15) rotate(5deg)" : "scale(1)",
                  filter: hovered === "note"
                    ? "brightness(1.4) drop-shadow(0 0 40px rgba(139,0,0,0.9))"
                    : "drop-shadow(0 8px 25px rgba(139,0,0,0.8))"
                }}
                onClick={() => setNoteOpen(true)}
                onMouseEnter={() => setHovered("note")}
                onMouseLeave={() => setHovered(null)}
              >
                📄
              </div>
            </div>
          </div>

          {/* Modal giấy note */}
          {noteOpen && (
            <div style={styles.noteModal} onClick={() => setNoteOpen(false)}>
              <div style={styles.notePanel} onClick={e => e.stopPropagation()}>
                <button style={styles.closeBtn} onClick={() => setNoteOpen(false)}>✕</button>
                <h3 style={styles.noteTitle}>📋 GHI CHÚ ĐIỀU TRA</h3>
                <pre style={styles.noteText}>{noteContent}</pre>
              </div>
            </div>
          )}
        </>
      )}

      {stage === "win" && (
        <div style={styles.screen}>
          <div style={styles.winBox}>
            <h1 style={styles.winTitle}>🎉 GIẢI MÃ THÀNH CÔNG!</h1>
            {/* <p style={styles.winText}>
              Bạn đã tìm ra thông điệp ẩn:
            </p>
            <div style={styles.secretMessage}>
              HẾT DÁM YÊU AI
            </div> */}
            <p style={styles.winSubtext}>Cửa đã mở... Bạn có thể tiếp tục hành trình!</p>
            <div style={styles.sparkles}>✨ 🔓 ✨ 🔓 ✨</div>
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
  chains: {
    position: "absolute",
    fontSize: "1.8rem",
    color: "#333",
    opacity: 0.3,
    textShadow: "0 2px 8px rgba(0,0,0,0.9)",
    animation: "swing 3s ease-in-out infinite",
    zIndex: 6
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
    background: "radial-gradient(circle, rgba(139,0,0,0.15), transparent 70%)",
    position: "absolute",
    bottom: "-60px",
    left: "50%",
    transform: "translateX(-50%)",
    animation: "lightFlicker 4s ease-in-out infinite",
    pointerEvents: "none"
  },
  doorWrapper: {
    position: "absolute",
    top: "10%",
    right: "3%",
    zIndex: 10
  },
  doorFrame: {
    position: "absolute",
    width: "140px",
    height: "200px",
    top: "-10px",
    left: "-10px",
    zIndex: -1
  },
  doorFrameTop: {
    position: "absolute",
    left: "0",
    top: "0",
    width: "100%",
    height: "10px",
    background: "linear-gradient(to bottom, #000 0%, #0a0a0a 60%, #1a1510 100%)",
    borderRadius: "6px 6px 0 0",
    boxShadow: "0 8px 25px rgba(0,0,0,0.95)"
  },
  doorFrameLeft: {
    position: "absolute",
    left: "0",
    top: "0",
    width: "10px",
    height: "80%",
    background: "linear-gradient(to right, #000 0%, #0a0a0a 60%, #1a1510 100%)",
    borderRadius: "6px 0 0 4px",
    boxShadow: "inset -5px 0 15px rgba(0,0,0,0.9)"
  },
  doorFrameRight: {
    position: "absolute",
    right: "0",
    top: "0",
    width: "10px",
    height: "80%",
    background: "linear-gradient(to left, #000 0%, #0a0a0a 60%, #1a1510 100%)",
    borderRadius: "0 6px 4px 0",
    boxShadow: "inset 5px 0 15px rgba(0,0,0,0.9)"
  },
  door3D: {
    position: "relative",
    width: "120px",
    height: "180px"
  },
  doorPanel: {
    position: "relative",
    width: "100%",
    height: "80%",
    background: "linear-gradient(135deg, #2a2520 0%, #1a1510 15%, #0f0a08 35%, #050302 50%, #0f0a08 65%, #1a1510 85%, #2a2520 100%)",
    border: "4px solid #1a1510",
    borderRadius: "8px 8px 2px 2px",
    boxShadow: "inset 0 3px 20px rgba(0,0,0,0.95), 0 12px 50px rgba(0,0,0,0.9)"
  },
  doorLine1: {
    position: "absolute",
    width: "calc(100% - 15px)",
    height: "2px",
    top: "38%",
    left: "8px",
    background: "linear-gradient(90deg, transparent, #0f0a08 20%, #0f0a08 80%, transparent)",
    opacity: 0.6
  },
  doorLine2: {
    position: "absolute",
    width: "2px",
    height: "calc(100% - 15px)",
    left: "50%",
    top: "8px",
    background: "linear-gradient(180deg, transparent, #0f0a08 20%, #0f0a08 80%, transparent)",
    opacity: 0.6
  },
  doorLock: {
    position: "absolute",
    top: "50%",
    left: "80%",
    transform: "translate(-50%, -50%)",
    transition: "all 0.4s ease",
    zIndex: 20
  },
  lockBody: {
    width: "22px",
    height: "30px",
    background: "linear-gradient(135deg, #3a3530 0%, #2a2520 15%, #1a1510 100%)",
    borderRadius: "5px",
    boxShadow: "inset 0 2px 8px rgba(0,0,0,0.9), 0 4px 15px rgba(0,0,0,0.9)",
    border: "2px solid #000",
    position: "relative"
  },
  lockShackle: {
    position: "absolute",
    width: "11px",
    height: "13px",
    top: "-11px",
    left: "50%",
    transform: "translateX(-50%)",
    border: "2px solid #3a3530",
    borderBottom: "none",
    borderRadius: "6px 6px 0 0",
    boxShadow: "inset 0 2px 6px rgba(0,0,0,0.9)"
  },
  lockKeyhole: {
    position: "absolute",
    width: "4px",
    height: "7px",
    background: "#000",
    borderRadius: "50% 50% 0 0",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    boxShadow: "inset 0 2px 6px rgba(0,0,0,1)"
  },
  gridsContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: "3500px",
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    zIndex: 7
  },
  gridWrapper: {
    background: "rgba(10,10,10,0.85)",
    border: "3px solid rgba(139,0,0,0.5)",
    borderRadius: "10px",
    padding: "10px",
    boxShadow: "0 12px 40px rgba(0,0,0,0.9)"
  },
  grid: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: "0"
  },
  gridRow: {
    display: "flex",
    gap: "0"
  },
  gridCell: {
    width: "calc(100% / 6)",
    aspectRatio: "1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.85rem",
    fontWeight: "bold",
    color: "#999",
    cursor: "pointer",
    transition: "all 0.2s ease",
    position: "relative",
    borderRadius: "0",
    fontFamily: "Arial, sans-serif",
    border: "1px solid rgba(139,0,0,0.15)",
    background: "rgba(20,20,20,0.6)"
  },
  selector: {
    position: "absolute",
    pointerEvents: "none",
    transition: "all 0.2s ease",
    zIndex: 10
  },
  selectorInner: {
    width: "100%",
    height: "100%",
    border: "4px solid #DC143C",
    borderRadius: "4px",
    boxShadow: "0 0 20px rgba(220,20,60,0.9), inset 0 0 15px rgba(220,20,60,0.4)",
    animation: "selectorPulse 1.5s ease-in-out infinite"
  },
  gridLabel: {
    textAlign: "center",
    fontSize: "0.75rem",
    color: "#666",
    marginTop: "5px",
    fontFamily: "Arial, sans-serif",
    fontWeight: "bold"
  },
  instruction: {
    position: "absolute",
    top: "8%",
    left: "50%",
    transform: "translateX(-50%)",
    background: "rgba(10,10,10,0.9)",
    border: "2px solid rgba(139,0,0,0.5)",
    borderRadius: "8px",
    padding: "8px 20px",
    fontSize: "0.9rem",
    color: "#999",
    textAlign: "center",
    boxShadow: "0 5px 20px rgba(0,0,0,0.8)",
    zIndex: 100,
    fontFamily: "Arial, sans-serif"
  },
  noteWrapper: {
    position: "absolute",
    bottom: "3%",
    left: "3%",
    zIndex: 50
  },
  noteShadow: {
    position: "absolute",
    width: "100px",
    height: "100px",
    background: "radial-gradient(ellipse, rgba(139,0,0,0.6) 0%, transparent 70%)",
    filter: "blur(15px)",
    top: "10px",
    left: "50%",
    transform: "translateX(-50%)"
  },
  noteIcon: {
    fontSize: "5rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
    filter: "drop-shadow(0 8px 25px rgba(139,0,0,0.8))",
    position: "relative"
  },
  noteModal: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.96)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
    backdropFilter: "blur(12px)"
  },
  notePanel: {
    background: "linear-gradient(135deg, #2a2520 0%, #1a1510 35%, #0f0a08 70%, #050302 100%)",
    border: "6px solid rgba(139,0,0,0.6)",
    borderRadius: "15px",
    padding: "40px",
    maxWidth: "650px",
    width: "90%",
    boxShadow: "0 30px 100px rgba(0,0,0,0.98)",
    position: "relative",
    maxHeight: "80vh",
    overflowY: "auto"
  },
  closeBtn: {
    position: "absolute",
    top: "15px",
    right: "15px",
    width: "38px",
    height: "38px",
    background: "linear-gradient(135deg, rgba(139,0,0,0.8), rgba(80,0,0,0.9))",
    border: "3px solid #000",
    borderRadius: "50%",
    color: "#fff",
    fontSize: "1.4rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    fontFamily: "Arial, sans-serif",
    zIndex: 10
  },
  noteTitle: {
    fontSize: "2rem",
    color: "#8B0000",
    textAlign: "center",
    marginBottom: "25px",
    textShadow: "0 0 25px rgba(139,0,0,0.8)",
    fontFamily: "Georgia, serif"
  },
  noteText: {
    fontSize: "1.2rem",
    color: "#c9b896",
    lineHeight: "2",
    whiteSpace: "pre-wrap",
    fontFamily: "Georgia, serif"
  },
  winBox: {
    textAlign: "center",
    maxWidth: "700px"
  },
  winTitle: {
    fontSize: "4rem",
    color: "#8B0000",
    textShadow: "0 0 60px rgba(139,0,0,0.9)",
    marginBottom: "30px",
    animation: "bounce 1s ease infinite"
  },
  winText: {
    fontSize: "1.6rem",
    marginBottom: "25px",
    color: "#999"
  },
  secretMessage: {
    fontSize: "3rem",
    color: "#8B0000",
    fontWeight: "bold",
    textShadow: "0 0 50px rgba(139,0,0,1)",
    marginBottom: "30px",
    padding: "25px",
    background: "rgba(139,0,0,0.1)",
    border: "4px solid rgba(139,0,0,0.6)",
    borderRadius: "15px",
    letterSpacing: "8px",
    fontFamily: "Arial, sans-serif"
  },
  winSubtext: {
    fontSize: "1.3rem",
    color: "#666",
    marginBottom: "20px"
  },
  sparkles: {
    fontSize: "2.5rem",
    marginTop: "30px",
    animation: "twinkle 1s ease-in-out infinite"
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
    10% { opacity: 0.2; }
    12% { opacity: 1; }
    50% { opacity: 0.8; }
    60% { opacity: 0.4; }
    62% { opacity: 1; }
    70% { opacity: 0.5; }
    72% { opacity: 1; }
  }
  @keyframes fogMove {
    0%, 100% { transform: translateX(0) scale(1); }
    50% { transform: translateX(20px) scale(1.05); }
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
    50% { opacity: 0.3; transform: scale(0.9); }
  }
  @keyframes unlocking {
    0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    50% { transform: translate(-50%, -50%) scale(1.5) rotate(180deg); opacity: 0.5; }
    100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
  }
  @keyframes shake {
    0%, 100% { transform: translate(-50%, -50%); }
    10%, 30%, 50%, 70%, 90% { transform: translate(-55%, -50%); }
    20%, 40%, 60%, 80% { transform: translate(-45%, -50%); }
  }
  @keyframes selectorPulse {
    0%, 100% { 
      border-color: #DC143C; 
      box-shadow: 0 0 20px rgba(220,20,60,0.9), inset 0 0 15px rgba(220,20,60,0.4);
    }
    50% { 
      border-color: #FF6347; 
      box-shadow: 0 0 35px rgba(255,99,71,1), inset 0 0 25px rgba(255,99,71,0.6);
    }
  }
  
  .continueBtn:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 40px rgba(139,0,0,0.9);
  }
  
  .closeBtn:hover {
    transform: rotate(90deg) scale(1.1);
    background: linear-gradient(135deg, rgba(180,0,0,0.9), rgba(120,0,0,0.95));
  }
  
  .gridCell:hover {
    background: rgba(139,0,0,0.2);
    transform: scale(1.05);
  }
`;
document.head.appendChild(styleSheet);