import { useState } from "react";
import { motion } from "framer-motion";
import { Button, Typography } from "@mui/material";
import { IMAGES } from "../data/invitation";

type Phase = "flying" | "landed" | "opening";

interface Props {
  onOpened: () => void;
}

export default function OpeningScene({ onOpened }: Props) {
  const [phase, setPhase] = useState<Phase>("flying");
  const landed = phase !== "flying";
  const opening = phase === "opening";

  return (
    <motion.section
      className="scene opening"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="arch" aria-hidden />
      <div className="candle" aria-hidden />
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.span
          key={i}
          className="particle"
          aria-hidden
          style={{ left: `${(i * 8.3 + 5) % 100}%`, top: `${(i * 23) % 100}%` }}
          animate={{ y: [0, -30, 0], opacity: [0.1, 0.8, 0.1] }}
          transition={{
            duration: 4 + (i % 4),
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}

      <motion.img
        src={IMAGES.owl}
        alt=""
        className="owl"
        initial={{ x: "-70vw", y: -80, opacity: 0 }}
        animate={
          landed
            ? { x: "70vw", y: -200, opacity: 0 }
            : { x: 0, y: -40, opacity: 1 }
        }
        transition={
          landed
            ? { duration: 1.4, ease: "easeIn" }
            : { duration: 1.8, ease: "easeOut" }
        }
        onAnimationComplete={() => {
          if (!landed) setTimeout(() => setPhase("landed"), 400);
        }}
      />

      <motion.div
        className="envelope-wrap"
        initial={{ y: "-60vh", opacity: 0 }}
        animate={landed ? { y: 0, opacity: 1 } : {}}
        transition={{ type: "spring", damping: 12, stiffness: 60, delay: 0.3 }}
      >
        <motion.div
          className="envelope"
          animate={
            opening
              ? { scale: 1.15 }
              : landed
                ? {
                    boxShadow: [
                      "0 0 20px #d9b25f55",
                      "0 0 50px #d9b25faa",
                      "0 0 20px #d9b25f55",
                    ],
                  }
                : {}
          }
          transition={
            opening ? { duration: 0.8 } : { duration: 2.5, repeat: Infinity }
          }
        >
          <motion.div
            className="flap"
            animate={{ rotateX: opening ? 180 : 0 }}
            transition={{ duration: 0.9 }}
          />
          <motion.div
            className="seal"
            animate={{ opacity: opening ? 0 : 1, scale: opening ? 0.6 : 1 }}
          >
            A ♥ K
          </motion.div>
        </motion.div>
        {opening && (
          <motion.div
            className="burst"
            aria-hidden
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: [0, 1, 1], scale: [0.2, 3, 12] }}
            transition={{ duration: 1.3, delay: 0.7 }}
            onAnimationComplete={onOpened}
          />
        )}
      </motion.div>

      <motion.div
        className="opening-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: landed && !opening ? 1 : 0 }}
        transition={{ delay: landed ? 1 : 0 }}
      >
        <Typography
          variant="h2"
          sx={{ color: "#f3e7cf", fontSize: { xs: "1.8rem", sm: "2.4rem" } }}
        >
          You've received a special letter.
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 3 }}
          onClick={() => setPhase("opening")}
          disabled={!landed}
        >
          Open the letter
        </Button>
      </motion.div>
    </motion.section>
  );
}
