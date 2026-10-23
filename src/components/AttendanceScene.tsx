import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button, Typography } from "@mui/material";
import { MAX_ESCAPES } from "../data/invitation";

type Answer = "pending" | "yes" | "no";

const TEASES = [
  "Wait, really? 🥺",
  "Catch me first!",
  "Are you sure?",
  "Think again!",
  "Too slow!",
];

export default function AttendanceScene() {
  const [answer, setAnswer] = useState<Answer>("pending");
  const [escapes, setEscapes] = useState(0);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const areaRef = useRef<HTMLDivElement>(null);
  const noRef = useRef<HTMLButtonElement>(null);

  const gaveUp = escapes >= MAX_ESCAPES;

  // Move the button within the arena's lower band, away from its current spot.
  const escape = () => {
    if (gaveUp || !areaRef.current || !noRef.current) return;
    const area = areaRef.current.getBoundingClientRect();
    const btn = noRef.current.getBoundingClientRect();
    const maxX = (area.width - btn.width) / 2;
    const maxY = area.height - btn.height;
    let next = pos;
    for (let i = 0; i < 8; i++) {
      next = { x: (Math.random() * 2 - 1) * maxX, y: Math.random() * maxY };
      if (Math.hypot(next.x - pos.x, next.y - pos.y) > 80) break;
    }
    setPos(next);
    setEscapes((n) => n + 1);
  };

  if (answer !== "pending") {
    const yes = answer === "yes";
    return (
      <motion.section
        className="scene attendance"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="card result">
          {yes &&
            [0, 1, 2, 3, 4].map((i) => (
              <motion.span
                key={i}
                className="heart"
                aria-hidden
                style={{ left: `${15 + i * 17}%` }}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: -80, opacity: [0, 1, 0] }}
                transition={{ duration: 2, delay: i * 0.2 }}
              >
                ♥
              </motion.span>
            ))}
          <Typography
            variant="h2"
            sx={{ fontSize: { xs: "2rem", sm: "2.8rem" } }}
          >
            {yes ? "Yay! 🥹❤️" : "Not even magic could change your mind? 🥹"}
          </Typography>
          <Typography sx={{ mt: 2 }}>
            {yes
              ? "Thank you for being a part of our happiness. We can't wait to celebrate this special night with you!"
              : "We really hoped you could make it, You'll be so missed! ❤️"}
          </Typography>
        </div>
      </motion.section>
    );
  }

  const label = gaveUp
    ? "Okay, I give up…"
    : escapes > 0
      ? TEASES[(escapes - 1) % TEASES.length]
      : "No, unfortunately";

  return (
    <motion.section
      className="scene attendance"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="card">
        <Typography
          variant="h2"
          sx={{ fontSize: { xs: "2rem", sm: "2.8rem" } }}
        >
          Will you be joining us?
        </Typography>
        <Typography sx={{ mt: 1 }}>
          We'd love to have you be a part of our happiness.
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 3 }}
          onClick={() => setAnswer("yes")}
        >
          Yes, of course! ❤️
        </Button>
        <div className="arena" ref={areaRef}>
          <motion.div
            className="no-slot"
            animate={{ x: pos.x, y: pos.y }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Button
              ref={noRef}
              variant="outlined"
              onPointerEnter={(e) => e.pointerType === "mouse" && escape()}
              onPointerDown={(e) => {
                if (e.pointerType !== "mouse" && !gaveUp) {
                  e.preventDefault();
                  escape();
                }
              }}
              onClick={(e) => {
                // Real clicks only: keyboard (detail 0), or after giving up.
                if (gaveUp || e.detail === 0) setAnswer("no");
              }}
            >
              {label}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
