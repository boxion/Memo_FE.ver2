import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import addImg from "../../assets/images/add.png";
import Floder from "../../assets/images/macos_folder.png";
import saveFileImage from "../../assets/images/savefile.png";
import deleteIcon from '../../assets/images/delete.png';

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9998;
  overflow-y: auto;
`;

const ModalWrapper = styled.div`
  position: fixed;
  width: 40%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 1vw;
  z-index: 9999;
`;

const SaveContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1vw;
`;

const StyledImg = styled.img`
  width: 7%;
  margin-right: 0.5vw;
`;

const SaveText = styled.div`
  color: #000000;
  font-size: 1.5vw;
  text-align: center;
  font-weight: bold;
`;

const CloseButton = styled.span`
  display: flex;
  justify-content: flex-end;
  padding: 1vw 2vw 0 2vw;
  font-size: 1.5vw;
  font-weight: bold;
  cursor: pointer;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background-color: #f0f0f0;
  border-radius: 1vw;
`;

const CategoryList = styled.div`
  display: grid;
  justify-items: center;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  margin: 1vw 5vw 2vw 5vw;
  overflow-y: auto;
  max-height: 30vh;

  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-thumb {
    background: #a7a7a7;
    border-radius: 1vw;
    margin-right: 5%;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #646464;
  }
`;

const CategoryImage = styled.img`
  width: 2vw;
  margin-right: 1vw;
`;

const Category = styled.button`
  width: 80%;
  height: 3vw; /* 카테고리 상자의 높이를 고정값으로 설정 */
  display: flex;
  padding: 0.3vw 1vw;
  margin-top: 1vw;
  align-items: center;
  font-size: 0.8vw;
  text-align: start;
  border-radius: 0.5vw;
  border: 0.1vw solid #838383;
  cursor: pointer;
  overflow: hidden; /* 텍스트가 넘칠 경우 숨김 처리 */
  white-space: nowrap; /* 텍스트가 줄 바꿈되지 않도록 처리 */
  text-overflow: ellipsis; /* 텍스트가 넘칠 경우 생략 부호(...) 처리 */

  ${({ isSelected }) =>
    isSelected &&
    css`
      border: 0.3vw solid #646464;
      background-color: #d2e5ff;
      opacity: 0.9;
    `}

  transform-origin: left;
  transform: scale(${({ scale }) => scale || 1});

  transition: transform 0.3s ease-in-out;
`;

const ButtonSet = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TextInput = styled.input`
  width: 50%;
  font-size: 0.8vw;
  background-color: #f0f0f0;
  font-weight: bold;
  padding: 1vw;
  margin: 0 0 1vw 6vw;
  border-radius: 1vw;
  border: 0.1vw solid #000000;
`;

const AddButton = styled.button`
  width: 6vw;
  margin: 0 0 1vw 1vw;
  border-radius: 2vw;
  border: ${({ hasImage }) => (hasImage ? "none" : "0.2vw solid #eeda25")};
  font-weight: bold;
  font-size: 0.8vw;
  cursor: pointer;
  background-color: ${({ disabled }) => (disabled ? "#f0f0f0" : "#f0f0f0")};

  img {
    width: 2vw;
  }

  &:not(:has(img)) {
    &:hover {
      background-color: ${({ disabled }) => (disabled ? "#c2c2c2" : "#c2bd80")};
    }
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const EditButton = styled(AddButton)`
  margin-left: 1vw;
  background-color: #ffc107;
  border: none;
  color: #000;
`;

const ConfirmButton = styled.button`
  width: 6vw;
  margin: 0 1vw 1vw 1vw;
  border-radius: 2vw;
  border: 0.2vw solid #000000;
  font-weight: bold;
  font-size: 0.8vw;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #b8b8b8;
  }
`;

const DeleteButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 6vw;
  margin: 0 6vw 1vw 0;
  border-radius: 2vw;
  border: 0.2vw solid #ff0000;
  font-weight: bold;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #ff0000;
    color: #fff;
  }

  img {
    width: 2vw; /* 원하는 크기로 조정 */
    height: 2vw; /* 이미지 비율을 유지하고 싶다면 height는 설정하지 않아도 됩니다 */
  }
`;

