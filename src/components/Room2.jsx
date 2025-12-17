import React, { useState, useEffect, useRef } from "react";
import laughSound from "../Audio/tieng_ma_cuoi-www_tiengdong_com.mp3";
import voiceSound from "../Audio/mp3-output-ttsfree(dot)com.mp3";

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

  const marbles = [
    ...Array(10).fill(null).map((_, i) => ({ id: `red-${i}`, color: "#8B0000", name: "Đỏ" })),
    ...Array(5).fill(null).map((_, i) => ({ id: `yellow-${i}`, color: "#8B8B00", name: "Vàng" })),
    ...Array(7).fill(null).map((_, i) => ({ id: `blue-${i}`, color: "#00008B", name: "Xanh Dương" })),
    ...Array(8).fill(null).map((_, i) => ({ id: `green-${i}`, color: "#006400", name: "Xanh Lá" }))
  ];

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
      const minDistance = 70;
      const areaWidth = 800;
      const areaHeight = 600;

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
            <div style={styles.roomBg}></div>
            <div style={styles.fog}></div>
            <div style={styles.vignette}></div>
            <div style={styles.crackOverlay}></div>
            
            {/* Blood stains */}
            <div style={{...styles.bloodStain, top: "25%", right: "18%", width: "100px", height: "70px"}}></div>
            <div style={{...styles.bloodStain, bottom: "15%", left: "22%", width: "90px", height: "90px", opacity: 0.4}}></div>

            {!deckOpen && (
              <>
                {/* Chains */}
                <div style={{...styles.chains, top: "10%", left: "8%", animationDelay: "0s"}}>⛓️</div>
                <div style={{...styles.chains, top: "8%", right: "12%", animationDelay: "0.8s"}}>⛓️</div>
                <div style={{...styles.chains, bottom: "20%", right: "15%", animationDelay: "1.5s"}}>⛓️</div>

                {/* Đèn trần với hiệu ứng nhấp nháy */}
                <div style={styles.ceilingLamp}>
                  <div style={styles.lampChain}></div>
                  <div style={styles.lampShade}>
                    <div style={styles.lampTop}></div>
                    <div style={styles.lampBottom}></div>
                    <div style={styles.lampGlow}></div>
                  </div>
                </div>

                {/* Tranh cổ kinh dị */}
                <div style={styles.oldPainting}>
                  <div style={styles.paintingFrame}></div>
                  <div style={styles.paintingCanvas}>
                    <div style={styles.skullInFrame}>💀</div>
                  </div>
                </div>

                {/* Kệ sách tối */}
                <div style={styles.bookshelf}>
                  <div style={styles.shelfBack}></div>
                  <div style={styles.shelf1}></div>
                  <div style={styles.shelf2}></div>
                  {[...Array(5)].map((_, i) => (
                    <div key={i} style={{...styles.book, left: `${10 + i * 18}%`, top: `${15 + (i % 2) * 30}%`}}></div>
                  ))}
                  <div style={styles.cobweb}>🕸️</div>
                </div>

                {/* Đồng hồ kinh dị */}
                <div style={styles.oldClock}>
                  <div style={styles.clockFace}>🕰️</div>
                  <div style={styles.clockGlow}></div>
                </div>

                {/* Thảm sàn tối */}
                <div style={styles.floorRug}></div>
              </>
            )}

            {/* Cửa */}
            {!deckOpen && (
              <div
                style={{
                  ...styles.doorWrapper,
                  cursor: jumpscareTriggered ? 'pointer' : 'default',
                  filter: hovered === "door" && jumpscareTriggered 
                    ? "brightness(1.15) drop-shadow(0 0 80px rgba(139,0,0,0.8))" 
                    : "none",
                  transform: hovered === "door" && jumpscareTriggered
                    ? "translateX(-50%) scale(1.02)" 
                    : "translateX(-50%)",
                  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
                }}
                onClick={() => jumpscareTriggered && setLockOpen(true)}
                onMouseEnter={() => setHovered("door")}
                onMouseLeave={() => setHovered(null)}
              >
                <div style={styles.doorFrame}>
                  <div style={styles.doorFrameTop}></div>
                  <div style={styles.doorFrameLeft}></div>
                  <div style={styles.doorFrameRight}></div>
                </div>
                <div style={styles.door3D}>
                  <div style={styles.doorShadow}></div>
                  <div style={styles.doorPanel}>
                    <div style={styles.doorLine1}></div>
                    <div style={styles.doorLine2}></div>
                    <div style={styles.doorBloodDrip}>🩸</div>
                  </div>
                  <div style={{
                    ...styles.doorLock,
                    opacity: jumpscareTriggered ? 1 : 0.4,
                    animation: jumpscareTriggered ? "lockGlow 2s ease-in-out infinite" : "none"
                  }}>
                    <div style={styles.lockShackle}></div>
                    <div style={styles.lockBody}>
                      <div style={styles.lockKeyhole}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bàn */}
            {!deckOpen && (
              <div style={styles.tableWrapper}>
                <div style={styles.tableShadow}></div>
                <div style={styles.tableTop}>
                  <div style={styles.tableEdge}></div>
                  <div style={styles.tableSurface}>
                    <div style={styles.marbleTray} onClick={() => setDeckOpen(true)}>
                      <div style={styles.trayShadow}></div>
                      <div style={{
                        ...styles.trayBody,
                        transform: hovered === "tray" ? "scale(1.08)" : "scale(1)",
                        filter: hovered === "tray" ? "brightness(1.2) drop-shadow(0 0 60px rgba(139,0,0,0.7))" : "none",
                        transition: "all 0.4s ease"
                      }}
                      onMouseEnter={() => setHovered("tray")}
                      onMouseLeave={() => setHovered(null)}>
                        <div style={styles.trayMarbles}>
                          <div style={{...styles.miniMarble, background: "#8B0000"}}></div>
                          <div style={{...styles.miniMarble, background: "#8B8B00"}}></div>
                          <div style={{...styles.miniMarble, background: "#00008B"}}></div>
                          <div style={{...styles.miniMarble, background: "#006400"}}></div>
                        </div>
                        <div style={styles.trayLabel}>Nhấn để xem</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={styles.tableLeg} data-pos="fl"></div>
                <div style={styles.tableLeg} data-pos="fr"></div>
                <div style={styles.tableLeg} data-pos="bl"></div>
                <div style={styles.tableLeg} data-pos="br"></div>
              </div>
            )}

            {/* Khay bi fullscreen */}
            {deckOpen && (
              <div style={styles.deckOpenView}>
                <button
                  style={styles.closeMarbleBtn}
                  onClick={closeDeck}
                >
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

            {/* Jumpscare */}
            {jumpscareShown && (
              <div style={{...styles.jumpscareOverlay, animation: "jumpscareAppear 0.5s ease-out"}} onClick={() => setJumpscareShown(false)}>
                <div style={styles.jumpscareBox}>
                  <div style={styles.ghostFace}>👻</div>
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

            {/* Controls */}
            <div style={styles.controls}>
              {jumpscareTriggered && !deckOpen && (
                <div style={styles.hintBox}>
                  💡 Manh mối: Không có TÍM, không có CAM... 🤔
                </div>
              )}
            </div>
          </div>

          {/* Modal mật khẩu */}
          {lockOpen && (
            <div style={styles.lockModal} onClick={() => setLockOpen(false)}>
              <div style={styles.lockPanel} onClick={e => e.stopPropagation()}>
                <div style={styles.lockPanelTitle}>🔐 NHẬP MẬT KHẨU</div>
                <div style={styles.lockInstructions}>Tìm ra mật khẩu 4 chữ số từ manh mối</div>
                <div style={styles.codeDisplay}>
                  {code.map((digit, i) => (
                    <div key={i} style={styles.digitWrapper}>
                      <button style={styles.arrowBtn} onClick={() => adjustCode(i, "up")}>▲</button>
                      <div style={styles.digit}>{digit}</div>
                      <button style={styles.arrowBtn} onClick={() => adjustCode(i, "down")}>▼</button>
                    </div>
                  ))}
                </div>
                <button style={styles.unlockBtn} onClick={checkCode}>🔓 MỞ KHÓA</button>
                <button style={styles.cancelBtn} onClick={() => { setLockOpen(false); setCode(["0","0","0","0"]); }}>
                  HỦY BỎ
                </button>
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
            {/* <p style={styles.winSubtext}>0 TÍM • 7 XANH DƯƠNG • 0 CAM • 3 CÒN LẠI</p> */}
            {/* <p style={styles.winSubtext}>Bạn đã thoát khỏi cả hai phòng!</p> */}
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
    fontFamily: "Georgia, serif",
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
    fontSize: "3rem",
    color: "#8B0000",
    marginBottom: "30px",
    textShadow: "0 0 35px rgba(139, 0, 0, 0.8)"
  },
  storyText: {
    fontSize: "1.35rem",
    lineHeight: "2",
    marginBottom: "25px",
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
  vignette: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(ellipse at center, transparent 15%, rgba(0,0,0,0.85) 100%)",
    pointerEvents: "none",
    zIndex: 3
  },
  crackOverlay: {
    position: "absolute",
    inset: 0,
    backgroundImage: `
      linear-gradient(${Math.random() * 360}deg, transparent 30%, rgba(0,0,0,0.3) 31%, transparent 32%),
      linear-gradient(${Math.random() * 360}deg, transparent 45%, rgba(0,0,0,0.2) 46%, transparent 47%)
    `,
    opacity: 0.5,
    pointerEvents: "none",
    zIndex: 4
  },
  bloodStain: {
    position: "absolute",
    background: "radial-gradient(ellipse, rgba(139,0,0,0.4) 0%, rgba(80,0,0,0.2) 40%, transparent 70%)",
    borderRadius: "50%",
    filter: "blur(8px)",
    pointerEvents: "none",
    zIndex: 5,
    animation: "pulse 8s ease-in-out infinite"
  },
  chains: {
    position: "absolute",
    fontSize: "1.5rem",
    color: "#333",
    opacity: 0.3,
    textShadow: "0 2px 8px rgba(0,0,0,0.9)",
    animation: "swing 3s ease-in-out infinite",
    zIndex: 6
  },
  ceilingLamp: {
    position: "absolute",
    top: "5%",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 8
  },
  lampChain: {
    width: "3px",
    height: "80px",
    background: "linear-gradient(to bottom, #222, #000)",
    margin: "0 auto",
    boxShadow: "0 2px 8px rgba(0,0,0,0.9)"
  },
  lampShade: {
    position: "relative",
    width: "120px",
    height: "60px"
  },
  lampTop: {
    width: "50px",
    height: "12px",
    background: "linear-gradient(135deg, #2a2520, #1a1510)",
    borderRadius: "50%",
    margin: "0 auto",
    boxShadow: "0 5px 20px rgba(0,0,0,0.8)"
  },
  lampBottom: {
    width: "120px",
    height: "60px",
    background: "linear-gradient(135deg, #3a3025 0%, #2a2520 50%, #1a1510 100%)",
    borderRadius: "0 0 50% 50%",
    boxShadow: "0 10px 40px rgba(0,0,0,0.9), inset 0 -5px 20px rgba(0,0,0,0.7)",
    border: "3px solid #000",
    margin: "0 auto"
  },
  lampGlow: {
    width: "180px",
    height: "180px",
    background: "radial-gradient(circle, rgba(139,0,0,0.2), transparent 70%)",
    position: "absolute",
    bottom: "-50px",
    left: "50%",
    transform: "translateX(-50%)",
    animation: "lightFlicker 4s ease-in-out infinite",
    pointerEvents: "none"
  },
  oldPainting: {
    position: "absolute",
    top: "15%",
    left: "10%",
    zIndex: 6
  },
  paintingFrame: {
    width: "150px",
    height: "120px",
    background: "linear-gradient(135deg, #1a1510 0%, #0f0a08 100%)",
    border: "8px solid #000",
    boxShadow: "0 10px 35px rgba(0,0,0,0.9), inset 0 2px 8px rgba(0,0,0,0.8)",
    borderRadius: "5px"
  },
  paintingCanvas: {
    position: "absolute",
    inset: "8px",
    background: "linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  skullInFrame: {
    fontSize: "3.5rem",
    opacity: 0.6,
    filter: "grayscale(1) brightness(0.5)",
    animation: "pulse 5s ease-in-out infinite"
  },
  bookshelf: {
    position: "absolute",
    top: "20%",
    right: "8%",
    width: "180px",
    height: "380px",
    zIndex: 6
  },
  shelfBack: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(135deg, #1a1510 0%, #0f0a08 50%, #000 100%)",
    borderRadius: "10px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.95), inset 0 8px 40px rgba(0,0,0,0.9)"
  },
  shelf1: {
    position: "absolute",
    width: "calc(100% - 20px)",
    height: "12px",
    left: "10px",
    top: "30%",
    background: "linear-gradient(to bottom, #2a2520, #1a1510)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.9)"
  },
  shelf2: {
    position: "absolute",
    width: "calc(100% - 20px)",
    height: "12px",
    left: "10px",
    top: "65%",
    background: "linear-gradient(to bottom, #2a2520, #1a1510)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.9)"
  },
  book: {
    position: "absolute",
    width: "22px",
    height: "70px",
    background: "linear-gradient(135deg, #2a1810, #1a1008, #0a0504)",
    border: "1px solid #000",
    borderRadius: "2px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.9)"
  },
  cobweb: {
    position: "absolute",
    top: "-8px",
    right: "-8px",
    fontSize: "2rem",
    opacity: 0.4,
    filter: "grayscale(1)",
    animation: "swing 4s ease-in-out infinite"
  },
  oldClock: {
    position: "absolute",
    top: "12%",
    right: "28%",
    zIndex: 6
  },
  clockFace: {
    fontSize: "3rem",
    filter: "brightness(0.6) grayscale(0.8)",
    animation: "swing 4s ease-in-out infinite"
  },
  clockGlow: {
    position: "absolute",
    width: "80px",
    height: "80px",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "radial-gradient(circle, rgba(139,0,0,0.2), transparent 70%)",
    animation: "pulse 3s ease-in-out infinite",
    pointerEvents: "none"
  },
  floorRug: {
    position: "absolute",
    bottom: "2%",
    left: "50%",
    transform: "translateX(-50%) perspective(800px) rotateX(65deg)",
    width: "400px",
    height: "250px",
    background: "repeating-linear-gradient(45deg, #1a1510, #1a1510 10px, #0f0a08 10px, #0f0a08 20px)",
    borderRadius: "15px",
    boxShadow: "0 20px 70px rgba(0,0,0,0.9)",
    border: "5px solid #000",
    zIndex: 4,
    opacity: 0.5
  },
  doorWrapper: {
    position: "absolute",
    top: "8%",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 10
  },
  doorFrame: {
    position: "absolute",
    width: "240px",
    height: "340px",
    top: "-20px",
    left: "-20px",
    zIndex: -1
  },
  doorFrameTop: {
    position: "absolute",
    left: "0",
    top: "0",
    width: "100%",
    height: "20px",
    background: "linear-gradient(to bottom, #000 0%, #0a0a0a 60%, #1a1510 100%)",
    borderRadius: "12px 12px 0 0",
    boxShadow: "0 8px 25px rgba(0,0,0,0.95)"
  },
  doorFrameLeft: {
    position: "absolute",
    left: "0",
    top: "0",
    width: "20px",
    height: "100%",
    background: "linear-gradient(to right, #000 0%, #0a0a0a 60%, #1a1510 100%)",
    borderRadius: "12px 0 0 8px",
    boxShadow: "inset -5px 0 15px rgba(0,0,0,0.9)"
  },
  doorFrameRight: {
    position: "absolute",
    right: "0",
    top: "0",
    width: "20px",
    height: "100%",
    background: "linear-gradient(to left, #000 0%, #0a0a0a 60%, #1a1510 100%)",
    borderRadius: "0 12px 8px 0",
    boxShadow: "inset 5px 0 15px rgba(0,0,0,0.9)"
  },
  door3D: {
    position: "relative",
    width: "200px",
    height: "320px"
  },
  doorShadow: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(135deg, transparent 0%, rgba(0,0,0,0.8) 100%)",
    borderRadius: "15px 15px 2px 2px"
  },
  doorPanel: {
    position: "relative",
    width: "100%",
    height: "100%",
    background: "linear-gradient(135deg, #2a2520 0%, #1a1510 15%, #0f0a08 35%, #050302 50%, #0f0a08 65%, #1a1510 85%, #2a2520 100%)",
    border: "8px solid #1a1510",
    borderRadius: "15px 15px 2px 2px",
    boxShadow: "inset 0 3px 25px rgba(0,0,0,0.95), 0 15px 60px rgba(0,0,0,0.9)",
    transform: "rotateX(2deg)"
  },
  doorLine1: {
    position: "absolute",
    width: "calc(100% - 30px)",
    height: "3px",
    top: "38%",
    left: "15px",
    background: "linear-gradient(90deg, transparent, #0f0a08 20%, #0f0a08 80%, transparent)",
    opacity: 0.6
  },
  doorLine2: {
    position: "absolute",
    width: "3px",
    height: "calc(100% - 30px)",
    left: "50%",
    top: "15px",
    background: "linear-gradient(180deg, transparent, #0f0a08 20%, #0f0a08 80%, transparent)",
    opacity: 0.6
  },
  doorBloodDrip: {
    position: "absolute",
    bottom: "20%",
    right: "25%",
    fontSize: "1.5rem",
    opacity: 0.6,
    animation: "drip 3s ease-in-out infinite"
  },
  doorLock: {
    position: "absolute",
    top: "50%",
    left: "78%",
    transform: "translate(-50%, -50%)",
    transition: "all 0.4s ease",
    cursor: "pointer",
    zIndex: 20
  },
  lockBody: {
    width: "35px",
    height: "45px",
    background: "linear-gradient(135deg, #3a3530 0%, #2a2520 15%, #1a1510 100%)",
    borderRadius: "8px",
    boxShadow: "inset 0 2px 8px rgba(0,0,0,0.9), 0 4px 18px rgba(0,0,0,0.9)",
    border: "2px solid #000",
    position: "relative"
  },
  lockShackle: {
    position: "absolute",
    width: "20px",
    height: "22px",
    top: "-18px",
    left: "50%",
    transform: "translateX(-50%)",
    border: "4px solid #3a3530",
    borderBottom: "none",
    borderRadius: "10px 10px 0 0",
    boxShadow: "inset 0 2px 8px rgba(0,0,0,0.9)"
  },
  lockKeyhole: {
    position: "absolute",
    width: "8px",
    height: "12px",
    background: "#000",
    borderRadius: "50% 50% 0 0",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    boxShadow: "inset 0 2px 6px rgba(0,0,0,1), 0 2px 8px rgba(139,0,0,0.3)"
  },
  tableWrapper: {
    position: "absolute",
    bottom: "5%",
    left: "50%",
    transform: "translateX(-50%) perspective(1200px) rotateX(25deg)",
    zIndex: 5
  },
  tableShadow: {
    position: "absolute",
    width: "950px",
    height: "650px",
    top: "35px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "radial-gradient(ellipse, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, transparent 75%)",
    filter: "blur(30px)",
    zIndex: -1
  },
  tableTop: {
    position: "relative",
    width: "900px",
    height: "600px"
  },
  tableEdge: {
    position: "absolute",
    width: "100%",
    height: "100%",
    background: "linear-gradient(135deg, #2a2520 0%, #1a1510 15%, #0f0a08 35%, #050302 50%, #0f0a08 65%, #1a1510 85%, #2a2520 100%)",
    borderRadius: "20px",
    boxShadow: "0 25px 70px rgba(0,0,0,0.95)"
  },
  tableSurface: {
    position: "absolute",
    width: "calc(100% - 30px)",
    height: "calc(100% - 30px)",
    top: "15px",
    left: "15px",
    background: "linear-gradient(135deg, #1a1510 0%, #0f0a08 30%, #050302 50%, #0f0a08 70%, #1a1510 100%)",
    borderRadius: "15px",
    boxShadow: "inset 0 5px 25px rgba(0,0,0,0.9)"
  },
  tableLeg: {
    position: "absolute",
    width: "70px",
    height: "280px",
    background: "linear-gradient(to bottom, #2a2520 0%, #1a1510 15%, #0f0a08 40%, #050302 70%, #000 100%)",
    borderRadius: "10px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.95)",
    transform: "perspective(1000px) rotateX(-20deg)"
  },
  marbleTray: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    cursor: "pointer",
    zIndex: 100
  },
  trayShadow: {
    position: "absolute",
    width: "200px",
    height: "200px",
    background: "rgba(0,0,0,0.8)",
    borderRadius: "50%",
    filter: "blur(25px)",
    top: "10px",
    left: "10px"
  },
  trayBody: {
    position: "relative",
    width: "200px",
    height: "200px",
    background: "radial-gradient(circle, #1a1510 0%, #0f0a08 100%)",
    border: "5px solid #000",
    borderRadius: "50%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 15px 60px rgba(0,0,0,0.9), inset 0 5px 25px rgba(0,0,0,0.8)"
  },
  trayMarbles: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px"
  },
  miniMarble: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    boxShadow: "0 3px 12px rgba(0,0,0,0.8), inset -5px -5px 12px rgba(0,0,0,0.5)"
  },
  trayLabel: {
    fontSize: "1rem",
    color: "#666",
    fontWeight: "bold",
    textShadow: "0 1px 8px rgba(0,0,0,0.8)",
    fontFamily: "Arial, sans-serif"
  },
  deckOpenView: {
    position: "fixed",
    inset: 0,
    zIndex: 500
  },
  closeMarbleBtn: {
    position: "fixed",
    top: "30px",
    right: "30px",
    background: "linear-gradient(135deg, rgba(139,0,0,0.8), rgba(80,0,0,0.9))",
    border: "3px solid rgba(139,0,0,0.8)",
    color: "#fff",
    padding: "15px 30px",
    fontSize: "1.1rem",
    cursor: "pointer",
    borderRadius: "10px",
    fontWeight: "bold",
    boxShadow: "0 5px 25px rgba(0,0,0,0.9)",
    zIndex: 1000,
    transition: "all 0.3s ease",
    fontFamily: "Arial, sans-serif"
  },
  deckOpenBg: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(135deg, #0a0a0a 0%, #000 50%, #0a0a0a 100%)",
    zIndex: 1
  },
  marble: {
    position: "absolute",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    boxShadow: "0 8px 30px rgba(0,0,0,0.8), inset -10px -10px 25px rgba(0,0,0,0.6)",
    transition: "transform 0.2s ease",
    border: "2px solid rgba(255,255,255,0.1)"
  },
  marbleShine: {
    position: "absolute",
    width: "20px",
    height: "20px",
    top: "8px",
    left: "12px",
    background: "radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)",
    borderRadius: "50%",
    filter: "blur(3px)"
  },
  marbleReflection: {
    position: "absolute",
    width: "15px",
    height: "15px",
    bottom: "10px",
    right: "10px",
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
    maxWidth: "600px",
    padding: "40px"
  },
  ghostFace: {
    fontSize: "8rem",
    marginBottom: "30px",
    animation: "shake 0.5s ease-in-out infinite",
    filter: "drop-shadow(0 0 40px rgba(155, 89, 182, 0.9))"
  },
  speechBubble: {
    background: "rgba(10, 10, 10, 0.95)",
    border: "4px solid rgba(139,0,0,0.6)",
    borderRadius: "20px",
    padding: "30px",
    marginBottom: "20px",
    boxShadow: "0 0 50px rgba(139,0,0,0.5)"
  },
  speechText: {
    fontSize: "1.3rem",
    color: "#999",
    marginBottom: "15px",
    lineHeight: "1.8"
  },
  clickToContinue: {
    fontSize: "0.9rem",
    color: "#555",
    fontStyle: "italic",
    animation: "blink 1.5s ease-in-out infinite",
    fontFamily: "Arial, sans-serif"
  },
  controls: {
    position: "absolute",
    bottom: "30px",
    left: "50%",
    transform: "translateX(-50%)",
    textAlign: "center",
    zIndex: 300,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    alignItems: "center"
  },
  hintBox: {
    background: "rgba(10, 10, 10, 0.92)",
    border: "2px solid rgba(139,0,0,0.6)",
    padding: "15px 30px",
    borderRadius: "10px",
    color: "#999",
    fontSize: "1rem",
    boxShadow: "0 5px 25px rgba(139,0,0,0.4)",
    fontFamily: "Arial, sans-serif"
  },
  lockModal: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.96)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3000,
    animation: "fadeIn 0.3s ease",
    backdropFilter: "blur(12px)"
  },
  lockPanel: {
    background: "linear-gradient(135deg, #0a0a0a 0%, #000 50%, #0a0a0a 100%)",
    border: "4px solid rgba(139,0,0,0.6)",
    borderRadius: "20px",
    padding: "40px",
    textAlign: "center",
    color: "#666",
    boxShadow: "0 25px 100px rgba(0,0,0,0.98)",
    minWidth: "400px"
  },
  lockPanelTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "15px",
    textShadow: "0 0 25px rgba(139,0,0,0.8)",
    color: "#8B0000"
  },
  lockInstructions: {
    fontSize: "0.9rem",
    color: "#555",
    marginBottom: "25px",
    fontFamily: "Arial, sans-serif"
  },
  codeDisplay: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginBottom: "25px"
  },
  digitWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px"
  },
  arrowBtn: {
    background: "linear-gradient(135deg, rgba(20,20,20,0.9), rgba(10,10,10,0.95))",
    border: "2px solid rgba(139,0,0,0.5)",
    color: "#666",
    width: "40px",
    height: "28px",
    cursor: "pointer",
    fontSize: "0.8rem",
    borderRadius: "5px",
    fontWeight: "bold",
    transition: "all 0.2s ease",
    fontFamily: "Arial, sans-serif"
  },
  digit: {
    width: "50px",
    height: "60px",
    background: "linear-gradient(135deg, #0a0a0a 0%, #000 40%, #050505 70%, #000 100%)",
    border: "3px solid rgba(139,0,0,0.6)",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2.2rem",
    color: "#8B0000",
    fontWeight: "bold",
    boxShadow: "inset 0 3px 15px rgba(0,0,0,0.99)",
    textShadow: "0 0 20px rgba(139,0,0,0.8)",
    fontFamily: "Arial, sans-serif"
  },
  unlockBtn: {
    background: "linear-gradient(135deg, rgba(139,0,0,0.8), rgba(100,0,0,0.9))",
    border: "3px solid rgba(139,0,0,0.8)",
    color: "#fff",
    padding: "15px 40px",
    fontSize: "1.2rem",
    cursor: "pointer",
    borderRadius: "10px",
    fontWeight: "bold",
    marginBottom: "12px",
    width: "100%",
    boxShadow: "0 5px 25px rgba(139,0,0,0.6)",
    fontFamily: "Arial, sans-serif"
  },
  cancelBtn: {
    background: "transparent",
    border: "2px solid rgba(80,80,80,0.5)",
    color: "#555",
    padding: "10px 30px",
    fontSize: "0.95rem",
    cursor: "pointer",
    borderRadius: "8px",
    width: "100%",
    fontFamily: "Arial, sans-serif"
  },
  winBox: {
    textAlign: "center",
    position: "relative"
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
    marginBottom: "18px",
    color: "#999"
  },
  correctAnswer: {
    color: "#8B0000",
    fontSize: "2.2rem",
    fontWeight: "bold",
    textShadow: "0 0 40px rgba(139,0,0,0.9)"
  },
  winSubtext: {
    fontSize: "1.2rem",
    color: "#666",
    marginTop: "15px",
    marginBottom: "15px"
  },
  sparkles: {
    fontSize: "2.5rem",
    marginTop: "25px",
    marginBottom: "35px",
    animation: "twinkle 1s ease-in-out infinite"
  },
  loseBox: {
    textAlign: "center"
  },
  loseTitle: {
    fontSize: "4rem",
    color: "#8B0000",
    textShadow: "0 0 60px rgba(139,0,0,0.9)",
    marginBottom: "30px"
  },
  loseText: {
    fontSize: "1.5rem",
    marginBottom: "20px",
    color: "#999"
  },
  loseSubtext: {
    fontSize: "1.2rem",
    color: "#666",
    marginBottom: "40px"
  },
  retryBtn: {
    background: "linear-gradient(135deg, rgba(139,0,0,0.8), rgba(80,0,0,0.9))",
    border: "3px solid rgba(139,0,0,0.8)",
    color: "#fff",
    padding: "18px 50px",
    fontSize: "1.3rem",
    cursor: "pointer",
    borderRadius: "12px",
    fontWeight: "bold",
    letterSpacing: "2px",
    boxShadow: "0 10px 35px rgba(139,0,0,0.7)",
    fontFamily: "Arial, sans-serif"
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
  
  [data-pos="fl"] { left: 120px; top: 100%; }
  [data-pos="fr"] { right: 120px; top: 100%; }
  [data-pos="bl"] { left: 140px; top: 92%; opacity: 0.4; filter: blur(3px); }
  [data-pos="br"] { right: 140px; top: 92%; opacity: 0.4; filter: blur(3px); }
`;
document.head.appendChild(styleSheet);