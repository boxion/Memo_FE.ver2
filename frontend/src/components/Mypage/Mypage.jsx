import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Config from "../Config/config";

const MypageText = styled.div`
  font-size: 1.5vw;
  margin-top: 1vw;
  font-weight: bold;
  text-align: center;
  color: #202020;
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

const Mypage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [videoList, setVideoList] = useState([]);
  const [categoryName, setCategoryName] = useState(localStorage.getItem("categoryName") || "최근 본 영상");

  useEffect(() => {
    getVideoList(categoryName);
  }, [categoryName]);

  // 비디오 목록을 서버에서 가져오는 함수
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
      responseData = responseData.map((video) => ({ ...video, isLocked: false })); // isLocked 속성 추가
      responseData.reverse(); //내림차순으로 비디오 정렬

      setVideoList(responseData); // 받아온 데이터를 상태에 저장
    } catch (error) {
      console.error("에러 발생:", error);
      console.log("해당 카테고리가 비어있습니다.");
    }
  };

  // 잠금장치 기능
  const toggleLock = (videoUrl) => {
    setVideoList((prevVideoList) =>
      prevVideoList.map((video) =>
        video.videoUrl === videoUrl
          ? { ...video, isLocked: !video.isLocked }
          : video
      )
    );
  };

  // 페이지네이션 = 6 이상일시 화면 전환 기능
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

  const goToPage = (page) => { // 특정 페이지로 이동하는 함수
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

   // 비디오의 오른쪽 클릭 시 삭제 확인 후 삭제 처리
  const handleContextMenu = (event, video) => {
    event.preventDefault();
    if (window.confirm("이 영상을 삭제하시겠습니까?")) {
      deleteVideo(video.videoUrl);
    }
  };

  // 비디오 선택 시 해당 비디오의 데이터를 가져오는 함수
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

      window.location.href = "/video-summary";
    } catch (error) {
      console.error("영상 선택 중 에러가 발생했습니다:", error);
    }
  };

  // 비디오를 삭제하는 함수
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
          <VideoCard
            key={index}
            onClick={() => selectVideo(video.videoUrl)}
            onContextMenu={(e) => handleContextMenu(e, video)}
          >
            <VideoCardImage src={video.thumbnailUrl} />
            <VideoCardContent>{video.videoTitle}</VideoCardContent>
            <LockButton
              isLocked={video.isLocked}
              onClick={(e) => {
                e.stopPropagation();
                toggleLock(video.videoUrl);
              }}
            >
              {video.isLocked ? "🔒" : "🔓"}
            </LockButton>
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
