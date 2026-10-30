import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { MAX_ESCAPES } from "../data/invitation";
import {
  getSavedName,
  getSavedStatus,
  lastError,
  saveStatus,
  setSavedName,
  type Status,
} from "../lib/rsvp";

type Answer = "pending" | Status;

const TEASES = [
  "Wait, really? 🥺",
  "Catch me first!",
  "Are you sure?",
  "Think again!",
  "Too slow!",
];

export default function AttendanceScene() {
  const [answer, setAnswer] = useState<Answer>("pending");
  const [choice, setChoice] = useState<Status | null>(null);
  const [name, setName] = useState(getSavedName);
  const [previous, setPrevious] = useState<Status | null>(null);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [escapes, setEscapes] = useState(0);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const areaRef = useRef<HTMLDivElement>(null);
  const noRef = useRef<HTMLButtonElement>(null);

  const gaveUp = escapes >= MAX_ESCAPES;

  const close = () => {
    setChoice(null);
    setPrevious(null);
    setError(false);
  };

  const save = async (trimmed: string, status: Status) => {
    const ok = await saveStatus(trimmed, status);
    if (!ok) return setError(true);
    setSavedName(trimmed);
    close();
    setAnswer(status);
  };

  // A different answer from the one on record needs confirmation first.
  const submit = async () => {
    const trimmed = name.trim();
    if (!choice || !trimmed || busy) return;
    setBusy(true);
    setError(false);
    const found = getSavedStatus();
    if (!previous && found && found !== choice) {
      setPrevious(found);
      return setBusy(false);
    }
    await save(trimmed, choice);
    setBusy(false);
  };

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
          onClick={() => setChoice("yes")}
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
                if (gaveUp || e.detail === 0) setChoice("no");
              }}
            >
              {label}
            </Button>
          </motion.div>
        </div>
      </div>
      <Dialog open={choice !== null} onClose={close} fullWidth maxWidth="xs">
        {previous ? (
          <>
            <DialogTitle>Changed your mind? ✨</DialogTitle>
            <DialogContent>
              <DialogContentText>
                You said <b>{previous === "yes" ? "Yes" : "No"}</b> before.
                Shall we make it a <b>{choice === "yes" ? "Yes" : "No"}</b>?
              </DialogContentText>
              {error && (
                <Typography color="error" sx={{ mt: 1 }}>
                  Couldn't save ({lastError}). Please try again.
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={close}>Sadly, still no</Button>
              <Button variant="contained" disabled={busy} onClick={submit}>
                Yes, Let the magic begin!
              </Button>
            </DialogActions>
          </>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <DialogTitle>Your name? ✨</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                fullWidth
                margin="dense"
                value={name}
                onChange={(e) => setName(e.target.value)}
                slotProps={{ htmlInput: { maxLength: 60 } }}
                error={error}
                helperText={
                  error
                    ? `Couldn't save (${lastError}). Please try again.`
                    : " "
                }
              />
            </DialogContent>
            <DialogActions>
              <Button
                type="submit"
                variant="contained"
                disabled={busy || !name.trim()}
              >
                {busy ? "Saving…" : "Done"}
              </Button>
            </DialogActions>
          </form>
        )}
      </Dialog>
    </motion.section>
  );
}
