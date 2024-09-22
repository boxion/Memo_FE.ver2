import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom"; // 영상 클릭 시 상태 전달을 받기 위함
import styled from "styled-components";
import Header from "../Header/Header";
import YouTube from "react-youtube";
import Chat from "./Chatgpt";
import SaveFolderModal from "./SaveFolderModal";
import Config from "../Config/config";

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
    color: #582fff;
  }
`;

// ToggleContainer 수정
const ToggleContainer = styled.div`
  position: relative;
  margin-top: 1rem; /* 여백 조정 */
  cursor: pointer;

  > .toggle-container {
    width: 70px;
    height: 24px;
    border-radius: 30px;
    background-color: #afafaf;
    transition: background-color 0.5s;

    // toggle--checked 클래스가 적용되었을 때
    &.toggle--checked {
      background-color: rgb(0, 200, 102);
    }
  }
`;

// ToggleCircle 컴포넌트 생성
const ToggleCircle = styled.div`
  position: absolute;
  top: 1px;
  left: 1px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: #e9e9ea;
  transition: left 0.5s;

  // toggle--checked 클래스가 적용되었을 때
  &.toggle--checked {
    left: 47px; // 체크된 상태에서의 위치
  }
`;

// ToggleText 컴포넌트
const ToggleText = styled.span`
  position: absolute;
  left: ${({ isEdit }) => (isEdit ? "0" : "30px")}; /* EDIT일 때 위치 조정 */
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: #000000;
`;

const ToggleText2 = styled.span`
  position: absolute;
  left: ${({ isEdit }) => (isEdit ? "0" : "10px")}; /* EDIT일 때 위치 조정 */
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: #000000;
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

const ActionButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2vw;
`;

const ActionButton = styled.button`
  background-color: #202d94;
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
  height: 0.1vw;
  background-color: #d9d9d9;
