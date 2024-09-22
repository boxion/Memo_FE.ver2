import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Homepage";
import LoginPage from "./pages/Loginpage";
import SignUpPage from "./pages/Signuppage";
import MyPage from "./pages/Myhomepage";
import AudioAI from "./pages/Audiopage";
import Community from "./pages/Community";
import PDFpage from "./pages/PDFpage";
import Team from "./pages/Team";
import PDFSummary from "./components/PDFSummary/PDFsummary";
import VideoSummary from "./components/VideoSummary/VideoSummary";
import VideoSummary2 from "./components/VideoSummary/VideoSummary2";
import AudioSummary from "./components/AudioSummary/AudioSummary";
import SaveMypage from "./components/Mypage/SaveMypage";
import MyPDF from "./components/Mypage/MyPDF";
import MyAudio from "./components/Mypage/MyAudio";

function App() {
  return (
    <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/video-summary" element={<VideoSummary />} />
            <Route path="/video-summary2" element={<VideoSummary2 />} />
            <Route path="/audio-ai" element={<AudioAI />} />
            <Route path="/audio-summary" element={<AudioSummary />} />
            <Route path="/PDFpage" element={<PDFpage />} />
            <Route path="/PDF-summary" element={<PDFSummary />} />
            <Route path="/community" element={<Community />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/mypdf" element={<MyPDF />} />
            <Route path="/myaudio" element={<MyAudio />} />
            <Route path="/Savemypage" element={<SaveMypage />} />
            <Route path="/team" element={<Team />} />
          </Routes>
    </Router>
  );
}

export default App;
