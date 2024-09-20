import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Config from "../Config/config";

const MypageText = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
`;

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

const itemsPerPage = 12;

const Mypage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [videoList, setVideoList] = useState([]); // videoList 상태 추가
  const [categoryName, setCategoryName] = useState(localStorage.getItem("categoryName") || "최근 본 영상");

  useEffect(() => {
    getVideoList(categoryName); // 컴포넌트가 처음 마운트될 때 호출
  }, [categoryName]);

  const getVideoList = async (categoryName) => {
    try {
      if (categoryName === "최근 본 영상") {
        categoryName = null;
      }

      const memberEmail = localStorage.getItem("userId");

      const response = await fetch(`${Config.baseURL}/api/v1/video/category-video`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ memberEmail, categoryName }),
      });

      if (!response.ok) {
        console.log("네트워크 응답이 실패했습니다. 개발자에게 문의하세요.");
        return;
      }

      let responseData = await response.json();
      responseData.reverse(); // 비디오 리스트를 내림차순으로 정렬

      setVideoList(responseData); // 받아온 데이터를 상태에 저장
    } catch (error) {
      console.error("에러 발생:", error);
      console.log("해당 카테고리가 비어있습니다.");
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = videoList.slice(startIndex, endIndex);

  const goToPrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    const totalPages = Math.ceil(videoList.length / itemsPerPage);
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

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
      deleteVideo(video.videoUrl);
    }
  };

  const selectVideo = async (videoUrl) => {
    const memberEmail = localStorage.getItem("userId");

    try {
      const response = await fetch(`${Config.baseURL}/api/v1/video/select-video`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          memberEmail,
          videoUrl
        })
      });

      if (!response.ok) {
        console.error("서버에서 오류가 발생했습니다.");
        return;
      }

      const responseData = await response.json();
      console.log("[ 선택한 video의 데이터: ] ", responseData);

      const { summary, document, videoUrl, documentDate, categoryName, videoTitle } = responseData.video;
      const { questions } = responseData;
      var document2 = document == null ? "" : document;
      const extractedQuestions = questions.map((question) => question.question);
      const extractedAnswers = questions.map((question) => question.answer);

      localStorage.setItem("summary", summary);
      localStorage.setItem("document", document2);
      localStorage.setItem("videoUrl", videoUrl);
      localStorage.setItem("videoTitle", videoTitle);
      localStorage.setItem("documentDate", documentDate);
      localStorage.setItem("categoryName", categoryName);
      localStorage.setItem("questions", JSON.stringify(extractedQuestions));
      localStorage.setItem("answers", JSON.stringify(extractedAnswers));

      window.location.href = "/memory";
    } catch (error) {
      console.error("영상 선택 중 에러가 발생했습니다:", error);
    }
  };

  const deleteVideo = async (videoUrl) => {
    try {
      const memberEmail = localStorage.getItem("userId");
      const videoList = JSON.parse(localStorage.getItem("videoList")) || [];

      const response = await fetch(`${Config.baseURL}/api/v1/video/delete-video`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          memberEmail,
          videoUrl
        })
      });

      if (response.status === 200) {
        console.log("영상 삭제 성공");
        const updatedVideoList = videoList.filter(
          (video) => video.videoUrl !== videoUrl
        );
        localStorage.setItem("videoList", JSON.stringify(updatedVideoList));
        window.location.reload();
      } else {
        console.error(`영상 삭제 오류. 상태 코드: ${response.status}`);
      }
    } catch (error) {
      console.error("영상 삭제 중 에러가 발생했습니다:", error);
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
            onClick={() => selectVideo(video.videoUrl)}
            onContextMenu={(e) => handleContextMenu(e, video)}
          >
            <ButtonImage src={video.thumbnailUrl} />
            <ButtonContent>{video.videoTitle}</ButtonContent>
          </StyledButton>
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
