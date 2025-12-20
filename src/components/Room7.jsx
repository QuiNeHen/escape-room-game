import React, { useState, useEffect, useRef } from "react";

// ========== IMPORT CÁC HÌNH ẢNH TẠI ĐÂY ==========
import posterImg from "../Img/BPQ CÔNG TY TÀI CHÍNH.png"
import roomBg7 from "../Img/room7.png"  // Nền phòng
// import doorImg7 from "../Img/lock7.png"  // Cửa
import lockImg7 from "../Img/lock7.png"  // Ổ khóa trên cửa
import frameImg7 from "../Img/BPQ CÔNG TY TÀI CHÍNH.png"  // Khung tranh

// Placeholder
const roomBg = roomBg7;  // Uncomment khi có ảnh
// const doorImg = doorImg7;  // Uncomment khi có ảnh
const lockImg = lockImg7;  // Uncomment khi có ảnh
const frameImg = frameImg7;  // Uncomment khi có ảnh
const posterUrl = posterImg;

export default function Room7({ onComplete }) {
  const [stage, setStage] = useState("intro");
  const [posterOpen, setPosterOpen] = useState(false);
  const [lockOpen, setLockOpen] = useState(false);
  const [password, setPassword] = useState(["", "", ""]);
  const [hovered, setHovered] = useState(null);
  const [isWrong, setIsWrong] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const audioRef = useRef(null);

  const correctPassword = "245";

  useEffect(() => {
    if (stage === "room" && audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(() => {});
    }
  }, [stage]);

  const handleNumberClick = (num) => {
    const emptyIndex = password.findIndex(d => d === "");
    if (emptyIndex !== -1) {
      const newPassword = [...password];
      newPassword[emptyIndex] = num.toString();
      setPassword(newPassword);
    }
  };

  const handleBackspace = () => {
    for (let i = password.length - 1; i >= 0; i--) {
      if (password[i] !== "") {
        const newPassword = [...password];
        newPassword[i] = "";
        setPassword(newPassword);
        break;
      }
    }
  };

  const handlePasswordSubmit = () => {
    const enteredPassword = password.join("");
    if (enteredPassword === correctPassword) {
      setIsCorrect(true);
      setTimeout(() => {
        setLockOpen(false);
        setTimeout(() => {
          setStage("win");
          audioRef.current?.pause();
          setTimeout(() => onComplete?.(), 3000);
        }, 500);
      }, 1000);
    } else {
      setIsWrong(true);
      setTimeout(() => {
        setIsWrong(false);
        setPassword(["", "", ""]);
      }, 1500);
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
            <h2 style={styles.introTitle}>PHÒNG 7 - POSTER KÌ LẠ</h2>
            <p style={styles.storyText}>Bạn bước vào một căn phòng làm việc...</p>
            <p style={styles.storyText}>Trên tường có một tấm poster bí ẩn.</p>
            <p style={styles.storyText}>Cửa phòng có ổ khóa số...</p>
            <button style={styles.continueBtn} onClick={() => setStage("room")}>
              ĐIỀU TRA →
            </button>
          </div>
        </div>
      )}

      {stage === "room" && (
        <>
          <div style={styles.roomContainer}>
            {/* HÌNH NỀN PHÒNG */}
            <div style={{
              ...styles.roomBg,
              backgroundImage: roomBg ? `url(${roomBg})` : 'none'
            }}></div>

            <div style={styles.fog}></div>
            <div style={styles.vignette}></div>

            {/* ========== CỬA VÀ Ổ KHÓA ========== */}
            <div style={styles.doorWrapper}>
              <div 
                style={{
                  ...styles.doorImage,
                  // backgroundImage: doorImg ? `url(${doorImg})` : 'none',
                  // backgroundColor: doorImg ? 'transparent' : '#f5e6d3'
                }}
              >
                {/* {!doorImg && <div style={{color: '#999', fontSize: '14px'}}>Cửa (Import hình)</div>} */}
              </div>
              
              {/* Ổ KHÓA */}
              <div 
                style={{
                  ...styles.lockOnDoor,
                  backgroundImage: lockImg ? `url(${lockImg})` : 'none',
                  backgroundColor: lockImg ? 'transparent' : 'rgba(255,140,0,0.9)',
                  opacity: isCorrect ? 0 : 1,
                  cursor: "pointer",
                  filter: isWrong
                    ? "brightness(1.3) drop-shadow(0 0 50px rgba(255,0,0,1))"
                    : isCorrect
                    ? "brightness(1.3) drop-shadow(0 0 50px rgba(0,255,0,1))"
                    : hovered === "lock" 
                    ? "brightness(1.3) drop-shadow(0 0 40px rgba(255,140,0,0.9))" 
                    : "brightness(1)",
                  transform: hovered === "lock" ? "scale(1.1)" : "scale(1)",
                  transition: "all 0.3s ease"
                }}
                onClick={() => !isCorrect && setLockOpen(true)}
                onMouseEnter={() => setHovered("lock")}
                onMouseLeave={() => setHovered(null)}
              >
                {!lockImg && <div style={{fontSize: '2rem'}}>🔒</div>}
              </div>
            </div>

            {/* ========== KHUNG TRANH POSTER ========== */}
            <div
              style={{
                ...styles.posterFrame,
                backgroundImage: frameImg ? `url(${frameImg})` : 'none',
                backgroundColor: frameImg ? 'transparent' : '#d4a574',
                filter: hovered === "poster" ? "brightness(1.2) drop-shadow(0 0 40px rgba(255,140,0,0.8))" : "brightness(1)",
                transform: hovered === "poster" ? "scale(1.05)" : "scale(1)",
                transition: "all 0.3s ease"
              }}
              onClick={() => setPosterOpen(true)}
              onMouseEnter={() => setHovered("poster")}
              onMouseLeave={() => setHovered(null)}
            >
              {!frameImg && <div style={{fontSize: '4rem'}}>🖼️</div>}
            </div>
          </div>

          {/* ========== MODAL POSTER ========== */}
          {posterOpen && (
            <div style={styles.posterModal} onClick={() => setPosterOpen(false)}>
              <div style={styles.posterFullscreen} onClick={e => e.stopPropagation()}>
                <button style={styles.closePosterBtn} onClick={() => setPosterOpen(false)}>✕</button>
                <img 
                  src={posterUrl} 
                  alt="Poster" 
                  style={styles.posterImage}
                />
              </div>
            </div>
          )}

          {/* ========== MODAL NHẬP MẬT KHẨU (REDESIGNED) ========== */}
          {lockOpen && (
            <div style={styles.lockModal} onClick={() => setLockOpen(false)}>
              <div style={styles.lockPanel} onClick={e => e.stopPropagation()}>
                <button style={styles.closeLockBtn} onClick={() => setLockOpen(false)}>✕</button>
                
                <div style={styles.lockPanelHeader}>
                  {/* <div style={styles.lockPanelIcon}>🔐</div> */}
                  <div style={styles.lockPanelTitle}>NHẬP MÃ BẢO MẬT</div>
                </div>

                {/* Màn hình hiển thị 3 số */}
                <div style={styles.passwordDisplay}>
                  {[0, 1, 2].map((index) => (
                    <div 
                      key={index} 
                      style={{
                        ...styles.digitBox,
                        background: password[index] 
                          ? "linear-gradient(135deg, #ff8c00 0%, #ff6b00 100%)"
                          : "linear-gradient(135deg, #2a2520 0%, #1a1510 100%)",
                        border: isCorrect 
                          ? "4px solid rgba(0,255,0,0.9)"
                          : isWrong
                          ? "4px solid rgba(255,0,0,0.9)"
                          : password[index]
                          ? "4px solid rgba(255,140,0,0.8)"
                          : "4px solid rgba(255,140,0,0.3)",
                        boxShadow: isCorrect
                          ? "0 0 30px rgba(0,255,0,0.8), inset 0 2px 10px rgba(0,0,0,0.5)"
                          : isWrong
                          ? "0 0 30px rgba(255,0,0,0.8), inset 0 2px 10px rgba(0,0,0,0.5)"
                          : password[index]
                          ? "0 0 25px rgba(255,140,0,0.6), inset 0 2px 10px rgba(0,0,0,0.5)"
                          : "0 0 15px rgba(255,140,0,0.3), inset 0 2px 10px rgba(0,0,0,0.5)",
                        color: password[index] ? "#fff" : "#666",
                        textShadow: password[index] ? "0 0 10px rgba(255,255,255,0.8)" : "none"
                      }}
                    >
                      {password[index] || "•"}
                    </div>
                  ))}
                </div>

                {/* Bàn phím số */}
                <div style={styles.numberPadContainer}>
                  <div style={styles.numberPad}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                      <button
                        key={num}
                        style={styles.numberButton}
                        onClick={() => handleNumberClick(num)}
                      >
                        {num}
                      </button>
                    ))}
                    <button
                      style={{...styles.numberButton, gridColumn: "2"}}
                      onClick={() => handleNumberClick(0)}
                    >
                      0
                    </button>
                  </div>
                  
                  {/* Nút xóa và OK */}
                  <div style={styles.controlButtons}>
                    <button style={styles.backspaceBtn} onClick={handleBackspace}>
                      XÓA
                    </button>
                    <button 
                      style={{
                        ...styles.submitBtn,
                        opacity: password.every(d => d !== "") ? 1 : 0.5,
                        cursor: password.every(d => d !== "") ? "pointer" : "not-allowed"
                      }} 
                      onClick={handlePasswordSubmit}
                      disabled={!password.every(d => d !== "")}
                    >
                      XÁC NHẬN
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {stage === "win" && (
        <div style={styles.screen}>
          <div style={styles.winBox}>
            <h1 style={styles.winTitle}>MỞ KHÓA THÀNH CÔNG!</h1>
            <p style={styles.winText}>
              {/* Bạn đã tìm ra mật khẩu từ poster! */}
            </p>
            <div style={styles.secretMessage}>
              {correctPassword}
            </div>
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
    fontFamily: "'Noto Serif', Georgia, serif",
    position: "relative",
    userSelect: "none",
    background: "#000"
  },
  roomContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
    overflow: "hidden"
  },
  roomBg: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(180deg, #1a1410 0%, #2a1f18 30%, #1f1812 60%, #0f0a08 100%)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    zIndex: 1
  },
  fog: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(ellipse at 50% 80%, rgba(255,140,0,0.15) 0%, transparent 60%)",
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
  
  // ========== Ổ KHÓA (KHÔNG CÒN CỬA - CHỈ CÓ Ổ KHÓA) ==========
  doorWrapper: {
    position: "fixed",
    top: "43vh",
    left: "85%",
    transform: "translateX(-50%)",
    width: "100%",
    height: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10
  },
  // doorImage: {
  //   display: "none" // Xóa hình cửa
  // },
  
  // ========== Ổ KHÓA TO HƠN + DIỆN TÍCH RỘNG ==========
  lockOnDoor: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "18vw",
    height: "18vw",
    minWidth: "80px",
    minHeight: "80px",
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    transition: "all 0.3s ease",
    zIndex: 20
  },
  
  // ========== KHUNG TRANH TO HƠN + CÓ VIỀN ==========
  posterFrame: {
    position: "fixed",
    top: "20%",
    left: "10%",
    width: "20vw",      // ← TĂNG từ 15vw lên 22vw
    height: "60vh",     // ← TĂNG từ 22vh lên 32vh
    minWidth: "200px",  // ← TĂNG từ 120px lên 200px
    minHeight: "250px", // ← TĂNG từ 160px lên 250px
    backgroundSize: "cover", // ← Đổi từ contain sang cover
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "12px",
    border: "8px solid #8b6f47", // ← THÊM VIỀN NÂU CAM
    boxShadow: "0 8px 25px rgba(0,0,0,0.7), inset 0 0 30px rgba(255,140,0,0.1)", // ← Shadow đẹp hơn
    zIndex: 7
  },
  
  screen: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#d4a574",
    animation: "fadeIn 0.8s ease-in",
    zIndex: 100
  },
  storyBox: {
    maxWidth: "700px",
    textAlign: "center",
    padding: "40px",
    background: "rgba(20, 15, 10, 0.95)",
    border: "4px solid rgba(255,140,0,0.6)",
    borderRadius: "15px",
    boxShadow: "0 25px 80px rgba(0,0,0,0.95)"
  },
  introTitle: {
    fontSize: "2.5rem",
    color: "#ff8c00",
    marginBottom: "30px",
    textShadow: "0 0 35px rgba(255, 140, 0, 0.8)"
  },
  storyText: {
    fontSize: "1.3rem",
    lineHeight: "2",
    marginBottom: "20px",
    color: "#d4a574"
  },
  continueBtn: {
    marginTop: "30px",
    background: "linear-gradient(135deg, rgba(255,140,0,0.8), rgba(255,100,0,0.9))",
    border: "3px solid rgba(255,140,0,0.8)",
    color: "#fff",
    padding: "16px 45px",
    fontSize: "1.2rem",
    cursor: "pointer",
    borderRadius: "10px",
    transition: "all 0.3s ease",
    fontWeight: "bold",
    fontFamily: "Arial, sans-serif"
  },
  posterModal: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.96)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
    backdropFilter: "blur(12px)"
  },
  posterFullscreen: {
    position: "relative",
    maxWidth: "90%",
    maxHeight: "90vh",
    background: "linear-gradient(135deg, #3a2f25 0%, #2a1f18 100%)",
    padding: "20px",
    borderRadius: "15px",
    border: "6px solid rgba(255,140,0,0.6)",
    boxShadow: "0 30px 100px rgba(0,0,0,0.98)"
  },
  closePosterBtn: {
    position: "absolute",
    top: "10px",
    right: "10px",
    width: "40px",
    height: "40px",
    background: "linear-gradient(135deg, rgba(255,140,0,0.8), rgba(255,100,0,0.9))",
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
  posterImage: {
    maxWidth: "100%",
    maxHeight: "80vh",
    display: "block",
    borderRadius: "8px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.9)"
  },
  lockModal: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.96)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3000,
    backdropFilter: "blur(12px)"
  },
  lockPanel: {
    background: "linear-gradient(135deg, #3a2f25 0%, #2a1f18 50%, #1a1410 100%)",
    border: "6px solid rgba(255,140,0,0.6)",
    borderRadius: "20px",
    padding: "35px",
    maxWidth: "450px",
    width: "90%",
    boxShadow: "0 30px 100px rgba(0,0,0,0.98)",
    position: "relative"
  },
  closeLockBtn: {
    position: "absolute",
    top: "15px",
    right: "15px",
    width: "35px",
    height: "35px",
    background: "linear-gradient(135deg, rgba(255,140,0,0.8), rgba(255,100,0,0.9))",
    border: "3px solid #000",
    borderRadius: "50%",
    color: "#fff",
    fontSize: "1.3rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    fontFamily: "Arial, sans-serif"
  },
  lockPanelHeader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "25px"
  },
  lockPanelIcon: {
    fontSize: "3rem",
    marginBottom: "10px",
    filter: "drop-shadow(0 0 20px rgba(255,140,0,0.8))"
  },
  lockPanelTitle: {
    fontSize: "1.5rem",
    color: "#f5e6d3",
    fontWeight: "bold",
    textAlign: "center",
    textShadow: "0 0 20px rgba(255,140,0,0.6)",
    fontFamily: "Arial, sans-serif"
  },
  passwordDisplay: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginBottom: "30px"
  },
  digitBox: {
    width: "70px",
    height: "90px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2.5rem",
    fontFamily: "monospace",
    fontWeight: "bold",
    transition: "all 0.3s ease"
  },
  numberPadContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  numberPad: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
    justifyContent: "center"
  },
  numberButton: {
    width: "75px",
    height: "65px",
    background: "linear-gradient(135deg, #d4a574 0%, #b8935e 100%)",
    border: "3px solid #a67c52",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "1.6rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontFamily: "Arial, sans-serif",
    boxShadow: "0 5px 15px rgba(0,0,0,0.8), inset 0 1px 3px rgba(255,255,255,0.3)"
  },
  controlButtons: {
    display: "flex",
    gap: "10px"
  },
  backspaceBtn: {
    flex: 1,
    height: "55px",
    background: "linear-gradient(135deg, #8b6f47 0%, #6b5739 100%)",
    border: "3px solid #5a4830",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontFamily: "Arial, sans-serif",
    boxShadow: "0 5px 15px rgba(0,0,0,0.8)"
  },
  submitBtn: {
    flex: 1,
    height: "55px",
    background: "linear-gradient(135deg, rgba(255,140,0,0.9), rgba(255,100,0,1))",
    border: "3px solid rgba(255,120,0,0.9)",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontFamily: "Arial, sans-serif",
    boxShadow: "0 5px 15px rgba(0,0,0,0.8), inset 0 1px 3px rgba(255,255,255,0.3)"
  },
  winBox: {
    textAlign: "center",
    maxWidth: "700px"
  },
  winTitle: {
    fontSize: "4rem",
    color: "#ff8c00",
    textShadow: "0 0 60px rgba(255,140,0,0.9)",
    marginBottom: "30px",
    animation: "bounce 1s ease infinite"
  },
  winText: {
    fontSize: "1.6rem",
    marginBottom: "25px",
    color: "#d4a574"
  },
  secretMessage: {
    fontSize: "3rem",
    color: "#ff8c00",
    fontWeight: "bold",
    textShadow: "0 0 50px rgba(255,140,0,1)",
    marginBottom: "20px",
    padding: "25px",
    background: "rgba(255,140,0,0.1)",
    border: "4px solid rgba(255,140,0,0.6)",
    borderRadius: "15px",
    letterSpacing: "8px",
    fontFamily: "Arial, sans-serif"
  },
  winSubtext: {
    fontSize: "1.3rem",
    color: "#d4a574",
    marginBottom: "15px"
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
  @keyframes fogMove {
    0%, 100% { transform: translateX(0) scale(1); }
    50% { transform: translateX(20px) scale(1.05); }
  }
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }
  @keyframes twinkle {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.3; transform: scale(0.9); }
  }
  
  .continueBtn:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 40px rgba(255,140,0,0.9);
  }
  
  .closePosterBtn:hover, .closeLockBtn:hover {
    transform: scale(1.15);
    background: linear-gradient(135deg, rgba(255,160,0,0.9), rgba(255,120,0,1));
  }
  
  .numberButton:hover {
    transform: scale(1.08);
    background: linear-gradient(135deg, #e0b080 0%, #c49d6a 100%);
    box-shadow: 0 7px 20px rgba(0,0,0,0.9), inset 0 1px 5px rgba(255,255,255,0.4);
  }
  
  .numberButton:active {
    transform: scale(0.95);
  }
  
  .backspaceBtn:hover {
    background: linear-gradient(135deg, #9b7f57 0%, #7b6549 100%);
    transform: scale(1.05);
  }
  
  .submitBtn:hover:not(:disabled) {
    background: linear-gradient(135deg, rgba(255,160,0,1), rgba(255,120,0,1));
    transform: scale(1.05);
    box-shadow: 0 7px 20px rgba(255,140,0,0.6), inset 0 1px 5px rgba(255,255,255,0.4);
  }
`;
document.head.appendChild(styleSheet);