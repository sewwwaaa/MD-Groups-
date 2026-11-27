import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon.jsx";

// Official MD Groups promo video (files in public/video/).
export default function VideoSection({ compact = false }) {
  const video = useRef(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    setPlaying(true);
    video.current?.play();
  };

  return (
    <section id="video" className={`section section--dark video-section ${compact ? "video-section--compact" : ""}`}>
      <div className="container video-section__inner">
        <div className="video-section__text">
          <p className="eyebrow">Watch our video</p>
          <h2>See MD Groups in action</h2>
          <p>
            Homes, land, apartments and quality vehicles, all with honest advice and paperwork handled
            properly. Meet the directors and see how we help you find the right deal.
          </p>
          {!compact && (
            <Link to="/contact" className="btn btn--gold">
              Talk to us today <Icon name="arrow" size={18} />
            </Link>
          )}
        </div>

        <div className={`video-frame ${playing ? "is-playing" : ""}`}>
          <video
            ref={video}
            src="/video/md-groups-promo.mp4"
            poster="/video/md-groups-poster.jpg"
            controls={playing}
            preload="none"
            playsInline
            onPlay={() => setPlaying(true)}
          >
            Your browser does not support video playback.
          </video>
          {!playing && (
            <button className="video-frame__play" onClick={play} aria-label="Play the MD Groups video">
              <span className="video-frame__btn">
                <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
              </span>
              <span className="video-frame__label">Play video · 0:43</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
