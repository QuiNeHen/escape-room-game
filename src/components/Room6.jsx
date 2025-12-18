import React, { useState, useEffect, useRef } from "react";

export default function Room6({ onComplete }) {
  const [stage, setStage] = useState("intro");
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [lockOpen, setLockOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [hovered, setHovered] = useState(null);
  const [isWrong, setIsWrong] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const audioRef = useRef(null);

  const correctPassword = "HIPPO";

  const messages = [
    { sender: "boss", text: "Nhớ khóa cửa cẩn thận lại trước khi về nhé!", time: "14:23" },
    { sender: "employee", text: "Dạ vâng ạ! Em nhớ rồi.", time: "14:25" },
    { sender: "boss", text: "Mật khẩu giờ thay đổi mỗi ngày để bảo mật hơn.", time: "14:26" },
    { sender: "employee", text: "Em biết rồi ạ. Mật khẩu hôm qua là 4157 = 🐶", time: "14:28" },
    { sender: "boss", text: "Đúng rồi, hôm qua là 4157 = 🐶.", time: "14:30" },
    { sender: "boss", text: "Còn hôm nay mật khẩu là 1291514 = 🦁", time: "14:31" },
    { sender: "employee", text: "Vậy mật khẩu hiện tại là gì ạ?", time: "14:33" },
    { sender: "boss", text: "Mật khẩu hiện tại là: 89161615", time: "14:35" },
    { sender: "boss", text: "Anh tin em giải được đấy! 😉", time: "14:36" },
    { sender: "employee", text: "Để em nghĩ một chút... 🤔", time: "14:38" }
  ];

  const keyboard = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  useEffect(() => {
    if (stage === "room" && audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(() => {});
    }
  }, [stage]);

  const handleKeyboardClick = (letter) => {
    if (password.length < 20) {
      setPassword(password + letter);
    }
  };

  const handleBackspace = () => {
    setPassword(password.slice(0, -1));
  };

  const handlePasswordSubmit = () => {
    if (password.toUpperCase() === correctPassword) {
      setIsCorrect(true);
      setLockOpen(false);
      setTimeout(() => {
        setStage("win");
        audioRef.current?.pause();
        setTimeout(() => onComplete?.(), 3000);
      }, 1500);
    } else {
      setIsWrong(true);
      setTimeout(() => {
        setIsWrong(false);
        setPassword("");
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
            <h2 style={styles.introTitle}>PHÒNG 6 - MẬT MÃ BÍ ẨN</h2>
            <p style={styles.storyText}>Bạn bước vào một căn phòng tối tăm...</p>
            <p style={styles.storyText}>Trên bàn có một chiếc điện thoại đang sáng màn hình.</p>
            <p style={styles.storyText}>Cửa phòng có ổ khóa mật khẩu chữ cái...</p>
            <p style={styles.storyText}>Liệu tin nhắn trong điện thoại có manh mối?</p>
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
                
                {/* Ổ khóa mật khẩu */}
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

            {/* Bàn với điện thoại */}
            <div style={styles.table}>
              <div style={styles.tableTop}></div>
              <div style={styles.tableLeg1}></div>
              <div style={styles.tableLeg2}></div>
              
              {/* Điện thoại */}
              <div
                style={{
                  ...styles.phone,
                  transform: hovered === "phone" ? "scale(1.05)" : "scale(1)",
                  boxShadow: hovered === "phone"
                    ? "0 20px 60px rgba(0,200,255,0.6), inset 0 0 40px rgba(0,200,255,0.2)"
                    : "0 15px 50px rgba(0,200,255,0.4), inset 0 0 30px rgba(0,200,255,0.1)"
                }}
                onClick={() => setPhoneOpen(true)}
                onMouseEnter={() => setHovered("phone")}
                onMouseLeave={() => setHovered(null)}
              >
                <div style={styles.phoneScreen}>
                  <div style={styles.phoneNotch}></div>
                  <div style={styles.phonePreview}>
                    <div style={styles.previewIcon}>📱</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal điện thoại */}
          {phoneOpen && (
            <div style={styles.phoneModal} onClick={() => setPhoneOpen(false)}>
              <div style={styles.phoneFullscreen} onClick={e => e.stopPropagation()}>
                <div style={styles.phoneHeader}>
                  <button style={styles.backBtn} onClick={() => setPhoneOpen(false)}>←</button>
                  <div style={styles.phoneHeaderTitle}>
                    <div style={styles.contactName}>👔 Sếp - Nhân viên</div>
                    <div style={styles.contactStatus}>Đang hoạt động</div>
                  </div>
                </div>
                
                <div style={styles.messagesContainer}>
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      style={{
                        ...styles.messageWrapper,
                        justifyContent: msg.sender === "boss" ? "flex-start" : "flex-end"
                      }}
                    >
                      <div
                        style={{
                          ...styles.messageBubble,
                          background: msg.sender === "boss"
                            ? "linear-gradient(135deg, #2a2a3e 0%, #1a1a2e 100%)"
                            : "linear-gradient(135deg, #0066cc 0%, #0052a3 100%)",
                          alignSelf: msg.sender === "boss" ? "flex-start" : "flex-end"
                        }}
                      >
                        <div style={styles.messageText}>{msg.text}</div>
                        <div style={styles.messageTime}>{msg.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div style={styles.phoneFooter}>
                  <div style={styles.phoneInput}>Đã khóa tin nhắn...</div>
                </div>
              </div>
            </div>
          )}

          {/* Modal nhập mật khẩu */}
          {lockOpen && (
            <div style={styles.lockModal} onClick={() => setLockOpen(false)}>
              <div style={styles.lockPanel} onClick={e => e.stopPropagation()}>
                <button style={styles.closeLockBtn} onClick={() => setLockOpen(false)}>✕</button>
                
                <div style={styles.lockTitle}>🔐 NHẬP MẬT KHẨU</div>
                
                {/* Màn hình hiển thị mật khẩu */}
                <div style={styles.passwordDisplay}>
                  {password || "_ _ _ _ _"}
                </div>

                {/* Bàn phím */}
                <div style={styles.keyboardContainer}>
                  {keyboard.map((row, rowIndex) => (
                    <div key={rowIndex} style={styles.keyboardRow}>
                      {row.map((letter) => (
                        <button
                          key={letter}
                          style={styles.keyButton}
                          onClick={() => handleKeyboardClick(letter)}
                        >
                          {letter}
                        </button>
                      ))}
                    </div>
                  ))}
                  
                  {/* Hàng nút điều khiển */}
                  <div style={styles.keyboardRow}>
                    <button style={styles.backspaceBtn} onClick={handleBackspace}>
                      ⌫ XÓA
                    </button>
                    <button 
                      style={{
                        ...styles.okBtn,
                        opacity: password.length > 0 ? 1 : 0.5,
                        cursor: password.length > 0 ? "pointer" : "not-allowed"
                      }} 
                      onClick={handlePasswordSubmit}
                      disabled={password.length === 0}
                    >
                      ✓ OK
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
            <h1 style={styles.winTitle}>🎉 GIẢI MÃ THÀNH CÔNG!</h1>
            <p style={styles.winText}>
              Bạn đã phá được mật khẩu:
            </p>
            <div style={styles.secretMessage}>
              89161615 = HIPPO 🦛
            </div>
            <p style={styles.winSubtext}>
              H(8) I(9) P(16) P(16) O(15)
            </p>
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
  table: {
    position: "absolute",
    bottom: "20%",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 5
  },
  tableTop: {
    width: "400px",
    height: "20px",
    background: "linear-gradient(135deg, #3a2520 0%, #2a1510 50%, #1a0a08 100%)",
    borderRadius: "12px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.9)",
    border: "3px solid #000"
  },
  tableLeg1: {
    position: "absolute",
    left: "40px",
    top: "20px",
    width: "18px",
    height: "120px",
    background: "linear-gradient(to bottom, #2a1510 0%, #1a0a08 100%)",
    boxShadow: "3px 0 10px rgba(0,0,0,0.9)"
  },
  tableLeg2: {
    position: "absolute",
    right: "40px",
    top: "20px",
    width: "18px",
    height: "120px",
    background: "linear-gradient(to bottom, #2a1510 0%, #1a0a08 100%)",
    boxShadow: "-3px 0 10px rgba(0,0,0,0.9)"
  },
  phone: {
    position: "absolute",
    top: "-130px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "100px",
    height: "180px",
    background: "linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)",
    borderRadius: "15px",
    border: "4px solid #000",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 15px 50px rgba(0,200,255,0.4), inset 0 0 30px rgba(0,200,255,0.1)"
  },
  phoneScreen: {
    width: "100%",
    height: "100%",
    background: "linear-gradient(135deg, #0a1a2a 0%, #050a15 100%)",
    borderRadius: "11px",
    padding: "10px",
    position: "relative",
    overflow: "hidden"
  },
  phoneNotch: {
    width: "40px",
    height: "5px",
    background: "#000",
    borderRadius: "3px",
    margin: "0 auto 10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.9)"
  },
  phonePreview: {
    textAlign: "center",
    marginTop: "35px"
  },
  previewIcon: {
    fontSize: "4rem",
    animation: "phonePulse 2s ease-in-out infinite"
  },
  phoneModal: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.96)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
    backdropFilter: "blur(12px)"
  },
  phoneFullscreen: {
    width: "90%",
    maxWidth: "500px",
    height: "80vh",
    background: "linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)",
    borderRadius: "20px",
    border: "4px solid #000",
    boxShadow: "0 30px 100px rgba(0,0,0,0.98)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  },
  phoneHeader: {
    background: "linear-gradient(135deg, #2a2a3e 0%, #1a1a2e 100%)",
    padding: "15px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    borderBottom: "2px solid #000",
    boxShadow: "0 4px 15px rgba(0,0,0,0.9)"
  },
  backBtn: {
    background: "transparent",
    border: "none",
    color: "#00c8ff",
    fontSize: "1.8rem",
    cursor: "pointer",
    padding: "5px 10px",
    transition: "all 0.3s ease"
  },
  phoneHeaderTitle: {
    flex: 1
  },
  contactName: {
    fontSize: "1.1rem",
    color: "#fff",
    fontFamily: "Arial, sans-serif",
    fontWeight: "bold",
    marginBottom: "3px"
  },
  contactStatus: {
    fontSize: "0.75rem",
    color: "#00ff88",
    fontFamily: "Arial, sans-serif"
  },
  messagesContainer: {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
    background: "linear-gradient(135deg, #0a0a1e 0%, #050510 100%)",
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  messageWrapper: {
    display: "flex",
    width: "100%"
  },
  messageBubble: {
    maxWidth: "75%",
    padding: "12px 16px",
    borderRadius: "18px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.6)"
  },
  messageText: {
    fontSize: "0.95rem",
    color: "#fff",
    lineHeight: "1.5",
    fontFamily: "Arial, sans-serif",
    marginBottom: "5px"
  },
  messageTime: {
    fontSize: "0.7rem",
    color: "rgba(255,255,255,0.5)",
    textAlign: "right",
    fontFamily: "Arial, sans-serif"
  },
  phoneFooter: {
    background: "linear-gradient(135deg, #2a2a3e 0%, #1a1a2e 100%)",
    padding: "15px",
    borderTop: "2px solid #000"
  },
  phoneInput: {
    fontSize: "0.9rem",
    color: "#666",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    fontStyle: "italic"
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
padding: "30px",
maxWidth: "500px",
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
lockTitle: {
fontSize: "1.8rem",
color: "#8B0000",
textAlign: "center",
marginBottom: "20px",
textShadow: "0 0 25px rgba(139,0,0,0.8)",
fontFamily: "Arial, sans-serif"
},
passwordDisplay: {
background: "rgba(10,10,10,0.9)",
border: "3px solid rgba(0,255,0,0.3)",
borderRadius: "10px",
padding: "20px",
fontSize: "1.8rem",
color: "#0f0",
textAlign: "center",
fontFamily: "monospace",
letterSpacing: "8px",
marginBottom: "25px",
minHeight: "60px",
display: "flex",
alignItems: "center",
justifyContent: "center",
boxShadow: "inset 0 4px 15px rgba(0,0,0,0.9), 0 0 20px rgba(0,255,0,0.2)",
textShadow: "0 0 10px #0f0"
},
keyboardContainer: {
display: "flex",
flexDirection: "column",
gap: "8px"
},
keyboardRow: {
display: "flex",
justifyContent: "center",
gap: "6px"
},
keyButton: {
width: "40px",
height: "45px",
background: "linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)",
border: "2px solid #444",
borderRadius: "8px",
color: "#fff",
fontSize: "1.1rem",
fontWeight: "bold",
cursor: "pointer",
transition: "all 0.2s ease",
fontFamily: "Arial, sans-serif",
boxShadow: "0 4px 10px rgba(0,0,0,0.8)"
},
backspaceBtn: {
flex: 1,
height: "45px",
background: "linear-gradient(135deg, #444 0%, #333 100%)",
border: "2px solid #555",
borderRadius: "8px",
color: "#fff",
fontSize: "0.9rem",
fontWeight: "bold",
cursor: "pointer",
transition: "all 0.2s ease",
fontFamily: "Arial, sans-serif",
boxShadow: "0 4px 10px rgba(0,0,0,0.8)"
},
okBtn: {
flex: 1,
height: "45px",
background: "linear-gradient(135deg, rgba(0,150,0,0.8), rgba(0,100,0,0.9))",
border: "2px solid rgba(0,200,0,0.8)",
borderRadius: "8px",
color: "#fff",
fontSize: "0.9rem",
fontWeight: "bold",
cursor: "pointer",
transition: "all 0.2s ease",
fontFamily: "Arial, sans-serif",
boxShadow: "0 4px 10px rgba(0,0,0,0.8)"
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
fontSize: "2.5rem",
color: "#8B0000",
fontWeight: "bold",
textShadow: "0 0 50px rgba(139,0,0,1)",
marginBottom: "20px",
padding: "25px",
background: "rgba(139,0,0,0.1)",
border: "4px solid rgba(139,0,0,0.6)",
borderRadius: "15px",
letterSpacing: "4px",
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
@keyframes phonePulse {
0%, 100% { transform: scale(1); opacity: 1; }
50% { transform: scale(1.1); opacity: 0.8; }
}
.continueBtn:hover {
transform: scale(1.05);
box-shadow: 0 10px 40px rgba(139,0,0,0.9);
}
.backBtn:hover {
transform: scale(1.2);
}
.closeLockBtn:hover {
transform: rotate(90deg) scale(1.1);
background: linear-gradient(135deg, rgba(180,0,0,0.9), rgba(120,0,0,0.95));
}
.keyButton:hover {
transform: scale(1.1);
background: linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 100%);
border-color: #666;
}
.keyButton:active {
transform: scale(0.95);
}
.backspaceBtn:hover {
background: linear-gradient(135deg, #555 0%, #444 100%);
transform: scale(1.05);
}
.okBtn:hover:not(:disabled) {
background: linear-gradient(135deg, rgba(0,180,0,0.9), rgba(0,130,0,1));
transform: scale(1.05);
}
`;
document.head.appendChild(styleSheet);