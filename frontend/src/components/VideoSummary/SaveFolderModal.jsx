import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Config from "../Config/config";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  padding: 2vw;
  border-radius: 1vw;
  width: 40vw;
`;

const ModalTitle = styled.div`
  font-size: 2vw;
  font-weight: bold;
  margin: 1vw;
`;

const SavePoint = styled.div`
  font-size: 1.3vw;
  margin: 1vw;
`;

const FolderContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1vw;
  width: 80%;
  max-height: 30vh;
  overflow-y: auto;
`;

const FolderButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: start;
  background-color: #f0f0f0;
  border: 0.2vw solid ${props => (props.selected ? "#202D94" : "#ccc")};
  border-radius: 1vw;
  padding: 1vw 2vw;
  margin: 0.5vw;
  cursor: pointer;
  font-size: 1vw;
  color: ${props => (props.selected ? "#202D94" : "#000")};

  &:hover {
    border-color: #202D94;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2vw;
  gap: 2vw;
`;

const ConfirmButton = styled.button`
  background-color: #202d94;
  color: white;
  border: none;
  border-radius: 1vw;
  padding: 1vw 2vw;
  font-size: 1vw;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const CancelButton = styled.button`
  background-color: #19181d;
  color: white;
  border: none;
  border-radius: 1vw;
  padding: 1vw 2vw;
  font-size: 1vw;
  cursor: pointer;

  &:hover {
    background-color: #202020;
  }
`;

const AddTextBox = styled.div`
  display: flex;
  flex-direction: row;
  width: 60%;
`;

const TextInput = styled.input`
  width: 80%;
  font-size: 1vw;
  padding: 0.5vw 0 0.5vw 1vw;
  margin-top: 1vw;
  border-radius: 0.5vw;
  border: 0.1vw solid #ccc;
`;

const AddButton = styled.button`
  width: 8vw;
  margin-top: 1vw;
  margin-left: 1vw;
  padding: 0.5vw 1vw;
  border-radius: 0.5vw;
  background-color: #4caf50;
  color: white;
  font-size: 1vw;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;


const SaveFolderModal = ({ isOpen, onClose }) => {
  const [folders, setFolders] = useState([]);
  const [content, setContent] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null);
  const navigate = useNavigate();

  // 컴포넌트가 렌더링될 때 API 요청
  useEffect(() => {
    const fetchData = async () => {
      try {
        const memberEmail = localStorage.getItem("userId");  // 로컬스토리지에서 userId 가져오기

        const response = await fetch(`${Config.baseURL}/api/v1/home/send-to-home`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            memberEmail,  // memberEmail로 userId 사용
          }),
        });

        const responseText = await response.text();
        // console.log("응답 상태:", response.status);
        // console.log("응답 본문:", responseText);  // 반환되는 데이터 로그 찍기

        // 응답이 성공적일 경우
        if (response.ok) {
          const categories = JSON.parse(responseText);  // 응답 본문을 JSON으로 변환
          const folderNames = categories.map(category => category.categoryName);  // categoryName만 추출
          setFolders(folderNames);  // folders 상태 업데이트
        }

      } catch (error) {
        console.error("에러 발생:", error);
      }
    };

    if (isOpen) {  // 모달이 열릴 때만 요청
      fetchData();
    }
  }, [isOpen]);  // isOpen 상태가 변경될 때마다 실행

  const handleInputChange = (e) => {
    setContent(e.target.value);
  };

  const handleAddFolder = async () => {
    try {
      if (content.trim() === "") {
        // 내용이 비어있을 때 경고창 띄우기
        alert("추가할 폴더명을 입력해주세요.");
        return;
      }
  
      // 로컬스토리지에서 userId를 가져옴
      const memberEmail = localStorage.getItem("userId");
  
      // 보내려는 데이터 구성
      const requestData = {
        memberEmail: memberEmail, // 로컬스토리지에서 가져온 값
        categoryName: content.trim(), // 입력된 폴더명
      };
  
      // POST 요청 보내기
      const response = await fetch(`${Config.baseURL}/api/v1/category/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
  
      // 응답 본문을 텍스트로 출력
      const responseText = await response.text();
      console.log("응답 상태:", response.status);
      console.log("응답 본문:", responseText); // 응답 본문을 출력하여 확인
  
      // 응답이 성공인지 확인
      if (!response.ok) {
        console.error("네트워크 응답이 실패했습니다. 개발자에게 문의하세요.");
        return;
      }
  
      // 201 상태일 경우 응답 본문이 비어있지 않으면 JSON 파싱
      if (response.status === 201 && responseText) {
        try {
          const responseData = JSON.parse(responseText); // JSON으로 변환
          console.log("카테고리가 성공적으로 생성되었습니다:", responseData);
        } catch (jsonError) {
          console.error("응답 본문을 JSON으로 변환하는 중 오류가 발생했습니다:", jsonError);
        }
      }
  
      // 필요한 작업 수행 (예: 성공 메시지 표시, 상태 업데이트 등)
      setFolders([...folders, content.trim()]); // 새로운 폴더 추가
      setContent(""); // 입력 필드 초기화
  
    } catch (error) {
      console.error("카테고리 생성 중 오류가 발생했습니다:", error);
    }
  };
  
  
  
  const handleSelectFolder = (folder) => {
    setSelectedFolder(folder);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirmClick = () => {
    if (selectedFolder) {
      alert("저장되었습니다");
      navigate("/");
    } else {
      alert("폴더를 선택해주세요.");
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContainer>
        <ModalTitle>📂 폴더에 저장해보세요!</ModalTitle>
        <SavePoint>어디로 저장할까요?</SavePoint>
        <FolderContainer>
          {folders.map((folder, index) => (
            <FolderButton
              key={index}
              selected={folder === selectedFolder}
              onClick={() => handleSelectFolder(folder)}
            >
              📁 {folder}
            </FolderButton>
          ))}
        </FolderContainer>
        <AddTextBox>
          <TextInput
            type="text"
            value={content}
            onChange={handleInputChange}
            placeholder="추가할 폴더명을 입력해주세요."
          />
          <AddButton onClick={handleAddFolder}>폴더 추가</AddButton>
        </AddTextBox>
        <ActionButtons>
          <ConfirmButton onClick={handleConfirmClick}>확인</ConfirmButton>
          <CancelButton onClick={onClose}>취소</CancelButton>
        </ActionButtons>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default SaveFolderModal;
