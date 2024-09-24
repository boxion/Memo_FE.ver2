import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../Header/Header";
import CategoryDropdown from "../Community/CategoryDropdown";
import audioData from "../../util/audioData";
import audioScriptData from "../../util/audioScriptData";
import Chat from "../VideoSummary/AudioChatgpt";

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

const TabAndViewContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TabButtonContainer = styled.div`
  display: flex;
  justify-content: flex-start;
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

const MVCTheorySection = styled.section`
  background-color: #fff;
  border-radius: 1vw;
  padding: 0 2vw;
`;

const MVCHeading = styled.h2`
  font-size: 1.2vw;
  color: #333;
  margin-bottom: 1vw;
`;

const MVCList = styled.ol`
  margin: 0;
  padding-left: 1vw;
  height: 55vh; 
  overflow-y: auto;
`;

const MVCListItem = styled.div`
  margin-bottom: 1vw;
  background-color: #f0f0f0;
  border-radius: 1vw;        
  padding: 1vw;         
`;
const MVCListTitle = styled.div`
  font-size: 1vw;
  font-weight: bold;
  color: #555;
`;

const MVCListText = styled.div`
  font-size: 1vw;
  color: #333;
  margin: 0;
`;

const ActionButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1vw;
`;

const ActionButton = styled.button`
  background-color: #4144E9;
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

const AudioPlayer = styled.audio`
  width: 100%;
  margin: 1vw 0;
`;

const AudioPlayerTitle = styled.h3`
  font-size: 2vw;
  font-weight: bold;
  margin-bottom: 1vw;
  color: #333;
  text-align: center;
  font-family: 'Bangers', cursive; 
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const FilterButton = styled.button`
  padding: 0.5vw 1vw;
  font-size: 1vw;
  cursor: pointer;
  border-radius: 2vw;
  margin-right: 0.5vw;
  background-color: #ffffff;
  border: 0.1vw solid #582fff;
  color: #582fff;

  width: auto;
  white-space: nowrap;
  max-width: 15vw;

  &:hover {
    background-color: #d0d0d0;
  }

  &.active {
    background-color: #ffffff;
    border: 0.1vw solid #000000;
  }
`;

const PlaceholderText = styled.span`
  color: #888;
`;

const Divider = styled.div`
  height: 0.1vw;
  background-color: #d9d9d9;
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
    color: #582fff;
  }
`;

const AudioSummary = () => {
  const [activeTab, setActiveTab] = useState("summary");
  const [showChat, setShowChat] = useState(true);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const navigate = useNavigate(); // useNavigate 훅 사용

  const filters = [ "경제/뉴스", "IT/프로그래밍", "공부", "스포츠", "정보", "언어", "자격증", "취업/이직", "주식/투자", "라이프", "진로", "기타", "필터없음" ];

  const audioFilePath = `${process.env.PUBLIC_URL}/audio/jerry_mvc_pattern.m4a`;

  const handleCategorySelect = (category) => {
    setSelectedFilter(category);
    setDropdownOpen(false); // 선택 후 드롭다운 닫기
  };


  useEffect(() => {
    if (selectedFilter) {
      console.log("필터가 변경되었습니다:", selectedFilter);
      // 필터 업데이트 로직
    }
  }, [selectedFilter]);

  const handleSubmit = () => {
    alert("오디오파일에 저장이 되었어요!");
    navigate("/myaudio"); // /mypage로 이동
  };

  const renderContent = () => {
    if (activeTab === "summary") {
      return (
        <MVCList>
          {audioData.content.map((item, index) => (
            <MVCListItem key={index}>
              <MVCListTitle>{item.title}</MVCListTitle>
              {item.text.map((sentence, sentenceIndex) => (
                <MVCListText key={sentenceIndex}>{sentence}.</MVCListText>
              ))}
            </MVCListItem>
          ))}
        </MVCList>
      );
    } else if (activeTab === "script") {
      return (
        <MVCList>
          <MVCListItem>
            <MVCListTitle>📌 전체 스크립트</MVCListTitle>
            <MVCListText>{audioScriptData.split('\n').map((line, index) => (
              <div key={index}>{line}</div>
            ))}</MVCListText>
          </MVCListItem>
        </MVCList>
      );
    } else if (activeTab === "filter") {
      return (
        <CategoryDropdown onSelectCategory={(category) => console.log(category)} />
      );
    }
  };

  return (
    <>
      <Header />
      <Container>
        <LeftSection>
          <AudioPlayerTitle>AudioPlayer</AudioPlayerTitle>
          <AudioPlayer controls>
            <source src={audioFilePath} type="audio/mpeg" />
            Your browser does not support the audio element.
          </AudioPlayer>
          {showChat && <Chat visible={showChat} />}
        </LeftSection>

        <RightSection>
          <MVCTheorySection>
            <TabAndViewContainer>
              <TabButtonContainer>
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
                <DropdownContainer>
                  <FilterButton onClick={() => setDropdownOpen(!isDropdownOpen)}>
                    {selectedFilter || (
                      <PlaceholderText>필터를 선택해주세요</PlaceholderText>
                    )}
                  </FilterButton>
                  <DropdownMenu isOpen={isDropdownOpen}>
                    {filters.map((category, index) => (
                      <React.Fragment key={category}>
                        <DropdownItem
                          onClick={() => handleCategorySelect(category)}
                          className={selectedFilter === category ? "selected" : ""}
                        >
                          {category}
                        </DropdownItem>
                        {index < filters.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </DropdownMenu>
                </DropdownContainer>
              </TabButtonContainer>
            </TabAndViewContainer>

            <MVCHeading>[10분 테코톡] 🧀 제리의 MVC 패턴</MVCHeading>
            
            {renderContent()}

            <ActionButtonContainer>
              <ActionButton onClick={handleSubmit}>등록하기</ActionButton>
            </ActionButtonContainer>
          </MVCTheorySection>
        </RightSection>
      </Container>
    </>
  );
};

export default AudioSummary;
