import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Header from "../Header/Header";
import CategoryDropdown from "../Community/CategoryDropdown";
import Config from "../Config/config";
import { PdfViewer } from '@naverpay/react-pdf'; // PdfViewer import
import { useLocation } from "react-router-dom";
import SaveFolderModal from "../VideoSummary/SaveFolderModal";

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

const PdfContainer = styled.div`
  margin-bottom: 2vw;
  height: 60vh; // 원하는 높이로 조절
  overflow-y: auto; // 세로 스크롤 추가
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

const ScriptContainer = styled.div`
  max-height: 75vh; 
  overflow-y: auto;
  padding: 1vw;
  margin: 1vw 0 0 0;
  background-color: #f0f0f0;
  border-radius: 1vw;
`;
const ScriptLine = styled.div`
  display: flex;
  margin-bottom: 0.5vw;
`;
const ScriptText = styled.span`
  color: #333;
  font-size: 1vw;
`;

const TheorySection = styled.section`
  background-color: #fff;
  border-radius: 1vw;
  padding: 2vw;
  //box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  //width: 100%;
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

const TimeText = styled.span`
  font-weight: bold;
  font-size: 1vw;
  margin-right: 1vw;
  color: #333;
`;
const Divider = styled.div`
  height: 0.1vw;
  background-color: #d9d9d9;
`;

const PdfTitle = styled.h2` 
  font-size: 1.2vw;
  color: #333;
  margin-bottom: 1vw;
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

const PDFSummary = () => {
  const [activeTab, setActiveTab] = useState("summary");
  const [viewMode, setViewMode] = useState(true);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const pdfContainerRef = useRef(null); // ref 생성
  const [documentDate, setDocumentDate] = useState(new Date());
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [pdfTitle, setPdfTitle] = useState("");
  const [summary, setSummary] = useState([]);
  const [fullScript, setFullScript] = useState([]);
  const dropdownRef = useRef(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const location = useLocation();

  const categories = [
    "경제/뉴스", "IT/프로그래밍", "공부", "스포츠", "정보", 
    "언어", "자격증", "취업/이직", "주식/투자", "라이프", "진로", "기타", "필터없음"
  ];

  useEffect(() => {
      fetchPdfFile();
  }, []);
  
  const fetchPdfFile = async () => {
    try {
      const response = await fetch(`${Config.baseURL}/api/v1/files/getpdffile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberEmail: '44',  // 예시 데이터
          pdfTitle: 'Ch08_유효성 검사.pdf',  // 예시 데이터
        }),
      });
  
      if (!response.ok) {
        throw new Error('PDF 파일 가져오기 오류: ' + response.statusText);
      }
  
      const blob = await response.blob();
      const pdfUrl = window.URL.createObjectURL(blob);
      setPdfUrl(pdfUrl); // pdfUrl 상태 업데이트
  
      // /getpdfinfo POST 요청 추가
      const infoResponse = await fetch(`${Config.baseURL}/api/v1/files/getpdfinfo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberEmail: '44',  // 예시 데이터
          pdfTitle: 'Ch08_유효성 검사.pdf',  // 예시 데이터
        }),
      });
  
      if (!infoResponse.ok) {
        throw new Error('PDF 정보 가져오기 오류: ' + infoResponse.statusText);
      }
  
      const pdfInfo = await infoResponse.json(); // JSON 형태로 응답 받기
      console.log('PDF 정보:', pdfInfo); // 로그 찍기
  
    } catch (error) {
      console.error('PDF 파일 가져오기 오류:', error);
    }
  };
  

  // PDF가 로드된 후 스크롤을 최하단으로 이동
  useEffect(() => {
    if (pdfContainerRef.current) {
      pdfContainerRef.current.scrollTop = pdfContainerRef.current.scrollHeight; // 스크롤을 최하단으로 이동
    }
  }, [pdfUrl]); // pdfUrl이 업데이트될 때마다 실행


  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setDropdownOpen(false); // 선택 후 드롭다운 닫기
  };

  const handleRegisterClick = () => {
    if (!selectedCategory) {
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


  const renderContent = () => {
    if (activeTab === "summary") {
      return (
        <ListBox>
        <PdfTitle>{pdfTitle || "비디오 제목 없음"}</PdfTitle>
        {summary.map((paragraph, index) => (
          <ListItem key={index}>
            {/* title과 content를 분리하여 각각 렌더링 */}
            <ListText>
              <strong>{paragraph.title}</strong> {/* 소제목 */}
            </ListText>
            <ListText>{paragraph.content}</ListText> {/* 내용 */}
          </ListItem>
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
          <PdfContainer ref={pdfContainerRef}> {/* ref를 PdfContainer에 추가 */}
            {pdfUrl && (
              <PdfViewer 
                pdfUrl={pdfUrl} 
                onErrorPDFRender={(e) => console.error('PDF 렌더링 오류:', e)} // 오류 핸들링
              />
            )}
          </PdfContainer>
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
              <ActionButton onClick={handleRegisterClick}>등록하기</ActionButton>
            </ActionButtonContainer>
            <SaveFolderModal isOpen={isModalOpen} onClose={handleCloseModal} />
          </TheorySection>
        </RightSection>
      </Container>
    </>
  );
};

export default PDFSummary;