import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from "../components/Header/Header";
import Config from "../components/Config/config";
import axios from 'axios'; // axios로 백엔드와 통신

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2vw;
  font-family: Arial, sans-serif;
  margin-top: 7vw;
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
  cursor: pointer; /* 클릭 가능하게 변경 */

`;

const PDFIconText = styled.span`
  font-size: 1.6vw;
  font-weight: bold;
  color: #666;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const SelectContainer = styled.div`

`;

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
  &:hover {
    background-color: #218838;
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
  const fileInputRef = useRef(null); // 파일 입력 참조
  const navigate = useNavigate(); // 페이지 이동

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handlePdfUpload = (e) => {
    setPdfFile(e.target.files[0]);
  };
// PDF 파일 업로드 함수
const handleUploadButtonClick = async () => {
  if (pdfFile) {
    try {
      // FormData 생성
      const formData = new FormData();
      formData.append('file', pdfFile);
      formData.append('memberEmail', localStorage.getItem('userId')); // 로컬스토리지에서 가져온 memberEmail
      formData.append('language', language);

      // 백엔드로 파일 업로드 요청
      const response = await axios.post(`${Config.baseURL}/api/v1/files/pdfupload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'json', // 응답을 JSON으로 받음
      });

      // JSON 응답에서 필요한 정보를 추출
      const parsedJson = response.data; // JSON 데이터를 그대로 사용
      console.log(parsedJson);

      // PDF 다운로드를 별도로 처리
      const pdfResponse = await axios.get(`${Config.baseURL}/api/v1/files/download`, {
        responseType: 'blob', // PDF 파일을 받기 위해 blob으로 설정
      });

      const pdfBlob = new Blob([pdfResponse.data], { type: 'application/pdf' });

      // Blob을 다운로드할 수 있도록 링크 생성
      const downloadLink = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = downloadLink;
      a.download = parsedJson.pdfTitle; // JSON에서 받은 PDF 제목을 사용
      a.click();

      // 다운로드 후 링크 해제
      URL.revokeObjectURL(downloadLink);
    } catch (error) {
      console.error('PDF 업로드 중 오류가 발생했습니다:', error);
    }
  } else {
    fileInputRef.current.click(); // 파일 입력을 클릭하여 파일 선택을 유도
  }
};

// Base64 데이터를 Blob으로 변환하는 함수
const base64ToBlob = (base64, mimeType) => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length).fill().map((_, i) => byteCharacters.charCodeAt(i));
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

const handlePDFIconClick = () => {
  fileInputRef.current.click(); // PDF 아이콘 클릭 시 파일 선택창 열림
};


  const handleSendButtonClick = () => {
    navigate('/PDF-Summary'); // 선택된 파일이 있을 때만 페이지 이동
  };

  return (
    <>
      <Header />
      <Container>
        <Title>요약할 PDF파일을 업로드해주세요!</Title>
        <Subtitle>PDF파일을 업로드 하시면 AI가 요약해 드립니다!</Subtitle>
        
        <UploadContainer>
          <PDFIcon>
            <PDFIconText>PDF</PDFIconText>
          </PDFIcon>
          
          <OptionsContainer>
          <UploadButton onClick={handleUploadButtonClick}>
              {pdfFile ? 'pdf 요약시작' : '업로드 할 파일 선택'} 
              이거 이렇게 안해도 될거같은데 그냥 파일 선택하면 밑에 보내기 뜨면 페이지 넘어가게 해
              <UploadFile
                type="file"
                accept="application/pdf"
                onChange={handlePdfUpload}
                ref={fileInputRef} // 참조 연결
              />
            </UploadButton>

            <SelectContainer>
              <Label>요약내용의 언어를 정해주세요</Label>
              <SelectBox value={language} onChange={handleLanguageChange}>
                <option value="한국어">한국어</option>
                <option value="영어">영어</option>
                <option value="중국어">중국어</option>
                <option value="일본어">일본어</option>
              </SelectBox>
            </SelectContainer>
          </OptionsContainer>
        </UploadContainer>

        {/* 업로드된 파일명이 있을 때 파일명 표시 */}
        {pdfFile && <FileName>첨부된 파일: {pdfFile.name}</FileName>}


        {/* 파일이 선택된 경우에만 보내기 버튼 표시 */}
        {pdfFile && <SendButton onClick={handleSendButtonClick}>보내기</SendButton>}

        <InfoText>ⓘ 선택된 PDF파일은 외부에 공개되지 않습니다</InfoText>
      </Container>
    </>
  );
}

export default PDFpage;
