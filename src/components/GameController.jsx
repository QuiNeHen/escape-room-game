import React, { useState, useEffect } from "react";
import TitleScreen from "./TitleScreen";
import Room1 from "./Room1";
import Room2 from "./Room2";
import Room3 from "./Room3";
import Room4 from "./Room4";
import Room5 from "./Room5";
import Room6 from "./Room6";
import Room7 from "./Room7";
import QRImg from "../Img/QR.jpg";

// Load Google Fonts hỗ trợ tiếng Việt
const loadFonts = () => {
  if (!document.querySelector('#game-fonts')) {
    const link = document.createElement('link');
    link.id = 'game-fonts';
    link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&family=Noto+Serif:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
};

export default function GameController() {
  const [currentScreen, setCurrentScreen] = useState("title");

  // Init: Load fonts và prevent scrollbars
  useEffect(() => {
    loadFonts();
    
    // Prevent scrollbars
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  const startGame = () => setCurrentScreen("instructions");
  const goToRoom1 = () => setCurrentScreen("room1");
  const goToRoom2 = () => setCurrentScreen("room2");
  const goToRoom3 = () => setCurrentScreen("room3");
  const goToRoom4 = () => setCurrentScreen("room4");
  const goToRoom5 = () => setCurrentScreen("room5");
  const goToRoom6 = () => setCurrentScreen("room6");
  const goToRoom7 = () => setCurrentScreen("room7");
  const gameComplete = () => {
    setCurrentScreen("finale");
  };

  return (
    <>
      {currentScreen === "title" && <TitleScreen onStart={startGame} />}
      {currentScreen === "instructions" && <InstructionsScreen onContinue={goToRoom1} />}
      {currentScreen === "room1" && <Room1 onComplete={goToRoom2} />}
      {currentScreen === "room2" && <Room2 onWin={goToRoom3} />}
      {currentScreen === "room3" && <Room3 onComplete={goToRoom4} />}
      {currentScreen === "room4" && <Room4 onComplete={goToRoom5} />}
      {currentScreen === "room5" && <Room5 onComplete={goToRoom6} />}
      {currentScreen === "room6" && <Room6 onComplete={goToRoom7} />}
      {currentScreen === "room7" && <Room7 onComplete={gameComplete} />}
      {currentScreen === "finale" && <FinaleScreen onRestart={() => setCurrentScreen("title")} />}
    </>
  );
}

function InstructionsScreen({ onContinue }) {
  return (
    <div style={styles.instructionsContainer}>
      <div style={styles.instructionsFog}></div>
      <div style={styles.instructionsVignette}></div>
      <div style={styles.instructionsContent}>
        <h1 style={styles.instructionsTitle}>MẬT THẤT</h1>
        
        <div style={styles.instructionsBox}>
          <h2 style={styles.sectionTitle}>HIỆN THỰC Ý TƯỞNG TỪ CHƯƠNG TRÌNH THỰC TẾ</h2>
          <h2 style={styles.sectionTitle}>(Đang trong giai đoạn hoàn thiện)</h2>
          <p style={styles.instructionText}>
            Nếu các bạn có đam mê về giải mã, giải đố và nhập vai vào một câu chuyện thì chắc hẳn
            sẽ biết đến chương trình Trốn Thoát Khỏi Mật Thất.
            Game được lấy ý tưởng từ các câu đố kinh điển trong chương trình và hiện thực hóa nó
            qua trò chơi để chúng ta có thể tương tác với các vật thể như trong câu đố để có cảm giác 
            như đang hóa thân vào người chơi đang thử thách chương trình !
          </p>
          <p style={styles.instructionText}>
            • Bạn sẽ phải vượt qua các phòng với các câu đố logic khác nhau
          </p>
          <p style={styles.instructionText}>
            • Quan sát kỹ mọi chi tiết trong phòng để tìm manh mối
          </p>
          <p style={styles.instructionText}>
            • Giải mã các bí ẩn để mở khóa và tiến tới phòng tiếp theo
          </p>
          <p style={styles.instructionText}>
            • Không có giới hạn thời gian - hãy suy nghĩ thật kỹ!
          </p>
        </div>

        <div style={styles.instructionsBox}>
          <h2 style={styles.sectionTitle}>👨‍💻 Về Tác Giả</h2>
          <p style={styles.instructionText}>
            Game được thiết kế và phát triển bởi [GỌI TÔI LÀ DEMO]
          </p>
          <p style={styles.instructionText}>
            Version: 2.4 | Update: [19/12/2025]
          </p>
          <p style={styles.instructionText}>
            MỌI NGƯỜI LƯU Ý CHƠI Ở ĐỘ RỘNG ZOOM: 67% LÀ ĐẸP NHẤT NHÉ !!!
          </p>
        </div>

        <button style={styles.startGameBtn} onClick={onContinue}>
          SẴN SÀNG THỬ THÁCH →
        </button>
      </div>
    </div>
  );
}

function FinaleScreen({ onRestart }) {
  const qrCodeUrl = QRImg;
  const feedbackUrl = "https://forms.gle/34jBiCFk55VNVAam7";

  const handleFormClick = () => {
    window.open(feedbackUrl, '_blank');
  };

  return (
    <div style={styles.finaleContainer}>
      <div style={styles.finaleFog}></div>
      <div style={styles.finaleVignette}></div>
      <div style={styles.finaleContent}>
        <h1 style={styles.finaleTitle}>🎉 CẢM ƠN BẠN ĐÃ CHƠI! 🎉</h1>
        
        <div style={styles.feedbackSection}>
          {/* QR Code */}
          <div style={styles.qrSection}>
            <h3 style={styles.feedbackTitle}>ỦNG HỘ MÌNH NẾU MỌI NGƯỜI CÓ LÒNG</h3>
            <div style={styles.qrBox}>
              <img src={qrCodeUrl} alt="QR Code" style={styles.qrImage} />
            </div>
            <p style={styles.qrText}>Quét mã QR để ủng hộ tác giả</p>
          </div>

          {/* Feedback Form */}
          <div style={styles.formSection}>
            <h3 style={styles.feedbackTitle}>📝 GÓP Ý CỦA BẠN</h3>
            <div style={styles.formBox} onClick={handleFormClick}>
              <p style={styles.formLinkText}>{feedbackUrl}</p>
            </div>
            <p style={styles.formText}>Click vào để điền form góp ý</p>
          </div>
        </div>

        <div style={styles.thanksBox}>
          <p style={styles.thanksText}>
            ❤️ Cảm ơn bạn đã dành thời gian trải nghiệm trò chơi!
          </p>
          <p style={styles.adviceText}>
            💡 <strong>TAG:</strong> Kiên trì là một đức tính, trí tuệ là một sản phẩm
          </p>
          <p style={styles.adviceText}>
            🧠 Nếu bạn thích logic puzzle, hãy để lại ý kiến của mình trong phần điền form nhé.
          </p>
          <p style={styles.adviceText}>
            🎮 CẦN LIÊN HỆ TÌM NGƯỜI POST BÀI. XIN CẢM ƠN !
          </p>
        </div>

        <button style={styles.restartBtn} onClick={onRestart}>
          🔄 CHƠI LẠI
        </button>
      </div>
    </div>
  );
}

const styles = {
  // ========== INSTRUCTIONS SCREEN - TONE XANH CYAN ==========
  instructionsContainer: {
    width: "100vw",
    height: "100vh",
    background: "linear-gradient(135deg, #0f1419 0%, #1a2832 30%, #0f1a21 60%, #0a1419 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden"
  },
  instructionsFog: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(ellipse at 50% 70%, rgba(126,200,227,0.08) 0%, transparent 60%)",
    animation: "fogMove 12s ease-in-out infinite alternate",
    pointerEvents: "none",
    zIndex: 2
  },
  instructionsVignette: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)",
    pointerEvents: "none",
    zIndex: 3
  },
  instructionsContent: {
    textAlign: "center",
    maxWidth: "min(90vw, 850px)",
    maxHeight: "90vh",
    padding: "clamp(25px, 4vh, 45px) clamp(25px, 4vw, 45px)",
    background: "rgba(10,15,20,0.95)",
    border: "5px solid rgba(126,200,227,0.6)",
    borderRadius: "25px",
    boxShadow: "0 35px 90px rgba(126,200,227,0.4), inset 0 0 50px rgba(0,0,0,0.6)",
    animation: "scaleIn 0.8s ease-out 0.3s both",
    overflow: "auto",
    zIndex: 10,
    backdropFilter: "blur(8px)"
  },
  instructionsTitle: {
    fontSize: "clamp(2.2rem, 5.5vw, 3rem)",
    color: "#7ec8e3",
    textShadow: "0 0 50px rgba(126,200,227,1), 0 5px 20px rgba(0,0,0,0.9)",
    marginBottom: "clamp(25px, 3.5vh, 35px)",
    animation: "titleGlow 2.5s ease-in-out infinite",
    fontFamily: "'Cinzel', serif",
    letterSpacing: "10px",
    fontWeight: "900"
  },
  instructionsBox: {
    background: "rgba(15,20,25,0.8)",
    border: "3px solid rgba(126,200,227,0.4)",
    borderRadius: "15px",
    padding: "clamp(18px, 2.8vh, 28px)",
    marginBottom: "clamp(18px, 2.8vh, 28px)",
    textAlign: "left",
    boxShadow: "0 5px 20px rgba(0,0,0,0.5)"
  },
  sectionTitle: {
    fontSize: "clamp(1.3rem, 3.2vw, 1.6rem)",
    color: "#7ec8e3",
    marginBottom: "clamp(12px, 1.8vh, 18px)",
    fontFamily: "'Noto Sans', Arial, sans-serif",
    textShadow: "0 0 20px rgba(126,200,227,0.7)",
    fontWeight: "bold"
  },
  instructionText: {
    fontSize: "clamp(0.95rem, 2.1vw, 1.15rem)",
    color: "#b0b8c0",
    lineHeight: "1.9",
    marginBottom: "clamp(10px, 1.2vh, 12px)",
    fontFamily: "'Noto Sans', Arial, sans-serif"
  },
  startGameBtn: {
    background: "linear-gradient(135deg, rgba(80,140,170,0.9), rgba(60,120,150,1))",
    border: "4px solid rgba(126,200,227,0.7)",
    color: "#fff",
    padding: "clamp(16px, 2vh, 20px) clamp(40px, 5.5vw, 55px)",
    fontSize: "clamp(1.15rem, 2.7vw, 1.4rem)",
    cursor: "pointer",
    borderRadius: "15px",
    fontWeight: "bold",
    letterSpacing: "4px",
    boxShadow: "0 12px 40px rgba(126,200,227,0.6)",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    fontFamily: "'Noto Sans', Arial, sans-serif",
    marginTop: "clamp(20px, 2.5vh, 25px)",
    textTransform: "uppercase"
  },
  
  // ========== FINALE SCREEN - TONE ĐỎ CAM ==========
  finaleContainer: {
    width: "100vw",
    height: "100vh",
    background: "linear-gradient(135deg, #1a0f0a 0%, #2a1a10 30%, #1f1510 60%, #1a0f0a 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    animation: "finaleAppear 1.5s ease-out"
  },
  finaleFog: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(ellipse at 50% 70%, rgba(218,100,80,0.1) 0%, transparent 60%)",
    animation: "fogMove 12s ease-in-out infinite alternate",
    pointerEvents: "none",
    zIndex: 2
  },
  finaleVignette: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)",
    pointerEvents: "none",
    zIndex: 3
  },
  finaleContent: {
    textAlign: "center",
    maxWidth: "min(95vw, 920px)",
    maxHeight: "92vh",
    padding: "clamp(25px, 4vh, 40px) clamp(25px, 4vw, 40px)",
    background: "rgba(15,10,8,0.95)",
    border: "5px solid rgba(218,100,80,0.6)",
    borderRadius: "25px",
    boxShadow: "0 35px 90px rgba(218,100,80,0.5), inset 0 0 50px rgba(0,0,0,0.6)",
    animation: "scaleIn 0.8s ease-out 0.5s both",
    overflow: "auto",
    zIndex: 10,
    backdropFilter: "blur(8px)"
  },
  finaleTitle: {
    fontSize: "clamp(2rem, 5vw, 3rem)",
    color: "#DA6450",
    textShadow: "0 0 50px rgba(218,100,80,1), 0 5px 20px rgba(0,0,0,0.9)",
    marginBottom: "clamp(25px, 3.5vh, 35px)",
    animation: "titleGlow 2.5s ease-in-out infinite",
    fontFamily: "'Cinzel', serif",
    letterSpacing: "10px",
    fontWeight: "900"
  },
  feedbackSection: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "clamp(15px, 3vw, 30px)",
    marginBottom: "clamp(20px, 3vh, 30px)"
  },
  qrSection: {
    flex: "1 1 250px",
    minWidth: "250px",
    maxWidth: "300px"
  },
  formSection: {
    flex: "1 1 250px",
    minWidth: "250px",
    maxWidth: "400px"
  },
  feedbackTitle: {
    fontSize: "clamp(1.05rem, 2.4vw, 1.3rem)",
    color: "#DA6450",
    marginBottom: "clamp(12px, 1.8vh, 18px)",
    fontFamily: "'Noto Sans', Arial, sans-serif",
    textShadow: "0 0 20px rgba(218,100,80,0.7)",
    fontWeight: "bold"
  },
  qrBox: {
    background: "rgba(20,15,12,0.8)",
    border: "4px solid rgba(218,100,80,0.5)",
    borderRadius: "15px",
    padding: "18px",
    marginBottom: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 5px 20px rgba(0,0,0,0.6)"
  },
  qrImage: {
    width: "clamp(150px, 20vw, 200px)",
    height: "clamp(150px, 20vw, 200px)",
    borderRadius: "10px",
    objectFit: "contain"
  },
  qrText: {
    fontSize: "clamp(0.8rem, 1.5vw, 0.9rem)",
    color: "#999",
    fontFamily: "'Noto Sans', Arial, sans-serif"
  },
  formBox: {
    background: "rgba(20,15,12,0.8)",
    border: "4px solid rgba(218,100,80,0.5)",
    borderRadius: "15px",
    padding: "clamp(14px, 1.8vh, 18px)",
    marginBottom: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    minHeight: "85px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 5px 20px rgba(0,0,0,0.6)"
  },
  formLinkText: {
    fontSize: "clamp(0.8rem, 1.9vw, 1rem)",
    color: "#7ec8e3",
    fontFamily: "'Noto Sans', Arial, sans-serif",
    wordBreak: "break-all",
    textDecoration: "underline"
  },
  formText: {
    fontSize: "clamp(0.8rem, 1.5vw, 0.9rem)",
    color: "#999",
    fontFamily: "'Noto Sans', Arial, sans-serif"
  },
  thanksBox: {
    background: "rgba(20,15,12,0.8)",
    border: "3px solid rgba(218,100,80,0.4)",
    borderRadius: "15px",
    padding: "clamp(18px, 2.8vh, 28px)",
    marginBottom: "clamp(18px, 2.8vh, 28px)",
    boxShadow: "0 5px 20px rgba(0,0,0,0.6)"
  },
  thanksText: {
    fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
    color: "#c9b896",
    marginBottom: "clamp(12px, 1.5vh, 15px)",
    fontFamily: "'Noto Serif', Georgia, serif",
    lineHeight: "1.8"
  },
  adviceText: {
    fontSize: "clamp(0.85rem, 1.8vw, 1rem)",
    color: "#999",
    marginBottom: "clamp(8px, 1vh, 10px)",
    fontFamily: "'Noto Sans', Arial, sans-serif",
    lineHeight: "1.6",
    textAlign: "left"
  },
  restartBtn: {
    background: "linear-gradient(135deg, rgba(218,100,80,0.9), rgba(190,85,65,1))",
    border: "4px solid rgba(218,100,80,0.7)",
    color: "#fff",
    padding: "clamp(14px, 1.8vh, 18px) clamp(35px, 5vw, 50px)",
    fontSize: "clamp(1.05rem, 2.4vw, 1.3rem)",
    cursor: "pointer",
    borderRadius: "15px",
    fontWeight: "bold",
    letterSpacing: "3px",
    boxShadow: "0 12px 40px rgba(218,100,80,0.6)",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    fontFamily: "'Noto Sans', Arial, sans-serif",
    textTransform: "uppercase"
  }
};

