import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Header from "../Header/Header";
import CategoryDropdown from "../Community/CategoryDropdown";
import Config from "../Config/config";
import { PdfViewer } from '@naverpay/react-pdf'; // PdfViewer import

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

const PdfContainer = styled.div`
  margin-bottom: 2vw;
  height: 60vh; // 원하는 높이로 조절
  overflow-y: auto; // 세로 스크롤 추가
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

const PDFSummary = () => {
  const [activeTab, setActiveTab] = useState("summary");
  const [viewMode, setViewMode] = useState(true);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const pdfContainerRef = useRef(null); // ref 생성

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
          <PdfContainer ref={pdfContainerRef}> {/* ref를 PdfContainer에 추가 */}
            {pdfUrl && (
              <PdfViewer 
                pdfUrl={pdfUrl} 
                onErrorPDFRender={(e) => console.error('PDF 렌더링 오류:', e)} // 오류 핸들링
              />
            )}
          </PdfContainer>

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

export default PDFSummary;