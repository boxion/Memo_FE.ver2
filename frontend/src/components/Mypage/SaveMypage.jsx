import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수 정의
  const [videoList, setVideoList] = useState([]);
  const [likedVideos, setLikedVideos] = useState([]);
  const [currentVideoId, setCurrentVideoId] = useState(null); // 현재 처리중인 videoId 저장
  useEffect(() => {
    const storedLikes = JSON.parse(localStorage.getItem("likedVideos")) || [];
    setLikedVideos(Array.isArray(storedLikes) ? storedLikes : []);
    getSavedVideos();
  }, []);
  
  useEffect(() => {
    // 비디오 목록을 가져온 후 좋아요 상태를 설정
    if (videoList.length > 0) {
      const likedVideosWithDefaults = videoList.map(video => video.videoUrl);
      setLikedVideos(likedVideosWithDefaults);
    }
  }, [videoList]);
  useEffect(() => {
    // likedVideos가 업데이트된 후 실행
    if (currentVideoId) {
      setVideoList((prev) => prev.filter((video) => video.videoId !== currentVideoId));
      setCurrentVideoId(null); // 상태 초기화
    }
  }, [likedVideos, currentVideoId]);
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
  const toggleLike = async (videoUrl, videoId) => {
    const memberEmail = localStorage.getItem("userId");
    const isCurrentlyLiked = likedVideos.includes(videoUrl);
  
    try {
      if (isCurrentlyLiked) {
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
  
        // 좋아요 목록에서 즉시 제거
        const updatedLikes = likedVideos.filter((url) => url !== videoUrl);
        setLikedVideos(updatedLikes);
        localStorage.setItem("likedVideos", JSON.stringify(updatedLikes));
  
        // 비디오 리스트에서도 즉시 제거
        setVideoList((prev) => prev.filter((video) => video.videoId !== videoId));
      } else {
        const updatedLikes = [...likedVideos, videoUrl];
        setLikedVideos(updatedLikes);
        localStorage.setItem("likedVideos", JSON.stringify(updatedLikes));
      }
    } catch (error) {
      console.error("Error while toggling like:", error);
    }
  };
  
// 비디오 클릭 핸들러
const handleVideoClick = async (video) => {
  try {
    // memberEmail과 videoUrl을 서버로 전송
    const response = await fetch(`${Config.baseURL}/api/v1/community/video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        memberEmail: video.memberEmail,
        videoUrl: video.videoUrl,
      }),
    });

    if (!response.ok) {
      throw new Error('비디오 정보를 불러오는데 실패했습니다.');
    }

    const videoAndQuestions = await response.json();
    console.log('불러온 비디오 정보:', videoAndQuestions);

    // 전송 성공 시 videoSummary 페이지로 이동 (로컬 저장된 정보가 아닌 클릭한 비디오 정보로 이동)
    navigate(`/video-summary2`, {
      state: {
        memberEmail: video.memberEmail,
        videoUrl: video.videoUrl,
        videoTitle: video.videoTitle,
        summary: video.summary,
        fullScript: video.fullScript
      },
    });
        window.scrollTo(0, 0);

  } catch (error) {
    console.error('비디오 클릭 처리 중 오류 발생:', error);
  }
};
  
  return (
    <>
      <Header />
      <MypageText>좋아요 누른 영상</MypageText>
      <GridContainer>
        {videoList.map((video) => (
          <VideoCard key={video.videoUrl}>
            <VideoCardImage src={video.thumbnailUrl} alt="Video Thumbnail" onClick={() => handleVideoClick(video)} />
            <VideoCardContent>{video.videoTitle}</VideoCardContent>
            <LikeButton
              isLiked={likedVideos.includes(video.videoUrl)} // 비디오 별로 좋아요 상태 확인
              onClick={() => toggleLike(video.videoUrl, video.videoId)}
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
