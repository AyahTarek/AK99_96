import { motion } from "framer-motion";
import { Button, Typography } from "@mui/material";
import { EVENT, IMAGES } from "../data/invitation";

interface Props {
  onContinue: () => void;
}

export default function InvitationScene({ onContinue }: Props) {
  return (
    <motion.section
      className="scene invitation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.article
        className="parchment"
        initial={{ scaleY: 0.1, opacity: 0, filter: "brightness(2)" }}
        animate={{ scaleY: 1, opacity: 1, filter: "brightness(1)" }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{ originY: 0 }}
      >
        <div className="ribbon" aria-hidden />
        <div className="invite-grid">
          <div className="couple-frame">
            <img className="couple" src={IMAGES.couple} alt="Ayah and Khaled" />
          </div>
          <div className="invite-text">
            <Typography
              variant="h1"
              sx={{ fontSize: { xs: "2.4rem", md: "3.2rem" } }}
            >
              {EVENT.title}
            </Typography>
            <Typography sx={{ mt: 2, fontStyle: "italic" }}>
              {EVENT.intro}
            </Typography>
            <Typography>{EVENT.body}</Typography>
            <Typography sx={{ mt: 1 }}>{EVENT.closing}</Typography>
            <p className="names">{EVENT.names}</p>
            <Typography sx={{ fontWeight: 600, fontSize: "1.5rem" }}>
              {EVENT.date}
            </Typography>
            <Typography sx={{ fontWeight: 600, fontSize: "1.5rem" }}>
              {EVENT.venue}
            </Typography>
            <Typography>
              <a href={EVENT.mapUrl} target="_blank" rel="noopener noreferrer">
                📍 {EVENT.address}
              </a>
            </Typography>
          </div>
        </div>
      </motion.article>

      <motion.div
        className="prompt"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, type: "spring", damping: 12 }}
      >
        <Typography
          sx={{
            color: "#ffe9a8",
            fontStyle: "italic",
            fontSize: { xs: "1.4rem", sm: "1.7rem" },
            textShadow: "0 0 12px #d9b25f",
          }}
        >
          One important question remains…
        </Typography>
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            boxShadow: [
              "0 0 0 0 #d9b25f00",
              "0 0 28px 8px #d9b25faa",
              "0 0 0 0 #d9b25f00",
            ],
          }}
          transition={{ duration: 1.6, repeat: Infinity, delay: 2 }}
          style={{ display: "inline-block", borderRadius: 999, marginTop: 8 }}
        >
          <Button variant="contained" onClick={onContinue}>
            Continue ✨
          </Button>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