const SaveModal = ({ closeModal }) => {
  const [content, setContent] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleAddContent = () => {
    if (isEditMode) {
      handleEditContent();
    } else {
      handleAddNewContent();
    }
  };

  const handleEditContent = () => {
    if (selectedCategory) {
      // 수정 전 카테고리명과 수정 후 카테고리명을 업데이트
      const updatedCategoryList = categoryList.map((category) =>
        category === selectedCategory ? content : category
      );
      localStorage.setItem(
        "categoryList",
        JSON.stringify(updatedCategoryList)
      );
      setCategoryList(updatedCategoryList);
      setSelectedCategory(null);
      setIsEditMode(false);
      setContent(""); // TextInput의 글자를 지웁니다
    }
  };

  const handleAddNewContent = () => {
    const newCategoryList = [...categoryList, content];
    localStorage.setItem("categoryList", JSON.stringify(newCategoryList));
    setCategoryList(newCategoryList);
    setContent("");
  };

  const handleSave = () => {
    localStorage.setItem("categoryName", selectedCategory);
    window.location.reload();
    closeModal();
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setContent(category);
    setIsEditMode(true);
  };

  const handleCategoryRightClick = () => {
    if (selectedCategory) {
      const confirmDelete = window.confirm(
        `${selectedCategory}을(를) 삭제하시겠습니까?`
      );
      if (confirmDelete) {
        const updatedCategoryList = categoryList.filter(
          (category) => category !== selectedCategory
        );
        localStorage.setItem(
          "categoryList",
          JSON.stringify(updatedCategoryList)
        );
        setCategoryList(updatedCategoryList);
        setSelectedCategory(null);
        setIsEditMode(false);
        setContent(""); // TextInput에 써있는 글씨 지우기
      }
    }
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 8) {
      setContent(inputValue);
    } else {
      alert("카테고리는 8글자 이하로 입력해주세요.");
    }
  };

  useEffect(() => {
    const storedCategoryList = localStorage.getItem("categoryList");
    if (storedCategoryList) {
      setCategoryList(JSON.parse(storedCategoryList));
    }
  }, []);

  return (
    <ModalBackdrop onClick={closeModal}>
      <ModalWrapper
        className="modal"
        onMouseDown={(e) => {
          if (e.button === 2) {
            handleCategoryRightClick();
          }
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <CloseButton onClick={closeModal}>Ⅹ</CloseButton>
        <SaveContainer>
          <StyledImg src={saveFileImage} alt="saveFileImage" />
          <SaveText>
            어느 폴더에 저장할까요?
          </SaveText>
        </SaveContainer>
        <ModalContent>
          <CategoryList>
            {categoryList.map((category, index) => (
              <Category
                key={index}
                onClick={() => handleCategoryClick(category)}
                isSelected={selectedCategory === category}
              >
                <CategoryImage src={Floder} alt="Folder" />
                {category}
              </Category>
            ))}
          </CategoryList>
          <ButtonSet>
            <TextInput
              type="text"
              value={content}
              onChange={handleInputChange}
              placeholder="추가할 폴더명을 입력해주세요."
            />
            {/* isEditMode에 따라 AddButton 또는 EditButton을 렌더링 */}
            {isEditMode ? (
              <EditButton onClick={handleAddContent}>수정</EditButton>
            ) : (
              <AddButton
                onClick={handleAddContent}
                hasImage={!isEditMode}
                disabled={!content.trim()}
              >
                <img src={addImg} alt="Add" />
              </AddButton>
            )}
            <ConfirmButton onClick={handleSave}>확인</ConfirmButton>
            <DeleteButton onClick={handleCategoryRightClick}>
              <img src={deleteIcon} alt="delete" />
            </DeleteButton>
          </ButtonSet>
        </ModalContent>
      </ModalWrapper>
    </ModalBackdrop>
  );
};

export default SaveModal;
