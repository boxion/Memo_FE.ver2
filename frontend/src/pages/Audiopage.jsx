//오디오 ai
import React, { useState } from 'react';
import styled from 'styled-components';
import Header from "../components/Header/Header";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  margin-bottom: 20px;
  color: #666;
`;

const SelectContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 400px;
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-size: 14px;
  margin-bottom: 5px;
`;

const SelectBox = styled.select`
  width: 190px;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
`;

const UploadContainer = styled.div`
  margin-bottom: 20px;
`;

const UploadLabel = styled(Label)`
  display: block;
  margin-bottom: 10px;
`;

const UploadInput = styled.input`
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const RecordButton = styled.button`
  background-color: #4e6af7;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;
  &:hover {
    background-color: #3e56c1;
  }
  &:disabled {
    background-color: #aaa;
    cursor: not-allowed;
  }
`;

const InfoText = styled.p`
  font-size: 12px;
  color: #999;
  margin-top: 10px;
`;

function Audiopage() {
  const [recordingLanguage, setRecordingLanguage] = useState('한국어');
  const [scriptLanguage, setScriptLanguage] = useState('한국어');
  const [audioFile, setAudioFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const handleRecordingLanguageChange = (e) => {
    setRecordingLanguage(e.target.value);
  };

  const handleScriptLanguageChange = (e) => {
    setScriptLanguage(e.target.value);
  };

  const handleAudioUpload = (e) => {
    setAudioFile(e.target.files[0]);
  };

  const startRecording = () => {
    setIsRecording(true);
    // 녹음 시작 로직 구현 필요
  };

  const stopRecording = () => {
    setIsRecording(false);
    // 녹음 종료 로직 구현 필요
  };

  return (
    <>
    <Header />
    <Container>
      <Title>오디오를 요약하고 스크립트로 만들어 보세요!</Title>
      <Subtitle>녹음하거나 음성파일을 업로드 할 수 있습니다</Subtitle>
      
      <SelectContainer>
        <div>
          <Label>녹음 언어 선택</Label>
          <SelectBox value={recordingLanguage} onChange={handleRecordingLanguageChange}>
            <option value="한국어">한국어</option>
            <option value="영어">영어</option>
            <option value="중국어">중국어</option>
            <option value="일본어">일본어</option>
          </SelectBox>
        </div>
        <div>
          <Label>스크립트 언어 선택</Label>
          <SelectBox value={scriptLanguage} onChange={handleScriptLanguageChange}>
            <option value="한국어">한국어</option>
            <option value="영어">영어</option>
            <option value="중국어">중국어</option>
            <option value="일본어">일본어</option>
          </SelectBox>
        </div>
      </SelectContainer>

      <UploadContainer>
        <UploadLabel htmlFor="audio-upload">오디오 파일 업로드</UploadLabel>
        <UploadInput id="audio-upload" type="file" accept="audio/*" onChange={handleAudioUpload} />
      </UploadContainer>

      <ButtonContainer>
        <RecordButton onClick={startRecording} disabled={isRecording}>
          {isRecording ? '녹음 중...' : '음성녹음 시작'}
        </RecordButton>
        {isRecording && <RecordButton onClick={stopRecording}>녹음 종료</RecordButton>}
      </ButtonContainer>

      <InfoText>ⓘ 녹음본은 외부로 공개되지 않아요!</InfoText>
    </Container>
    </>
  );
}

export default Audiopage;
