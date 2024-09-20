import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Config from "../Config/config";

const RankingContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 1vw;
`;

const RankingCard = styled.button`
  background-color: #ffffff;
  border: none;
  box-shadow: 0px 0.4vw 0.8vw rgba(0, 0, 0, 0.1);
  padding: 1vw;
  text-align: center;
  width: 20vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 1vw;
`;

const RankingCardImage = styled.img`
  width: 100%; 
  height: auto;
  background-color: #e0e0e0;
  background-size: cover;
  object-fit: cover; 
  border-radius: 0.5vw;
  margin-bottom: 0.5vw;
`;

const RankingCardContent = styled.div`
  font-size: 1vw;
  font-weight: 600;
  margin-bottom: 0.8vw;
  text-align: center;
  width: 100%;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 두 줄까지만 표시 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RankingCardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-top: 0.5vw;
`;

const RankingCardIcon = styled.div`
  font-size: 1.2vw;
  color: #ff6b6b;
`;

const RankingCardAvatar = styled.div`
  font-size: 1.2vw;
  color: #000000;
`;

const RankingVideo = () => {
  const [rankingData, setRankingData] = useState([]);

  useEffect(() => {
    const fetchRankingData = async () => {
      try {
        const response = await fetch(`${Config.baseURL}/api/v1/video/most-frequent-url`);
        const data = await response.json();
        setRankingData(data); 
      } catch (error) {
        console.error("Error fetching ranking data:", error);
      }
    };

    fetchRankingData();
  }, []);

  const handleButtonClick = (videoUrl) => {
    const textarea = document.createElement("textarea");
    textarea.value = videoUrl;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    alert(`📌 YouTube URL이 복사되었습니다.\n아래의 입력창에 넣어보세요.\n`);
  };

  return (
    <RankingContainer>
      {rankingData.map((data, index) => (
        <RankingCard key={index} onClick={() => handleButtonClick(data.videoUrl)}>
          <RankingCardImage src={data.thumbnailUrl} alt={data.videoTitle} />
          <RankingCardContent>{data.videoTitle}</RankingCardContent>
          <RankingCardFooter>
            <RankingCardIcon>★</RankingCardIcon>
            <RankingCardAvatar>👤</RankingCardAvatar>
          </RankingCardFooter>
        </RankingCard>
      ))}
    </RankingContainer>
  );
};

export default RankingVideo;
