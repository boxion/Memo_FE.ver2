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
    setLikedVideos(storedLikes);
  }, []);

  const toggleLike = (videoUrl) => {
    const updatedLikes = likedVideos.includes(videoUrl)
      ? likedVideos.filter((url) => url !== videoUrl)
      : [...likedVideos, videoUrl];

    setLikedVideos(updatedLikes);
    localStorage.setItem("likedVideos", JSON.stringify(updatedLikes));
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
              onClick={() => toggleLike(video.videoUrl)}
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
