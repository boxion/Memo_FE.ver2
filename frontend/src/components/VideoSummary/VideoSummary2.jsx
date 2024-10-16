//커뮤니티-> 남의 영상 보기 -> 전달해주는 userId가 다름
import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom"; // 영상 클릭 시 상태 전달을 받기 위함
import styled from "styled-components";
import Header from "../Header/Header";
import YouTube from "react-youtube";
import Chat from "./Chatgpt";
import SaveFolderModal from "./SaveFolderModal";

const Container = styled.div`
  padding: 2vw;
  display: flex;
  justify-content: center;
  font-family: Arial, sans-serif;
`;

const LeftSection = styled.div`
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
`;

const RightSection = styled.div`
  width: 100%;
  max-width: 600px;
  position: relative;
`;

const TabButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1vw;
`;

const TabButton = styled.button`
  padding: 0.5vw 1vw;
  font-size: 1vw;
  cursor: pointer;
  border-radius: 2vw;
  margin-right: 0.5vw;
  background-color: #ffffff;
  border: 0.1vw solid #d9d9d9;
  color: #000000;

  &.active {
    background-color: #d0d0d0;
  }
`;

const VideoContainer = styled.div`
  margin-bottom: 2vw;
  width: 100%;
  max-width: 100%;
  height: auto;
`;

const TheorySection = styled.section`
  background-color: #fff;
  border-radius: 1vw;
  padding: 2vw;
  //box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  //width: 100%;
`;

const VideoTitle = styled.h2`
  font-size: 1.2vw;
  color: #333;
  margin-bottom: 1vw;
`;

const ListBox = styled.ol`
  margin: 0;
  padding-left: 1vw;
  max-height: 80vh; 
  overflow-y: auto;
`;

const ListItem = styled.div`
  margin: 1vw 1vw 1vw 0;
  background-color: #f0f0f0;
  border-radius: 1vw;
  padding: 1vw;
`;

const ListText = styled.p`
  font-size: 1vw;
  color: #333;
  margin: 0;
`;



const ScriptLine = styled.div`
  display: flex;
  margin-bottom: 0.5vw;
`;

const ScriptContainer = styled.div`
  max-height: 75vh; 
  overflow-y: auto;
  padding: 1vw;
  margin: 1vw 0 0 0;
  background-color: #f0f0f0;
  border-radius: 1vw;
`;

const TimeText = styled.span`
  font-weight: bold;
  font-size: 1vw;
  margin-right: 1vw;
  color: #333;
`;

const ScriptText = styled.span`
  color: #333;
  font-size: 1vw;
`;

const DateText = styled.div`
  font-size: 1.3vw;
  margin-bottom: 0.5vw;
  color: #838383;