`;

const PlaceholderText = styled.span`
  color: #888;
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
  const [activeTab, setActiveTab] = useState("summary");
  const [viewMode, setViewMode] = useState(true);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [showChat, setShowChat] = useState(true);
  const [videoTitle, setVideoTitle] = useState("");
  const [summary, setSummary] = useState([]);
  const [fullScript, setFullScript] = useState([]);
  const dropdownRef = useRef(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [documentDate, setDocumentDate] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [filter, setFilter] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [viewCount, setViewCount] = useState(0);

  const filters = [ "경제/뉴스", "IT/프로그래밍", "공부", "스포츠", "정보", "언어", "자격증", "취업/이직", "주식/투자", "라이프", "진로", "기타", "필터없음" ];

  useEffect(() => {
    const fetchVideoData = async () => {
      // 로컬 스토리지에서 userId와 videoUrl을 가져옴
      const memberEmail = localStorage.getItem("userId");
      const videoUrl = localStorage.getItem("videoUrl");

      // POST 요청 보내기
      const requestURL = `${Config.baseURL}/api/v1/video/select-video`;
      const requestData = {
        memberEmail: memberEmail,
        videoUrl: videoUrl
      };

      try {
        const response = await fetch(requestURL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestData)
        });

        // 응답 상태 체크
        if (!response.ok) {
          throw new Error("네트워크 응답에 문제가 있습니다.");
        }

        // 응답 데이터를 JSON으로 파싱
        const responseData = await response.json();
        console.log("[ 선택한 video의 데이터: ] ", responseData);

        // 받은 데이터에서 필요한 정보를 추출합니다.
        const { video } = responseData;
        const { videoTitle, summary, documentDate, categoryName, filter, fullScript, isPublished, viewCount } = video;
        const { questions } = responseData;

        // 로컬 스토리지에 질문 데이터 저장
        if (questions) {
          localStorage.setItem("videoQuestions", JSON.stringify(questions));
        }

        // 상태 업데이트
        if (videoTitle) setVideoTitle(videoTitle);
        if (summary) handleSetSummary(summary); // 변경된 부분
        if (documentDate) setDocumentDate(documentDate);
        if (categoryName) setCategoryName(categoryName);

        // filter가 null이 아닐 때만 setSelectedFilter 호출
        if (filter !== null) setSelectedFilter(filter);
        if (fullScript) setFullScript(fullScript.split("\n"));
        if (isPublished !== undefined) setIsPublished(isPublished);
        if (viewCount !== undefined) setViewCount(viewCount);

        if (videoUrl) {
          const videoId = extractVideoId(videoUrl);
          setVideoId(videoId);
        }
      } catch (error) {
        console.error("비디오 데이터 가져오기 실패:", error);
      }
    };

    fetchVideoData();
  }, []);

  // selectedFilter가 변경될 때마다 백엔드로 PUT 요청을 보낸다.
  useEffect(() => {
    if (selectedFilter) {
      console.log("필터가 변경되었습니다:", selectedFilter);

      // 로컬 스토리지에서 memberEmail과 videoUrl을 가져옴
      const memberEmail = localStorage.getItem("userId"); // 'userId' 대신 실제 로컬스토리지 키 사용
      let videoUrl = localStorage.getItem("videoUrl"); // 'videoUrl' 대신 실제 로컬스토리지 키 사용

      // 보내려는 주소
      const requestURL = `${Config.baseURL}/api/v1/video/update-filter`;

      // 보내려는 데이터
      const requestData = {
        memberEmail: memberEmail, // 로컬스토리지에서 가져온 값
        videoUrl: videoUrl, // 로컬스토리지에서 가져온 값
        filter: selectedFilter // 현재 선택된 필터 값
      };

      // PUT 요청 보내기
      fetch(requestURL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
      })
        .then((response) => response.text()) // 응답을 텍스트로 받음
        .then((data) => {
          console.log("필터 업데이트 성공:", data);
        })
        .catch((error) => {
          console.error("필터 업데이트 실패:", error);
        });
    }
  }, [selectedFilter]);

  // summary가 변경될 때마다 통신
  useEffect(() => {
    const updateSummary = async () => {
      const memberEmail = localStorage.getItem("userId");
      const videoUrl = localStorage.getItem("videoUrl");

      // summary를 문자열로 변환
      const summaryString = summary
        .map((item) => `${item.title}\n${item.content}`)
        .join("###");

      console.log(
        "memberEmail, videoUrl, summaryString",
        memberEmail,
        videoUrl,
        summaryString
      );

      // PUT 요청
      try {
        const response = await fetch(
          `${Config.baseURL}/api/v1/video/update-summary`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              memberEmail,
              videoUrl,
              summary: summaryString
            })
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update summary");
        }

        const data = await response.json();
        console.log("Update response:", data);
      } catch (error) {
        console.error("Failed to update summary:", error);
      }
    };

    if (summary.length > 0) {
      updateSummary();
    }
  }, [summary]); // summary가 변경될 때마다 실행

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

  // summary 설정 로직
  const handleSetSummary = (newSummary) => {
    if (newSummary) {
      const formattedSummary = newSummary
        .split("###")
        .map((item) => {
          const lines = item.split("\n");
          return {
            title: lines[0],
            content: lines.slice(1).join("\n").trim()
          };
        })
        .filter(
          (item) => item.title.trim() !== "" || item.content.trim() !== ""
        );

      setSummary(formattedSummary);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedFilter(category);
    setDropdownOpen(false); // 선택 후 드롭다운 닫기
  };

  const handleRegisterClick = () => {
    if (!setSelectedFilter) {
      // 필터가 선택되지 않았을 경우 경고창 띄우기
      alert("필터를 선택해주세요.");
    } else {
      // 필터가 선택되었을 경우 모달 열기
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const extractVideoId = (url) => {
    // 숏츠 URL을 포함한 유튜브 URL에서 videoId를 추출합니다.
    const regExp =
      /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[1] ? match[1] : null;
  };

  const handleResize = () => {
    setPlayerSize({
      width: window.innerWidth * 0.4,
      height: (window.innerWidth * 0.35 * 9) / 16
    });
  };

  const handleTitleChange = (e, index) => {
    const newTitle = e.target.textContent; // 입력된 텍스트 가져오기
    setSummary((prevSummary) =>
      prevSummary.map((item, i) =>
        i === index ? { ...item, title: newTitle } : item
      )
    );
  };

  const handleContentChange = (e, index) => {
    const newContent = e.target.textContent; // 입력된 텍스트 가져오기
    setSummary((prevSummary) =>
      prevSummary.map((item, i) =>
        i === index ? { ...item, content: newContent } : item
      )
    );
  };

  const toggleHandler = () => {
    setViewMode(!viewMode);
  };

  const renderContent = () => {
    if (activeTab === "summary") {
      return (
        <ListBox>
          <VideoTitle>{videoTitle || "비디오 제목 없음"}</VideoTitle>
          {summary.map((paragraph, index) => (
            <ListItem key={index}>
              {/* title과 content를 분리하여 각각 렌더링 */}
              <ListText
                contentEditable={!viewMode} // viewMode에 따라 편집 가능 여부 설정
                suppressContentEditableWarning={true} // 경고 메시지 숨김
                onInput={(e) => handleTitleChange(e, index)} // 타이틀이 변경되었을 때 핸들러
              >
                <strong>{paragraph.title}</strong> {/* 소제목 */}
              </ListText>
              <ListText
                contentEditable={!viewMode} // viewMode에 따라 편집 가능 여부 설정
                suppressContentEditableWarning={true} // 경고 메시지 숨김
                onInput={(e) => handleContentChange(e, index)} // 내용이 변경되었을 때 핸들러
              >
                {paragraph.content}
              </ListText>{" "}
              {/* 내용 */}
            </ListItem>
          ))}
        </ListBox>
      );
    } else if (activeTab === "script") {
      const parsedScript = parseScript(fullScript); // 스크립트 파싱
      return (
        <ScriptContainer>
          <VideoTitle>{videoTitle || "비디오 제목 없음"}</VideoTitle>
          {parsedScript.map((line, index) => (
            <ScriptLine key={index}>
              <TimeText>{line.time}</TimeText>
              <ScriptText
                contentEditable={!viewMode} // viewMode에 따라 편집 가능 여부 설정
                suppressContentEditableWarning={true} // 경고 메시지 숨김
              >
                {line.text}
              </ScriptText>
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
            <DateText>{documentDate}</DateText>
            {videoId && (
              <YouTube
                videoId={videoId}
                opts={{
                  width: playerSize.width.toString(),
                  height: playerSize.height.toString(),
                  playerVars: {
                    autoplay: 1,
                    rel: 0,
                    modestbranding: 1
                  }
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
                <DropdownContainer ref={dropdownRef}>
                  <FilterButton
                    onClick={() => setDropdownOpen(!isDropdownOpen)}
                  >
                    {selectedFilter || (
                      <PlaceholderText>필터를 선택해주세요</PlaceholderText>
                    )}
                  </FilterButton>
                  <DropdownMenu isOpen={isDropdownOpen}>
                    {filters.map((category, index) => (
                      <React.Fragment key={category}>
                        <DropdownItem
                          onClick={() => handleCategorySelect(category)}
                          className={
                            selectedFilter === category ? "selected" : ""
                          }
                        >
                          {category}
                        </DropdownItem>
                        {index < filters.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </DropdownMenu>
                </DropdownContainer>
              </div>
              <ToggleContainer onClick={toggleHandler}>
                <div
                  className={`toggle-container ${
                    viewMode ? "" : "toggle--checked"
                  }`}
                >
                  <ToggleText>{viewMode ? "VIEW" : ""}</ToggleText>
                  <ToggleCircle className={viewMode ? "" : "toggle--checked"} />
                  <ToggleText2>{viewMode ? "" : "EDIT"}</ToggleText2>
                </div>
              </ToggleContainer>
            </TabButtonContainer>

            {renderContent()}

            <ActionButtonContainer>
              <ActionButton onClick={handleRegisterClick}>
                등록하기
              </ActionButton>
            </ActionButtonContainer>
            <SaveFolderModal isOpen={isModalOpen} onClose={handleCloseModal} />
          </TheorySection>
        </RightSection>
      </Container>
    </>
  );
};

export default VideoSummary;
