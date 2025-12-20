import React, { useState, useEffect, useRef } from "react";

// ========== IMPORT CÁC HÌNH ẢNH TẠI ĐÂY ==========
import roomBg1 from "../Img/room6.jpg"  // Nền phòng
import lockImg1 from "../Img/lock6.png"  // Ổ khóa trên cửa
import phoneImg1 from "../Img/phone6.png"  // Điện thoại
import phoneZoomBg from "../Img/nenphone6.png"  // Nền mới cho khi zoom điện thoại

const roomBg = roomBg1;
const lockImg = lockImg1;
const phoneImg = phoneImg1;

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
            <p style={styles.storyText}>Bạn bước vào một căn phòng nhìn như văn phòng...</p>
            <p style={styles.storyText}>Trên bàn có một chiếc điện thoại đang sáng màn hình.</p>
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
              backgroundImage: roomBg ? `url(${roomBg})` : 'linear-gradient(180deg, #000000 0%, #0a0a0a 30%, #050505 60%, #000 100%)',
            }}></div>

            <div style={styles.fog}></div>
            <div style={styles.vignette}></div>

            {/* VÙ GỐC Ổ KHÓA - CHỈ ĐỂ ĐẶT Ổ KHÓA VÀO */}
            <div style={styles.doorWrapper}>
              {/* Ổ KHÓA - CHỈ VIỀN MÀU ĐỎ/XANH KHI SAI/ĐÚNG */}
              <div 
                style={{
                  ...styles.lockOnDoor,
                  backgroundImage: lockImg ? `url(${lockImg})` : 'none',
                  backgroundColor: lockImg ? 'transparent' : 'rgba(0,0,0,0.8)',
                  opacity: isCorrect ? 0 : 1,
                  cursor: "pointer",
                  // CHỈ VIỀN MÀU - KHÔNG XOAY, KHÔNG RUNG
                  filter: isWrong
                    ? "brightness(1.3) drop-shadow(0 0 50px rgba(255,0,0,1))"
                    : isCorrect
                    ? "brightness(1.3) drop-shadow(0 0 50px rgba(0,255,0,1))"
                    : hovered === "lock" 
                    ? "brightness(1.3) drop-shadow(0 0 30px rgba(255,200,0,0.8))" 
                    : "brightness(1)",
                  transform: hovered === "lock" ? "scale(1.15)" : "scale(1)",
                  transition: "all 0.3s ease"
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isCorrect) setLockOpen(true);
                }}
                onMouseEnter={(e) => {
                  e.stopPropagation();
                  setHovered("lock");
                }}
                onMouseLeave={() => setHovered(null)}
              >
                {!lockImg && <div style={{fontSize: '2rem'}}>🔒</div>}
              </div>
            </div>

            {/* ĐIỆN THOẠI */}
            <div
              style={{
                ...styles.phoneWrapper,
                backgroundImage: phoneImg ? `url(${phoneImg})` : 'none',
                backgroundColor: phoneImg ? 'transparent' : '#1a1a1a',
                filter: hovered === "phone" ? "brightness(1.3) drop-shadow(0 0 60px rgba(0,200,255,0.8))" : "brightness(1)",
                transform: hovered === "phone" ? "scale(1.08)" : "scale(1)",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
              }}
              onClick={() => setPhoneOpen(true)}
              onMouseEnter={() => setHovered("phone")}
              onMouseLeave={() => setHovered(null)}
            >
              {!phoneImg && <div style={{fontSize: '3rem'}}>📱</div>}
            </div>
          </div>

          {/* Modal điện thoại */}
          {phoneOpen && (
            <div style={styles.phoneModal} onClick={() => setPhoneOpen(false)}>
              <div style={styles.phoneFullscreen} onClick={e => e.stopPropagation()}>
                <div style={styles.phoneHeader}>
                  <button style={styles.backBtn} onClick={() => setPhoneOpen(false)}>←</button>
                  <div style={styles.phoneHeaderTitle}>
                    <div style={styles.contactName}>NHÓM CTY DEMO</div>
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
                
                <div style={styles.lockTitle}>NHẬP MẬT KHẨU</div>
                
                <div style={styles.passwordDisplay}>
                  {password || " "}
                </div>

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
                  
                  <div style={styles.keyboardRow}>
                    <button style={styles.backspaceBtn} onClick={handleBackspace}>
                      XÓA
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
            <h1 style={styles.winTitle}>GIẢI MÃ THÀNH CÔNG!</h1>
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
    backgroundSize: "cover",
    backgroundPosition: "center",
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
  
  // ========== VÙ GỐC Ổ KHÓA (KHÔNG CÒN HIỆU ỨNG) ==========
  doorWrapper: {
    position: "fixed",
    top: "43vh",
    left: "64%",
    transform: "translateX(-50%)",
    width: "100%",
    height: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10
  },
  
  // ========== Ổ KHÓA (ĐIỀU CHỈNH VỊ TRÍ TẠI ĐÂY) ==========
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
  
  // ========== ĐIỆN THOẠI (ĐIỀU CHỈNH VỊ TRÍ TẠI ĐÂY) ==========
  phoneWrapper: {
    position: "fixed",
    bottom: "12vh",
    left: "20%",
    transform: "translateX(-50%)",
    width: "12vw",
    height: "20vh",
    minWidth: "100px",
    minHeight: "150px",
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 15
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
    backgroundImage: `url(${phoneZoomBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
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
    border: "6px solid rgba(0, 5, 139, 0.6)",
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
    color: "#4f4f4fff",
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
    box-shadow: 0 10px 40px rgba(139,0,0,0.9);
  }
  .backBtn:hover {
    transform: scale(1.2);
  }
  .closeLockBtn:hover {
    transform: scale(1.1);
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