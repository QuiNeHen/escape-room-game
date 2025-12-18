import React, { useState, useEffect, useRef } from "react";
import posterImg from "../Img/BPQ CÔNG TY TÀI CHÍNH.png"

export default function Room7({ onComplete }) {
  const [stage, setStage] = useState("intro");
  const [posterOpen, setPosterOpen] = useState(false);
  const [lockOpen, setLockOpen] = useState(false);
  const [password, setPassword] = useState(["", "", ""]);
  const [hovered, setHovered] = useState(null);
  const [isWrong, setIsWrong] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const audioRef = useRef(null);

  const correctPassword = "245"; // Bạn có thể thay đổi mật khẩu đúng ở đây
  const posterUrl = posterImg; // Link poster sẽ thêm sau

  useEffect(() => {
    if (stage === "room" && audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(() => {});
    }
  }, [stage]);

  const handleNumberClick = (num) => {
    // Tìm ô trống đầu tiên để điền
    const emptyIndex = password.findIndex(d => d === "");
    if (emptyIndex !== -1) {
      const newPassword = [...password];
      newPassword[emptyIndex] = num.toString();
      setPassword(newPassword);
    }
  };

  const handleBackspace = () => {
    // Xóa số cuối cùng
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
            {/* <p style={styles.storyText}>Liệu poster có chứa manh mối?</p> */}
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

            {/* Cửa với ổ khóa */}
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
                
                {/* Ổ khóa 3 số */}
                <div 
                  style={{
                    ...styles.passwordLock,
                    opacity: isCorrect ? 0 : 1,
                    animation: isWrong
                      ? "shake 0.5s ease"
                      : isCorrect
                      ? "unlocking 1s ease-out"
                      : "none",
                    cursor: "pointer"
                  }}
                  onClick={() => !isCorrect && setLockOpen(true)}
                  onMouseEnter={() => setHovered("lock")}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div style={{
                    ...styles.lockScreen,
                    transform: hovered === "lock" ? "scale(1.1)" : "scale(1)",
                    boxShadow: hovered === "lock" 
                      ? "inset 0 2px 15px rgba(0,255,0,0.5), 0 8px 30px rgba(0,0,0,0.9)"
                      : "inset 0 2px 10px rgba(0,0,0,0.9), 0 4px 20px rgba(0,0,0,0.9)"
                  }}>
                    <div style={styles.lockIcon}>🔒</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bàn làm việc */}
            <div style={styles.desk}>
              <div style={styles.deskTop}></div>
              <div style={styles.deskLeg1}></div>
              <div style={styles.deskLeg2}></div>
            </div>

            {/* Poster trên tường */}
            <div
              style={{
                ...styles.posterFrame,
                transform: hovered === "poster" ? "scale(1.05)" : "scale(1)",
                boxShadow: hovered === "poster"
                  ? "0 20px 60px rgba(139,0,0,0.8)"
                  : "0 15px 50px rgba(139,0,0,0.5)"
              }}
              onClick={() => setPosterOpen(true)}
              onMouseEnter={() => setHovered("poster")}
              onMouseLeave={() => setHovered(null)}
            >
              <div style={styles.posterIcon}>🖼️</div>
            </div>
          </div>

          {/* Modal Poster */}
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

          {/* Modal nhập mật khẩu */}
          {lockOpen && (
            <div style={styles.lockModal} onClick={() => setLockOpen(false)}>
              <div style={styles.lockPanel} onClick={e => e.stopPropagation()}>
                <button style={styles.closeLockBtn} onClick={() => setLockOpen(false)}>✕</button>
                
                {/* Màn hình hiển thị 3 số */}
                <div style={styles.passwordDisplay}>
                  {[0, 1, 2].map((index) => (
                    <div 
                      key={index} 
                      style={{
                        ...styles.digitBox,
                        border: isCorrect 
                          ? "4px solid rgba(0,255,0,0.8)"
                          : isWrong
                          ? "4px solid rgba(255,0,0,0.8)"
                          : "4px solid rgba(0,255,0,0.3)",
                        boxShadow: isCorrect
                          ? "inset 0 4px 15px rgba(0,0,0,0.9), 0 0 30px rgba(0,255,0,0.8)"
                          : isWrong
                          ? "inset 0 4px 15px rgba(0,0,0,0.9), 0 0 30px rgba(255,0,0,0.8)"
                          : "inset 0 4px 15px rgba(0,0,0,0.9), 0 0 20px rgba(0,255,0,0.2)",
                        animation: isWrong ? "digitShake 0.5s ease" : "none"
                      }}
                    >
                      {password[index] || "_"}
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
                      NHẬP
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
            <h1 style={styles.winTitle}>🎉 MỞ KHÓA THÀNH CÔNG!</h1>
            <p style={styles.winText}>
              Bạn đã tìm ra mật khẩu từ poster!
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
    height: "100%",
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
  passwordLock: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    transition: "all 0.4s ease",
    zIndex: 20
  },
  lockScreen: {
    width: "50px",
    height: "50px",
    background: "linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)",
    borderRadius: "50%",
    boxShadow: "inset 0 2px 10px rgba(0,0,0,0.9), 0 4px 20px rgba(0,0,0,0.9)",
    border: "3px solid #000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease"
  },
  lockIcon: {
    fontSize: "1.5rem",
    filter: "drop-shadow(0 0 8px rgba(255,200,0,0.6))"
  },
  desk: {
    position: "absolute",
    bottom: "18%",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 5
  },
  deskTop: {
    width: "450px",
    height: "25px",
    background: "linear-gradient(135deg, #3a2520 0%, #2a1510 50%, #1a0a08 100%)",
    borderRadius: "12px",
    boxShadow: "0 12px 45px rgba(0,0,0,0.9)",
    border: "3px solid #000"
  },
  deskLeg1: {
    position: "absolute",
    left: "50px",
    top: "25px",
    width: "20px",
    height: "140px",
    background: "linear-gradient(to bottom, #2a1510 0%, #1a0a08 100%)",
    boxShadow: "3px 0 12px rgba(0,0,0,0.9)"
  },
  deskLeg2: {
    position: "absolute",
    right: "50px",
    top: "25px",
    width: "20px",
    height: "140px",
    background: "linear-gradient(to bottom, #2a1510 0%, #1a0a08 100%)",
    boxShadow: "-3px 0 12px rgba(0,0,0,0.9)"
  },
  posterFrame: {
    position: "absolute",
    top: "25%",
    left: "20%",
    width: "120px",
    height: "160px",
    background: "linear-gradient(135deg, #2a2520 0%, #1a1510 100%)",
    border: "6px solid #1a1510",
    borderRadius: "8px",
    boxShadow: "0 15px 50px rgba(139,0,0,0.5)",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 7
  },
  posterIcon: {
    fontSize: "4rem",
    filter: "drop-shadow(0 0 15px rgba(139,0,0,0.6))"
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
    background: "linear-gradient(135deg, #2a2520 0%, #1a1510 100%)",
    padding: "20px",
    borderRadius: "15px",
    border: "6px solid rgba(139,0,0,0.6)",
    boxShadow: "0 30px 100px rgba(0,0,0,0.98)"
  },
  closePosterBtn: {
    position: "absolute",
    top: "10px",
    right: "10px",
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
    background: "linear-gradient(135deg, #2a2520 0%, #1a1510 35%, #0f0a08 70%, #050302 100%)",
    border: "6px solid rgba(139,0,0,0.6)",
    borderRadius: "20px",
    padding: "40px",
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
    background: "linear-gradient(135deg, rgba(139,0,0,0.8), rgba(80,0,0,0.9))",
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
  passwordDisplay: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginBottom: "30px"
  },
  digitBox: {
    width: "80px",
    height: "100px",
    background: "rgba(10,10,10,0.9)",
    border: "4px solid rgba(0,255,0,0.3)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "3rem",
    color: "#0f0",
    fontFamily: "monospace",
    fontWeight: "bold",
    boxShadow: "inset 0 4px 15px rgba(0,0,0,0.9), 0 0 20px rgba(0,255,0,0.2)",
    textShadow: "0 0 15px #0f0"
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
    width: "80px",
    height: "70px",
    background: "linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)",
    border: "3px solid #444",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "1.8rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontFamily: "Arial, sans-serif",
    boxShadow: "0 5px 15px rgba(0,0,0,0.8)"
  },
  controlButtons: {
    display: "flex",
    gap: "10px"
  },
  backspaceBtn: {
    flex: 1,
    height: "60px",
    background: "linear-gradient(135deg, #666 0%, #444 100%)",
    border: "3px solid #555",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "1.1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontFamily: "Arial, sans-serif",
    boxShadow: "0 5px 15px rgba(0,0,0,0.8)"
  },
  submitBtn: {
    flex: 1,
    height: "60px",
    background: "linear-gradient(135deg, rgba(0,150,0,0.8), rgba(0,100,0,0.9))",
    border: "3px solid rgba(0,200,0,0.8)",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "1.1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontFamily: "Arial, sans-serif",
    boxShadow: "0 5px 15px rgba(0,0,0,0.8)"
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
    marginBottom: "20px",
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
  
  .continueBtn:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 40px rgba(139,0,0,0.9);
  }
  
  .closePosterBtn:hover, .closeLockBtn:hover {
    transform: rotate(90deg) scale(1.1);
    background: linear-gradient(135deg, rgba(180,0,0,0.9), rgba(120,0,0,0.95));
  }
  
  .numberButton:hover {
    transform: scale(1.1);
    background: linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 100%);
    border-color: #666;
  }
  
  .numberButton:active {
    transform: scale(0.95);
  }
  
  .clearBtn:hover {
    background: linear-gradient(135deg, #777 0%, #555 100%);
    transform: scale(1.05);
  }
  
  .submitBtn:hover:not(:disabled) {
    background: linear-gradient(135deg, rgba(0,180,0,0.9), rgba(0,130,0,1));
    transform: scale(1.05);
  }
`;
document.head.appendChild(styleSheet);