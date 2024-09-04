import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import Profile from "../../assets/images/profile.png";
import SettingsIconImg from "../../assets/images/SettingsIcon.png";
import HistoryIconImg from "../../assets/images/history.png";
import LogoutIconImg from "../../assets/images/logout.png";
import { useNavigate } from "react-router-dom";

const Overlay = styled.div`
  position: fixed;
  top: ${({ top }) => top - top * 0.9}px; /* y 좌푯값 지정 */
  left: ${({ left }) => left - left * 0.27}px; /* x 좌푯값 지정 */
  z-index: 99;
  width: ${({ width }) => width - width * 1.15}px; /* 동적으로 width 조정 */
  height: ${({ height }) => height - height * 1.2}px; /* 동적으로 height 조정 */
  background: rgba(0, 0, 0, 0);
  display: flex;
  justify-content: flex-end;
`;

const DropdownContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 2vw;
  align-items: flex-start;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  padding: 10px;
`;

const InfoBox = styled.div``;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  width: 100%;
  white-space: nowrap; /* 텍스트 줄바꿈 방지 */
`;

const ProfileBox = styled.div``;

const ProfileImage = styled.img`
  margin-top: 1vw;  
  border-radius: 50%;
  cursor: pointer;
`;

const Email = styled.div`
  font-size: 1rem;
  color: #838383;
  margin: 0 1vw 0.5vw 1vw;
`;

const Nickname = styled.div`
  font-size: 1vw;
  margin: 0 1vw 0 1vw;
  font-weight: bold;
  white-space: nowrap; /* 텍스트 줄바꿈 방지 */
`;

const Options = styled.div`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
`;

const Option = styled.div`
  display: flex;
  align-items: center;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const OptionItem = styled.div`
  font-size: 0.8vw;
  padding: 0.5vw 1vw;
  cursor: pointer;
`;

const IconImg = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #e7e7e7;
  padding: 20px;
  border-radius: 1vw;
`;

const TextInput = styled.input`
  font-size: 1vw;
  background-color: #f0f0f0;
  font-weight: bold;
  margin: 1vw;
  padding: 1vw;
  border-radius: 1vw;
  border: 0.1vw solid #000000;
`;

const Button = styled.button`
  margin: 1vw;
  padding: 1vw;
  border-radius: 1vw;
  border: 0.2vw solid #000000;
  font-weight: bold;
  font-size: 1vw;

  &:hover {
    background-color: #b8b8b8;
  }
`;

const UserProfileDropdown = ({ closeModal }) => {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [newNickname, setNewNickname] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showWarning, setShowWarning] = useState(false); // 경고 메시지 상태 추가
  const navigate = useNavigate();
  const modalRef = useRef();
  const overlayRef = useRef();

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const memberName = localStorage.getItem("memberName");
    if (memberName) {
      setNickname(memberName);
    }

    const memberEmail = localStorage.getItem("userId");
    if (memberEmail) {
      setEmail(memberEmail);
    }

    const handleClickOutside = (e) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target)) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeModal]);

  const handleNicknameChange = (e) => {
    if (e.target.value.length <= 3) {
      setNewNickname(e.target.value);
      setShowWarning(false);
    } else {
      setShowWarning(true); // 3글자를 초과하면 경고 메시지 표시
    }
  };

  const handleNicknameSubmit = () => {
    if (newNickname) {
      setNickname(newNickname);
      localStorage.setItem("memberName", newNickname);
      setNewNickname("");
      setShowModal(false);
    }
  };

  return (
    <Overlay ref={overlayRef} top={windowSize.height} left={windowSize.width} width={windowSize.width} height={windowSize.height}>
      <DropdownContainer>
        <InfoBox>
          <UserInfo>
            <Nickname>{nickname}님 안녕하세요ᵔᴗᵔ</Nickname>
          </UserInfo>
          <Email>{email}</Email>
          <Options>
            <Option>
              <OptionItem
                onClick={() => {
                  navigate("/mypage");
                }}
              >
                내 기록보기
              </OptionItem>
              <IconImg src={HistoryIconImg} alt="History" />
            </Option>
            <Option>
              <OptionItem onClick={() => setShowModal(true)}>
                닉네임 변경
              </OptionItem>
              <IconImg
                onClick={() => setShowModal(true)}
                src={SettingsIconImg}
                alt="Settings"
              />
            </Option>
            <Option>
              <OptionItem
                onClick={() => {
                  localStorage.removeItem("memberName");
                  localStorage.removeItem("userId");
                  navigate("/login"); // 로그아웃 후 로그인 페이지로 이동
                }}
              >
                로그아웃
              </OptionItem>
              <IconImg src={LogoutIconImg} alt="Logout" />
            </Option>
          </Options>
        </InfoBox>
        <ProfileBox>
          <ProfileImage src={Profile} alt="Profile" />
        </ProfileBox>
      </DropdownContainer>
      {showModal && (
        <Modal ref={modalRef}>
          <div
            style={{
              fontWeight: "bold",
              fontSize: "1.5rem",
              textAlign: "center",
            }}
          >
            닉네임을 변경하시겠습니까?
          </div>
          <TextInput
            type="text"
            value={newNickname}
            onChange={handleNicknameChange}
            placeholder="새 닉네임 입력"
          />
          <Button onClick={handleNicknameSubmit}>변경하기</Button>
          {showWarning && (
            <div style={{ fontSize: "1vw", color: "red", fontWeight: "bold", marginLeft: "1.5vw" }}>
              닉네임은 3글자까지 가능합니다.
            </div>
          )}
        </Modal>
      )}
    </Overlay>
  );
};

export default UserProfileDropdown;