const styleSheet = document.createElement("style");
styleSheet.textContent = `
  * {
    box-sizing: border-box;
  }
  
  body, html {
    margin: 0;
    padding: 0;
    overflow: hidden !important;
    width: 100vw;
    height: 100vh;
  }
  
  @keyframes finaleAppear {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes scaleIn {
    from { transform: scale(0.7); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  
  @keyframes titleGlow {
    0%, 100% { 
      filter: drop-shadow(0 0 25px currentColor) brightness(1);
    }
    50% { 
      filter: drop-shadow(0 0 45px currentColor) brightness(1.1);
    }
  }
  
  button:hover {
    transform: translateY(-8px) scale(1.05);
  }
  
  .startGameBtn:hover {
    box-shadow: 0 18px 50px rgba(126,200,227,0.9);
    background: linear-gradient(135deg, rgba(100,160,190,1), rgba(80,140,170,1));
  }
  
  .formBox:hover {
    transform: scale(1.05);
    border-color: rgba(218,100,80,0.8);
    box-shadow: 0 8px 30px rgba(218,100,80,0.5);
  }
  
  .restartBtn:hover {
    box-shadow: 0 18px 50px rgba(218,100,80,0.9);
    background: linear-gradient(135deg, rgba(238,120,100,1), rgba(210,105,85,1));
  }
  
  *::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  *::-webkit-scrollbar-track {
    background: rgba(0,0,0,0.3);
    border-radius: 10px;
  }
  
  *::-webkit-scrollbar-thumb {
    background: rgba(139,0,0,0.5);
    border-radius: 10px;
  }
  
  *::-webkit-scrollbar-thumb:hover {
    background: rgba(139,0,0,0.7);
  }
`;
document.head.appendChild(styleSheet);