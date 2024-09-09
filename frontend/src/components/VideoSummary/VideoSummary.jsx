import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Header from "../Header/Header";
import YouTube from "react-youtube";

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
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
`;

const MVCHeading = styled.h2`
  font-size: 1.2vw;
  color: #333;
  margin-bottom: 1vw;
`;

const MVCList = styled.ol`
  margin: 0;
  padding-left: 1vw;
`;

const MVCListItem = styled.div`
  margin-bottom: 1vw;
  background-color: #f0f0f0;
  border-radius: 1vw;
  padding: 1vw;
`;

const MVCListTitle = styled.h3`
  font-size: 1vw;
  color: #555;
  margin-bottom: 1vw;
`;

const MVCListText = styled.p`
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
  const dropdownRef = useRef(null);

  const categories = [
    "일반", "창업", "IT/프로그래밍", "공부", "뉴스", "정보", 
    "언어", "자격증", "취업/이직", "주식/투자", "라이프", "진로", "기타"
  ];

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setDropdownOpen(false); // 선택 후 드롭다운 닫기
  };

  // 드롭다운 외부 클릭 감지하여 닫기
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
        <MVCList>
          <MVCListItem>
            <MVCListTitle>1. MVC패턴이란 무엇인가?</MVCListTitle>
            <MVCListText>
              MVC패턴은 사용자 인터페이스와 비즈니스 로직을 분리하여 각각의 문제를 독립적으로 운영하여
              유지보수를 용이하게 만들 수 있는 디자인 패턴입니다.
            </MVCListText>
          </MVCListItem>
          <MVCListItem>
            <MVCListTitle>2. 두 모델의 핵심적인 차이</MVCListTitle>
            <MVCListText>
              두 모델의 핵심적인 차이는 두 가지로 요약할 수 있습니다.
            </MVCListText>
          </MVCListItem>
          <MVCListItem>
            <MVCListTitle>3. Dispatcher Servlet</MVCListTitle>
            <MVCListText>
              요청을 처리할 컨트롤러를 찾아 위임하고 최종적인 결과를 반환하는 것.
            </MVCListText>
          </MVCListItem>
        </MVCList>
      );
    } else if (activeTab === "script") {
      return (
        <div>
          <p>여기에 전체 스크립트 내용을 추가하세요.</p>
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

            <MVCHeading>MVC 패턴 이론</MVCHeading>
            
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

export default VideoSummary;
