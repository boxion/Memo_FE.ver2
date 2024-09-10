import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Header from "../Header/Header";
import YouTube from "react-youtube";
import Chat from "./Chatgpt";

// 스타일 설정
const Container = styled.div`
  padding: 2vw;
  display: flex;
  justify-content: center;
  font-family: Arial, sans-serif;
`;

const LeftSection = styled.div`
  width: 100%;
  max-width: 600px;
  padding-right: 2vw;
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    width: 50%;
  }
`;

const RightSection = styled.div`
  width: 100%;
  max-width: 600px;
  padding-left: 2vw;
  position: relative;

  @media (min-width: 768px) {
    width: 50%;
  }
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
  border: 0.1vw solid #D9D9D9;
  color: #000000;

  &.active {
    background-color: #d0d0d0;
  }
`;

const FilterButton = styled.button`
  padding: 0.5vw 1vw;
  font-size: 1vw;
  cursor: pointer;
  border-radius: 2vw;
  margin-right: 0.5vw;
  background-color: #ffffff;
  border: 0.1vw solid #582FFF;
  color: #582FFF;
 
    width: auto; /* 너비를 자동으로 설정 */
  white-space: nowrap; /* 텍스트 줄바꿈 방지 */
  max-width: 15vw; /* 버튼의 최대 너비 설정, 필요에 따라 조정 */
'
  &:hover {
    background-color: #d0d0d0;
  }

  &.active {
    background-color: #ffffff;
    border: 0.1vw solid #000000;
  }
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownMenu = styled.div`
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1;
  border-radius: 1vw;
  font-size: 1vw;
`;

const DropdownItem = styled.button`
  background-color: #fff;
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: 1vw;
  margin: 0.5vw;

  &:hover {
    background-color: #f1f1f1;
  }

  &.selected {
    color: #582FFF;
  }
`;

const ViewEditButton = styled.button`
  background-color: #4144E9;
  color: white;
  border: none;
  border-radius: 1vw;
  padding: 0.5vw 1vw;
  font-size: 0.8vw;
  cursor: pointer;
  margin-right: 1vw;

  &:hover {
    background-color: #0056b3;
  }
`;

const VideoContainer = styled.div`
  margin-bottom: 2vw;
`;

const TheorySection = styled.section`
  background-color: #fff;
  border-radius: 1vw;
  padding: 2vw;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
`;

const VideoTitle = styled.h2`
  font-size: 1.2vw;
  color: #333;
  margin-bottom: 1vw;
`;

const ListBox = styled.ol`
  margin: 0;
  padding-left: 1vw;
`;

const ListItem = styled.div`
  margin-bottom: 1vw;
  background-color: #f0f0f0;
  border-radius: 1vw;
  padding: 1vw;
`;

const ListText = styled.p`
  font-size: 1vw;
  color: #333;
  margin: 0;
`;

const ActionButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2vw;
`;

const ActionButton = styled.button`
  background-color: #202D94;
  color: white;
  border: none;
  border-radius: 0.5vw;
  padding: 1vw 2vw;
  font-size: 1vw;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: #d9d9d9;
`;

const PlaceholderText = styled.span`
  color: #888;
`;

const VideoSummary = () => {
  const [activeTab, setActiveTab] = useState("summary");
  const [viewMode, setViewMode] = useState(true);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showChat, setShowChat] = useState(true); 
  const [videoTitle, setVideoTitle] = useState("");
  const [summary, setSummary] = useState([]);
  const [fullScript, setFullScript] = useState("");
  const dropdownRef = useRef(null);

  const categories = [
    "일반", "창업", "IT/프로그래밍", "공부", "뉴스", "정보", 
    "언어", "자격증", "취업/이직", "주식/투자", "라이프", "진로", "기타"
  ];

  useEffect(() => {
    const storedVideoTitle = localStorage.getItem("videoTitle");
    const storedSummary = localStorage.getItem("summary");
    const storedFullScript = localStorage.getItem("fullScript");
    
    if (storedVideoTitle) {
      setVideoTitle(storedVideoTitle);
    }
    if (storedSummary) {
      setSummary(storedSummary.split("\n\n")); // 단락을 \n\n로 나눔
    }
    if (storedFullScript) {
      setFullScript(storedFullScript.split("\nT"));
    }
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setDropdownOpen(false); // 선택 후 드롭다운 닫기
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
            <ListItem key={index}>
              <ListText>{paragraph}</ListText>
            </ListItem>
          ))}
        </ListBox>
      );
    } else if (activeTab === "script") {
      return (
        <div>
          <p>{fullScript}</p>
        </div>
      );
    }
  };

  return (
    <>
      <Header />
      <Container>
        <LeftSection>
          <VideoContainer>
            <YouTube videoId="your-video-id-here" opts={{ width: "100%", height: "300px" }} />
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
                <DropdownContainer ref={dropdownRef}>
                  <FilterButton
                    onClick={() => setDropdownOpen(!isDropdownOpen)}
                  >
                    {selectedCategory || <PlaceholderText>필터를 선택해주세요</PlaceholderText>}
                  </FilterButton>
                  <DropdownMenu isOpen={isDropdownOpen}>
                    {categories.map((category, index) => (
                      <React.Fragment key={category}>
                        <DropdownItem
                          onClick={() => handleCategorySelect(category)}
                          className={selectedCategory === category ? "selected" : ""}
                        >
                          {category}
                        </DropdownItem>
                        {index < categories.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </DropdownMenu>
                </DropdownContainer>
              </div>
              <ViewEditButton onClick={() => setViewMode(!viewMode)}>
                {viewMode ? "View" : "Edit"}
              </ViewEditButton>
            </TabButtonContainer>

            {renderContent()}

            <ActionButtonContainer>
              <ActionButton>등록하기</ActionButton>
            </ActionButtonContainer>
          </TheorySection>
        </RightSection>
      </Container>
    </>
  );
};

export default VideoSummary;
