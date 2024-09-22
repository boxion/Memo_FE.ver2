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
  border: 0.2vw solid ${(props) => (props.selected ? "#202D94" : "#ccc")};
  border-radius: 1vw;
  padding: 1vw 2vw;
  margin: 0.5vw;
  cursor: pointer;
  font-size: 1vw;
  color: ${(props) => (props.selected ? "#202D94" : "#000")};

  &:hover {
    border-color: #202d94;
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

const DeleteButton = styled.button`
  background-color: #d9534f;
  color: white;
  border: none;
  border-radius: 1vw;
  padding: 0.5vw 1vw;
  font-size: 1vw;
  cursor: pointer;

  &:hover {
    background-color: #c9302c;
  }
`;

const DeleteMenuContainer = styled.div`
  position: absolute;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 0.5vw;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
`;


const SaveFolderModal = ({ isOpen, onClose }) => {
  const [folders, setFolders] = useState([]);
  const [content, setContent] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [showDeleteMenu, setShowDeleteMenu] = useState({ visible: false, folder: null });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const memberEmail = localStorage.getItem("userId");
        const response = await fetch(`${Config.baseURL}/api/v1/home/send-to-home`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            memberEmail,
          }),
        });

        const responseText = await response.text();

        if (response.ok) {
          const categories = JSON.parse(responseText);
          const folderNames = categories.map((category) => category.categoryName);
          setFolders(folderNames);
        }
      } catch (error) {
        console.error("에러 발생:", error);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.length <= 8) { 
      setContent(value);
    } else {
      alert("폴더명은 8글자 이하로 입력해주세요.");
    }
  };

  const handleAddFolder = async () => {
    try {
      if (content.trim() === "") {
        alert("추가할 폴더명을 입력해주세요.");
        return;
      }

      const memberEmail = localStorage.getItem("userId");
      const requestData = {
        memberEmail: memberEmail,
        categoryName: content.trim(),
      };

      const response = await fetch(`${Config.baseURL}/api/v1/category/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const responseText = await response.text();
      if (!response.ok) {
        console.error("네트워크 응답이 실패했습니다. 개발자에게 문의하세요.");
        return;
      }

      if (response.status === 201 && responseText) {
        try {
          const responseData = JSON.parse(responseText);
          console.log("카테고리가 성공적으로 생성되었습니다:", responseData);
        } catch (jsonError) {
          console.error("응답 본문을 JSON으로 변환하는 중 오류가 발생했습니다:", jsonError);
        }
      }

      setFolders([...folders, content.trim()]);
      setContent("");
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

  const handleConfirmClick = async () => {
    if (selectedFolder) {
      try {
        const memberEmail = localStorage.getItem("userId");
        const videoUrl = localStorage.getItem("videoUrl");
        const requestData = {
          memberEmail: memberEmail,
          categoryName: selectedFolder,
          videoUrl: videoUrl,
        };

        const response = await fetch(`${Config.baseURL}/api/v1/category/add-video`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          console.error("네트워크 응답이 실패했습니다. 개발자에게 문의하세요.");
          return;
        }

        if (response.status === 200 || response.status === 201) {
          alert("비디오가 성공적으로 폴더에 저장되었습니다.");
        }
      } catch (error) {
        console.error("비디오 저장 중 오류가 발생했습니다:", error);
      }
    } else {
      alert("폴더를 선택해주세요.");
    }
  };

  const handleContextMenu = (e, folder) => {
    e.preventDefault(); // 기본 컨텍스트 메뉴 방지
    const confirmed = window.confirm(`${folder} 폴더를 삭제하시겠습니까?`);
    if (confirmed) {
      handleDelete(folder); // 삭제 함수 호출
    }
  };

  const handleDelete = async (folderToDelete) => {
    try {
      const memberEmail = localStorage.getItem("userId"); // 로컬스토리지에서 memberEmail 가져오기
    
      // 삭제 요청 보내기
      const response = await fetch(`${Config.baseURL}/api/v1/category/delete-category`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          memberEmail,
          categoryName: folderToDelete, // 삭제할 폴더 이름
        }),
      });
    
      if (!response.ok) {
        console.error("삭제 요청이 실패했습니다. 개발자에게 문의하세요.");
        return;
      }
    
      const updatedFolders = folders.filter((folder) => folder !== folderToDelete); // 폴더 목록에서 삭제
      setFolders(updatedFolders);
      alert("폴더가 삭제되었습니다.");
    } catch (error) {
      console.error("폴더 삭제 중 오류가 발생했습니다:", error);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteMenu({ visible: false, folder: null });
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
              onContextMenu={(e) => handleContextMenu(e, folder)} // 우클릭 이벤트 핸들러 추가
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

        {showDeleteMenu.visible && (
          <DeleteMenuContainer top={mousePosition.y} left={mousePosition.x}>
            <DeleteButton onClick={handleDelete}>삭제</DeleteButton>
            <CancelButton onClick={handleCancelDelete}>취소</CancelButton>
          </DeleteMenuContainer>
        )}
      </ModalContainer>
    </ModalOverlay>
  );
};

export default SaveFolderModal;
