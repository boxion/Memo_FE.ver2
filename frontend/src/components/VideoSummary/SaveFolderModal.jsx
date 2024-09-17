import React, { useState } from "react";
import styled from "styled-components";

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

const foldersData = ["개발지식", "뉴스지식", "자기계발", "주식공부", "토익공부"];

const SaveFolderModal = ({ isOpen, onClose }) => {
  const [folders, setFolders] = useState(foldersData);
  const [content, setContent] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null);

  const handleInputChange = (e) => {
    setContent(e.target.value);
  };

  const handleAddFolder = () => {
    if (content.trim() !== "") {
      setFolders([...folders, content.trim()]);
      setContent("");
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
          <ConfirmButton onClick={onClose}>확인</ConfirmButton>
          <CancelButton onClick={onClose}>취소</CancelButton>
        </ActionButtons>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default SaveFolderModal;
