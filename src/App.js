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
    invitation:
      "我们诚挚邀请您参加我们的婚礼，见证我们的幸福时刻。期待您的到来！",
  },
  images: {
    couple: "https://picsum.photos/id/237/800/1200",
    hotel: "https://picsum.photos/id/1018/800/1200",
    background: "https://picsum.photos/id/1015/800/1200",
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

    // 用户滑动/点击屏幕，标记为已操作
    const userAction = () => {
      userInteracted.current = true;
      // 3.8 秒后恢复自动滚动
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

      <section ref={sectionRefs[0]} className="screen" style={{ backgroundImage: `url(${config.images.couple})` }}>
        <div className="overlay">
          <h1 className="title">{config.couple.groom} ❤ {config.couple.bride}</h1>
          <p className="date">{config.couple.date}</p>
        </div>
      </section>

      <section ref={sectionRefs[1]} className="screen" style={{ backgroundImage: `url(${config.images.hotel})` }}>
        <div className="overlay">
          <h2>{config.hotel.name}</h2>
          <p>{config.hotel.address}</p>
        </div>
      </section>

      <section ref={sectionRefs[2]} className="screen" style={{ backgroundImage: `url(${config.images.background})` }}>
        <div className="overlay">
          <h2>结婚喜讯</h2>
          <p>{config.texts.invitation}</p>
        </div>
      </section>
    </div>
  );
}

export default App;
