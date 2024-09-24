import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import checkImg from "../../assets/images/check3.png";
import YoutubeIcon from "../../assets/images/youtubebutton.png";
import RankVideo from "./RankingVideo";
import Config from "../Config/config";

const CheckImage = styled.img`
  width: 7%;
`;

const LoadingIcon = styled(FontAwesomeIcon).attrs({
  icon: faSpinner,
  size: "4x",
  color: "#333",
})``;

const LoadingText = styled.div`
  text-align: center;
  font-size: 1vw;
  font-weight: bold;
  margin-top: 2vw;
  margin-bottom: 2vw;
`;

const RedText = styled.span`
  font-size: 1vw;
  color: red;
  font-weight: bold;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Title = styled.h1`
  color: #000000;
  font-weight: bold;
  font-size: 2vw;
`;

const Subheading = styled.h5`
  color: #333;
  margin-top: -1vw;
  font-size: 1.1vw;
`;

const Detail = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1vw;
`;

const InputContainer = styled.div`
  background-color: #202d94;
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 0.7vw 1.5vw 0.7vw 1.5vw;
  border-radius: 1vw;
`;

const Input = styled.input`
  width: 30vw;
  padding: 1vw;
  border: none;
  border-radius: 0.4vw;
  background-color: #202d94;
  font-size: 1vw;
  color: white;
  ::placeholder {
    color: white;
  }
`;

const YoutubeIconImg = styled.img`
  width: 3vw;
  background: #e4e9ee;
  border: 0.3vw solid #fff;
  border-radius: 50%;
  cursor: pointer;
  outline: none;
  margin-right: 1vw;
`;

const Button = styled.button`
  font-size: 1.2vw;
  font-weight: 800;
  padding: 0.5vw 1vw;
  background-color: #e4e9ee;
  color: #4144e9;
  border: none;
  border-radius: 0.5vw;
  margin-left: 1vw;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};

  &:hover {
    background-color: ${({ disabled }) => (disabled ? "#000" : "#555")};
  }
`;

const Head = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 7vw;
`;

const RankingContainer = styled.div`
  margin: 8vw 0 2vw 0;
`;

const RankingItem = styled.div`
  font-size: 1vw;
  font-weight: bold;
  display: flex;
`;

const Home = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const GPTSummary = async (url) => {
    try {
      const userId = localStorage.getItem("userId"); // 로컬 스토리지에서 userId 가져오기
      localStorage.removeItem("videoQuestions");

      console.log("GPT 모델에 summary 요청을 전송하는 중...");
      console.log("[ 대상 URL ] : ", url);
      console.log("[ userId ] : ", userId);
        
      const response = await fetch(`${Config.baseURL}/api/v1/video/summary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"          
        },
        body: JSON.stringify({
          url: url,
          memberEmail: userId // userId 값을 함께 전송
        })
      });

      if (!response.ok) {
        console.error("서버에서 오류를 반환했습니다.");
        return;
      }

      const data = await response.json();
      localStorage.setItem("videoUrl", url);

      return data;
    
    } catch (error) {
      console.error("에러 발생:", error);
    }
  };

  const handleUpload = async () => {
    setIsLoading(true);
    try {
      console.log("영상 링크:", videoUrl);
      localStorage.setItem("videoUrl", videoUrl);
      await GPTSummary(videoUrl); // GPTSummary 함수 호출
      setIsCompleted(true);
      
      // 요약이 완료되면 바로 /video-summary 페이지로 이동
      navigate("/video-summary");
    } catch (error) {
      console.error("영상 요약 중 에러 발생:", error);
    }
    setIsLoading(false);
  };
  
  const getTitleContent = () => {
    if (isLoading) {
      return (
        <>
          <LoadingIcon spin />
          <LoadingText>
            Loading...
            <br /><br />
            잠깐! 새로고침은 안돼요!
            <br />
            <RedText>새로고침 시 영상변환이 초기화되니 유의해주세요.</RedText>
          </LoadingText>
        </>
      );
    } else {
      return (
        <>
          {isCompleted && <CheckImage src={checkImg} alt="Check" />}
          <Title>{getTitleText()}</Title>
          <Subheading>{getSubheadingText()}</Subheading>
        </>
      );
    }
  };

  const getTitleText = () => {
    if (isLoading) {
      return "영상을 요약하고 있어요...";
    } else {
      return "정리할 영상의 링크를 걸어주세요!";
    }
  };  
  
  const getSubheadingText = () => {
    return "정리하고 싶은 YouTube 영상의 링크를 붙여넣어주세요.";
  };

  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState(null);
  const [isValidUrl, setIsValidUrl] = useState(true); // URL 유효성 상태 추가

  const extractVideoId = (url) => {
    const regExp = /^(?:.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/))([^#\&\?]{11}).*/;
    const match = url.match(regExp);
    return match && match[1] ? match[1] : null;
  };

  const handleChange = (event) => {
    const url = event.target.value;
    setVideoUrl(url);
    setIsValidUrl(!!extractVideoId(url)); // URL 유효성 검사 및 상태 업데이트
  };

  const handleLoadVideo = () => {
    const id = extractVideoId(videoUrl);
    setVideoId(id);
  };

  return (
    <Container>
      <Head>
        {getTitleContent()}
        <Detail>
          <InputContainer>
            <YoutubeIconImg
              src={YoutubeIcon}
              alt="유튜브 아이콘"
              onClick={handleLoadVideo}
            />
            <Input
              type="text"
              value={videoUrl}
              onChange={handleChange}
              placeholder="https://www.youtube.com/"
              style={{ borderColor: isValidUrl ? "initial" : "red" }} // 유효하지 않은 URL일 경우 빨간 테두리 표시
            />
            <Button
              onClick={isLoading || !isValidUrl ? () => {} : handleUpload} // 유효하지 않은 URL일 경우 버튼 비활성화
              disabled={isLoading || videoUrl.trim() === "" || !isValidUrl} // 유효하지 않은 URL일 경우 버튼 비활성화
            >
              {isLoading ? "Loading.." : "Load Video"}
            </Button>
          </InputContainer>
        </Detail>
      </Head>
      <div style={{ marginTop: "5vw" }}>
        <RankingContainer>
          <RankingItem>▶ 실시간 사용자가 많이 본 영상이예요..</RankingItem>
          <RankVideo />
        </RankingContainer>
      </div>
    </Container>
  );
};

export default Home;