`;

const parseScript = (scriptArray) => {
  return scriptArray
    .map((line) => {
      // "TS: 0:00 | TXT: 안녕하세요." 형식의 문자열에서 TS:와 TXT: 제거
      const match = line.match(/TS: (\d+:\d+) \| TXT: (.+)/);
      if (match) {
        return { time: match[1], text: match[2] };
      }
      return null;
    })
    .filter(Boolean); // null 값 제거
};

const VideoSummary = () => {
  const [videoId, setVideoId] = useState(null);
  const [playerSize, setPlayerSize] = useState({ width: 560, height: 315 });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("summary");
  const [viewMode, setViewMode] = useState(true);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showChat, setShowChat] = useState(true);
  const [videoTitle, setVideoTitle] = useState("");
  const [summary, setSummary] = useState([]);
  const [fullScript, setFullScript] = useState([]);
  const dropdownRef = useRef(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    // 페이지가 렌더링될 때마다 화면을 최상단으로 스크롤
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    const videoData = location.state;
  
    console.log("videoData: ",videoData); // videoData 확인
  
    if (videoData) {
      const { videoTitle, summary, fullScript, videoUrl } = videoData;
  
      localStorage.setItem("videoTitle", videoTitle);
      localStorage.setItem("summary", summary);
      localStorage.setItem("fullScript", fullScript);
      localStorage.setItem("videoUrl", videoUrl);
  
      const videoId = extractVideoId(videoUrl);
      setVideoId(videoId);
      setVideoTitle(videoTitle);
  
      // summary와 fullScript가 정의되어 있는지 확인
      if (summary) {
        setSummary(
          summary
            .split("###")
            .map(item => {
              // 각 item을 줄 단위로 나눈 후, 공백이나 줄바꿈만 있는 항목은 필터링
              const lines = item.split("\n").filter(line => line.trim() !== ""); 
              return {
                title: lines[0], // 첫 번째 줄을 title로 사용
                content: lines.slice(1).join("\n").trim(), // 나머지를 content로 사용
              };
            })
        );
      } else {
        console.error("Summary is undefined or empty");
      }
      
  
      if (fullScript) {
        setFullScript(fullScript.split("\n"));
      } else {
        console.error("Full script is undefined or empty");
      }
    } else {
      const storedVideoTitle = localStorage.getItem("videoTitle");
      const storedSummary = localStorage.getItem("summary");
      const storedFullScript = localStorage.getItem("fullScript");
      const storedVideoUrl = localStorage.getItem("videoUrl");
      const documentDate = localStorage.getItem("documentDate");
      console.log(storedVideoTitle, storedSummary, storedFullScript); // 저장된 값 확인
  
      if (storedVideoTitle) setVideoTitle(storedVideoTitle);
  
      // localStorage에서 가져온 summary와 fullScript가 정의되어 있는지 확인
      if (storedSummary && storedSummary.trim() !== "") {
        setSummary(storedSummary.split("###").map(item => {
          const lines = item.split("\n");
          return { title: lines[0], content: lines.slice(1).join("\n").trim() };
        }));
      } else {
        console.error("Stored summary is undefined or empty");
      }
  
      if (storedFullScript) {
        setFullScript(storedFullScript.split("\n"));
      } else {
        console.error("Stored full script is undefined or empty");
      }
  
      if (storedVideoUrl) {
        const videoId = extractVideoId(storedVideoUrl);
        setVideoId(videoId);
      }
    }
  }, [location.state]);

  
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const extractVideoId = (url) => {
    // 숏츠 URL을 포함한 유튜브 URL에서 videoId를 추출합니다.
    const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[1] ? match[1] : null;
  };

  const handleResize = () => {
    setPlayerSize({
      width: window.innerWidth * 0.4,
      height: (window.innerWidth * 0.35 * 9) / 16,
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const renderContent = () => {
    if (activeTab === "summary") {
      return (
        <ListBox>
          <VideoTitle>{videoTitle || "비디오 제목 없음"}</VideoTitle>
          {summary.map((paragraph, index) => (
            // paragraph.content가 비어있거나 공백/줄바꿈만 있는 경우 표시하지 않음
            paragraph.content.trim() !== "" && (
              <ListItem key={index}>
                {/* title과 content를 분리하여 각각 렌더링 */}
                <ListText>
                  <strong>{paragraph.title}</strong> {/* 소제목 */}
                </ListText>
                <ListText>{paragraph.content}</ListText> {/* 내용 */}
              </ListItem>
            )
          ))}
        </ListBox>
      );
    } else if (activeTab === "script") {
      const parsedScript = parseScript(fullScript); // 스크립트 파싱
      return (
        <ScriptContainer>
          {parsedScript.map((line, index) => (
            <ScriptLine key={index}>
              <TimeText>{line.time}</TimeText>
              <ScriptText>{line.text}</ScriptText>
            </ScriptLine>
          ))}
        </ScriptContainer>
      );
    }
  };

  return (
    <>
      <Header />
      <Container>
        <LeftSection>
          <VideoContainer>
            {videoId && (
              <YouTube
                videoId={videoId}
                opts={{
                  width: playerSize.width.toString(),
                  height: playerSize.height.toString(),
                  playerVars: {
                    autoplay: 1,
                    rel: 0,
                    modestbranding: 1,
                  },
                }}
              />
            )}
          </VideoContainer>
          {showChat && <Chat visible={showChat} />}
        </LeftSection>

        <RightSection>
          <TheorySection>
            <TabButtonContainer>
              <div>
                <TabButton
                  className={activeTab === "summary" ? "active" : ""}
                  onClick={() => setActiveTab("summary")}
                >
                  요약본
                </TabButton>
                <TabButton
                  className={activeTab === "script" ? "active" : ""}
                  onClick={() => setActiveTab("script")}
                >
                  전체 스크립트
                </TabButton>
              </div>
            </TabButtonContainer>
            {renderContent()}
            <SaveFolderModal isOpen={isModalOpen} onClose={handleCloseModal} />
          </TheorySection>
        </RightSection>
      </Container>
    </>
  );
};

export default VideoSummary;
//필터를 선택해주세요 경고창 띄우기
//저장이 되었습니다 모달창 띄우기