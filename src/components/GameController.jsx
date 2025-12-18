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
  const goToRoom1 = () => setCurrentScreen("room2");
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
    <div style={styles.finaleContainer}>
      <div style={styles.instructionsContent}>
        <h1 style={styles.instructionsTitle}>MẬT THẤT</h1>
        
        <div style={styles.instructionsBox}>
          <h2 style={styles.sectionTitle}>HIỆN THỰC Ý TƯỞNG TỪ CHƯƠNG TRÌNH THỰC TẾ</h2>
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
            Version: 2.1 | Update: [18/12/2025]
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
  finaleContainer: {
    width: "100vw",
    height: "100vh",
    background: "linear-gradient(135deg, #000000 0%, #1a0a0a 30%, #2a0505 60%, #000000 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    animation: "finaleAppear 1.5s ease-out"
  },
  instructionsContent: {
    textAlign: "center",
    maxWidth: "min(90vw, 800px)",
    maxHeight: "90vh",
    padding: "clamp(20px, 4vh, 40px) clamp(20px, 4vw, 40px)",
    background: "rgba(10, 10, 10, 0.95)",
    border: "6px solid rgba(139,0,0,0.7)",
    borderRadius: "25px",
    boxShadow: "0 40px 120px rgba(139,0,0,0.8), inset 0 0 60px rgba(139,0,0,0.1)",
    animation: "scaleIn 0.8s ease-out 0.5s both",
    overflow: "auto"
  },
  instructionsTitle: {
    fontSize: "clamp(2rem, 5vw, 2.5rem)",
    color: "#DC143C",
    textShadow: "0 0 60px rgba(220,20,60,0.9), 0 0 100px rgba(220,20,60,0.5)",
    marginBottom: "clamp(20px, 3vh, 30px)",
    animation: "titleGlow 2s ease-in-out infinite",
    fontFamily: "'Noto Serif', Georgia, serif"
  },
  instructionsBox: {
    background: "rgba(20,20,20,0.8)",
    border: "3px solid rgba(139,0,0,0.5)",
    borderRadius: "15px",
    padding: "clamp(15px, 2.5vh, 25px)",
    marginBottom: "clamp(15px, 2.5vh, 25px)",
    textAlign: "left"
  },
  sectionTitle: {
    fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
    color: "#8B0000",
    marginBottom: "clamp(10px, 1.5vh, 15px)",
    fontFamily: "'Noto Sans', Arial, sans-serif",
    textShadow: "0 0 20px rgba(139,0,0,0.8)"
  },
  instructionText: {
    fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
    color: "#c9b896",
    lineHeight: "1.8",
    marginBottom: "clamp(8px, 1vh, 10px)",
    fontFamily: "'Noto Sans', Arial, sans-serif"
  },
  startGameBtn: {
    background: "linear-gradient(135deg, rgba(139,0,0,0.9), rgba(100,0,0,0.95))",
    border: "4px solid rgba(139,0,0,0.8)",
    color: "#fff",
    padding: "clamp(14px, 1.8vh, 18px) clamp(35px, 5vw, 50px)",
    fontSize: "clamp(1.1rem, 2.5vw, 1.3rem)",
    cursor: "pointer",
    borderRadius: "15px",
    fontWeight: "bold",
    letterSpacing: "3px",
    boxShadow: "0 15px 50px rgba(139,0,0,0.8)",
    transition: "all 0.4s ease",
    fontFamily: "'Noto Sans', Arial, sans-serif",
    marginTop: "clamp(15px, 2vh, 20px)"
  },
  finaleContent: {
    textAlign: "center",
    maxWidth: "min(95vw, 900px)",
    maxHeight: "92vh",
    padding: "clamp(20px, 3.5vh, 35px) clamp(20px, 3.5vw, 35px)",
    background: "rgba(10, 10, 10, 0.95)",
    border: "6px solid rgba(139,0,0,0.7)",
    borderRadius: "25px",
    boxShadow: "0 40px 120px rgba(139,0,0,0.8), inset 0 0 60px rgba(139,0,0,0.1)",
    animation: "scaleIn 0.8s ease-out 0.5s both",
    overflow: "auto"
  },
  finaleTitle: {
    fontSize: "clamp(1.8rem, 4.5vw, 2.5rem)",
    color: "#DC143C",
    textShadow: "0 0 60px rgba(220,20,60,0.9), 0 0 100px rgba(220,20,60,0.5)",
    marginBottom: "clamp(20px, 3vh, 30px)",
    animation: "titleGlow 2s ease-in-out infinite",
    fontFamily: "'Noto Serif', Georgia, serif"
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
    fontSize: "clamp(1rem, 2.2vw, 1.2rem)",
    color: "#8B0000",
    marginBottom: "clamp(10px, 1.5vh, 15px)",
    fontFamily: "'Noto Sans', Arial, sans-serif",
    textShadow: "0 0 20px rgba(139,0,0,0.8)",
    fontWeight: "bold"
  },
  qrBox: {
    background: "rgba(20,20,20,0.8)",
    border: "4px solid rgba(139,0,0,0.5)",
    borderRadius: "15px",
    padding: "15px",
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
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
    background: "rgba(20,20,20,0.8)",
    border: "4px solid rgba(139,0,0,0.5)",
    borderRadius: "15px",
    padding: "clamp(12px, 1.5vh, 15px)",
    marginBottom: "10px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    minHeight: "80px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  formLinkText: {
    fontSize: "clamp(0.75rem, 1.8vw, 0.95rem)",
    color: "#00c8ff",
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
    background: "rgba(20,20,20,0.8)",
    border: "3px solid rgba(139,0,0,0.5)",
    borderRadius: "15px",
    padding: "clamp(15px, 2.5vh, 25px)",
    marginBottom: "clamp(15px, 2.5vh, 25px)"
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
    background: "linear-gradient(135deg, rgba(139,0,0,0.9), rgba(100,0,0,0.95))",
    border: "4px solid rgba(139,0,0,0.8)",
    color: "#fff",
    padding: "clamp(12px, 1.6vh, 16px) clamp(30px, 4.5vw, 45px)",
    fontSize: "clamp(1rem, 2.2vw, 1.2rem)",
    cursor: "pointer",
    borderRadius: "12px",
    fontWeight: "bold",
    letterSpacing: "2px",
    boxShadow: "0 15px 50px rgba(139,0,0,0.8)",
    transition: "all 0.4s ease",
    fontFamily: "'Noto Sans', Arial, sans-serif"
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
    0%, 100% { text-shadow: 0 0 60px rgba(220,20,60,0.9), 0 0 100px rgba(220,20,60,0.5); }
    50% { text-shadow: 0 0 80px rgba(220,20,60,1), 0 0 120px rgba(220,20,60,0.7); }
  }
  
  button:hover {
    transform: translateY(-8px) scale(1.05);
    box-shadow: 0 20px 70px rgba(139,0,0,1);
    background: linear-gradient(135deg, rgba(180,0,0,0.95), rgba(139,0,0,1));
  }
  
  .formBox:hover {
    transform: scale(1.05);
    border-color: rgba(139,0,0,0.8);
  }
  
  /* Custom scrollbar cho overflow areas */
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