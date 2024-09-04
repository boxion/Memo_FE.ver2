import React from "react";
import styled from "styled-components";
import Warning from "../../assets/images/warning.png";

const ModalWrapper = styled.div`
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  position: fixed;
  z-index: 9999;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  display: flex; /* 내부 요소를 가운데 정렬하기 위해 flex 사용 */
  flex-direction: column; /* 내부 요소를 세로로 정렬 */
  align-items: center; /* 세로 방향 가운데 정렬 */
`;

const WarningImage = styled.img`
  width: 30%;
  height: auto;
`;

const Backdrop = styled.div`
  width: 100%;
  height: 100%;
`;

const LoginButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #bababa;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const LoginWarning = ({ isOpen, onClose }) => {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalWrapper isOpen={isOpen}>
      <Backdrop onClick={handleBackdropClick}>
        {" "}
        <ModalContent>
          <WarningImage src={Warning} alt="Warning" />
          <h2>로그인 후 사용가능해요!</h2>
          <LoginButton onClick={() => (window.location.href = "/login")}>
            로그인 하러 가기
          </LoginButton>
        </ModalContent>
      </Backdrop>
    </ModalWrapper>
  );
};

export default LoginWarning;
