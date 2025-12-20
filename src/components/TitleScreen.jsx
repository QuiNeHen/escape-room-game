import React, { useState, useEffect, useRef } from "react";

export default function TitleScreen({ onStart }) {
  const [btnHover, setBtnHover] = useState(false);
  const titleAudioRef = useRef(null);

  useEffect(() => {
    // Add animations
    const style = document.createElement("style");
    style.id = "title-screen-animations";
    style.textContent = `
      @keyframes titleGlow {
        0%, 100% { 
          text-shadow: 0 0 30px rgba(218,165,32,1), 0 0 60px rgba(218,165,32,0.6), 0 5px 15px rgba(0,0,0,0.8);
        }
        50% { 
          text-shadow: 0 0 50px rgba(218,165,32,1), 0 0 90px rgba(218,165,32,0.8), 0 5px 15px rgba(0,0,0,0.8);
        }
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 0.4; transform: scale(1); }
        50% { opacity: 0.8; transform: scale(1.2); }
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
        50% { transform: translateY(-20px) translateX(10px); opacity: 0.8; }
      }
      
      @keyframes fogMove {
        0%, 100% { transform: translateX(0) scale(1); }
        50% { transform: translateX(30px) scale(1.1); }
      }
      
      @keyframes shimmer {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
      
      .title-glow {
        animation: titleGlow 3s ease-in-out infinite;
      }
      
      .start-btn:hover {
        transform: scale(1.08) translateY(-5px) !important;
        box-shadow: 0 15px 50px rgba(218,165,32,0.8), inset 0 0 30px rgba(218,165,32,0.2) !important;
      }
    `;
    document.head.appendChild(style);

    // Audio
    if (titleAudioRef.current) {
      titleAudioRef.current.volume = 0.3;
      titleAudioRef.current.loop = true;
      titleAudioRef.current.play().catch(() => {});
    }

    return () => {
      const existingStyle = document.getElementById("title-screen-animations");
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, []);

  return (
    <div style={styles.titleContainer}>
      <audio ref={titleAudioRef}>
        <source src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_3b3c7d7f0d.mp3?filename=horror-ambience-01-111751.mp3" type="audio/mpeg" />
      </audio>

      {/* Particle effects - Vàng lấp lánh */}
      <div style={styles.particles}>
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.particle,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <div style={styles.fog}></div>
      <div style={styles.vignette}></div>

      {/* Decorative corners - Kim cương vàng */}
      <div style={{...styles.cornerDecor, top: '5%', left: '5%'}}>◈</div>
      <div style={{...styles.cornerDecor, top: '5%', right: '5%'}}>◈</div>
      <div style={{...styles.cornerDecor, bottom: '5%', left: '5%'}}>◈</div>
      <div style={{...styles.cornerDecor, bottom: '5%', right: '5%'}}>◈</div>

      {/* Decorative lines */}
      <div style={{...styles.decorLine, top: '10%', left: '10%', width: '15vw'}}></div>
      <div style={{...styles.decorLine, top: '10%', right: '10%', width: '15vw'}}></div>
      <div style={{...styles.decorLine, bottom: '10%', left: '10%', width: '15vw'}}></div>
      <div style={{...styles.decorLine, bottom: '10%', right: '10%', width: '15vw'}}></div>

      <div style={styles.titleBox}>
        <div style={styles.titleDecorTop}>⟨ ◈ ⟩</div>
        
        <h1 style={styles.mainTitle} className="title-glow">
          MẬT THẤT
        </h1>
        
        <div style={styles.titleLine}></div>
        
        <p style={styles.subTitle}>
          Lối Thoát Duy Nhất Là... Trí Tuệ Của Bạn
        </p>
        
        <div style={styles.titleDecorBottom}>⟨ ◈ ⟩</div>

        <button
          className="start-btn"
          style={{
            ...styles.startBtn,
            transform: btnHover ? 'scale(1.08) translateY(-5px)' : 'scale(1)',
            boxShadow: btnHover 
              ? '0 15px 50px rgba(218,165,32,0.8), inset 0 0 30px rgba(218,165,32,0.2)'
              : '0 10px 30px rgba(218,165,32,0.5), inset 0 0 20px rgba(0,0,0,0.3)'
          }}
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          onClick={onStart}
        >
          BƯỚC VÀO
        </button>
      </div>
    </div>
  );
}

const styles = {
  titleContainer: {
    width: "100vw",
    height: "100vh",
    background: "linear-gradient(135deg, #1a1410 0%, #2d1f15 25%, #1f1812 50%, #2a1d13 75%, #1a1410 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden"
  },
  particles: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    zIndex: 1
  },
  particle: {
    position: "absolute",
    width: "4px",
    height: "4px",
    background: "radial-gradient(circle, #DAA520, transparent)",
    borderRadius: "50%",
    animation: "float 10s infinite ease-in-out",
    opacity: 0.6,
    boxShadow: "0 0 8px rgba(218,165,32,0.8)"
  },
  fog: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(ellipse at 50% 70%, rgba(218,165,32,0.12) 0%, transparent 60%)",
    animation: "fogMove 12s ease-in-out infinite alternate",
    pointerEvents: "none",
    zIndex: 2
  },
  vignette: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)",
    pointerEvents: "none",
    zIndex: 3
  },
  cornerDecor: {
    position: "absolute",
    fontSize: "2.5rem",
    color: "#DAA520",
    opacity: 0.5,
    textShadow: "0 0 25px rgba(218,165,32,0.9)",
    animation: "pulse 3s ease-in-out infinite",
    zIndex: 4
  },
  decorLine: {
    position: "absolute",
    height: "2px",
    background: "linear-gradient(90deg, transparent, rgba(218,165,32,0.6), transparent)",
    boxShadow: "0 0 10px rgba(218,165,32,0.5)",
    zIndex: 4,
    opacity: 0.7
  },
  titleBox: {
    textAlign: "center",
    padding: "60px 80px",
    background: "rgba(15,10,8,0.9)",
    border: "5px solid rgba(218,165,32,0.6)",
    borderRadius: "20px",
    boxShadow: "0 0 70px rgba(218,165,32,0.5), inset 0 0 50px rgba(0,0,0,0.6)",
    maxWidth: "850px",
    zIndex: 10,
    backdropFilter: "blur(8px)",
    position: "relative"
  },
  titleDecorTop: {
    fontSize: "1.8rem",
    color: "#DAA520",
    marginBottom: "25px",
    opacity: 0.9,
    letterSpacing: "10px",
    textShadow: "0 0 20px rgba(218,165,32,0.8)"
  },
  mainTitle: {
    fontFamily: "'Cinzel', serif",
    fontSize: "6rem",
    margin: "25px 0",
    color: "#DAA520",
    letterSpacing: "20px",
    fontWeight: "900",
    textTransform: "uppercase",
    position: "relative"
  },
  titleLine: {
    width: "70%",
    height: "3px",
    background: "linear-gradient(90deg, transparent, #DAA520, transparent)",
    margin: "25px auto",
    boxShadow: "0 0 15px rgba(218,165,32,0.9)"
  },
  subTitle: {
    fontSize: "1.4rem",
    margin: "25px 0 35px",
    color: "#c9b896",
    textShadow: "0 2px 15px rgba(0,0,0,0.9), 0 0 20px rgba(218,165,32,0.4)",
    letterSpacing: "4px",
    fontStyle: "italic",
    fontFamily: "'Noto Serif', Georgia, serif"
  },
  titleDecorBottom: {
    fontSize: "1.8rem",
    color: "#DAA520",
    marginTop: "35px",
    marginBottom: "35px",
    opacity: 0.9,
    letterSpacing: "10px",
    textShadow: "0 0 20px rgba(218,165,32,0.8)"
  },
  startBtn: {
    padding: "20px 65px",
    fontSize: "1.6rem",
    background: "linear-gradient(135deg, rgba(30,22,18,0.95), rgba(20,15,12,1))",
    color: "#DAA520",
    border: "4px solid rgba(218,165,32,0.7)",
    borderRadius: "15px",
    cursor: "pointer",
    fontWeight: "bold",
    letterSpacing: "5px",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    textTransform: "uppercase",
    fontFamily: "'Noto Sans', Arial, sans-serif",
    position: "relative",
    overflow: "hidden"
  }
};