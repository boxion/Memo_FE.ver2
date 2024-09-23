import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import Config from "../Config/config";
import audioIcon from "../../assets/images/audio.png";
import pdfIcon from "../../assets/images/pdf.png";
import videoIcon from "../../assets/images/video.png";
import Header from "../Header/Header";

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
  margin-left: 18.5vw; /* MypageText를 오른쪽으로 이동 */
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1vw;
  gap: 1vw; /* 버튼 간격 */
  margin-left: 1.5vw; /* MypageText를 오른쪽으로 이동 */
`;
const CircleButton = styled.button`
  width: 2.5vw;
  height: 2.5vw;
  border-radius: 50%;
  background-color: #202D94;
  background-size: cover; /* 이미지 크기를 버튼에 맞게 */
  background-position: center; /* 이미지 중앙 정렬 */
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #4144E9;
  }

  &:active {
    background-color: #202D94;
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
  width: 100%; 
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

const LockButton = styled.button`
  position: absolute;
  right: 1vw;
  background-color: ${({ isLocked }) => (isLocked ? "#D9534F" : "#202D94")};
  color: white;
  border: none;
  width: 3vw;
  height: 3vw;
  font-size: 1vw;
  cursor: pointer;
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
  color: ${({ isActive }) => (isActive ? "#ffffff" : "#000000")}; /* isActive에 따라 색상 변경 */
  border: 0.1vw solid #4144E9;
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
  background-color: #D9D9D9;
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
  background-color: #D9D9D9;
`;

const itemsPerPage = 6;

const MyPDF = () => {
  const [reset, setReset] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfList, setVideoList] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [categoryName, setCategoryName] = useState(localStorage.getItem("categoryName") || "최근 본 영상");
  localStorage.removeItem("categoryName");

  const handleButtonClick = (path) => {
    navigate(path);
  };

  // // 잠금장치 기능
  // const toggleLock = async (videoUrl, currentStatus) => {
  //   const memberEmail = localStorage.getItem("userId");
  //   const newStatus = currentStatus ? "public" : "private"; // 현재 상태에 따라 새 상태 설정
  
  //   try {
  //     const response = await fetch(`${Config.baseURL}/api/v1/video/update-publication-status`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         memberEmail,
  //         videoUrl,
  //         status: newStatus,
  //       }),
  //     });
  
  //     if (response.ok) {
  //       console.log("잠금 상태 업데이트 성공");
  
  //       // 서버에서 응답이 성공적일 경우, 로컬 상태도 업데이트
  //       setVideoList((prevVideoList) =>
  //         prevVideoList.map((video) =>
  //           video.videoUrl === videoUrl
  //             ? { ...video, isLocked: newStatus === "private" } // 새로운 상태에 따라 잠금 상태 변경
  //             : video
  //         )
  //       );
  //     } else {
  //       console.error("잠금 상태 업데이트 실패", await response.text()); // 서버의 오류 메시지 출력
  //     }
  //   } catch (error) {
  //     console.error("잠금 상태 업데이트 중 에러 발생:", error);
  //   }
  // };

  // 페이지네이션 = 6 이상일시 화면 전환 기능
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

  const goToPage = (page) => { // 특정 페이지로 이동하는 함수
    setCurrentPage(page);
  };

  const renderPageButtons = () => {
    const totalPages = Math.ceil(pdfList.length / itemsPerPage);
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <PageButton
          key={i}
          isActive={i === currentPage}
          onClick={() => goToPage(i)}
        >
          {i}
        </PageButton>
      );
    }
    return pages;
  };


  if (reset) {
    // reset 상태일 때 비워진 상태를 렌더링
    return <div>로딩중...</div>; // 로딩 중 메시지
  }

  return (
    <>
    <Header />
      <MypageHeader>
        <ButtonContainer>
          <CircleButton style={{ backgroundImage: `url(${videoIcon})` }} onClick={() => handleButtonClick("/mypage")}/>
          <CircleButton style={{ backgroundImage: `url(${pdfIcon})`   }} onClick={() => handleButtonClick("/mypdf")}/>
          <CircleButton style={{ backgroundImage: `url(${audioIcon})` }} onClick={() => handleButtonClick("/myaudio")}/>
        </ButtonContainer>
      <MypageText>
        {categoryName === "최근 본 영상" || categoryName === "null"
          ? "최근 본 영상"
          : categoryName + " 카테고리 영상"}
      </MypageText>
    </MypageHeader>
      <GridContainer>
        {currentData.map((pdf, index) => (
          <PDFCard
            key={index}

          >
            <PDFCardImage src={pdf.thumbnailUrl} />
            <PDFCardContent>{pdf.pdfTitle}</PDFCardContent>
            <LockButton
              isLocked={pdf.isLocked}
              onClick={(e) => {
                e.stopPropagation();
                // toggleLock(video.videoUrl, video.isLocked);
              }}
            >
              {pdf.isLocked ? "🔒" : "🔓"}
            </LockButton>
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