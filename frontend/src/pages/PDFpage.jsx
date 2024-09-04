import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from "../components/Header/Header";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2vw;
  font-family: Arial, sans-serif;
  margin-top: 1vw;
`;

const Title = styled.h1`
  font-size: 2vw;
`;

const Subtitle = styled.p`
  font-size: 1.2vw;
  color: #666;
  margin-bottom: 4vw;
`;

const UploadContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #e0e0e0;
  border-radius: 2vw;
  padding: 3vw;
  width: 50vw;
  max-width: 1200px;
  box-shadow: 0px 0.8vw 1.2vw rgba(0, 0, 0, 0.1);
`;

const PDFIcon = styled.div`
  width: 5vw;
  height: 5vw;
  background-color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 4vw;
  box-shadow: 0px 0.4vw 0.8vw rgba(0, 0, 0, 0.1);
`;

const PDFIconText = styled.span`
  font-size: 1.6vw;
  font-weight: bold;
  color: #666;
`;

const OptionsContainer = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  margin-right: 4vw;
`;

const SelectContainer = styled.div`
  margin-right: 2vw;
`;

const Label = styled.label`
  font-size: 1.5vw;
  display: block;
  margin-bottom: 1vw;
`;

const SelectBox = styled.select`
  width: 100%;
  padding: 1vw;
  font-size: 1.2vw;
  border: 0.2vw solid #ccc;
  border-radius: 0.8vw;
  background-color: #fff;
`;

const UploadButton = styled.button`
  background-color: #4e6af7;
  color: white;
  padding: 1vw 2vw;
  font-size: 1.3vw;
  border: none;
  border-radius: 1vw;
  cursor: pointer;
  display: flex;
  align-items: center;
  &:hover {
    background-color: #3e56c1;
  }
`;

const UploadFile = styled.input`
  display: none;
`;

const InfoText = styled.p`
  font-size: 1vw;
  color: #999;
  margin-top: 2vw;
`;

function PDFpage() {
  const [language, setLanguage] = useState('한국어');
  const [pdfFile, setPdfFile] = useState(null);
  const fileInputRef = useRef(null); // 파일 입력 참조
  const navigate = useNavigate(); // 페이지 이동

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handlePdfUpload = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleUploadButtonClick = () => {
    if (pdfFile) {
      navigate('/PDF-Summary'); // 페이지 이동
    } else {
      fileInputRef.current.click(); // 파일 입력을 클릭하여 파일 선택을 유도
    }
  };

  return (
    <>
      <Header />
      <Container>
        <Title>요약할 PDF파일을 업로드 해주세요!</Title>
        <Subtitle>PDF파일을 업로드 하시면 AI가 요약해 드립니다!</Subtitle>
        
        <UploadContainer>
          <PDFIcon>
            <PDFIconText>PDF</PDFIconText>
          </PDFIcon>
          
          <OptionsContainer>
            <SelectContainer>
              <Label>요약내용의 언어를 정해주세요</Label>
              <SelectBox value={language} onChange={handleLanguageChange}>
                <option value="한국어">한국어</option>
                <option value="영어">영어</option>
                <option value="중국어">중국어</option>
                <option value="일본어">일본어</option>
              </SelectBox>
            </SelectContainer>

            <UploadButton onClick={handleUploadButtonClick}>
              파일 업로드
              <UploadFile
                type="file"
                accept="application/pdf"
                onChange={handlePdfUpload}
                ref={fileInputRef} // 참조 연결
              />
            </UploadButton>
          </OptionsContainer>
        </UploadContainer>

        <InfoText>ⓘ 업로드한 PDF파일은 외부에 공개되지 않습니다</InfoText>
      </Container>
    </>
  );
}

export default PDFpage;
