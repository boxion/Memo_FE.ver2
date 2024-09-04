import React, { useEffect } from "react";
import styled from "styled-components";

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
  useEffect(() => {
    // 로컬 스토리지에서 각 영상 정보를 가져와서 출력하고 로그를 출력합니다.
    for (let i = 1; i <= 3; i++) {
      const rankingData = JSON.parse(localStorage.getItem(`ranking${i}`));
      if (rankingData) {
        console.log(`Ranking ${i} Data:`, rankingData);
      }
    }
  }, []);

  // rankingData 변수 정의
  const rankingData = [];
  for (let i = 1; i <= 3; i++) {
    const data = JSON.parse(localStorage.getItem(`ranking${i}`));
    if (data) {
      rankingData.push(data);
    }
  }
      // // 클립보드 API가 지원되는지 확인
      // if (navigator.clipboard && navigator.clipboard.writeText) {
      //   // 클립보드에 videoUrl 복사
      //   navigator.clipboard.writeText(videoUrl)
      //     .then(() => {
      //       // 클립보드에 복사되었을 때의 처리
      //       alert(
      //         `YouTube URL이 클립보드에 복사되었습니다😁\n아래의 입력창에 붙여넣어주세요❗❗`
      //       );
      //     })
      //     .catch((error) => {
      //       // 복사 실패 시 처리
      //       console.error("클립보드에 복사 실패:", error);
      //       alert("클립보드에 복사하는 중 오류가 발생했습니다.");
      //     });
      // } else {
      //   // 클립보드 API가 지원되지 않는 경우
      //   console.error("클립보드 API가 지원되지 않습니다.");
      //   alert("클립보드 API가 지원되지 않습니다. 다른 브라우저를 사용해 보세요.");
      // }
  

  const handleButtonClick = (videoUrl) => {
    const textarea = document.createElement("textarea");
    textarea.value = videoUrl;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    alert(`YouTube URL이 복사되었습니다😁\n아래의 입력창에 넣어보세요❗❗\n`);
    // alert(`YouTube URL이 복사되었습니다😁\n아래의 입력창에 넣어보세요❗❗\n${videoUrl}`);
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
