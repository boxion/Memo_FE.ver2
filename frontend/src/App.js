import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Homepage";
import LoginPage from "./pages/Loginpage";
import SignUpPage from "./pages/Signuppage";
import MyPage from "./pages/Myhomepage";
import AudioAI from "./pages/Audiopage";
import Community from "./pages/Community";
import PDFpage from "./pages/PDFpage";
import PDFSummary from "./components/PDFSummary/PDFsummary";
import VideoSummary from "./components/VideoSummary/VideoSummary";
import AudioSummary from "./components/AudioSummary/AudioSummary";

function App() {
  return (
    <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/video-summary" element={<VideoSummary />} />
            <Route path="/audio-ai" element={<AudioAI />} />
            <Route path="/audio-summary" element={<AudioSummary />} />
            <Route path="/PDFpage" element={<PDFpage />} />
            <Route path="/PDF-summary" element={<PDFSummary />} />
            <Route path="/community" element={<Community />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/mypage" element={<MyPage />} />
          </Routes>
    </Router>
  );
}

export default App;
