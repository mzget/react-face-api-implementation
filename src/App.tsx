import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { FaceDetection } from "./pages/FaceDetection";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Face Detection</p>
      </header>
      <div className="App-detector">
        <FaceDetection />
      </div>
    </div>
  );
}

export default App;
