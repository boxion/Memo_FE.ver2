import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Header from "../Header/Header";
import Config from "../Config/config";
import { PdfViewer } from '@naverpay/react-pdf';
import SaveFolderModal from "../VideoSummary/SaveFolderModal";
import PDFChat from "./PDFChat";
import gptIcon from "../../assets/images/GPTIcon.png";

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
  max-height: 63vh; 
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
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const GptIcon = styled.img`
  margin-right: 2vw;
  width: 2vw;
  height: 2vw;
  cursor: pointer;
`;

const ChatOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const ChatContainer = styled.div`
  border-radius: 1vw;
  padding: 1vw;
  width: 50%;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  background-color: white;
`;

const DateText = styled.div`
  font-size: 1vw;
  margin-bottom: 0.5vw;
  color: #838383;
`;

// 요약본 처리해주는 함수
const parseSummary = (summary) => {
  const paragraphs = summary.split("\n\n").filter(p => p.trim());

  return paragraphs.map((paragraph, index) => {
    // split(":")으로 나누기
    let [title, ...content] = paragraph.split(":");

    // title과 content에서 *만 ""로 변경
    const replaceStars = (str) => str.replace(/\**/g, "");

    // title과 content에서 *을 빈 문자열로 대체
    title = replaceStars(title);
    content = content.map(text => replaceStars(text));

    return {
      title: title.trim() || `Section ${index + 1}`, // title이 빈 문자열일 경우 기본 섹션 제목 설정
      content: content.join(": ").trim(), // 내용 합치기
    };
  });
};


const PDFSummary = () => {
  const [activeTab, setActiveTab] = useState("summary");
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const pdfContainerRef = useRef(null); 
  const [pdfTitle, setPdfTitle] = useState("");
  const [summary, setSummary] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isGptModalOpen, setGptModalOpen] = useState(false);
  useEffect(() => {
    if (pdfContainerRef.current) {
      pdfContainerRef.current.innerHTML = ''; // 기존의 canvas 삭제
    }
  }, [pdfUrl]);

  useEffect(() => {
    fetchPdfFile();
  }, []);

  const fetchPdfFile = async () => {
    setIsLoading(true);
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
      setPdfUrl(pdfUrl);
      
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

      const pdfInfo = await infoResponse.json();
      setPdfTitle(pdfTitle);
      setSummary(parseSummary(pdfInfo.summary));
      localStorage.setItem("documentDate", pdfInfo.documentDate);
  
    } catch (error) {
      console.error('PDF 파일 가져오기 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSuccess = () => {
    console.log("PDF 렌더링 성공");
  };
  
  const handleLoadError = (error) => {
    console.error("PDF 렌더링 오류:", error);
  };

  const handleRegisterClick = () => {
    alert("PDF 폴더에 저장되었습니다!");
    window.location.href = "/myPDF"; // /mypage로 이동
  };
  
  
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleGptIconClick = () => {
    setGptModalOpen(true);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseGptModal();
    }
  };
  
  const handleCloseGptModal = () => {
    setGptModalOpen(false);
  };

  const renderContent = () => {
    if (activeTab === "summary") {
      return (
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
            <PdfTitle>
              🖍️ {pdfTitle || "제목 없음"}
              <GptIcon src={gptIcon} alt="GPT Icon" onClick={handleGptIconClick} />
            </PdfTitle>
            {renderContent()}
            <ActionButtonContainer>
              <ActionButton onClick={handleRegisterClick}>등록하기</ActionButton>
            </ActionButtonContainer>
            <SaveFolderModal isOpen={isModalOpen} onClose={handleCloseModal} />
            {isGptModalOpen && (
              <>
                <ChatOverlay onClick={handleOverlayClick} />
                <ChatContainer>
                  <PDFChat visible={isGptModalOpen} onClose={handleCloseGptModal} isModal={true} />
                </ChatContainer>
              </>
            )}
          </TheorySection>
        </RightSection>
      </Container>
    </>
  );
};

export default PDFSummary;
