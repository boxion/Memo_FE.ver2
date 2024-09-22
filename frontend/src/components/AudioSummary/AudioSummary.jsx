import React, { useState } from "react";
import styled from "styled-components";
import Header from "../Header/Header";
import YouTube from "react-youtube";
import CategoryDropdown from "../Community/CategoryDropdown";
import audioData from "../../util/audioData";

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
  margin-bottom: 1vw;
`;

const TabButtonContainer = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const TabButton = styled.button`
  padding: 0.5vw 1vw;
  font-size: 1vw;
  cursor: pointer;
  border-radius: 1vw;
  margin-right: 0.5vw;
  background-color: #ffffff;
  border: 0.1vw solid #582FFF;
  color: #582FFF;

  &:hover {
    background-color: #d0d0d0;
  }

  &.active {
    background-color: #ffffff;
    border: 0.1vw solid #000000;
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

const ChatContainer = styled.div`
  flex-grow: 1;
  background-color: #000000;
  border-radius: 1vw;
  padding: 1vw;
`;

const ChatHeader = styled.div`
  background-color: #000000;
  color: white;
  padding: 1vw;
  border-radius: 1vw 1vw 0 0;
  font-size: 1vw;
`;

const ChatBox = styled.div`
  height: 20vw;
  overflow-y: auto;
  padding: 1vw;
  background-color: white;
  border-radius: 0 0 1vw 1vw;
`;

const ChatInputContainer = styled.div`
  display: flex;
  margin-top: 1vw;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 1vw;
  border-radius: 0.5vw;
  border: 1px solid #ccc;
  font-size: 1vw;
`;

const SendButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 0.5vw;
  padding: 1vw 2vw;
  font-size: 1vw;
  cursor: pointer;
  margin-left: 1vw;

  &:hover {
    background-color: #0056b3;
  }
`;

const MVCTheorySection = styled.section`
  background-color: #fff;
  border-radius: 1vw;
  padding: 2vw;
`;

const MVCHeading = styled.h2`
  font-size: 1.2vw;
  color: #333;
  margin-bottom: 1vw;
`;

const MVCList = styled.ol`
  margin: 0;
  padding-left: 1vw;
  height: 20vw; /* 원하는 높이 설정 */
  overflow-y: auto; /* 스크롤 가능 */
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
  margin-top: 2vw;
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

const AudioSummary = () => {
  const [activeTab, setActiveTab] = useState("summary");
  const [viewMode, setViewMode] = useState(true); 

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
        <div>
          <p>여기에 전체 스크립트 내용을 추가하세요.</p>
        </div>
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
          <VideoContainer>
            <YouTube videoId="your-video-id-here" opts={{ width: "100%", height: "300px" }} />
          </VideoContainer>

          <ChatContainer>
            <ChatHeader>ChatGPT와 대화</ChatHeader>
            <ChatBox>
              {/*채팅 내용 */}
            </ChatBox>
            <ChatInputContainer>
              <ChatInput type="text" placeholder="무엇이든 물어보세요..." />
              <SendButton>전송</SendButton>
            </ChatInputContainer>
          </ChatContainer>
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
                <TabButton
                  className={activeTab === "filter" ? "active" : ""}
                  onClick={() => setActiveTab("filter")}
                >
                  필터를 선택하세요
                </TabButton>
              </TabButtonContainer>

              <ViewEditButton onClick={() => setViewMode(!viewMode)}>
                {viewMode ? "View" : "Edit"}
              </ViewEditButton>
            </TabAndViewContainer>

            <MVCHeading>[10분 테코톡] 🧀 제리의 MVC 패턴</MVCHeading>
            
            {renderContent()}

            <ActionButtonContainer>
              <ActionButton>등록하기</ActionButton>
            </ActionButtonContainer>
          </MVCTheorySection>
        </RightSection>
      </Container>
    </>
  );
};

export default AudioSummary;
