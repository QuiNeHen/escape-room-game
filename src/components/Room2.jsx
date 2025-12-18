import React, { useState, useEffect, useRef } from "react";

// ========== IMPORT CÁC HÌNH ẢNH TẠI ĐÂY ==========
import Bg from "../Img/room2.png"
import doorImage from "../Img/locks.png"
// import lockImage from "../Img/lock2.png"
import trayImage from "../Img/vienbi.png"
import marbleTrayBg from "../Img/bgdeck.jpg"
import ghostImage from "../Img/mabupbe.png"
import laughSound from "../Audio/tieng_ma_cuoi-www_tiengdong_com.mp3";
import voiceSound from "../Audio/mp3-output-ttsfree(dot)com.mp3";

const loadFonts = () => {
  if (!document.querySelector('#room2-fonts')) {
    const link = document.createElement('link');
    link.id = 'room2-fonts';
    link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&family=Noto+Serif:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
};

export default function Room2({onWin}) {
  const [stage, setStage] = useState("intro");
  const [deckOpen, setDeckOpen] = useState(false);
  const [jumpscareShown, setJumpscareShown] = useState(false);
  const [jumpscareTriggered, setJumpscareTriggered] = useState(false);
  const [marblePositions, setMarblePositions] = useState({});
  const [dragging, setDragging] = useState(null);
  const [lockOpen, setLockOpen] = useState(false);
  const [code, setCode] = useState(["0", "0", "0", "0"]);
  const [hovered, setHovered] = useState(null);
  const audioRef = useRef(null);
  const laughAudioRef = useRef(null);
  const voiceAudioRef = useRef(null);

  const correctCode = ["0", "7", "0", "3"];

  // ========== ĐỊNH NGHĨA ĐƯỜNG DẪN HÌNH ẢNH ==========
  const backgroundImage = Bg; // Bg - Hình nền phòng chính
  const doorImg = doorImage; // doorImage - Hình cửa
  const lockImg = ""; // lockImage - Hình khóa trên cửa
  const trayImg = trayImage; // trayImage - Hình khay bi trên bàn
  const marbleTrayBackground = marbleTrayBg; // marbleTrayBg - Nền khi mở khay bi
  const lockModalBackground = ""; // lockModalBg - Nền modal nhập mật khẩu
  // const laughSound = laughSound; // Audio cười
  // const voiceSound = voiceSound; // Audio thoại

  const marbles = [
    ...Array(10).fill(null).map((_, i) => ({ id: `red-${i}`, color: "#8B0000", name: "Đỏ" })),
    ...Array(3).fill(null).map((_, i) => ({ id: `yellow-${i}`, color: "#8B8B00", name: "Vàng" })),
    ...Array(7).fill(null).map((_, i) => ({ id: `blue-${i}`, color: "#00008B", name: "Xanh Dương" })),
    ...Array(8).fill(null).map((_, i) => ({ id: `green-${i}`, color: "#006400", name: "Xanh Lá" }))
  ];

  useEffect(() => {
    loadFonts();
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (deckOpen && !jumpscareTriggered) {
      const timer = setTimeout(() => {
        setJumpscareShown(true);
        setJumpscareTriggered(true);

        if (laughSound) {
          laughAudioRef.current = new Audio(laughSound);
          laughAudioRef.current.volume = 0.8;
          laughAudioRef.current.play().catch(e => console.error("Lỗi cười:", e));

          const laughTimeout = setTimeout(() => {
            if (laughAudioRef.current) {
              laughAudioRef.current.pause();
              laughAudioRef.current.currentTime = 0;
            }

            if (voiceSound) {
              voiceAudioRef.current = new Audio(voiceSound);
              voiceAudioRef.current.volume = 1;
              voiceAudioRef.current.play().catch(e => console.error("Lỗi thoại:", e));
            }
          }, 5000);

          return () => clearTimeout(laughTimeout);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [deckOpen, jumpscareTriggered, laughSound, voiceSound]);

  useEffect(() => {
    if (deckOpen) {
      const positions = {};
      const placed = [];
      const minDistance = Math.min(window.innerWidth, window.innerHeight) * 0.07;
      const areaWidth = Math.min(window.innerWidth * 0.7, 800);
      const areaHeight = Math.min(window.innerHeight * 0.6, 600);

      marbles.forEach((marble) => {
        let x, y;
        let attempts = 0;

        do {
          x = (Math.random() - 0.5) * areaWidth;
          y = (Math.random() - 0.5) * areaHeight;
          attempts++;
        } while (attempts < 100 && placed.some(p => Math.hypot(p.x - x, p.y - y) < minDistance));

        positions[marble.id] = { x, y, rotation: Math.random() * 360 };
        placed.push({ x, y });
      });

      setMarblePositions(positions);
    }
  }, [deckOpen]);

  useEffect(() => {
    if (stage === "room" && audioRef.current) {
      audioRef.current.volume = 0.25;
      audioRef.current.play();
    }
  }, [stage]);

  const handleMarbleDrag = (e, marbleId) => {
    if (e.type === "mousedown" || e.type === "touchstart") {
      e.stopPropagation();
      setDragging(marbleId);
    }
  };

  const handleMouseMove = (e) => {
    const clientX = e.clientX || (e.touches?.[0]?.clientX);
    const clientY = e.clientY || (e.touches?.[0]?.clientY);

    if (dragging && deckOpen) {
      setMarblePositions(prev => ({
        ...prev,
        [dragging]: {
          ...prev[dragging],
          x: clientX - window.innerWidth / 2,
          y: clientY - window.innerHeight / 2 + 50
        }
      }));
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleMouseMove);
      window.addEventListener("touchend", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("touchmove", handleMouseMove);
        window.removeEventListener("touchend", handleMouseUp);
      };
    }
  }, [dragging]);

  const closeDeck = () => {
    setDeckOpen(false);
  };

  const adjustCode = (index, direction) => {
    const newCode = [...code];
    let num = parseInt(newCode[index]);
    if (direction === "up") num = (num + 1) % 10;
    else num = (num - 1 + 10) % 10;
    newCode[index] = num.toString();
    setCode(newCode);
  };

  const checkCode = () => {
    if (code.join("") === correctCode.join("")) {
      setStage("win");
      audioRef.current?.pause();
      setTimeout(() => onWin?.(), 3000);
    } else {
      setLockOpen(false);
      setCode(["0", "0", "0", "0"]);
      setStage("lose");
      audioRef.current?.pause();
    }
  };

  return (
    <div style={styles.container} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      <audio ref={audioRef} loop>
        <source src="data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=" />
      </audio>

      {stage === "intro" && (
        <div style={styles.screen}>
          <div style={styles.storyBox}>
            <h2 style={styles.introTitle}>PHÒNG 2</h2>
            <p style={styles.storyText}>Bạn bước qua cánh cửa...</p>
            <p style={styles.storyText}>Một căn phòng tối khác hiện ra.</p>
            <p style={styles.storyText}>Trên bàn là một khay đầy viên bi màu sắc.</p>
            <button style={styles.continueBtn} onClick={() => setStage("room")}>
              TIẾP TỤC →
            </button>
          </div>
        </div>
      )}

      {stage === "room" && (
        <>
          <div style={styles.roomContainer}>
            {/* HÌNH NỀN PHÒNG CHÍNH */}
            <div style={{
              ...styles.roomBg,
              backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none'
            }}></div>
            
            <div style={styles.fog}></div>
            <div style={styles.vignette}></div>

            {!deckOpen && (
              <>
                {/* CÁNH CỬA VỚI KHÓA */}
                <div
                  style={{
                    ...styles.doorWrapper,
                    filter: hovered === "door" && jumpscareTriggered 
                      ? "brightness(1.15) drop-shadow(0 0 80px rgba(139,0,0,0.8))" 
                      : "none",
                    transform: hovered === "door" && jumpscareTriggered
                      ? "translate(-50%, 0) scale(1.02)" 
                      : "translate(-50%, 0)",
                    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
                  }}
                  onClick={() => jumpscareTriggered && setLockOpen(true)}
                  onMouseEnter={() => setHovered("door")}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Hình cửa */}
                  <div style={{
                    ...styles.doorImage,
                    backgroundImage: doorImg ? `url(${doorImg})` : 'none',
                    backgroundColor: doorImg ? 'transparent' : '#2a2520'
                  }}>
                    {!doorImg && <div style={styles.placeholderText}>CỬA<br/>(Import hình)</div>}
                  </div>

                  {/* Hình khóa */}
                  {/* <div style={{
                    ...styles.lockImage,
                    backgroundImage: lockImg ? `url(${lockImg})` : 'none',
                    backgroundColor: lockImg ? 'transparent' : '#3a3530',
                    opacity: jumpscareTriggered ? 1 : 0.4,
                    cursor: jumpscareTriggered ? 'pointer' : 'default'
                  }}>
                    {!lockImg && <div style={styles.lockPlaceholder}>🔒</div>}
                  </div> */}
                </div>

                {/* BÀN VÀ KHAY BI */}
                <div style={styles.tableWrapper}>
                  <div style={styles.tableShadow}></div>
                  <div style={styles.tableTop}>
                    <div style={styles.tableEdge}></div>
                    <div style={styles.tableSurface}>
                      {/* KHAY BI */}
                      <div 
                        style={{
                          ...styles.marbleTray,
                          backgroundImage: trayImg ? `url(${trayImg})` : 'none',
                          backgroundColor: trayImg ? 'transparent' : '#1a1510',
                          filter: hovered === "tray" ? "brightness(1.3) drop-shadow(0 0 70px rgba(139,0,0,0.8))" : "none",
                          transform: hovered === "tray" ? "scale(1.08)" : "scale(1)",
                          transition: "all 0.4s ease"
                        }}
                        onClick={() => setDeckOpen(true)}
                        onMouseEnter={() => setHovered("tray")}
                        onMouseLeave={() => setHovered(null)}
                      >
                        {!trayImg && (
                          <>
                            <div style={styles.trayMarbles}>
                              <div style={{...styles.miniMarble, background: "#8B0000"}}></div>
                              <div style={{...styles.miniMarble, background: "#8B8B00"}}></div>
                              <div style={{...styles.miniMarble, background: "#00008B"}}></div>
                              <div style={{...styles.miniMarble, background: "#006400"}}></div>
                            </div>
                            <div style={styles.trayLabel}>KHAY BI<br/>(Nhấn để xem)</div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div style={styles.tableLeg} data-pos="fl"></div>
                  <div style={styles.tableLeg} data-pos="fr"></div>
                  <div style={styles.tableLeg} data-pos="bl"></div>
                  <div style={styles.tableLeg} data-pos="br"></div>
                </div>
              </>
            )}

            {/* MÀN HÌNH MỞ KHAY BI */}
            {deckOpen && (
              <div style={{
                ...styles.deckOpenView,
                backgroundImage: marbleTrayBackground ? `url(${marbleTrayBackground})` : 'none'
              }}>
                <button style={styles.closeMarbleBtn} onClick={closeDeck}>
                  ✕ ĐÓNG KHAY BI
                </button>
                <div style={styles.deckOpenBg}></div>
                {marbles.map(marble => (
                  <div
                    key={marble.id}
                    style={{
                      ...styles.marble,
                      left: `calc(50% + ${marblePositions[marble.id]?.x || 0}px)`,
                      top: `calc(50% + ${marblePositions[marble.id]?.y || 0}px)`,
                      transform: `translate(-50%, -50%) rotate(${marblePositions[marble.id]?.rotation || 0}deg)`,
                      background: `radial-gradient(circle at 30% 30%, ${marble.color}, ${adjustBrightness(marble.color, -40)})`,
                      cursor: dragging === marble.id ? "grabbing" : "grab",
                      zIndex: dragging === marble.id ? 1000 : 50
                    }}
                    onMouseDown={(e) => handleMarbleDrag(e, marble.id)}
                    onTouchStart={(e) => handleMarbleDrag(e, marble.id)}
                  >
                    <div style={styles.marbleShine}></div>
                    <div style={styles.marbleReflection}></div>
                  </div>
                ))}
              </div>
            )}

            {/* JUMPSCARE */}
            {jumpscareShown && (
              <div style={{...styles.jumpscareOverlay, animation: "jumpscareAppear 0.5s ease-out"}} onClick={() => setJumpscareShown(false)}>
                <div style={styles.jumpscareBox}>
                  <div style={styles.ghostFace}>
  <img src={ghostImage} alt="Con ma" style={{ width: '100%', height: '100%' }} />
</div>
                  <div style={styles.speechBubble}>
                    <p style={styles.speechText}>"Bạn đến rồi à..."</p>
                    <p style={styles.speechText}>
                      "Nhưng trong số bi kia không có viên màu <span style={{color: "#9b59b6", fontWeight: "bold"}}>TÍM</span> và màu <span style={{color: "#ff6600", fontWeight: "bold"}}>CAM</span> mà tôi muốn."
                    </p>
                    <p style={styles.speechText}>"Lần sau bạn mua cho tôi nhé!"</p>
                  </div>
                  <div style={styles.clickToContinue}>(Nhấn để tiếp tục)</div>
                </div>
              </div>
            )}

            <div style={styles.controls}>
              {jumpscareTriggered && !deckOpen && (
                <div style={styles.hintBox}>
                  💡 Manh mối: Không có TÍM, không có CAM... 🤔
                </div>
              )}
            </div>
          </div>

          {/* MODAL NHẬP MẬT KHẨU */}
          {lockOpen && (
          <div style={{
            ...styles.lockModal,
            backgroundImage: lockModalBackground ? `url(${lockModalBackground})` : 'none'
          }} onClick={() => setLockOpen(false)}>
            <div style={styles.lockPanel3D} onClick={e => e.stopPropagation()}>
              <div style={styles.lockPanelTitle}>NHẬP MẬT KHẨU</div>
              {/* <div style={styles.lockInstructions}>Nhập 4 chữ số theo thứ tự</div> */}
              <div style={styles.codeDisplay}>
                {code.map((digit, i) => (
                  <div key={i} style={styles.digitWrapper}>
                    <button style={styles.arrowBtn} onClick={() => adjustCode(i, "up")}>▲</button>
                    <div style={styles.digit3D}>{digit}</div>
                    <button style={styles.arrowBtn} onClick={() => adjustCode(i, "down")}>▼</button>
                  </div>
                ))}
              </div>
              <button style={styles.unlockBtn} onClick={checkCode}>MỞ KHÓA</button>
              <button style={styles.cancelBtn} onClick={() => {setLockOpen(false); setCode(["0","0","0","0"]);}}>HỦY BỎ</button>
            </div>
          </div>
        )}
        </>
      )}

      {stage === "win" && (
        <div style={styles.screen}>
          <div style={styles.winBox}>
            <h1 style={styles.winTitle}>🎉 HOÀN THÀNH!</h1>
            <p style={styles.winText}>
              Mật khẩu: <span style={styles.correctAnswer}>0 7 0 3</span>
            </p>
            <div style={styles.sparkles}>✨ ⭐ ✨ ⭐ ✨</div>
          </div>
        </div>
      )}

      {stage === "lose" && (
        <div style={{...styles.screen, animation: "flicker 0.3s ease-in-out 5"}}>
          <div style={styles.loseBox}>
            <h1 style={styles.loseTitle}>❌ SAI MẬT KHẨU</h1>
            <p style={styles.loseText}>Đèn chớp tắt...</p>
            <p style={styles.loseSubtext}>Suy nghĩ lại về manh mối.</p>
            <button style={styles.retryBtn} onClick={() => {
              setStage("room");
              setLockOpen(false);
              setCode(["0", "0", "0", "0"]);
              audioRef.current?.play();
            }}>
              THỬ LẠI
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function adjustBrightness(color, percent) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
  return "#" + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1);
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
    background: "linear-gradient(180deg, #000000 0%, #0a0a0a 30%, #050505 60%, #000 100%)",
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
    maxWidth: "clamp(500px, 70vw, 700px)",
    textAlign: "center",
    padding: "clamp(30px, 5vw, 40px)",
    background: "rgba(10, 10, 10, 0.95)",
    border: "4px solid rgba(139,0,0,0.6)",
    borderRadius: "15px",
    boxShadow: "0 25px 80px rgba(0,0,0,0.95)"
  },
  introTitle: {
    fontSize: "clamp(2.2rem, 4vw, 3rem)",
    color: "#8B0000",
    marginBottom: "clamp(20px, 3vh, 30px)",
    textShadow: "0 0 35px rgba(139, 0, 0, 0.8)",
    fontFamily: "'Noto Serif', Georgia, serif"
  },
  storyText: {
    fontSize: "clamp(1.1rem, 1.8vw, 1.35rem)",
    lineHeight: "clamp(1.6, 2vh, 2)",
    marginBottom: "clamp(18px, 2.5vh, 25px)",
    color: "#999",
    fontFamily: "'Noto Serif', Georgia, serif"
  },
  continueBtn: {
    marginTop: "clamp(20px, 3vh, 30px)",
    background: "linear-gradient(135deg, rgba(139,0,0,0.8), rgba(80,0,0,0.9))",
    border: "3px solid rgba(139,0,0,0.8)",
    color: "#fff",
    padding: "clamp(12px, 1.6vh, 16px) clamp(35px, 4.5vw, 45px)",
    fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
    cursor: "pointer",
    borderRadius: "10px",
    transition: "all 0.3s ease",
    fontWeight: "bold",
    fontFamily: "'Noto Sans', Arial, sans-serif"
  },
  
  // CỬA - HOÀN TOÀN CỐ ĐỊNH
  doorWrapper: {
    position: "fixed",
    top: "25vh",
    left: "58%",
    transform: "translate(-50%, 0)",
    width: "16vw",
    minWidth: "180px",
    height: "33vh",
    minHeight: "300px",
    zIndex: 10,
    cursor: "pointer"
  },
  doorImage: {
    position: "absolute",
    inset: 0,
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // border: "3px solid rgba(139,0,0,0.3)",
    // borderRadius: "10px"
  },
  lockImage: {
    position: "absolute",
    top: "50%",
    left: "75%",
    transform: "translate(-50%, -50%)",
    width: "4vw",
    minWidth: "40px",
    height: "5vh",
    minHeight: "50px",
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "8px",
    transition: "all 0.4s ease",
    zIndex: 20
  },
  lockPlaceholder: {
    fontSize: "2rem"
  },
  placeholderText: {
    color: "#666",
    fontSize: "1rem",
    textAlign: "center",
    fontFamily: "'Noto Sans', Arial, sans-serif"
  },
  
  // BÀN VÀ KHAY BI - HOÀN TOÀN CỐ ĐỊNH
  // tableWrapper: {
  //   position: "fixed",
  //   bottom: "5vh",
  //   left: "50%",
  //   transform: "translateX(-50%) perspective(1200px) rotateX(25deg)",
  //   zIndex: 5
  // },
  // tableShadow: {
  //   position: "absolute",
  //   width: "90vw",
  //   maxWidth: "950px",
  //   height: "60vh",
  //   maxHeight: "650px",
  //   top: "35px",
  //   left: "50%",
  //   transform: "translateX(-50%)",
  //   background: "radial-gradient(ellipse, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, transparent 75%)",
  //   filter: "blur(30px)",
  //   zIndex: -1
  // },
  // tableTop: {
  //   position: "relative",
  //   width: "85vw",
  //   maxWidth: "900px",
  //   height: "55vh",
  //   maxHeight: "600px"
  // },
  // tableEdge: {
  //   position: "absolute",
  //   width: "100%",
  //   height: "100%",
  //   background: "linear-gradient(135deg, #2a2520 0%, #1a1510 15%, #0f0a08 35%, #050302 50%, #0f0a08 65%, #1a1510 85%, #2a2520 100%)",
  //   borderRadius: "20px",
  //   boxShadow: "0 25px 70px rgba(0,0,0,0.95)"
  // },
  // tableSurface: {
  //   position: "absolute",
  //   width: "calc(100% - 30px)",
  //   height: "calc(100% - 30px)",
  //   top: "15px",
  //   left: "15px",
  //   background: "linear-gradient(135deg, #1a1510 0%, #0f0a08 30%, #050302 50%, #0f0a08 70%, #1a1510 100%)",
  //   borderRadius: "15px",
  //   boxShadow: "inset 0 5px 25px rgba(0,0,0,0.9)"
  // },
  // tableLeg: {
  //   position: "absolute",
  //   width: "7vw",
  //   maxWidth: "70px",
  //   height: "25vh",
  //   maxHeight: "280px",
  //   background: "linear-gradient(to bottom, #2a2520 0%, #1a1510 15%, #0f0a08 40%, #050302 70%, #000 100%)",
  //   borderRadius: "10px",
  //   boxShadow: "0 20px 60px rgba(0,0,0,0.95)",
  //   transform: "perspective(1000px) rotateX(-20deg)"
  // },
  
  // KHAY BI TRÊN BÀN
  marbleTray: {
    position: "absolute",
    top: "60%",
    left: "35%",
    transform: "translate(-50%, -50%)",
    width: "24vw",
    minWidth: "200px",
    height: "24vh",
    minHeight: "200px",
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    // border: "3px solid rgba(139,0,0,0.3)",
    // borderRadius: "15px",
    zIndex: 100
  },
  trayMarbles: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px"
  },
  miniMarble: {
    width: "clamp(24px, 3vw, 30px)",
    height: "clamp(24px, 3vh, 30px)",
    borderRadius: "50%",
    boxShadow: "0 3px 12px rgba(0,0,0,0.8), inset -5px -5px 12px rgba(0,0,0,0.5)"
  },
  trayLabel: {
    fontSize: "clamp(0.8rem, 1.2vw, 1rem)",
    color: "#666",
    fontWeight: "bold",
    textShadow: "0 1px 8px rgba(0,0,0,0.8)",
    fontFamily: "'Noto Sans', Arial, sans-serif"
  },
  deckOpenView: {
    position: "fixed",
    inset: 0,
    zIndex: 500
  },
  closeMarbleBtn: {
    position: "fixed",
    top: "clamp(20px, 3vh, 30px)",
    right: "clamp(20px, 3vw, 30px)",
    background: "linear-gradient(135deg, rgba(139,0,0,0.8), rgba(80,0,0,0.9))",
    border: "3px solid rgba(139,0,0,0.8)",
    color: "#fff",
    padding: "clamp(12px, 1.5vh, 15px) clamp(24px, 3vw, 30px)",
    fontSize: "clamp(0.9rem, 1.3vw, 1.1rem)",
    cursor: "pointer",
    borderRadius: "10px",
    fontWeight: "bold",
    boxShadow: "0 5px 25px rgba(0,0,0,0.9)",
    zIndex: 1000,
    transition: "all 0.3s ease",
    fontFamily: "'Noto Sans', Arial, sans-serif"
  },
  deckOpenBg: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(135deg, #0a0a0a 0%, #000 50%, #0a0a0a 100%)",
    zIndex: 1
  },
  marble: {
    position: "absolute",
    width: "clamp(40px, 5vw, 50px)",
    height: "clamp(40px, 5vh, 50px)",
    borderRadius: "50%",
    boxShadow: "0 8px 30px rgba(0,0,0,0.8), inset -10px -10px 25px rgba(0,0,0,0.6)",
    transition: "transform 0.2s ease",
    border: "2px solid rgba(255,255,255,0.1)"
  },
  marbleShine: {
    position: "absolute",
    width: "clamp(16px, 2vw, 20px)",
    height: "clamp(16px, 2vh, 20px)",
    top: "clamp(6px, 0.8vh, 8px)",
    left: "clamp(10px, 1.2vw, 12px)",
    background: "radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)",
    borderRadius: "50%",
    filter: "blur(3px)"
  },
  marbleReflection: {
    position: "absolute",
    width: "clamp(12px, 1.5vw, 15px)",
    height: "clamp(12px, 1.5vh, 15px)",
    bottom: "clamp(8px, 1vh, 10px)",
    right: "clamp(8px, 1vw, 10px)",
    background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)",
    borderRadius: "50%",
    filter: "blur(2px)"
  },
  jumpscareOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.97)",
    zIndex: 2000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  jumpscareBox: {
    textAlign: "center",
    maxWidth: "clamp(450px, 60vw, 600px)",
    padding: "clamp(30px, 4vw, 40px)"
  },
  ghostFace: {
    position: "fixed",
    left: "50vh",
    fontSize: "clamp(6rem, 10vw, 8rem)",
    marginBottom: "clamp(20px, 3vh, 30px)",
    animation: "shake 0.5s ease-in-out infinite",
    filter: "drop-shadow(0 0 40px rgba(155, 89, 182, 0.9))"
  },
  speechBubble: {
    background: "rgba(10, 10, 10, 0.95)",
    border: "4px solid rgba(139,0,0,0.6)",
    borderRadius: "20px",
    padding: "clamp(24px, 3vw, 30px)",
    marginBottom: "clamp(16px, 2vh, 20px)",
    boxShadow: "0 0 50px rgba(139,0,0,0.5)"
  },
  speechText: {
    fontSize: "clamp(1.05rem, 1.6vw, 1.3rem)",
    color: "#999",
    marginBottom: "clamp(12px, 1.5vh, 15px)",
    lineHeight: "clamp(1.6, 1.8vh, 1.8)",
    fontFamily: "'Noto Serif', Georgia, serif"
  },
  clickToContinue: {
    fontSize: "clamp(0.75rem, 1.1vw, 0.9rem)",
    color: "#555",
    fontStyle: "italic",
    animation: "blink 1.5s ease-in-out infinite",
    fontFamily: "'Noto Sans', Arial, sans-serif"
  },
  controls: {
    position: "absolute",
    bottom: "clamp(20px, 3vh, 30px)",
    left: "50%",
    transform: "translateX(-50%)",
    textAlign: "center",
    zIndex: 300,
    display: "flex",
    flexDirection: "column",
    gap: "clamp(8px, 1vh, 10px)",
    alignItems: "center"
  },
  hintBox: {
    background: "rgba(10, 10, 10, 0.92)",
    border: "2px solid rgba(139,0,0,0.6)",
    padding: "clamp(12px, 1.5vh, 15px) clamp(24px, 3vw, 30px)",
    borderRadius: "10px",
    color: "#999",
    fontSize: "clamp(0.85rem, 1.2vw, 1rem)",
    boxShadow: "0 5px 25px rgba(139,0,0,0.4)",
    fontFamily: "'Noto Sans', Arial, sans-serif"
  },
  // MODAL NHẬP MẬT KHẨU
  lockModal: {
    position: "fixed",
    inset: 0,
    background: "rgba(15,25,30,0.92)",  // ← Màu xanh xám tối thay vì đen
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 400,
    backdropFilter: "blur(12px)",
    backgroundSize: "cover",
    backgroundPosition: "center"
  },
  lockPanel3D: {
    width: "35vw",
    maxWidth: "550px",
    minWidth: "380px",
    background: "linear-gradient(135deg, #1a2832 0%, #0f1a21 50%, #0a1419 100%)",  // ← Gradient xanh xám cũ kỹ
    border: "4px solid rgba(60,80,90,0.6)",  // ← Viền xanh xám thay vì đỏ
    borderRadius: "15px",
    padding: "40px 30px",
    textAlign: "center",
    color: "#b0b8c0",  // ← Chữ xám nhạt
    boxShadow: "0 45px 120px rgba(0,0,0,0.99), inset 0 3px 35px rgba(40,60,70,0.3)",  // ← Shadow xanh nhạt
    fontFamily: "'Noto Serif', Georgia, serif"
  },
  lockPanelTitle: {
    fontSize: "2.2rem",
    marginBottom: "25px",
    textShadow: "0 0 30px rgba(80,110,130,0.8)",  // ← Glow xanh xám
    fontWeight: "bold",
    letterSpacing: "3px",
    color: "#a0b0c0"  // ← Xám xanh nhạt thay vì đỏ
  },
  lockInstructions: {
    fontSize: "1rem",
    color: "#8090a0",  // ← Xám trung bình
    marginBottom: "35px",
    fontStyle: "italic"
  },
  codeDisplay: {
    display: "flex",
    justifyContent: "center",
    gap: "25px",
    marginBottom: "40px"
  },
  digitWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px"
  },
  arrowBtn: {
    width: "60px",
    height: "50px",
    background: "linear-gradient(135deg, rgba(40,50,60,0.9), rgba(25,35,45,0.95))",  // ← Xanh xám tối
    border: "3px solid rgba(70,90,100,0.5)",  // ← Viền xanh xám
    color: "#b0b8c0",  // ← Chữ xám nhạt
    fontSize: "1.4rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    boxShadow: "0 6px 20px rgba(0,0,0,0.8)",
    fontFamily: "'Noto Sans', Arial, sans-serif"
  },
  digit3D: {
    width: "85px",
    height: "100px",
    background: "linear-gradient(135deg, #0f1a21 0%, #0a1419 40%, #060d12 70%, #000 100%)",  // ← Gradient xanh đen
    border: "4px solid rgba(60,80,95,0.6)",  // ← Viền xanh xám
    borderRadius: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "3.8rem",
    color: "#90a5b5",  // ← Số màu xám xanh nhạt thay vì đỏ
    fontWeight: "bold",
    boxShadow: "inset 0 8px 35px rgba(0,0,0,0.99), 0 10px 40px rgba(50,70,80,0.4)",  // ← Shadow xanh
    textShadow: "0 0 40px rgba(100,130,150,0.7), 0 0 70px rgba(80,110,130,0.4)",  // ← Glow xanh xám
    fontFamily: "'Noto Sans', Arial, sans-serif"
  },
  unlockBtn: {
    width: "100%",
    background: "linear-gradient(135deg, rgba(50,70,85,0.8) 0%, rgba(40,60,75,0.9) 35%, rgba(30,50,65,0.95) 70%, rgba(20,40,55,1) 100%)",  // ← Gradient xanh xám
    border: "4px solid rgba(60,85,100,0.8)",  // ← Viền xanh
    color: "#d0d8e0",  // ← Chữ xám rất nhạt
    padding: "20px 0",
    fontSize: "1.5rem",
    borderRadius: "15px",
    cursor: "pointer",
    fontWeight: "bold",
    letterSpacing: "3px",
    marginBottom: "20px",
    boxShadow: "0 15px 50px rgba(40,60,75,0.6), inset 0 3px 15px rgba(100,120,140,0.2)",  // ← Shadow xanh
    transition: "all 0.3s ease",
    textShadow: "0 2px 8px rgba(0,0,0,0.9)",
    fontFamily: "'Noto Sans', Arial, sans-serif"
  },
  cancelBtn: {
    width: "100%",
    background: "transparent",
    border: "3px solid rgba(80,95,110,0.5)",  // ← Viền xám xanh
    color: "#8090a0",  // ← Chữ xám trung bình
    padding: "15px 0",
    fontSize: "1.05rem",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    fontFamily: "'Noto Sans', Arial, sans-serif"
  },
  winBox: {
    textAlign: "center",
    position: "relative"
  },
  winTitle: {
    fontSize: "clamp(3rem, 5vw, 4rem)",
    color: "#8B0000",
    textShadow: "0 0 60px rgba(139,0,0,0.9)",
    marginBottom: "clamp(20px, 3vh, 30px)",
    animation: "bounce 1s ease infinite",
    fontFamily: "'Noto Serif', Georgia, serif"
  },
  winText: {
    fontSize: "clamp(1.2rem, 2vw, 1.6rem)",
    marginBottom: "clamp(14px, 1.8vh, 18px)",
    color: "#999",
    fontFamily: "'Noto Serif', Georgia, serif"
  },
  correctAnswer: {
    color: "#8B0000",
    fontSize: "clamp(1.8rem, 2.8vw, 2.2rem)",
    fontWeight: "bold",
    textShadow: "0 0 40px rgba(139,0,0,0.9)"
  },
  winSubtext: {
    fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
    color: "#666",
    marginTop: "clamp(12px, 1.5vh, 15px)",
    marginBottom: "clamp(12px, 1.5vh, 15px)",
    fontFamily: "'Noto Serif', Georgia, serif"
  },
  sparkles: {
    fontSize: "clamp(2rem, 3vw, 2.5rem)",
    marginTop: "clamp(20px, 2.5vh, 25px)",
    marginBottom: "clamp(28px, 3.5vh, 35px)",
    animation: "twinkle 1s ease-in-out infinite"
  },
  loseBox: {
    textAlign: "center"
  },
  loseTitle: {
    fontSize: "clamp(3rem, 5vw, 4rem)",
    color: "#8B0000",
    textShadow: "0 0 60px rgba(139,0,0,0.9)",
    marginBottom: "clamp(20px, 3vh, 30px)",
    fontFamily: "'Noto Serif', Georgia, serif"
  },
  loseText: {
    fontSize: "clamp(1.2rem, 2vw, 1.5rem)",
    marginBottom: "clamp(16px, 2vh, 20px)",
    color: "#999",
    fontFamily: "'Noto Serif', Georgia, serif"
  },
  loseSubtext: {
    fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
    color: "#666",
    marginBottom: "clamp(32px, 4vh, 40px)",
    fontFamily: "'Noto Serif', Georgia, serif"
  },
  retryBtn: {
    background: "linear-gradient(135deg, rgba(139,0,0,0.8), rgba(80,0,0,0.9))",
    border: "3px solid rgba(139,0,0,0.8)",
    color: "#fff",
    padding: "clamp(14px, 1.8vh, 18px) clamp(40px, 5vw, 50px)",
    fontSize: "clamp(1.05rem, 1.6vw, 1.3rem)",
    cursor: "pointer",
    borderRadius: "12px",
    fontWeight: "bold",
    letterSpacing: "clamp(1.5px, 0.2vw, 2px)",
    boxShadow: "0 10px 35px rgba(139,0,0,0.7)",
    fontFamily: "'Noto Sans', Arial, sans-serif"
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
    20% { opacity: 0.3; }
    22% { opacity: 1; }
    50% { opacity: 0.8; }
    60% { opacity: 0.4; }
    62% { opacity: 1; }
    70% { opacity: 0.5; }
    72% { opacity: 1; }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.8; }
  }
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }
  @keyframes twinkle {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.3; transform: scale(0.9); }
  }
  @keyframes flicker {
    0%, 100% { opacity: 1; }
    25% { opacity: 0.1; }
    50% { opacity: 0.8; }
    75% { opacity: 0.2; }
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0) rotate(0deg); }
    25% { transform: translateX(-10px) rotate(-5deg); }
    75% { transform: translateX(10px) rotate(5deg); }
  }
  @keyframes jumpscareAppear {
    from { opacity: 0; transform: scale(0.5); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
  @keyframes swing {
    0%, 100% { transform: rotate(-3deg); }
    50% { transform: rotate(3deg); }
  }
  @keyframes lockGlow {
    0%, 100% { filter: drop-shadow(0 0 8px rgba(139,0,0,0.8)); }
    50% { filter: drop-shadow(0 0 20px rgba(139,0,0,1)); }
  }
  @keyframes fogMove {
    0%, 100% { transform: translateX(0) scale(1); }
    50% { transform: translateX(20px) scale(1.05); }
  }
  @keyframes drip {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(10px); }
  }
  
  [data-pos="fl"] { left: clamp(96px, 12vw, 120px); top: 100%; }
  [data-pos="fr"] { right: clamp(96px, 12vw, 120px); top: 100%; }
  [data-pos="bl"] { left: clamp(112px, 14vw, 140px); top: 92%; opacity: 0.4; filter: blur(3px); }
  [data-pos="br"] { right: clamp(112px, 14vw, 140px); top: 92%; opacity: 0.4; filter: blur(3px); }
  
  button:hover {
    transform: scale(1.05);
  }
`;
document.head.appendChild(styleSheet);