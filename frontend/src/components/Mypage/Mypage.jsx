import React, { useState } from "react";
import styled from "styled-components";

const MypageText = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
`;

// 그리드 형식으로 카드들을 표시하는 컨테이너
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-gap: 2vw;
  margin: 2vw 15vw 1vw 15vw;
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(6, 1fr);
  }
`;

// 카드를 나타내는 버튼 스타일 컴포넌트
const StyledButton = styled.button`
  background-color: white;
  border: 0.2vw solid #838383;
  border-radius: 1vw;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: 11vw;
  padding-bottom: 1vw;
  cursor: pointer;
  transition: background-color 0.3s;

  &:active {
    background-color: #ccc;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.2);
  }
`;

const ButtonImage = styled.img`
  height: 70%;
  object-fit: cover;
  margin: 0.5vw;
`;

const ButtonContent = styled.div`
  text-align: center;
  font-size: 1vw;
  font-weight: bold;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// 페이지네이션 컨테이너
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1vw;
  margin-bottom: 2vw;
`;

const PageButton = styled.button`
  padding: 0.5vw 0.7vw;
  margin: 0 0.3vw;
  border: 0.1vw solid #838383;
  background-color: ${({ isActive }) => (isActive ? "#838383" : "transparent")};
  border-radius: 0.5vw;
  cursor: pointer;
  &:hover {
    color: #ffffff;
  }
`;

const PrevButton = styled.button`
  padding: 0.5vw 0.7vw;
  border: 0.1vw solid #d9d9d9;
  border-radius: 0.6vw;
  cursor: pointer;
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  background-color: #838383;

  &:hover {
    background-color: #606060;
  }
`;

const NextButton = styled.button`
  padding: 0.5vw 0.7vw;
  border: 0.1vw solid #d9d9d9;
  border-radius: 0.6vw;
  cursor: pointer;
  color: #d9d9d9;
  font-size: 1rem;
  font-weight: bold;
  background-color: #ffffff;

  &:hover {
    background-color: #606060;
  }
`;

// 페이지당 보여질 항목 수
const itemsPerPage = 12;

const Mypage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const videoList = JSON.parse(localStorage.getItem("videoList")) || [];
  const categoryName = localStorage.getItem("categoryName");

  // 현재 페이지에 따른 데이터 계산
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = videoList.slice(startIndex, endIndex);

  // 이전 페이지로 이동
  const goToPrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  // 다음 페이지로 이동
  const goToNextPage = () => {
    const totalPages = Math.ceil(videoList.length / itemsPerPage);
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  // 페이지 번호를 클릭하여 해당 페이지로 이동
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  // 페이지 버튼 렌더링
  const renderPageButtons = () => {
    const totalPages = Math.ceil(videoList.length / itemsPerPage);
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

  const handleContextMenu = (event, video) => {
    event.preventDefault();
    if (window.confirm("이 영상을 삭제하시겠습니까?")) {
      const updatedVideoList = videoList.filter(v => v.videoUrl !== video.videoUrl);
      localStorage.setItem("videoList", JSON.stringify(updatedVideoList));
      window.location.reload();  // 페이지를 새로고침하여 삭제된 항목을 반영
    }
  };

  return (
    <>
      <MypageText>
        {categoryName === "최근 본 영상" || categoryName === "null"
          ? "최근 본 영상"
          : categoryName + " 카테고리 영상"}
      </MypageText>
      <GridContainer>
        {currentData.map((video, index) => (
          <StyledButton
            key={index}
            onClick={() => window.location.href = video.videoUrl}
            onContextMenu={(e) => handleContextMenu(e, video)}
          >
            <ButtonImage src={video.thumbnailUrl} />
            <ButtonContent>{video.videoTitle}</ButtonContent>
          </StyledButton>
        ))}
      </GridContainer>
      <PaginationContainer>
        <PrevButton onClick={goToPrevPage} disabled={currentPage === 1}>
          {"<"}
        </PrevButton>
        {renderPageButtons()}
        <NextButton
          onClick={goToNextPage}
          disabled={currentPage === Math.ceil(videoList.length / itemsPerPage)}
        >
          {">"}
        </NextButton>
      </PaginationContainer>
    </>
  );
};

export default Mypage;
