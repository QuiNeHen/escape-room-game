import React from "react";

// Dùng Font chữ cổ kính/kinh dị. Bạn cần đảm bảo đã import chúng (ví dụ: qua Google Fonts)
// Ví dụ: 'Cinzel' cho phong cách cổ điển, 'Creepster' cho phong cách rùng rợn.
const FONT_TITLE = "'Cinzel', serif";
const FONT_BODY = "'Roboto Mono', monospace"; // Hoặc font khác phù hợp

const styles = {
  // --- CONTAINER & HIỆU ỨNG NỀN ---
  container: {
    width: "100vw",
    height: "100vh",
    background: "#0a0a0a", // Màu nền gần như đen, u ám hơn
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: FONT_BODY,
    color: "#d4af77", // Màu vàng đồng/sét rỉ
    overflow: "hidden",
    position: "relative",
  },
  // Hiệu ứng Sương mù/Ánh sáng mờ từ dưới lên
  fog: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(ellipse at 50% 80%, rgba(40,40,60,0.3) 0%, transparent 60%)",
    animation: "fogMove 15s ease-in-out infinite alternate",
    pointerEvents: "none",
    zIndex: 1,
  },
  // Họa tiết Mê cung/Gạch cũ kỹ mờ ảo
  maze: {
    position: "absolute",
    inset: 0,
    backgroundImage: `
      linear-gradient(90deg, transparent 48%, rgba(139,115,85,0.15) 48%, rgba(139,115,85,0.15) 52%, transparent 52%),
      linear-gradient(0deg, transparent 48%, rgba(139,115,85,0.15) 48%, rgba(139,115,85,0.15) 52%, transparent 52%),
      linear-gradient(45deg, transparent 48%, rgba(139,115,85,0.08) 48%, rgba(139,115,85,0.08) 52%, transparent 52%),
      linear-gradient(-45deg, transparent 48%, rgba(139,115,85,0.08) 48%, rgba(139,115,85,0.08) 52%, transparent 52%)
    `,
    backgroundSize: "80px 80px, 80px 80px, 120px 120px, 120px 120px",
    backgroundPosition: "0 0, 0 0, 0 0, 0 0",
    opacity: 0.4,
    animation: "mazeShift 30s linear infinite",
    zIndex: 2,
  },
  // Hiệu ứng Vignette (tối viền) mạnh mẽ hơn
  vignette: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.7) 60%, #000 100%)",
    pointerEvents: "none",
    zIndex: 3,
  },
  // Vết nứt/Xước ngẫu nhiên (lớp 4)
  crackOverlay: {
    position: "absolute",
    inset: 0,
    backgroundImage: `
      linear-gradient(${Math.random() * 360}deg, transparent 30%, rgba(0,0,0,0.3) 31%, transparent 32%),
      linear-gradient(${Math.random() * 360}deg, transparent 45%, rgba(0,0,0,0.2) 46%, transparent 47%),
      linear-gradient(${Math.random() * 360}deg, transparent 60%, rgba(0,0,0,0.25) 61%, transparent 62%)
    `,
    opacity: 0.6,
    pointerEvents: "none",
    zIndex: 4,
  },

  // --- HỘP TIÊU ĐỀ CHÍNH ---
  titleBox: {
    textAlign: "center",
    padding: "60px 80px",
    background: "rgba(10,10,10,0.85)",
    border: "4px solid rgba(139,115,85,0.4)", // Viền cũ kỹ
    borderRadius: "8px",
    boxShadow:
      "0 0 80px rgba(0,0,0,0.9), inset 0 0 40px rgba(139,69,19,0.2)", // Đổ bóng sâu
    maxWidth: "900px",
    zIndex: 10,
    position: "relative",
    backdropFilter: "blur(3px)", // Làm mờ nhẹ nền phía sau
  },

  // Trang trí Đầu lâu
  skullDecor: {
    position: "absolute",
    fontSize: "2rem",
    opacity: 0.3,
    filter: "grayscale(1)",
    animation: "float 4s ease-in-out infinite",
  },

  // Tiêu đề Chính
  mainTitle: {
    fontFamily: FONT_TITLE,
    fontSize: "5rem",
    margin: "0 0 20px",
    textShadow:
      "0 0 20px rgba(139,0,0,0.8), 0 0 40px rgba(0,0,0,0.9), 2px 2px 4px #000",
    color: "#8B0000", // Đỏ thẩm (Máu)
    letterSpacing: "12px",
    fontWeight: "900",
    textTransform: "uppercase",
    position: "relative",
    filter: "drop-shadow(0 0 15px rgba(139,0,0,0.5))", // Thêm bóng đổ màu đỏ
  },
  // Vết nứt nhỏ ngang qua tiêu đề
  titleCrack: {
    position: "absolute",
    width: "100%",
    height: "3px",
    background: "linear-gradient(90deg, transparent, rgba(139,0,0,0.6), transparent)",
    top: "50%",
    left: 0,
    opacity: 0.4,
  },

  // Tiêu đề Phụ
  subTitle: {
    fontSize: "1.5rem",
    margin: "0 0 50px",
    color: "#666",
    textShadow: "0 0 10px rgba(0,0,0,0.8)",
    letterSpacing: "4px",
    fontStyle: "italic",
    opacity: 0.8,
  },

  // Hiệu ứng Máu rỉ (Blood Drip)
  bloodDrip: {
    position: "absolute",
    top: "-50px", // Bắt đầu từ ngoài màn hình
    width: "8px",
    height: "100px",
    background:
      "linear-gradient(to bottom, #8B0000 0%, #4B0000 50%, transparent 100%)",
    borderRadius: "50%",
    boxShadow: "0 0 20px rgba(139,0,0,0.6)",
    filter: "blur(1px)",
  },

  // Nút Bắt đầu
  startBtn: {
    padding: "22px 70px",
    fontSize: "1.8rem",
    background:
      "linear-gradient(135deg, rgba(20,20,20,0.9) 0%, rgba(10,10,10,0.95) 100%)",
    color: "#8B0000", // Màu chữ đỏ thẩm
    border: "3px solid rgba(139,0,0,0.6)",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    letterSpacing: "6px",
    boxShadow:
      "0 0 40px rgba(139,0,0,0.4), inset 0 0 20px rgba(0,0,0,0.5)",
    transition: "all 0.4s ease",
    textTransform: "uppercase",
    position: "relative",
    overflow: "hidden",
  },
  // Hiệu ứng sáng mờ cho nút khi hover
  btnGlow: {
    position: "absolute",
    inset: "-3px",
    background: "linear-gradient(45deg, transparent, rgba(139,0,0,0.3), transparent)",
    opacity: 0,
    transition: "opacity 0.4s ease",
  },
  // Trang trí góc (Corner Decor)
  cornerDecor: {
    position: "absolute",
    width: "40px",
    height: "40px",
    border: "3px solid rgba(139,115,85,0.3)",
    opacity: 0.5,
  },
  // Trang trí Dây xích
  chains: {
    position: "absolute",
    fontSize: "1.5rem",
    color: "#444", // Xám tối
    opacity: 0.4,
    textShadow: "0 2px 5px rgba(0,0,0,0.8)",
    animation: "swing 3s ease-in-out infinite",
  },
};

