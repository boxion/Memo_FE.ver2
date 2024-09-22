import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import SaveModal from "../VideoSummary/SaveFolderModal";
import folderIcon from "../../assets/images/macos_folder.png";
import Config from "../Config/config";

const SideMenuContainer = styled.div`
  position: fixed;
  bottom: ${({ isOpen }) =>
    isOpen ? "0" : "-100%"};
  left: 0;
  width: 18%;
  height: 85%;
  background-color: #ffffff;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 999;
  padding-top: 30px;
  transition: bottom 0.3s ease;
`;

const SideMenuWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 16%;
  height: auto; 
  background-color: #ffffff;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 999;
`;

const EditButtonWrapper = styled.div`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0;
  right: 1vw;
  background: none;
  border: none;
  font-size: 3vw;
  cursor: pointer;
`;

const CategoryContainer = styled.div`
  margin: 1vw;
  max-height: 80%;

  &::-webkit-scrollbar {
    width: 1vw;
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
  border-radius: 1vw;
  margin: 0 0 1vw 0;
  padding: 1vw;
  border: 0.2vw solid #d9d9d9; 
  cursor: pointer; 
  transition: background-color 0.3s; 

  &:hover {
    background-color: #f0f0f0; 
  }
`;

const Icon = styled.img`
  width: 1.5vw;
  margin-right: 1vw;
  margin-left: 1vw;
`;

const Text = styled.div`
  flex: 1;
  text-align: start;
  font-size: 1.2vw;
`;

const EditButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
  height: 3vw;
  font-size: 1.2vw;
  margin: 1vw 0 1vw 1.2vw;
  border: 0.2vw dashed #d9d9d9;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const SideMenu = ({ isOpen, onClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryList, setCategoryList] = useState([]); // 백엔드에서 받아온 카테고리 데이터를 저장할 상태
  const sideMenuRef = useRef(null); // 사이드 메뉴 참조 생성
  const navigate = useNavigate();
  
  // 렌더링될 때 로컬스토리지의 isLoggedIn 값이 true인지 확인 후 요청
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn === "true") {
      const memberEmail = localStorage.getItem("userId");

      // 백엔드로 POST 요청 보내기
      const sendToHome = async () => {
        try {
          const response = await fetch(`${Config.baseURL}/api/v1/home/send-to-home`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              memberEmail, // userId를 memberEmail로 전달
            }),
          });

          if (!response.ok) {
            throw new Error("서버에서 오류가 발생했습니다.");
          }

          const responseData = await response.json();
          console.log("백엔드 응답:", responseData);

          // 백엔드에서 받은 categoryName 데이터를 setCategoryList로 저장
          const categories = responseData.map((category) => category.categoryName);
          setCategoryList(categories); // 상태에 카테고리 목록 저장

        } catch (error) {
          console.error("POST 요청 중 에러 발생:", error);
        }
      };

      sendToHome();
    }
  }, []);

  const handleMenuItemClick = (category) => {
    localStorage.setItem("categoryName",category);
    onClose();
    navigate("/mypage");
    window.location.reload();
  };

  const handleEditCategories = () => {
    setIsModalOpen(true);
    console.log("카테고리 수정 버튼 클릭됨");
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <SideMenuWrapper>
        <SideMenuContainer ref={sideMenuRef} isOpen={isOpen}>
          <CloseButton onClick={onClose}>×</CloseButton>
          <CategoryContainer>
            {categoryList.map((category, index) => (
              <StyledMenuItem
                key={index}
                onClick={() => handleMenuItemClick(category)}
              >
                <Text>📁 {category}</Text>
              </StyledMenuItem>
            ))}
          </CategoryContainer>
          <EditButtonWrapper>
            <EditButton onClick={handleEditCategories}>
              + 카테고리 추가
            </EditButton>
          </EditButtonWrapper>
        </SideMenuContainer>
      </SideMenuWrapper>
      {isModalOpen && <SaveModal isOpen={isModalOpen} onClose={closeModal} />}
    </>
  );
};

export default SideMenu;
