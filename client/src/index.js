import React from "react";
import ReactDOM from "react-dom/client";
// import './styles/index_clear.css';
import "styles/styles.css";
import App from "App";
import { MobileProvider } from "context/mobile/mobileContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <MobileProvider>
      <App />
    </MobileProvider>
  </React.StrictMode>
);
