import { createTheme } from "@mui/material/styles";

const serif = '"Cormorant Garamond", Georgia, serif';

export const theme = createTheme({
  palette: {
    primary: { main: "#6e1423" },
    secondary: { main: "#b8924a" },
    background: { default: "#2a0d12", paper: "#f3e7cf" },
    text: { primary: "#5a1020" },
  },
  typography: {
    fontFamily: serif,
    h1: { fontFamily: serif, fontWeight: 600 },
    h2: { fontFamily: serif, fontWeight: 600 },
    body1: { fontSize: "1.25rem" },
    button: { textTransform: "none", fontFamily: serif, fontSize: "1.2rem", fontWeight: 600 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 999, padding: "10px 28px", border: "1px solid #b8924a" },
        contained: {
          background: "linear-gradient(#7d1a2c,#5a0f1d)",
          color: "#f6ecd6",
          "&:hover": { background: "linear-gradient(#8d2236,#6a1423)" },
        },
        outlined: { color: "#6e1423", background: "#f6ecd6", "&:hover": { background: "#efe0bf" } },
      },
    },
  },
});
