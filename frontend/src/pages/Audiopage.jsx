import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import Header from "../components/Header/Header";
import { useSpeechRecognition } from 'react-speech-kit';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faSpinner, faUpload } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2vw;
  font-family: Arial, sans-serif;
  margin-top: 4vw;
`;

const Title = styled.h1`
  color: #000000;
  font-weight: bold;
  font-size: 2vw;
`;

const Subtitle = styled.h5`
  color: #333;
  margin-top: -1vw;
  font-size: 1.1vw;
`;

const UploadContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #f1f1f1;
  border-radius: 2vw;
  padding: 2vw;
  margin-top: 2vw;
  width: 40%;
  max-width: 1200px;
  box-shadow: 0px 0.8vw 1.2vw rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

const UploadIcon = styled.div`
  width: 4vw;
  height: 4vw;
  background-color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 2vw;
  box-shadow: 0px 0.4vw 0.8vw rgba(0, 0, 0, 0.1);
`;

const ResponsiveIcon = styled(FontAwesomeIcon)`
  width: 2.5vw;  
  height: auto;
`;

const UploadText = styled.span`
  font-size: 1.5vw;
  font-weight: bold;
  color: #666;
`;

const UploadInput = styled.input`
  display: none;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2vw;
`;

const RecordButton = styled.button`
  background-color: ${props => (props.isRecording ? "#f44336" : "#4CAF50")};
  color: white;
  padding: 1vw 3vw;
  font-size: 1.3vw;
  border: none;
  border-radius: 2vw;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: ${props => (props.isRecording ? "#d32f2f" : "#388E3C")};
  }
`;

const TranscriptBox = styled.div`
  background-color: #f9f9f9;
  border: 0.2vw solid #ccc;
  padding: 0 1vw 1vw 1vw;
  margin-top: 1vw;
  font-size: 1vw;
  border-radius: 1vw;
  width: 50%;
  color: #333;
  min-height: 4vw;
`;

const InfoText = styled.p`
  font-size: 1vw;
  color: #999;
  margin-top: 2vw;
`;

const AudioPlayer = styled.audio`
  margin-top: 1vw;
`;

const SendButton = styled.button`
  background-color: #202D94;
  color: white;
  padding: 1vw 3vw;
  font-size: 1.3vw;
  border: none;
  border-radius: 2vw;
  cursor: pointer;
  margin-top: 2vw;
  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

function Audiopage() {
  const [isRecording, setIsRecording] = useState(false); // 음성녹화 상태
  const [transcript, setTranscript] = useState(''); // 음성 녹음 실시간 변환 상태
  const [audioFile, setAudioFile] = useState(null); // 오디오 파일 업로드 상태
  const [fileName, setFileName] = useState('오디오 파일 업로드');  // 파일 이름 상태
  const [isLoading, setIsLoading] = useState(false);  // 로딩 상태
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const inputRef = useRef(null);
  const navigate = useNavigate(); 

  const { listen, stop } = useSpeechRecognition({
    onResult: (result) => {
      setTranscript(result);
    },
  });

  const startRecording = async () => {
    setIsRecording(true);
    setTranscript('');
    
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioFile(audioUrl);
      audioChunksRef.current = [];
    };

    mediaRecorderRef.current.start();
    listen();
  };

  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorderRef.current.stop();
    stop();
  };

  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);  // 파일 이름 업데이트
      setAudioFile(URL.createObjectURL(file));
    }
  };

  const handleSend = () => {
    setIsLoading(true);
 
    setTimeout(() => {
      setIsLoading(false); 
      navigate('/audio-summary'); 
    }, 5000);
  };

  return (
    <>
      <Header />
      <Container>
        <Title>오디오를 요약하고 스크립트로 만들어 보세요!</Title>
        <Subtitle>녹음하거나 음성파일을 업로드 할 수 있습니다.</Subtitle>

        <UploadContainer onClick={() => inputRef.current.click()}>
          <UploadIcon>
            <ResponsiveIcon icon={faUpload} />
          </UploadIcon>
          <UploadText>{fileName}</UploadText>
          <UploadInput ref={inputRef} id="audio-upload" type="file" accept="audio/*" onChange={handleAudioUpload} />
        </UploadContainer>
        
        {/* 파일 선택 시 보내기 버튼 활성화 */}
        {audioFile && (
          <SendButton onClick={handleSend} disabled={isLoading}>
            {isLoading ? (
              <FontAwesomeIcon icon={faSpinner} spin style={{ marginRight: "1vw" }} />
            ) : (
              '보내기'
            )}
          </SendButton>
        )}
          {/* 음성 녹음 기능 */}
        <ButtonContainer>
          <RecordButton onClick={isRecording ? stopRecording : startRecording} isRecording={isRecording}>
            {isRecording ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin style={{ marginRight: "1vw" }} />
                녹음 중...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faMicrophone} style={{ marginRight: "1vw" }} />
                실시간 녹음 시작
              </>
            )}
          </RecordButton>
        </ButtonContainer>

        {transcript && (
          <TranscriptBox>
            <p>음성 인식 결과:</p>
            {transcript}
          </TranscriptBox>
        )}

        <InfoText>ⓘ 녹음본은 외부로 공개되지 않아요!</InfoText>

        {audioFile && (
          <AudioPlayer controls>
            <source src={audioFile} type="audio/wav" />
            Your browser does not support the audio tag.
          </AudioPlayer>
        )}
      </Container>
    </>
  );
}

export default Audiopage;
