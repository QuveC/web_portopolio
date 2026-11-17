import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";
import "./editorial.css";

// No <StrictMode>: the motion engine arms each section's springs once, imperatively.
createRoot(document.getElementById("root")).render(<App />);
