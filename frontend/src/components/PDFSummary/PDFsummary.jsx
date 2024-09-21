import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Header from "../Header/Header";
import Config from "../Config/config";
import { PdfViewer } from '@naverpay/react-pdf'; // PdfViewer import
import { useLocation } from "react-router-dom";
import SaveFolderModal from "../VideoSummary/SaveFolderModal";

const Container = styled.div`
  padding: 1vw;
  display: flex; 
  flex-direction: row;
  justify-content: center;
  font-family: Arial, sans-serif;

   @media (max-width: 768px) { 
    flex-direction: column;
  }
`;

const LeftSection = styled.div`
  width: 100%;
  max-width: 600px;
  padding-right: 2vw;
  display: flex;
  flex-direction: column;
`;

const RightSection = styled.div`
  width: 100%;
  max-width: 600px;
  padding-left: 2vw;
  position: relative;
`;


const PdfContainer = styled.div`
  height: 70vh;
  overflow-y: auto;
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

const ListBox = styled.ol`
  margin: 0;
  padding-left: 1vw;
  max-height: 64vh; 
  overflow-y: auto;
`;

const ListItem = styled.div`
  margin: 1vw 1vw 0 0;
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
  padding: 1vw;
  margin: 1vw 0 0 0;
  background-color: #f0f0f0;
  border-radius: 1vw;
`;

const TheorySection = styled.section`
  background-color: #fff;
  border-radius: 1vw;
`;

const PdfTitle = styled.div` 
  font-size: 1.3vw;
  font-weight: bold;
  color: #333;
  margin-top: 0.5vw;
`;

const DateText = styled.div`
  font-size: 1vw;
  margin-bottom: 0.5vw;
  color: #838383;
`;

//요약본 처리해주는 함수
const parseSummary = (summary) => {
  const paragraphs = summary.split("\n\n").filter(p => p.trim()); // '•'를 기준으로 분리
  return paragraphs.map((paragraph, index) => {
    const [title, ...content] = paragraph.split(": "); // ':'로 제목과 내용 분리
    return {
      title: title.trim() || `Section ${index + 1}`, // 제목이 없으면 'Section'으로 대체
      content: content.join(": ").trim(), // 내용이 ':' 이후로 나올 수 있으므로 다시 합침
    };
  });
};

const PDFSummary = () => {
  const [activeTab, setActiveTab] = useState("summary");
  const [viewMode, setViewMode] = useState(true);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const pdfContainerRef = useRef(null); 
  const [documentDate, setDocumentDate] = useState(new Date());
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [pdfTitle, setPdfTitle] = useState("");
  const [summary, setSummary] = useState([]);
  const [fullScript, setFullScript] = useState([]);
  const dropdownRef = useRef(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const location = useLocation();


  useEffect(() => {
    // PDF가 변경될 때마다 초기화 처리
    if (pdfContainerRef.current) {
      pdfContainerRef.current.innerHTML = ''; // 기존의 canvas 삭제
    }
  }, [pdfUrl]);

  useEffect(() => {
    fetchPdfFile();
  }, []);

  const fetchPdfFile = async () => {
    setIsLoading(true); // 로딩 시작
    try {
      let memberEmail = localStorage.getItem("userId");
      let pdfTitle = localStorage.getItem("PDFFileName");
      
      const response = await fetch(`${Config.baseURL}/api/v1/files/getpdffile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberEmail: memberEmail, 
          pdfTitle: pdfTitle,  
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
          memberEmail: memberEmail,
          pdfTitle: pdfTitle,
        }),
      });
  
      if (!infoResponse.ok) {
        throw new Error('PDF 정보 가져오기 오류: ' + infoResponse.statusText);
      }
  
      const pdfInfo = await infoResponse.json(); // JSON 형태로 응답 받기
      console.log('PDF 정보:', pdfInfo); // 로그 찍기
      
      // 상태 업데이트
      setPdfTitle(pdfTitle);
      console.log('pdfInfo.fullScript :', pdfInfo.fullScript);
      setSummary(parseSummary(pdfInfo.summary)); // 요약본을 파싱하여 상태로 설정
      // setFullScript(pdfInfo.fullScript); // 전체 스크립트를 그대로 설정
      setDocumentDate(pdfInfo.documentDate); // 문서 날짜 설정
      // setSelectedCategory(pdfInfo.categoryName || ""); // 카테고리 설정
  
    } catch (error) {
      console.error('PDF 파일 가져오기 오류:', error);
    } finally {
      setIsLoading(false); // 로딩 끝
    }
  };

  const handleLoadSuccess = () => {
    console.log("PDF 렌더링 성공");
  };
  
  const handleLoadError = (error) => {
    console.error("PDF 렌더링 오류:", error);
  };

  const handleRegisterClick = () => {
    setModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const renderContent = () => {
    if (activeTab === "summary") {
      return (
        <>
        <PdfTitle>🖍️ {pdfTitle || "제목 없음"}</PdfTitle>
        <ListBox>
          {summary.map((paragraph, index) => (
            <ListItem key={index}>
              <ListText>
                <strong>{paragraph.title}</strong>
              </ListText>
              <ListText>{paragraph.content}</ListText>
            </ListItem>
          ))}
        </ListBox>
        </>
      );
    } else if (activeTab === "script") {
      return (
        <ScriptContainer>
         {fullScript}
        </ScriptContainer>
      );
    }
  };
  
  return (
    <>
      <Header />
      <Container>
        <LeftSection>
        <DateText>{localStorage.getItem("documentDate")}</DateText>
          <PdfContainer ref={pdfContainerRef}>
            {pdfUrl && !isLoading && (
              <PdfViewer
                key={Math.random()}
                pdfUrl={pdfUrl}
                onErrorPDFRender={handleLoadError}
                onLoadSuccess={handleLoadSuccess}
              />
            )}
          </PdfContainer>
        </LeftSection>
        <RightSection>
          <TheorySection>
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
