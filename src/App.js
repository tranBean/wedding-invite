import React, { useState, useRef } from "react";
import "./App.css"; // 建议分个 CSS 文件写样式

// ====== Config 区域，所有内容集中这里修改 ======
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
    couple:
      "https://picsum.photos/id/237/800/1200", // 占位：新人合照
    hotel:
      "https://picsum.photos/id/1018/800/1200", // 占位：酒店外观
    background:
      "https://picsum.photos/id/1015/800/1200", // 可用于通用背景
  },
  music: {
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // 占位音乐
  },
};
// =============================================

function App() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  return (
    <div className="invitation-container">
      {/* 音乐控件 */}
      <audio ref={audioRef} loop src={config.music.url}></audio>
      <button className="music-btn" onClick={toggleMusic}>
        {playing ? "⏸️ 音乐暂停" : "▶️ 播放音乐"}
      </button>

      {/* 第一屏 - 新人 */}
      <section className="screen" style={{ backgroundImage: `url(${config.images.couple})` }}>
        <div className="overlay">
          <h1 className="title">
            {config.couple.groom} ❤ {config.couple.bride}
          </h1>
          <p className="date">{config.couple.date}</p>
        </div>
      </section>

      {/* 第二屏 - 酒店 */}
      <section className="screen" style={{ backgroundImage: `url(${config.images.hotel})` }}>
        <div className="overlay">
          <h2>{config.hotel.name}</h2>
          <p>{config.hotel.address}</p>
        </div>
      </section>

      {/* 第三屏 - 文案 */}
      <section className="screen" style={{ backgroundImage: `url(${config.images.background})` }}>
        <div className="overlay">
          <h2>结婚喜讯</h2>
          <p>{config.texts.invitation}</p>
        </div>
      </section>
    </div>
  );
}

export default App;
