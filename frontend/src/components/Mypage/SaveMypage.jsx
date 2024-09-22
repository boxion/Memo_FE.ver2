import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Config from "../Config/config";
import Header from "../Header/Header";

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
`;

const VideoCardImage = styled.img`
  width: 100%;
  height: 13vw;
  background-color: #e0e0e0;
  background-size: cover;
  object-fit: cover; 
  border-radius: 0.5vw;
  margin-bottom: 0.5vw;
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

const LikeButton = styled.button`
  position: absolute;
  top: 0.5vw;
  right: 1vw;
  background-color: ${({ isLiked }) => (isLiked ? "red" : "gray")};
  border: none;
  border-radius: 50%;
  width: 2vw;
  height: 2vw;
  cursor: pointer;
`;

const SaveMypage = () => {
  const [videoList, setVideoList] = useState([]);
  const [likedVideos, setLikedVideos] = useState([]);

  useEffect(() => {
    const storedLikes = JSON.parse(localStorage.getItem("likedVideos")) || [];
    // likedVideos가 배열인지 확인
    setLikedVideos(Array.isArray(storedLikes) ? storedLikes : []);
    // 저장한 비디오 서버에서 불러오기
    getSavedVideos();
  }, []);

  // 저장한 비디오를 서버에서 가져오는 함수
  const getSavedVideos = async () => {
    const memberEmail = localStorage.getItem("userId");

    try {
      const response = await fetch(`${Config.baseURL}/api/v1/video/saved-videos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ memberEmail }),
      });

      if (!response.ok) {
        console.error("서버와 통신 중 오류가 발생했습니다.");
        return;
      }

      const savedVideos = await response.json();
      console.log("저장한 비디오:", savedVideos);

      const videoDetailsPromises = savedVideos.map(video => getVideoDetails(video.videoId));
      const videoDetails = await Promise.all(videoDetailsPromises);

      setVideoList(videoDetails);
    } catch (error) {
      console.error("저장한 비디오를 불러오는 중 에러가 발생했습니다:", error);
    }
  };

  // videoId로 비디오 세부 정보 가져오는 함수
  const getVideoDetails = async (videoId) => {
    try {
      const response = await fetch(`${Config.baseURL}/api/v1/video/details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoId }),
      });

      if (!response.ok) {
        console.error("비디오 세부 정보를 가져오는 중 오류가 발생했습니다.");
        return null;
      }

      const videoDetail = await response.json();
      return videoDetail;
    } catch (error) {
      console.error("비디오 세부 정보를 불러오는 중 에러가 발생했습니다:", error);
      return null;
    }
  };
  const toggleLike = async (videoId) => {
    const memberEmail = localStorage.getItem("userId");
    const isLiked = likedVideos.includes(videoId);
  
    try {
      if (isLiked) {
        // 언라이크 API 호출
        const response = await fetch(`${Config.baseURL}/api/v1/video/unlike`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ memberEmail, videoId }),
        });
  
        if (!response.ok) {
          const errorResponse = await response.text();
          console.error("Failed to unlike the video:", errorResponse);
          return;
        }
  
        console.log("Successfully unliked the video:", videoId);
  
        // 좋아요 목록에서 제거
        const updatedLikes = likedVideos.filter((id) => id !== videoId);
        console.log("Before update:", likedVideos);
        setLikedVideos(updatedLikes);
        localStorage.setItem("likedVideos", JSON.stringify(updatedLikes));
        console.log("After update:", updatedLikes);
  
        // 비디오 리스트에서 제거
        setVideoList((prev) => {
          const updatedList = prev.filter((video) => video.videoId !== videoId);
          console.log("Updated video list:", updatedList);
          return updatedList;
        });
      } else {
        // 좋아요 추가
        const updatedLikes = [...likedVideos, videoId];
        console.log("Before adding like:", likedVideos);
        setLikedVideos(updatedLikes);
        localStorage.setItem("likedVideos", JSON.stringify(updatedLikes));
        console.log("After adding like:", updatedLikes);
      }
    } catch (error) {
      console.error("Error while toggling like:", error);
    }
  };

  
  return (
    <>
      <Header />
      <MypageText>좋아요 누른 영상</MypageText>
      <GridContainer>
        {videoList.map((video) => (
          <VideoCard key={video.videoUrl}>
            <VideoCardImage src={video.thumbnailUrl} alt="Video Thumbnail" />
            <VideoCardContent>{video.videoTitle}</VideoCardContent>
            <LikeButton
              isLiked={likedVideos.includes(video.videoUrl)}
              onClick={() => toggleLike(video.videoId)}
            >
              ♥
            </LikeButton>
          </VideoCard>
        ))}
      </GridContainer>
    </>
  );
};
export default SaveMypage;
