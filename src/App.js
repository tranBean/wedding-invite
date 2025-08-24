import React, { useState, useRef, useEffect } from "react";
import "./App.css";

// ====== Config 区域 ======
const config = {
  couple: {
    groom: "付传宾",
    bride: "牛佳惠",
    date: "2025-09-20 12:00",
  },
  hotel: {
    name: "汀州皇冠国际酒店",
    address: "福建省龙岩市长汀县环北路51-8号",
  },
  texts: {
    invitation: [
      "亲爱的家人朋友们：",
      "感谢大家一直以来的关心与厚爱！我们诚挚邀请您参加我们的婚礼，见证我们幸福的时刻，共享喜悦与欢乐。",
      "希望您能准时莅临，与我们一同庆祝这美好的一天！期待您的到来，让我们的婚礼因为您的参与而更加圆满和温暖。"
    ],
  },
  images: {
    couple: process.env.PUBLIC_URL + "/p1.jpg",    // 新人合照
    hotel: process.env.PUBLIC_URL + "/p2.png",    // 酒店外观
    background: process.env.PUBLIC_URL + "/p3.png", // 通用背景
  },
  music: {
    url: process.env.PUBLIC_URL + "/bgmusic.mp3",
  },
};
// ========================

function App() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  const sectionRefs = [useRef(null), useRef(null), useRef(null)];
  const currentIndex = useRef(0);
  const userInteracted = useRef(false);

  // 页面首次交互自动播放音乐
  useEffect(() => {
    const startMusic = () => {
      if (audioRef.current) {
        audioRef.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      }
      window.removeEventListener("click", startMusic);
      window.removeEventListener("touchstart", startMusic);
    };

    window.addEventListener("click", startMusic, { once: true });
    window.addEventListener("touchstart", startMusic, { once: true });

    return () => {
      window.removeEventListener("click", startMusic);
      window.removeEventListener("touchstart", startMusic);
    };
  }, []);

  // 点击按钮播放/暂停
  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => setPlaying(false));
      setPlaying(true);
    }
  };

  // 自动跳屏逻辑
  useEffect(() => {
    const interval = setInterval(() => {
      if (!userInteracted.current) {
        currentIndex.current = (currentIndex.current + 1) % sectionRefs.length;
        sectionRefs[currentIndex.current].current.scrollIntoView({ behavior: "auto" });
      }
    }, 3800);

    const userAction = () => {
      userInteracted.current = true;
      setTimeout(() => (userInteracted.current = false), 3800);
    };

    window.addEventListener("scroll", userAction, { passive: true });
    window.addEventListener("touchstart", userAction);

    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", userAction);
      window.removeEventListener("touchstart", userAction);
    };
  }, []);

  return (
    <div className="invitation-container">
      <audio ref={audioRef} loop src={config.music.url}></audio>
      <button className="music-btn" onClick={toggleMusic}>
        {playing ? "⏸️ 暂停音乐" : "▶️ 播放音乐"}
      </button>

      {/* 第一屏 - 新人 */}
      <section ref={sectionRefs[0]} className="screen" style={{ backgroundImage: `url(${config.images.couple})` }}>
        <div className="overlay">
          <h1 className="title"><strong>{config.couple.groom} ❤ {config.couple.bride}</strong></h1>
          <p className="date"><strong>{config.couple.date}</strong></p>
        </div>
      </section>

      {/* 第二屏 - 酒店 */}
      <section ref={sectionRefs[1]} className="screen" style={{ backgroundImage: `url(${config.images.hotel})` }}>
        <div className="overlay">
          <h2><strong>{config.hotel.name}</strong></h2>
          <p><strong>{config.hotel.address}</strong></p>
        </div>
      </section>

      {/* 第三屏 - 文案 */}
      <section ref={sectionRefs[2]} className="screen" style={{ backgroundImage: `url(${config.images.background})` }}>
        <div className="overlay">
          <h2><strong>结婚喜讯</strong></h2>
          {config.texts.invitation.map((line, idx) => (
            <p key={idx}><strong>{line}</strong></p>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;
