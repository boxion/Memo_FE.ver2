import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Header from "../components/Header/Header";
import Config from "../components/Config/config";
import axios from 'axios'; 

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
  cursor: pointer;
`;

const PDFIconText = styled.span`
  font-size: 1.6vw;
  font-weight: bold;
  color: #666;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;

const SelectContainer = styled.div``;

const Label = styled.div`
  font-size: 1.3vw;
  margin-bottom: 1vw;
`;

const SelectBox = styled.select`
  padding: 0.5vw 1vw;
  font-size: 1.2vw;
  border: 0.2vw solid #ccc;
  border-radius: 1vw;
  background-color: #fff;
`;

const UploadButton = styled.button`
  padding: 1vw 2vw;
  font-size: 1.3vw;
  border: none;
  border-radius: 1vw;
  cursor: pointer;
  display: flex;
  align-items: center;
  &:hover {
    background-color: #999999;
  }
`;

const SendButton = styled.button`
  background-color: #202D94;
  color: white;
  padding: 1vw 2vw;
  font-size: 1.3vw;
  border: none;
  border-radius: 1vw;
  cursor: pointer;
  margin-top: 1vw;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: #111111;
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

const FileName = styled.p`
  font-size: 1vw;
  color: #333;
  margin-top: 1vw;
  font-weight: bold;
`;

function PDFpage() {
  const [language, setLanguage] = useState('한국어');
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfTitle, setPdfTitle] = useState(''); 
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const fileInputRef = useRef(null); 
  const navigate = useNavigate(); 

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handlePdfUpload = (e) => {
    setPdfFile(e.target.files[0]); 
  };

  const handleSendButtonClick = async () => {
    if (pdfFile) {
      setIsLoading(true); // 로딩 시작
      try {
        const formData = new FormData();
        formData.append('file', pdfFile);
        formData.append('memberEmail', localStorage.getItem('userId')); 
        formData.append('language', language);

        const response = await axios.post(`${Config.baseURL}/api/v1/files/pdfupload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const { pdfTitle } = response.data;
        setPdfTitle(pdfTitle);


        localStorage.setItem("PDFFileName",pdfFile.name);

        // 성공 메시지 또는 기타 처리

        alert('PDF 파일이 성공적으로 업로드되었습니다!');
        navigate('/PDF-Summary'); 

      } catch (error) {
        console.error('PDF 업로드 중 오류 발생:', error);
      } finally {
        setIsLoading(false); // 로딩 완료
      }
    }
  };

  return (
    <>
      <Header />
      <Container>
        <Title>요약할 PDF파일을 업로드해주세요!</Title>
        <Subtitle>PDF파일을 업로드 하시면 AI가 요약해 드립니다!</Subtitle>

        <UploadContainer>
          <PDFIcon onClick={() => fileInputRef.current.click()}>
            <PDFIconText>PDF</PDFIconText>
          </PDFIcon>

          <OptionsContainer>
            <SelectContainer>
              <Label>PDF의 언어를 알려주세요</Label>
              <SelectBox value={language} onChange={handleLanguageChange}>
                <option value="한국어">한국어</option>
                <option value="영어">영어</option>
                <option value="중국어">중국어</option>
                <option value="일본어">일본어</option>
              </SelectBox>
            </SelectContainer>
            <UploadButton onClick={() => fileInputRef.current.click()}>
              {pdfFile ? pdfFile.name : '파일 선택'}
              <UploadFile
                type="file"
                accept="application/pdf"
                onChange={handlePdfUpload}
                ref={fileInputRef}
              />
            </UploadButton>
          </OptionsContainer>
        </UploadContainer>

        {/* 파일이 선택된 경우에만 보내기 버튼 표시 */}
        {pdfFile && (
          <SendButton onClick={handleSendButtonClick}>
            {isLoading ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
              '보내기'
            )}
          </SendButton>
        )}

        {pdfTitle && <FileName>{pdfTitle}</FileName>}

        <InfoText>ⓘ 선택된 PDF파일은 외부에 공개되지 않습니다</InfoText>
      </Container>
    </>
  );
}

export default PDFpage;
