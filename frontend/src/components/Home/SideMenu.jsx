import React, { useState } from "react";
import styled from "styled-components";
import SaveModal from "../Mypage/SaveModal";
import folderIcon from "../../assets/images/macos_folder.png";

const SideMenuContainer = styled.div`
  position: fixed;
  bottom: ${({ isOpen }) =>
    isOpen ? "0" : "-100%"}; /* isOpen 상태에 따라 아래로 내려옴/올라감 */
  left: 0;
  width: 18%;
  height: 85%;
  background-color: #ffffff;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 999;
  padding-top: 30px;
  transition: bottom 0.3s ease; /* 아래쪽으로 이동하는 애니메이션 효과 */
`;

const SideMenuWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 16%;
  height: auto; /* 높이를 자동으로 조정하여 내용에 따라 늘어날 수 있도록 변경합니다. */
  background-color: #ffffff;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 999;
`;

const EditButtonWrapper = styled.div`
  position: absolute;
  bottom: 10px; /* 아래 여백 조정 */
  left: 50%; /* 가운데 정렬 */
  transform: translateX(-50%); /* 가운데 정렬 */
  width: 100%;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 30px;
  cursor: pointer;
`;

const CategoryContainer = styled.div`
  margin: 1vw;
  max-height: 80%; /* 높이 제한을 설정하여 스크롤이 필요한 경우 스크롤바가 나타나도록 함 */
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 10px;
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

const StyledMenuItem = styled.div`
  display: flex;
  width: 80%;
  border-radius: 10px; /* 둥근 네모 모양의 버튼으로 만들기 위해 border-radius 값을 조정합니다. */
  margin: 0 0 1vw 1.2vw;
  padding: 1vw 0 1vw 0;
  border: 2px solid #d9d9d9; /* 테두리를 추가하여 버튼처럼 보이도록 설정합니다. */
  cursor: pointer; /* 마우스 포인터를 올렸을 때 버튼임을 나타내기 위해 커서 모양을 변경합니다. */
  transition: background-color 0.3s; /* 배경색 변경에 대한 애니메이션 효과를 추가합니다. */

  &:hover {
    background-color: #f0f0f0; /* 마우스를 올렸을 때 배경색 변경을 위한 스타일을 추가합니다. */
  }
`;

const Icon = styled.img`
  width: 1.5vw;
  margin-right: 1vw;
  margin-left: 1vw;
`;

const Text = styled.div`
  flex: 1; /* 텍스트가 남은 공간을 차지하도록 */
  text-align: start; /* 텍스트 중앙 정렬 */
`;

const EditButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
  height: 3vw;
  font-size:1.2vw;
  margin: 1vw 0 1vw 1.2vw;
  border: 2px dashed #d9d9d9;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const SideMenu = ({ isOpen, onClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리
  const categoryList = JSON.parse(localStorage.getItem("categoryList")) || []; // 로컬스토리지에서 카테고리 목록 가져오기

  const handleMenuItemClick = (category) => {
    onClose(); // 메뉴 항목 클릭 시 사이드 메뉴 닫기
  };

  const handleEditCategories = () => {
    setIsModalOpen(true); // 모달을 엽니다
    console.log("카테고리 수정 버튼 클릭됨");
  };

  const closeModal = () => {
    setIsModalOpen(false); // 모달을 닫습니다
  };

  return (
    <>
      <SideMenuWrapper>
        <SideMenuContainer isOpen={isOpen}>
          <CloseButton onClick={onClose}>×</CloseButton>
          <CategoryContainer>
            {categoryList.map((category, index) => (
              <StyledMenuItem
                key={index}
                onClick={() => handleMenuItemClick(category)}
              >
                <Icon src={folderIcon} alt="Folder Icon" />
                <Text>{category}</Text>
              </StyledMenuItem>
            ))}
          </CategoryContainer>
          <EditButtonWrapper>
            <EditButton onClick={handleEditCategories}>
              + 카테고리 수정
            </EditButton>
          </EditButtonWrapper>
        </SideMenuContainer>
      </SideMenuWrapper>
      {isModalOpen && <SaveModal closeModal={closeModal} />}{" "}
      {/* 모달을 조건부로 렌더링 */}
    </>
  );
};

export default SideMenu;
