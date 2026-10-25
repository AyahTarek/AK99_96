import { useRef, useState } from "react";
import { AnimatePresence, MotionConfig } from "framer-motion";
import OpeningScene from "./components/OpeningScene";
import InvitationScene from "./components/InvitationScene";
import AttendanceScene from "./components/AttendanceScene";

const SONG_SRC = "/audio/Siilawy - لما تكوني (Official Music Video).mp3";

type Scene = "opening" | "invitation" | "attendance";

export default function App() {
  const [scene, setScene] = useState<Scene>("opening");
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleOpened = () => {
    if (!audioRef.current) {
      const a = new Audio(encodeURI(SONG_SRC));
      a.loop = true;
      a.volume = 0.5;
      audioRef.current = a;
    }
    audioRef.current.play().catch(() => {});
    setScene("invitation");
  };

  const toggleMute = () => {
    const a = audioRef.current;
    if (!a) return;
    a.muted = !a.muted;
    setMuted(a.muted);
  };

  return (
    <MotionConfig reducedMotion="user">
      <main className="stage">
        {scene !== "opening" && (
          <button
            type="button"
            className="sound-toggle"
            onClick={toggleMute}
            aria-label={muted ? "Unmute music" : "Mute music"}
          >
            {muted ? "🔇" : "🔊"}
          </button>
        )}
        <AnimatePresence mode="wait">
          {scene === "opening" && (
            <OpeningScene key="o" onOpened={handleOpened} />
          )}
          {scene === "invitation" && (
            <InvitationScene
              key="i"
              onContinue={() => setScene("attendance")}
            />
          )}
          {scene === "attendance" && <AttendanceScene key="a" />}
        </AnimatePresence>
      </main>
    </MotionConfig>
  );
}
