import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Config from "../Config/config";

const RankingContainer = styled.div`
  margin-top: 1vw;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 1rem;
`;

const StyledButton = styled.button`
  background-color: white;
  border: 0.2vw solid #838383;
  border-radius: 1vw;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 15vw;
  height: 10vw;
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
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RankingVideo = () => {
  // 상태로 받아올 데이터를 저장
  const [rankingData, setRankingData] = useState([]);

  useEffect(() => {
    // 컴포넌트가 렌더링될 때 API 요청을 보냄
    const fetchRankingData = async () => {
      try {
        const response = await fetch(`${Config.baseURL}/api/v1/video/most-frequent-url`);
        const data = await response.json();
        setRankingData(data); // 받아온 데이터를 상태에 저장
      } catch (error) {
        console.error("Error fetching ranking data:", error);
      }
    };

    fetchRankingData(); // 데이터 요청 함수 호출
  }, []);

  const handleButtonClick = (videoUrl) => {
    const textarea = document.createElement("textarea");
    textarea.value = videoUrl;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    alert(`YouTube URL이 복사되었습니다😁\n아래의 입력창에 넣어보세요❗❗\n`);
  };

  return (
    <RankingContainer>
      {rankingData.map((data, index) => (
        <StyledButton
          key={index}
          onClick={() => handleButtonClick(data.videoUrl)}
        >
          <ButtonImage src={data.thumbnailUrl} alt={data.videoTitle} />
          <ButtonContent>{data.videoTitle}</ButtonContent>
        </StyledButton>
      ))}
    </RankingContainer>
  );
};

export default RankingVideo;
