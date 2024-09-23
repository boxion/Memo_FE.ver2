//내 오디오 페이지
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Config from "../Config/config";
import audioIcon from "../../assets/images/audio.png";
import pdfIcon from "../../assets/images/pdf.png";
import videoIcon from "../../assets/images/video.png";

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


const VideoCard = styled.button`
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

const VideoCardImage = styled.img`
  width: 100%; 
  height: 13vw;
  background-color: #e0e0e0;
  background-size: cover;
  object-fit: cover; 
  border-radius: 0.5vw;
  margin-bottom: 0.5vw;
  transition: transform 0.3s ease-in-out;
`;

const VideoCardContent = styled.div`
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
  width: 1.8vw;
  height: 1.8vw;
  border: none;
  padding: 1vw 1vw 1vw 0.1w;  /* Adjust the padding to move text */
  background-color: transparent;
  font-size: 1.2vw;
  margin: 0 0.5vw;
    cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
    /* 현재 페이지일 경우 동그라미 */
  ${({ isActive }) =>
    isActive &&
    `
      border-radius: 20%;  // 동그라미 모양
      border: 2px solid #4144E9;  // 동그라미 외곽선
      background-color: #4144E9;
      color: white;
    `}
`;

const PrevButton = styled.button`
  width: 1.8vw;
  height: 1.8vw;
  padding: 1vw 1vw 1vw 0.6w;  /* Adjust the padding to move text */
  margin: 0 0.2vw;
  border: none;
  border-radius: 0.5vw;
  cursor: pointer;
  color: #ffffff;
  font-size: 1.2vw;
  font-weight: bold;
  background-color: #D9D9D9;
  line-height: 0.2vw;  /* Adjust line-height to shift text upwards */
`;

const NextButton = styled.button`
  width: 1.8vw;
  height: 1.8vw;
  padding: 1vw 1vw 1vw 0.8w;  /* Adjust the padding to move text */
  margin: 0 0.2vw;
  border: none;
  border-radius: 0.5vw;
  cursor: pointer;
  color: #ffffff;
  font-size: 1.2vw;
  font-weight: bold;
  background-color: #D9D9D9;
  line-height: 0.2vw;  /* Adjust line-height to shift text upwards */
`;

const itemsPerPage = 6;

const Mypage = () => {
  const [reset, setReset] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [audioList, setAudioList] = useState([]);
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState(localStorage.getItem("categoryName") || "최근 본 영상");
  localStorage.removeItem("categoryName");

  

  // 페이지네이션 = 6 이상일시 화면 전환 기능
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = audioList.slice(startIndex, endIndex);

  const goToPrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    const totalPages = Math.ceil(audioList.length / itemsPerPage);
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const goToPage = (page) => { // 특정 페이지로 이동하는 함수
    setCurrentPage(page);
  };

  const renderPageButtons = () => {
    const totalPages = Math.ceil(audioList.length / itemsPerPage);
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
 
  return (
    <>
      <MypageHeader>
      <ButtonContainer>
      <CircleButton
          style={{ backgroundImage: `url(${videoIcon})` }}
          onClick={() => navigate("/mypage")}
        />
        <CircleButton
          style={{ backgroundImage: `url(${pdfIcon})` }}
          onClick={() => navigate("/mypdf")}
        />
        <CircleButton
          style={{ backgroundImage: `url(${audioIcon})` }}
          onClick={() => navigate("/myaudio")}
        />
      </ButtonContainer>
      <MypageText>
        {categoryName === "최근 요약한 오디오" || categoryName === "null"
          ? "최근 요약한 오디오"
          : categoryName + " 카테고리 오디오"}
      </MypageText>
    </MypageHeader>
      <GridContainer>
        {currentData.map((audio, index) => (
          <VideoCard>
            <VideoCardImage src={audio.thumbnailUrl} />
            <VideoCardContent>{audio.videoTitle}</VideoCardContent>
          </VideoCard>
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

export default Mypage;