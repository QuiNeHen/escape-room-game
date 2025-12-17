import React, { useState } from "react";
import TitleScreen from "./TitleScreen";
import Room1 from "./Room1";
import Room2 from "./Room2";
import Room3 from "./Room3";
import Room4 from "./Room4";
import Room5 from "./Room5";
import Room6 from "./Room6";
import Room7 from "./Room7";
import QRImg from "../Img/QR.jpg"

export default function GameController() {
  const [currentScreen, setCurrentScreen] = useState("title");

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
            như đang hóa thân vào người chơi đang thử thác chương trình !
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
            Phiên bản: 2.0 | Ngày hoàn thiện: [17/12/2025]
          </p>
        </div>

        <button style={styles.startGameBtn} onClick={onContinue}>
          SẴN SÀNG PHIÊU LƯU →
        </button>
      </div>
    </div>
  );
}

function FinaleScreen({ onRestart }) {
  const qrCodeUrl = QRImg; // Thay link QR code của bạn
  const feedbackUrl = "https://forms.gle/34jBiCFk55VNVAam7"; // Thay link Google Form của bạn

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
            <div style={styles.formBox}>
              <p style={styles.formText}>https://forms.gle/34jBiCFk55VNVAam7</p>
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
    maxWidth: "800px",
    padding: "40px",
    background: "rgba(10, 10, 10, 0.95)",
    border: "6px solid rgba(139,0,0,0.7)",
    borderRadius: "25px",
    boxShadow: "0 40px 120px rgba(139,0,0,0.8), inset 0 0 60px rgba(139,0,0,0.1)",
    animation: "scaleIn 0.8s ease-out 0.5s both"
  },
  instructionsTitle: {
    fontSize: "2.5rem",
    color: "#DC143C",
    textShadow: "0 0 60px rgba(220,20,60,0.9), 0 0 100px rgba(220,20,60,0.5)",
    marginBottom: "30px",
    animation: "titleGlow 2s ease-in-out infinite",
    fontFamily: "Georgia, serif"
  },
  instructionsBox: {
    background: "rgba(20,20,20,0.8)",
    border: "3px solid rgba(139,0,0,0.5)",
    borderRadius: "15px",
    padding: "25px",
    marginBottom: "25px",
    textAlign: "left"
  },
  sectionTitle: {
    fontSize: "1.5rem",
    color: "#8B0000",
    marginBottom: "15px",
    fontFamily: "Arial, sans-serif",
    textShadow: "0 0 20px rgba(139,0,0,0.8)"
  },
  instructionText: {
    fontSize: "1.1rem",
    color: "#c9b896",
    lineHeight: "1.8",
    marginBottom: "10px",
    fontFamily: "Arial, sans-serif"
  },
  startGameBtn: {
    background: "linear-gradient(135deg, rgba(139,0,0,0.9), rgba(100,0,0,0.95))",
    border: "4px solid rgba(139,0,0,0.8)",
    color: "#fff",
    padding: "18px 50px",
    fontSize: "1.3rem",
    cursor: "pointer",
    borderRadius: "15px",
    fontWeight: "bold",
    letterSpacing: "3px",
    boxShadow: "0 15px 50px rgba(139,0,0,0.8)",
    transition: "all 0.4s ease",
    fontFamily: "Arial, sans-serif",
    marginTop: "20px"
  },
  finaleContent: {
    textAlign: "center",
    maxWidth: "900px",
    padding: "35px",
    background: "rgba(10, 10, 10, 0.95)",
    border: "6px solid rgba(139,0,0,0.7)",
    borderRadius: "25px",
    boxShadow: "0 40px 120px rgba(139,0,0,0.8), inset 0 0 60px rgba(139,0,0,0.1)",
    animation: "scaleIn 0.8s ease-out 0.5s both"
  },
  finaleTitle: {
    fontSize: "2.5rem",
    color: "#DC143C",
    textShadow: "0 0 60px rgba(220,20,60,0.9), 0 0 100px rgba(220,20,60,0.5)",
    marginBottom: "30px",
    animation: "titleGlow 2s ease-in-out infinite",
    fontFamily: "Georgia, serif"
  },
  feedbackSection: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    marginBottom: "30px"
  },
  qrSection: {
    flex: 1,
    maxWidth: "300px"
  },
  formSection: {
    flex: 1,
    maxWidth: "400px"
  },
  feedbackTitle: {
    fontSize: "1.2rem",
    color: "#8B0000",
    marginBottom: "15px",
    fontFamily: "Arial, sans-serif",
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
    width: "200px",
    height: "200px",
    borderRadius: "10px"
  },
  qrText: {
    fontSize: "0.9rem",
    color: "#999",
    fontFamily: "Arial, sans-serif"
  },
  formBox: {
    background: "rgba(20,20,20,0.8)",
    border: "4px solid rgba(139,0,0,0.5)",
    borderRadius: "15px",
    padding: "15px",
    marginBottom: "10px",
    cursor: "pointer",
    transition: "all 0.3s ease"
  },
  formImage: {
    width: "100%",
    height: "150px",
    borderRadius: "10px"
  },
  formText: {
    fontSize: "0.9rem",
    color: "#999",
    fontFamily: "Arial, sans-serif"
  },
  thanksBox: {
    background: "rgba(20,20,20,0.8)",
    border: "3px solid rgba(139,0,0,0.5)",
    borderRadius: "15px",
    padding: "25px",
    marginBottom: "25px"
  },
  thanksText: {
    fontSize: "1.4rem",
    color: "#c9b896",
    marginBottom: "15px",
    fontFamily: "Georgia, serif",
    lineHeight: "1.8"
  },
  adviceText: {
    fontSize: "1rem",
    color: "#999",
    marginBottom: "10px",
    fontFamily: "Arial, sans-serif",
    lineHeight: "1.6",
    textAlign: "left"
  },
  restartBtn: {
    background: "linear-gradient(135deg, rgba(139,0,0,0.9), rgba(100,0,0,0.95))",
    border: "4px solid rgba(139,0,0,0.8)",
    color: "#fff",
    padding: "16px 45px",
    fontSize: "1.2rem",
    cursor: "pointer",
    borderRadius: "12px",
    fontWeight: "bold",
    letterSpacing: "2px",
    boxShadow: "0 15px 50px rgba(139,0,0,0.8)",
    transition: "all 0.4s ease",
    fontFamily: "Arial, sans-serif"
  }
};

const styleSheet = document.createElement("style");
styleSheet.textContent = `
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
  @keyframes statAppear {
    from { transform: translateY(50px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  @keyframes celebrate {
    0%, 100% { transform: scale(1) rotate(0deg); }
    25% { transform: scale(1.1) rotate(-5deg); }
    75% { transform: scale(1.1) rotate(5deg); }
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
  .statItem:nth-child(1) {
    animation-delay: 0.2s;
  }
  .statItem:nth-child(2) {
    animation-delay: 0.3s;
  }
  .statItem:nth-child(3) {
    animation-delay: 0.4s;
  }
  .statItem:nth-child(4) {
    animation-delay: 0.5s;
  }
  .statItem:nth-child(5) {
    animation-delay: 0.6s;
  }
  .statItem:nth-child(6) {
    animation-delay: 0.7s;
  }
  .statItem:nth-child(7) {
    animation-delay: 0.8s;
  }
`;
document.head.appendChild(styleSheet);