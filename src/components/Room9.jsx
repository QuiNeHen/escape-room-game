import React, { useState, useEffect, useRef } from "react";

// ========== IMPORT CÁC HÌNH ẢNH TẠI ĐÂY ==========
import RoomBg1 from "../Img/room9.png"
import ChestImg1 from "../Img/lockblock9.png"
// import ChestOpenImg from "../Img/chest-open9.png"
import PuzzlePaperImg1 from "../Img/img9.png" // Giấy câu hỏi đầu
// import PoemPaperImg from "../Img/poem-paper9.png" // Giấy thơ Ngũ Hành
import DoorImg1 from "../Img/lock9.png"

const RoomBg = RoomBg1;
const ChestImg = ChestImg1;
const ChestOpenImg = "";
const PuzzlePaperImg = PuzzlePaperImg1; // Giấy hình thù kỳ lạ
const PoemPaperImg = ""; // Giấy thơ
const DoorImg = DoorImg1;

const loadFonts = () => {
  if (!document.querySelector('#room9-fonts')) {
    const link = document.createElement('link');
    link.id = 'room9-fonts';
    link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&family=Noto+Serif:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
};

export default function Room9({ onComplete }) {
  const [stage, setStage] = useState("intro");
  const [hovered, setHovered] = useState(null);
  
  const [puzzlePaperPickedUp, setPuzzlePaperPickedUp] = useState(false);
  const [puzzlePaperOpen, setPuzzlePaperOpen] = useState(false);
  
  const [chestOpen, setChestOpen] = useState(false);
  const [chestLockOpen, setChestLockOpen] = useState(false);
  const [chestCode, setChestCode] = useState(["", "", "", ""]);
  const correctChestCode = ["1", "8", "1", "4"];
  
  const [poemPaperPickedUp, setPoemPaperPickedUp] = useState(false);
  const [poemPaperOpen, setPoemPaperOpen] = useState(false);
  
  const [doorLockOpen, setDoorLockOpen] = useState(false);
  // Chỉ lưu 8 ô còn lại (bỏ 2 ô đầu 9,0 đã cố định)
  const [doorCode, setDoorCode] = useState(["", "", "", "", "", "", "", ""]);
  const correctDoorCode = ["6", "0", "3", "6", "4", "2", "3", "0"];
  
  const audioRef = useRef(null);

  const poemContent = `Kim thìn tỵ ngọ vạn năm dài
Mộc hợi tý sửu nghìn năm qua
Thủy dần mão thìn trăm năm nữa
Hỏa tị ngọ mùi mười năm còn
Thổ thân dậu tuất một đời người`;

  useEffect(() => {
    loadFonts();
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    if (stage === "room" && audioRef.current) {
      audioRef.current.volume = 0.25;
      audioRef.current.play().catch(() => {});
    }
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [stage]);

  const handleChestKeypad = (num) => {
    const emptyIndex = chestCode.findIndex(d => d === "");
    if (emptyIndex !== -1) {
      const newCode = [...chestCode];
      newCode[emptyIndex] = num;
      setChestCode(newCode);
    }
  };

  const handleChestDelete = () => {
    for (let i = chestCode.length - 1; i >= 0; i--) {
      if (chestCode[i] !== "") {
        const newCode = [...chestCode];
        newCode[i] = "";
        setChestCode(newCode);
        break;
      }
    }
  };

  const checkChestCode = () => {
    if (JSON.stringify(chestCode) === JSON.stringify(correctChestCode)) {
      setChestOpen(true);
      setChestLockOpen(false);
      setChestCode(["", "", "", ""]);
    } else {
      alert("Mật khẩu sai!");
      setChestCode(["", "", "", ""]);
    }
  };

  const handleDoorKeypad = (num) => {
    const emptyIndex = doorCode.findIndex(d => d === "");
    if (emptyIndex !== -1) {
      const newCode = [...doorCode];
      newCode[emptyIndex] = num;
      setDoorCode(newCode);
    }
  };

  const handleDoorDelete = () => {
    for (let i = doorCode.length - 1; i >= 0; i--) {
      if (doorCode[i] !== "") {
        const newCode = [...doorCode];
        newCode[i] = "";
        setDoorCode(newCode);
        break;
      }
    }
  };

  const checkDoorCode = () => {
    if (JSON.stringify(doorCode) === JSON.stringify(correctDoorCode)) {
      setStage("win");
      audioRef.current?.pause();
      setTimeout(() => onComplete?.(), 3000);
    } else {
      setStage("lose");
      audioRef.current?.pause();
    }
  };

  const Keypad = ({ onNumber, onDelete, onConfirm }) => (
    <>
      <div style={styles.keypad}>
        {[1,2,3,4,5,6,7,8,9,0].map(num => (
          <button key={num} style={styles.keypadBtn} onClick={() => onNumber(num.toString())}>{num}</button>
        ))}
      </div>
      <div style={styles.keypadActions}>
        <button style={styles.deleteBtn} onClick={onDelete}>XÓA</button>
        <button style={styles.unlockBtn} onClick={onConfirm}>XÁC NHẬN</button>
      </div>
    </>
  );

  return (
    <div style={styles.container}>
      <audio ref={audioRef} loop>
        <source src="https://assets.mixkit.co/sfx/preview/mixkit-creepy-ambience-1099.mp3" type="audio/mpeg" />
      </audio>

      {stage === "intro" && (
        <div style={styles.screen}>
          <div style={styles.storyBox}>
            <h2 style={styles.introTitle}>PHÒNG 9 - BÍ ẨN NGŨ HÀNH</h2>
            <p style={styles.storyText}>Bạn bước vào một căn phòng cổ kính...</p>
            <p style={styles.storyText}>Một chiếc rương gỗ khóa chặt giữa phòng...</p>
            <p style={styles.storyText}>Những tờ giấy cũ kỹ ẩn chứa bí mật...</p>
            <button style={styles.continueBtn} onClick={() => setStage("room")}>ĐIỀU TRA →</button>
          </div>
        </div>
      )}

      {stage === "room" && (
        <div style={styles.roomContainer}>
          <div style={{...styles.roomBg, backgroundImage: RoomBg ? `url(${RoomBg})` : 'linear-gradient(135deg, #2a1f1a 0%, #1a1210 50%, #0f0a08 100%)'}}></div>
          <div style={styles.fog}></div>
          <div style={styles.vignette}></div>

          {!puzzlePaperPickedUp && (
            <div style={{...styles.paperOnFloor, left: "20vw", bottom: "15vh", backgroundImage: PuzzlePaperImg ? `url(${PuzzlePaperImg})` : 'none', backgroundColor: PuzzlePaperImg ? 'transparent' : 'rgba(210,180,140,0.6)', filter: hovered === "puzzlePaper" ? "brightness(1.4) drop-shadow(0 0 50px rgba(218,165,32,0.9))" : "brightness(1) drop-shadow(0 8px 25px rgba(0,0,0,0.8))", transform: hovered === "puzzlePaper" ? "rotate(-5deg) scale(1.1)" : "rotate(-5deg) scale(1)"}} onMouseEnter={() => setHovered("puzzlePaper")} onMouseLeave={() => setHovered(null)} onClick={() => {setPuzzlePaperPickedUp(true); setPuzzlePaperOpen(true);}}>
              {!PuzzlePaperImg && <div style={{fontSize: '2.5rem', color: '#D2691E'}}>📜</div>}
            </div>
          )}

          {puzzlePaperPickedUp && !puzzlePaperOpen && (
            <div style={{...styles.paperInventory, right: "3vw", backgroundImage: PuzzlePaperImg ? `url(${PuzzlePaperImg})` : 'none', backgroundColor: PuzzlePaperImg ? 'transparent' : 'rgba(210,180,140,0.7)'}} onClick={() => setPuzzlePaperOpen(true)}>
              {!PuzzlePaperImg && <span style={{fontSize: '1.8rem', color: '#8B4513'}}>📜</span>}
            </div>
          )}

          {puzzlePaperOpen && (
            <div style={styles.paperModal} onClick={() => setPuzzlePaperOpen(false)}>
              <div style={styles.imageOnlyPanel} onClick={e => e.stopPropagation()}>
                <button style={styles.closePaper} onClick={() => setPuzzlePaperOpen(false)}>✕</button>
                {PuzzlePaperImg ? <img src={PuzzlePaperImg} alt="Puzzle" style={styles.fullImage}/> : <div style={styles.puzzlePlaceholder}><p style={styles.placeholderText}>Hình ảnh câu đố (1814)</p></div>}
              </div>
            </div>
          )}

          {!chestOpen && (
            <div style={{...styles.chest, backgroundImage: ChestImg ? `url(${ChestImg})` : 'none', backgroundColor: !ChestImg ? 'rgba(139,69,19,0.8)' : 'transparent', filter: hovered === "chest" ? "brightness(1.3) drop-shadow(0 0 50px rgba(218,165,32,0.9))" : "brightness(1) drop-shadow(0 15px 40px rgba(0,0,0,0.9))", transform: hovered === "chest" ? "scale(1.05)" : "scale(1)"}} onMouseEnter={() => setHovered("chest")} onMouseLeave={() => setHovered(null)} onClick={() => setChestLockOpen(true)}>
              {!ChestImg && <div style={{fontSize: '5rem', color: '#8B4513'}}>📦</div>}
            </div>
          )}

          {chestLockOpen && (
            <div style={styles.lockModal} onClick={() => setChestLockOpen(false)}>
              <div style={styles.lockPanel} onClick={e => e.stopPropagation()}>
                <div style={styles.codeDisplay}>
                  {chestCode.map((digit, i) => (<div key={i} style={styles.codeDigit}>{digit || "_"}</div>))}
                </div>
                <Keypad onNumber={handleChestKeypad} onDelete={handleChestDelete} onConfirm={checkChestCode}/>
              </div>
            </div>
          )}

          {chestOpen && !poemPaperPickedUp && (
            <div style={{...styles.poemInChest, backgroundImage: PoemPaperImg ? `url(${PoemPaperImg})` : 'none', backgroundColor: PoemPaperImg ? 'transparent' : 'rgba(255,235,205,0.9)', filter: hovered === "poemPaper" ? "brightness(1.5) drop-shadow(0 0 40px rgba(255,215,0,1))" : "brightness(1.2) drop-shadow(0 5px 20px rgba(0,0,0,0.8))", animation: "glow 2s ease-in-out infinite"}} onMouseEnter={() => setHovered("poemPaper")} onMouseLeave={() => setHovered(null)} onClick={() => {setPoemPaperPickedUp(true); setPoemPaperOpen(true);}}>
              {!PoemPaperImg && <div style={{fontSize: '2rem', color: '#8B4513'}}>📜</div>}
            </div>
          )}

          {poemPaperPickedUp && !poemPaperOpen && (
            <div style={{...styles.paperInventory, right: "10vw", backgroundImage: PoemPaperImg ? `url(${PoemPaperImg})` : 'none', backgroundColor: PoemPaperImg ? 'transparent' : 'rgba(255,235,205,0.8)'}} onClick={() => setPoemPaperOpen(true)}>
              {!PoemPaperImg && <span style={{fontSize: '1.8rem', color: '#8B4513'}}>📜</span>}
            </div>
          )}

          {poemPaperOpen && (
            <div style={styles.paperModal} onClick={() => setPoemPaperOpen(false)}>
              <div style={styles.poemPanel} onClick={e => e.stopPropagation()}>
                <button style={styles.closePaper} onClick={() => setPoemPaperOpen(false)}>✕</button>
                <pre style={styles.poemContent}>{poemContent}</pre>
              </div>
            </div>
          )}

          <div style={{...styles.door, backgroundImage: DoorImg ? `url(${DoorImg})` : 'none', backgroundColor: DoorImg ? 'transparent' : 'rgba(101,67,33,0.9)', filter: hovered === "door" ? "brightness(1.2) drop-shadow(0 0 60px rgba(218,165,32,0.8))" : "brightness(1) drop-shadow(0 20px 50px rgba(0,0,0,0.95))", transform: hovered === "door" ? "scale(1.02)" : "scale(1)"}} onMouseEnter={() => setHovered("door")} onMouseLeave={() => setHovered(null)} onClick={() => setDoorLockOpen(true)}>
            {!DoorImg && <div style={{fontSize: '6rem', color: '#654321', marginTop: '30vh'}}>🚪</div>}
          </div>

          {doorLockOpen && (
            <div style={styles.lockModal} onClick={() => setDoorLockOpen(false)}>
              <div style={styles.lockPanel} onClick={e => e.stopPropagation()}>
                <div style={{display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px'}}>
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}}>
                    <div style={{display: 'flex', gap: '5px'}}>
                      <div style={{...styles.codeDigit, ...styles.codeDigitLocked}}>9</div>
                      <div style={{...styles.codeDigit, ...styles.codeDigitLocked}}>0</div>
                    </div>
                    <span style={styles.doorCodeDash}>-</span>
                    <div style={{display: 'flex', gap: '5px'}}>
                      <div style={styles.codeDigit}>{doorCode[0] || "_"}</div>
                      <div style={styles.codeDigit}>{doorCode[1] || "_"}</div>
                    </div>
                    <span style={styles.doorCodeDash}>-</span>
                    <div style={{display: 'flex', gap: '5px'}}>
                      <div style={styles.codeDigit}>{doorCode[2] || "_"}</div>
                      <div style={styles.codeDigit}>{doorCode[3] || "_"}</div>
                    </div>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}}>
                    <div style={{display: 'flex', gap: '5px'}}>
                      <div style={styles.codeDigit}>{doorCode[4] || "_"}</div>
                      <div style={styles.codeDigit}>{doorCode[5] || "_"}</div>
                    </div>
                    <span style={styles.doorCodeDash}>-</span>
                    <div style={{display: 'flex', gap: '5px'}}>
                      <div style={styles.codeDigit}>{doorCode[6] || "_"}</div>
                      <div style={styles.codeDigit}>{doorCode[7] || "_"}</div>
                    </div>
                  </div>
                </div>
                <Keypad onNumber={handleDoorKeypad} onDelete={handleDoorDelete} onConfirm={checkDoorCode}/>
              </div>
            </div>
          )}
        </div>
      )}

      {stage === "win" && (
        <div style={styles.screen}>
          <div style={styles.winBox}>
            <h1 style={styles.winTitle}>🎉 XUẤT SẮC!</h1>
            <div style={styles.sparkles}>✨ 🏆 ✨</div>
            <p style={styles.winSubtext}>Bạn đã giải mã Ngũ Hành thành công!</p>
          </div>
        </div>
      )}

      {stage === "lose" && (
        <div style={{...styles.screen, animation: "flicker 0.3s ease-in-out 5"}}>
          <div style={styles.loseBox}>
            <h1 style={styles.loseTitle}>❌ CHƯA ĐÚNG</h1>
            <p style={styles.loseSubtext}>Hãy nghiên cứu kỹ thơ!</p>
            <button style={styles.retryBtn} onClick={() => {setStage("room"); setDoorLockOpen(false); setDoorCode(["","","","","","","",""]); audioRef.current?.play();}}>THỬ LẠI</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {width: "100vw", height: "100vh", overflow: "hidden", fontFamily: "'Noto Serif', Georgia, serif", position: "relative", userSelect: "none", background: "#000"},
  roomContainer: {position: "absolute", inset: 0},
  roomBg: {position: "absolute", inset: 0, backgroundSize: "cover", backgroundPosition: "center", zIndex: 1},
  fog: {position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 80%, rgba(218,165,32,0.08) 0%, transparent 60%)", animation: "fogMove 20s ease-in-out infinite", pointerEvents: "none", zIndex: 2},
  vignette: {position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 15%, rgba(0,0,0,0.88) 100%)", pointerEvents: "none", zIndex: 3},
  screen: {width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.8s ease-in", zIndex: 100},
  storyBox: {maxWidth: "700px", textAlign: "center", padding: "40px", background: "rgba(10, 10, 10, 0.95)", border: "6px solid #DAA520", borderRadius: "15px", boxShadow: "0 25px 80px rgba(218,165,32,0.6)"},
  introTitle: {fontSize: "2.5rem", color: "#DAA520", marginBottom: "30px", textShadow: "0 0 35px rgba(218,165,32,0.8)"},
  storyText: {fontSize: "1.3rem", lineHeight: "2", marginBottom: "20px", color: "#D2B48C"},
  continueBtn: {marginTop: "30px", background: "linear-gradient(135deg, #DAA520, #B8860B)", border: "3px solid #DAA520", color: "#fff", padding: "16px 45px", fontSize: "1.2rem", cursor: "pointer", borderRadius: "10px", transition: "all 0.3s ease", fontWeight: "bold"},
  paperOnFloor: {position: "fixed", width: "100px", height: "100px", backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat: "no-repeat", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, transition: "all 0.4s ease"},
  paperInventory: {position: "fixed", bottom: "3vh", width: "70px", height: "70px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat: "no-repeat", transition: "all 0.3s ease"},
  paperModal: {position: "fixed", inset: 0, background: "rgba(0,0,0,0.94)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, backdropFilter: "blur(10px)"},
  imageOnlyPanel: {position: "relative", maxWidth: "90vw", maxHeight: "90vh"},
  fullImage: {maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", borderRadius: "10px"},
  poemPanel: {width: "600px", maxWidth: "90vw", maxHeight: "85vh", background: "#FFF8DC", padding: "50px 40px", boxShadow: "0 30px 100px rgba(218,165,32,0.8)", overflowY: "auto", borderRadius: "15px", border: "5px solid #8B4513", position: "relative"},
  closePaper: {position: "absolute", top: "15px", right: "15px", width: "40px", height: "40px", background: "linear-gradient(135deg, rgba(139,69,19,0.9), rgba(101,67,33,0.9))", border: "3px solid #654321", borderRadius: "50%", color: "#fff", fontSize: "1.4rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s ease", fontWeight: "bold", zIndex: 10},
  puzzlePlaceholder: {minHeight: "400px", minWidth: "600px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(139,69,19,0.1)", borderRadius: "10px", border: "3px dashed #8B4513"},
  placeholderText: {fontSize: "1.5rem", color: "#8B4513"},
  poemContent: {fontSize: "1.6rem", color: "#654321", lineHeight: "2.5", whiteSpace: "pre-wrap", textAlign: "center", fontWeight: "500"},
  chest: {position: "fixed", bottom: "20vh", left: "50%", transform: "translateX(-50%)", width: "200px", height: "150px", backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat: "no-repeat", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, transition: "all 0.4s ease", borderRadius: "10px"},
  poemInChest: {position: "fixed", bottom: "25vh", left: "50%", transform: "translateX(-50%)", width: "100px", height: "100px", backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat: "no-repeat", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 15, transition: "all 0.3s ease", borderRadius: "8px"},
  door: {position: "fixed", top: "35%", right: "5vw", transform: "translateY(-50%)", width: "300px", height: "400px", backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat: "no-repeat", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, transition: "all 0.4s ease", borderRadius: "15px"},
  lockModal: {position: "fixed", inset: 0, background: "rgba(0,0,0,0.94)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 400, backdropFilter: "blur(10px)"},
  lockPanel: {width: "450px", maxWidth: "90vw", background: "linear-gradient(135deg, #2a1f1a, #1a1210)", border: "5px solid #DAA520", borderRadius: "20px", padding: "40px 30px", textAlign: "center", boxShadow: "0 40px 120px rgba(218,165,32,0.7)"},
  codeDisplay: {display: "flex", justifyContent: "center", gap: "12px", marginBottom: "30px"},
  codeDigit: {width: "50px", height: "60px", fontSize: "2.2rem", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(245,222,179,0.9)", border: "4px solid #8B4513", borderRadius: "8px", color: "#654321", fontWeight: "bold"},
  codeDigitLocked: {background: "rgba(218,165,32,0.3)", border: "4px solid #DAA520", color: "#DAA520"},
  doorCodeDash: {fontSize: "2rem", color: "#DAA520", fontWeight: "bold"},
  keypad: {display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px", marginBottom: "20px", maxWidth: "350px", margin: "0 auto 20px"},
  keypadBtn: {width: "60px", height: "55px", background: "linear-gradient(135deg, #8B4513, #654321)", border: "3px solid #DAA520", borderRadius: "10px", color: "#FFF", fontSize: "1.6rem", fontWeight: "bold", cursor: "pointer", transition: "all 0.2s ease", boxShadow: "0 4px 15px rgba(0,0,0,0.5)"},
  keypadActions: {display: "flex", gap: "12px", justifyContent: "center"},
  deleteBtn: {flex: 1, padding: "14px", fontSize: "1.1rem", fontWeight: "bold", background: "linear-gradient(135deg, rgba(139,0,0,0.8), rgba(100,0,0,0.9))", color: "#FFF", border: "3px solid rgba(218,165,32,0.6)", borderRadius: "10px", cursor: "pointer", transition: "all 0.3s ease"},
  unlockBtn: {flex: 1, padding: "14px", fontSize: "1.1rem", fontWeight: "bold", background: "linear-gradient(135deg, #DAA520, #B8860B)", color: "#FFF", border: "3px solid #8B4513", borderRadius: "10px", cursor: "pointer", transition: "all 0.3s ease"},
  winBox: {textAlign: "center", maxWidth: "700px"},
  winTitle: {fontSize: "4rem", color: "#FFD700", textShadow: "0 0 60px rgba(255,215,0,0.9)", marginBottom: "30px", animation: "bounce 1s ease infinite"},
  sparkles: {fontSize: "2.5rem", marginTop: "30px", marginBottom: "35px", animation: "twinkle 1s ease-in-out infinite"},
  winSubtext: {fontSize: "1.3rem", color: "#DAA520"},
  loseBox: {textAlign: "center"},
  loseTitle: {fontSize: "4rem", color: "#DC143C", textShadow: "0 0 60px rgba(220,20,60,0.9)", marginBottom: "30px"},
  loseSubtext: {fontSize: "1.2rem", color: "#D2B48C", marginBottom: "40px"},
  retryBtn: {background: "linear-gradient(135deg, rgba(218,165,32,0.9), rgba(184,134,11,0.9))", border: "3px solid rgba(218,165,32,0.8)", color: "#fff", padding: "18px 50px", fontSize: "1.3rem", cursor: "pointer", borderRadius: "12px", fontWeight: "bold", letterSpacing: "2px", boxShadow: "0 10px 35px rgba(218,165,32,0.6)", transition: "all 0.3s ease"}
};

const styleSheet = document.createElement("style");
styleSheet.textContent = `
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes fogMove{0%,100%{transform:translateX(0) scale(1)}50%{transform:translateX(30px) scale(1.08)}}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}}
@keyframes twinkle{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.9)}}
@keyframes flicker{0%,100%{opacity:1}25%{opacity:0.1}50%{opacity:0.8}75%{opacity:0.2}}
@keyframes glow{0%,100%{filter:brightness(1.2) drop-shadow(0 5px 20px rgba(0,0,0,0.8))}50%{filter:brightness(1.5) drop-shadow(0 0 40px rgba(255,215,0,1))}}
button:hover:not(:disabled){transform:scale(1.05)}
.closePaper:hover{transform:rotate(90deg) scale(1.1)}
.continueBtn:hover{box-shadow:0 15px 50px rgba(218,165,32,1);background:linear-gradient(135deg,#FFD700,#DAA520)}
*::-webkit-scrollbar{width:10px;height:10px}
*::-webkit-scrollbar-track{background:rgba(0,0,0,0.3);border-radius:10px}
*::-webkit-scrollbar-thumb{background:rgba(218,165,32,0.6);border-radius:10px}
*::-webkit-scrollbar-thumb:hover{background:rgba(218,165,32,0.8)}
`;
document.head.appendChild(styleSheet);