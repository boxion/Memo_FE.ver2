import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import Config from "../Config/config";
import audioIcon from "../../assets/images/audio.png";
import pdfIcon from "../../assets/images/pdf.png";
import videoIcon from "../../assets/images/video.png";
import Header from "../Header/Header";

// 스타일링
const MypageHeader = styled.div`
  display: flex;
  align-items: center;
  margin: 1vw 15vw 1vw 15vw;
`;
const MypageText = styled.div`
  font-size: 1.5vw;
  margin-top: 1vw;
  font-weight: bold;
  text-align: center;
  color: #202020;
  margin-left: 18.5vw;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1vw;
  gap: 1vw;
  margin-left: 1.5vw;
`;
const CircleButton = styled.button`
  width: 2.5vw;
  height: 2.5vw;
  border-radius: 50%;
  background-color: #202d94;
  background-size: cover;
  background-position: center;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #4144e9;
  }

  &:active {
    background-color: #202d94;
  }
`;
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-gap: 2vw;
  margin: 1vw 15vw 1vw 15vw;
`;
const PDFCard = styled.button`
  background-color: white;
  border: none;
  border-radius: 1vw;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 100%;
  padding-bottom: 1vw;
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: translateY(-0.5vw);
    background-color: #f1f1f1;
  }

  &:active {
    background-color: #e0e0e0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
  }
`;
const PDFCardImage = styled.img`
  width: 50%;
  height: 13vw;
  background-color: #e0e0e0;
  background-size: cover;
  object-fit: cover;
  border-radius: 0.5vw;
  margin-bottom: 0.5vw;
  transition: transform 0.3s ease-in-out;
`;
const PDFCardContent = styled.div`
  text-align: center;
  font-size: 1vw;
  font-weight: 600;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 0.5vw;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1vw;
  margin-bottom: 2vw;
`;
const PageButton = styled.button`
  padding: 1vw;
  margin: 0 0.2vw;
  border: none;
  font-size: 1vw;
  background-color: ${({ isActive }) => (isActive ? "#4144E9" : "transparent")};
  border-radius: 0.5vw;
  cursor: pointer;
  color: ${({ isActive }) => (isActive ? "#ffffff" : "#000000")};
  border: 0.1vw solid #4144e9;
`;
const PrevButton = styled.button`
  padding: 1vw;
  margin: 0 0.2vw;
  border: none;
  border-radius: 0.5vw;
  cursor: pointer;
  color: #ffffff;
  font-size: 1vw;
  font-weight: bold;
  background-color: #d9d9d9;
`;
const NextButton = styled.button`
  padding: 1vw;
  margin: 0 0.2vw;
  border: none;
  border-radius: 0.5vw;
  cursor: pointer;
  color: #ffffff;
  font-size: 1vw;
  font-weight: bold;
  background-color: #d9d9d9;
`;

const itemsPerPage = 6;

const MyPDF = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfList, setPdfList] = useState([]);
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState(localStorage.getItem("categoryName") || "최근 본 영상");
  localStorage.removeItem("categoryName");

  // PDF 목록 가져오기
  useEffect(() => {
    const fetchPDFs = async () => {
      const memberEmail = localStorage.getItem("userId");
      try {
        const response = await fetch(`${Config.baseURL}/api/v1/files/getpdfs`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ memberEmail }),
        });

        if (response.ok) {
          const data = await response.json();
          setPdfList(data); // PDF 목록을 상태에 저장
        } else {
          console.error("PDF 목록 가져오기 실패:", await response.text());
        }
      } catch (error) {
        console.error("PDF 목록 가져오기 중 에러 발생:", error);
      }
    };

    fetchPDFs();
  }, []);

  // 페이지네이션 로직
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = pdfList.slice(startIndex, endIndex);

  const goToPrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    const totalPages = Math.ceil(pdfList.length / itemsPerPage);
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const renderPageButtons = () => {
    const totalPages = Math.ceil(pdfList.length / itemsPerPage);
    return Array.from({ length: totalPages }, (_, index) => (
      <PageButton
        key={index + 1}
        isActive={index + 1 === currentPage}
        onClick={() => goToPage(index + 1)}
      >
        {index + 1}
      </PageButton>
    ));
  };

  const handlePDFClick = (pdfTitle) => {
    localStorage.setItem("PDFFileName", pdfTitle);
    // 여기에서 PDF 파일을 열거나 다른 동작을 추가할 수 있습니다.
    console.log(`Saved PDF file name: ${pdfTitle}`); // 확인용 로그
    navigate("/PDF-Summary");
  };
  

  return (
    <>
      <Header />
      <MypageHeader>
        <ButtonContainer>
          <CircleButton style={{ backgroundImage: `url(${videoIcon})` }} onClick={() => navigate("/mypage")} />
          <CircleButton style={{ backgroundImage: `url(${pdfIcon})` }} onClick={() => navigate("/mypdf")} />
          <CircleButton style={{ backgroundImage: `url(${audioIcon})` }} onClick={() => navigate("/myaudio")} />
        </ButtonContainer>
        <MypageText>
          {categoryName === "최근 본 영상" || categoryName === "null"
            ? "최근 본 영상"
            : `${categoryName} 카테고리 영상`}
        </MypageText>
      </MypageHeader>
      <GridContainer>
        {currentData.map((pdf, index) => (
          <PDFCard key={index} onClick={() => handlePDFClick(pdf.pdfTitle)}>
            <PDFCardImage src={pdf.thumbnailUrl} />
            <PDFCardContent>{pdf.pdfTitle}</PDFCardContent>
          </PDFCard>
        ))}
      </GridContainer>
      <PaginationContainer>
        <PrevButton onClick={goToPrevPage}>{"<"}</PrevButton>
        {renderPageButtons()}
        <NextButton onClick={goToNextPage}>{">"}</NextButton>
      </PaginationContainer>
    </>
  );
};

export default MyPDF;