export default function TitleScreen({ onStart }) {
  const [btnHover, setBtnHover] = React.useState(false);

  // Mảng chứa thông số cho các giọt máu
  const bloodDrips = Array.from({ length: 8 }, (_, i) => ({
    left: `${10 + i * 11}%`,
    delay: `${i * 1.5}s`,
    duration: `${10 + i * 0.8}s`,
    opacity: Math.random() * 0.5 + 0.3,
  }));

  const titleAudioRef = React.useRef(null);
  const screamAudioRef = React.useRef(null);

  React.useEffect(() => {
    // Thêm Keyframes vào DOM
    const style = document.createElement("style");
    style.textContent = `
      // Hoạt ảnh ánh sáng nhấp nháy cho Tiêu đề
      @keyframes flickerGlow {
        0%, 100% { 
          opacity: 1; 
          text-shadow: 0 0 20px rgba(139,0,0,0.8), 0 0 40px rgba(0,0,0,0.9), 2px 2px 4px #000;
        }
        50% { 
          opacity: 0.85; 
          text-shadow: 0 0 30px rgba(139,0,0,1), 0 0 60px rgba(139,0,0,0.6), 2px 2px 4px #000;
        }
      }
      // Hoạt ảnh Giọt máu
      @keyframes drip {
        0% { transform: translateY(-100px) scaleY(0.3); opacity: 0; }
        10% { opacity: 1; }
        70% { transform: translateY(100vh) scaleY(4); opacity: 0.6; } // Kéo dài khi rơi
        100% { transform: translateY(100vh) scaleY(4); opacity: 0; }
      }
      // Hoạt ảnh sương mù
      @keyframes fogMove {
        0%, 100% { transform: translateX(0) scale(1); }
        50% { transform: translateX(20px) scale(1.05); }
      }
      // Hoạt ảnh họa tiết nền
      @keyframes mazeShift {
        0% { transform: translate(0, 0) rotate(0deg); }
        100% { transform: translate(40px, 40px) rotate(1deg); }
      }
      // Hoạt ảnh trang trí nổi/trôi
      @keyframes float {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-10px) rotate(5deg); }
      }
      // Hoạt ảnh dây xích đung đưa
      @keyframes swing {
        0%, 100% { transform: rotate(-2deg); }
        50% { transform: rotate(2deg); }
      }
      // Hoạt ảnh Glitch/Trục trặc nhẹ
      @keyframes glitch {
        0%, 100% { transform: translate(0, 0); }
        25% { transform: translate(-2px, 2px); }
        50% { transform: translate(2px, -2px); }
        75% { transform: translate(-2px, -2px); }
      }

      // Áp dụng hoạt ảnh cho các thành phần
      .title-main { 
        animation: flickerGlow 5s infinite, glitch 0.3s infinite; // Kết hợp nhấp nháy và glitch
      }
      .blood-drip { 
        animation: drip linear infinite; 
      }

      // Hiệu ứng hover cho nút Bắt đầu
      .start-btn:hover {
        transform: scale(1.08);
        box-shadow: 0 0 80px rgba(139,0,0,0.8), inset 0 0 30px rgba(139,0,0,0.2);
        border-color: rgba(139,0,0,0.9);
        color: #ff0000; // Đỏ tươi hơn khi hover
        background: linear-gradient(135deg, rgba(30,0,0,0.9) 0%, rgba(10,0,0,0.95) 100%);
      }
    `;
    document.head.appendChild(style);

    // Xử lý Âm thanh
    // Nhạc nền
    if (titleAudioRef.current) {
      titleAudioRef.current.volume = 0.4;
      titleAudioRef.current.loop = true;
      titleAudioRef.current.play().catch(() => {});
    }

    // Tiếng thét ngẫu nhiên (15-35 giây)
    const screamInterval = setInterval(() => {
      if (screamAudioRef.current && Math.random() > 0.5) {
        screamAudioRef.current.currentTime = 0;
        screamAudioRef.current.volume = 0.3;
        screamAudioRef.current.play().catch(() => {});
      }
    }, Math.random() * 20000 + 15000);

    return () => {
      document.head.removeChild(style);
      clearInterval(screamInterval);
    };
  }, []);

  return (
    <div style={styles.container}>
      {/* Các lớp Overlay cho hiệu ứng u ám */}
      <div style={styles.fog} />
      <div style={styles.maze} />
      <div style={styles.vignette} />
      <div style={styles.crackOverlay} />

      {/* Trang trí Dây xích */}
      <div style={{ ...styles.chains, top: "10%", left: "15%", animationDelay: "0s" }}>⛓️</div>
      <div style={{ ...styles.chains, top: "15%", right: "12%", animationDelay: "1s" }}>⛓️</div>
      <div style={{ ...styles.chains, bottom: "20%", left: "10%", animationDelay: "0.5s" }}>⛓️</div>
      <div style={{ ...styles.chains, bottom: "25%", right: "15%", animationDelay: "1.5s" }}>⛓️</div>

      {/* Hiệu ứng Rỉ máu */}
      {bloodDrips.map((drip, i) => (
        <div
          key={i}
          className="blood-drip"
          style={{
            ...styles.bloodDrip,
            left: drip.left,
            opacity: drip.opacity,
            animationDelay: drip.delay,
            animationDuration: drip.duration,
          }}
        />
      ))}

      {/* Tích hợp Audio (LƯU Ý: Phải có file audio thật) */}
      <audio ref={titleAudioRef}>
        <source
          src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_3b3c7d7f0d.mp3?filename=horror-ambience-01-111751.mp3"
          type="audio/mpeg"
        />
        {/* Thêm fallback hoặc thông báo */}
      </audio>
      <audio ref={screamAudioRef}>
        <source
          src="https://cdn.pixabay.com/download/audio/2023/01/04/audio_2d5d2c8e8d.mp3?filename=female-scream-horror-6318.mp3"
          type="audio/mpeg"
        />
      </audio>

      <div style={styles.titleBox}>
        {/* Trang trí góc hộp */}
        <div style={{ ...styles.cornerDecor, top: -3, left: -3, borderRight: 0, borderBottom: 0 }} />
        <div style={{ ...styles.cornerDecor, top: -3, right: -3, borderLeft: 0, borderBottom: 0 }} />
        <div style={{ ...styles.cornerDecor, bottom: -3, left: -3, borderRight: 0, borderTop: 0 }} />
        <div style={{ ...styles.cornerDecor, bottom: -3, right: -3, borderLeft: 0, borderTop: 0 }} />

        {/* Trang trí Đầu lâu */}
        <div style={{ ...styles.skullDecor, top: "20px", left: "30px", animationDelay: "0s" }}>💀</div>
        <div style={{ ...styles.skullDecor, top: "20px", right: "30px", animationDelay: "1s" }}>💀</div>

        <h1 style={styles.mainTitle} className="title-main">
          MẬT THẤT
          <div style={styles.titleCrack} />
        </h1>
        <p style={styles.subTitle}>Lối thoát duy nhất là... trí tuệ của bạn</p>
        <button
          className="start-btn" // Thêm class để áp dụng hover CSS bên ngoài
          style={styles.startBtn}
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          onClick={onStart}
        >
          <div style={{ ...styles.btnGlow, opacity: btnHover ? 1 : 0 }} />
          <span style={{ position: "relative", zIndex: 1 }}>BƯỚC VÀO</span>
        </button>
      </div>
    </div>
  );
}