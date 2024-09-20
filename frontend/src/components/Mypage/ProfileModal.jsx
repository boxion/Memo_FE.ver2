// import React, { useEffect, useState, useRef } from "react";
// import styled from "styled-components";
// import Profile from "../../assets/images/profile.png";
// import SettingsIconImg from "../../assets/images/SettingsIcon.png";
// import HistoryIconImg from "../../assets/images/history.png";
// import LogoutIconImg from "../../assets/images/logout.png";
// import { useNavigate } from "react-router-dom";
// import Config from "../Config/config";


// const Overlay = styled.div`
//   position: fixed;
//   top: ${({ top }) => top - top * 0.9}px; /* y 좌푯값 지정 */
//   left: ${({ left }) => left - left * 0.27}px; /* x 좌푯값 지정 */
//   z-index: 99;
//   width: ${({ width }) => width - width * 1.15}px; /* 동적으로 width 조정 */
//   height: ${({ height }) => height - height * 1.2}px; /* 동적으로 height 조정 */
//   background: rgba(0, 0, 0, 0);
//   display: flex;
//   justify-content: flex-end;
// `;

// const DropdownContainer = styled.div`
//   width: 100%;
//   display: flex;
//   flex-direction: row;
//   gap: 2vw;
//   align-items: flex-start;
//   background: rgba(255, 255, 255, 0.9);
//   box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
//   border-radius: 5px;
//   padding: 10px;
// `;

// const InfoBox = styled.div``;

// const UserInfo = styled.div`
//   display: flex;
//   align-items: center;
//   margin-bottom: 10px;
//   width: 100%;
//   white-space: nowrap; /* 텍스트 줄바꿈 방지 */
// `;

// const ProfileBox = styled.div``;

// const ProfileImage = styled.img`
//   margin-top: 1vw;  
//   border-radius: 50%;
//   cursor: pointer;
// `;

// const Email = styled.div`
//   font-size: 1rem;
//   color: #838383;
//   margin: 0 1vw 0.5vw 1vw;
// `;

// const Nickname = styled.div`
//   font-size: 1vw;
//   margin: 0 1vw 0 1vw;
//   font-weight: bold;
//   white-space: nowrap; /* 텍스트 줄바꿈 방지 */
// `;

// const Options = styled.div`
//   list-style: none;
//   padding: 0;
//   display: flex;
//   flex-direction: column;
// `;

// const Option = styled.div`
//   display: flex;
//   align-items: center;
//   &:hover {
//     background-color: #f0f0f0;
//   }
// `;

// const OptionItem = styled.div`
//   font-size: 0.8vw;
//   padding: 0.5vw 1vw;
//   cursor: pointer;
// `;

// const IconImg = styled.img`
//   width: 20px;
//   height: 20px;
//   cursor: pointer;
// `;

// const Modal = styled.div`
//   position: fixed;
//   top: 50%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   background-color: #e7e7e7;
//   padding: 20px;
//   border-radius: 1vw;
// `;

// const TextInput = styled.input`
//   font-size: 1vw;
//   background-color: #f0f0f0;
//   font-weight: bold;
//   margin: 1vw;
//   padding: 1vw;
//   border-radius: 1vw;
//   border: 0.1vw solid #000000;
// `;

// const Button = styled.button`
//   margin: 1vw;
//   padding: 1vw;
//   border-radius: 1vw;
//   border: 0.2vw solid #000000;
//   font-weight: bold;
//   font-size: 1vw;

//   &:hover {
//     background-color: #b8b8b8;
//   }
// `;

// const UserProfileDropdown = ({ closeModal }) => {
//   const [nickname, setNickname] = useState("");
//   const [email, setEmail] = useState("");
//   const [newNickname, setNewNickname] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [showWarning, setShowWarning] = useState(false);
//   const navigate = useNavigate();
//   const modalRef = useRef();
//   const overlayRef = useRef();

//   const [windowSize, setWindowSize] = useState({
//     width: window.innerWidth,
//     height: window.innerHeight,
//   });

//   useEffect(() => {
//     const handleResize = () => {
//       setWindowSize({
//         width: window.innerWidth,
//         height: window.innerHeight,
//       });
//     };

//     window.addEventListener("resize", handleResize);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   useEffect(() => {
//     const memberName = localStorage.getItem("memberName");
//     if (memberName) {
//       setNickname(memberName);
//     }

//     const memberEmail = localStorage.getItem("userId");
//     if (memberEmail) {
//       setEmail(memberEmail);
//     }

//     const handleClickOutside = (e) => {
//       if (overlayRef.current && !overlayRef.current.contains(e.target)) {
//         closeModal();
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [closeModal]);

//   // 닉네임 변경 로직
//   const handleNicknameChange = (e) => {
//     if (e.target.value.length <= 3) {
//       setNewNickname(e.target.value);
//       setShowWarning(false);
//     } else {
//       setShowWarning(true);
//     }
//   };

//   // 닉네임 서버로 전송
//   const handleNicknameSubmit = async () => {
//     try {
//       await changeNickname(newNickname);
//       setNickname(newNickname);
//       localStorage.setItem("memberName", newNickname);
//       setNewNickname("");
//       setShowModal(false);
//     } catch (error) {
//       console.error("닉네임 변경 오류:", error);
//     }
//   };

//   // -----------------------------------------------------------------------------
//   // - Name: getVideoList
//   // - Desc: 해당 카테고리의 전체 영상 가져오기
//   const getVideoList = async (categoryName) => {
//     try {
//       localStorage.setItem("categoryName", categoryName);
//       if (categoryName === "최근 본 영상") {
//         categoryName = null;
//       }
//       const memberEmail = localStorage.getItem("userId");

//       const response = await fetch(`${Config.baseURL}/api/v1/video/category-video`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ memberEmail, categoryName }),
//       });

//       if (!response.ok) {
//         throw new Error("네트워크 응답이 실패했습니다.");
//       }

//       let responseData = await response.json();

//       responseData = responseData.map((video) => ({
//         ...video,
//         videoTitle: video.videoTitle.replace(/_/g, " "),
//       }));

//       responseData.reverse();

//       localStorage.setItem("videoList", JSON.stringify(responseData));
//       navigate("/mypage");
//       window.location.reload();

//       return responseData;
//     } catch (error) {
//       console.error("에러 발생:", error);
//     }
//   };

//   // 로그아웃 함수
//   const logout = () => {
//     const ranking1Data = localStorage.getItem("ranking1");
//     const ranking2Data = localStorage.getItem("ranking2");
//     const ranking3Data = localStorage.getItem("ranking3");
//     localStorage.clear();
//     localStorage.setItem("isLoggedIn", false);
//     if (ranking1Data) {
//       localStorage.setItem("ranking1", ranking1Data);
//       localStorage.setItem("ranking2", ranking2Data);
//       localStorage.setItem("ranking3", ranking3Data);
//     }

//     navigate("/");
//     window.location.reload();
//   };

//   // 닉네임 변경 함수
//   const changeNickname = async (newNickname) => {
//     try {
//       const userEmail = localStorage.getItem("userId");

//       const response = await fetch(`${BASE_URL}/api/v1/user/update-name`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           memberEmail: userEmail,
//           newName: newNickname,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("닉네임 변경 실패");
//       }

//       console.log("닉네임 변경 성공!");
//     } catch (error) {
//       console.error("닉네임 변경 중 에러:", error);
//     }
//   };

//   return (
//     <Overlay
//       ref={overlayRef}
//       top={windowSize.height}
//       left={windowSize.width}
//       width={windowSize.width}
//       height={windowSize.height}
//     >
//       <DropdownContainer>
//         <InfoBox>
//           <UserInfo>
//             <Nickname>{nickname}님 안녕하세요ᵔᴗᵔ</Nickname>
//           </UserInfo>
//           <Email>{email}</Email>
//           <Options>
//             <Option>
//               <OptionItem onClick={() => getVideoList("최근 본 영상")}>
//                 내 기록보기
//               </OptionItem>
//               <IconImg src={HistoryIconImg} alt="History" />
//             </Option>
//             <Option>
//               <OptionItem onClick={() => setShowModal(true)}>
//                 닉네임 변경
//               </OptionItem>
//               <IconImg src={SettingsIconImg} alt="Settings" />
//             </Option>
//             <Option>
//               <OptionItem onClick={logout}>로그아웃</OptionItem>
//               <IconImg src={LogoutIconImg} alt="Logout" />
//             </Option>
//           </Options>
//         </InfoBox>
//         <ProfileBox>
//           <ProfileImage src={Profile} alt="Profile" />
//         </ProfileBox>
//       </DropdownContainer>

//       {showModal && (
//         <Modal ref={modalRef}>
//           <h2>닉네임 변경</h2>
//           <TextInput
//             type="text"
//             value={newNickname}
//             onChange={handleNicknameChange}
//             placeholder="새 닉네임을 입력하세요"
//           />
//           {showWarning && <p>닉네임은 3글자 이하로 입력해주세요.</p>}
//           <Button onClick={handleNicknameSubmit}>저장</Button>
//           <Button onClick={() => setShowModal(false)}>취소</Button>
//         </Modal>
//       )}
//     </Overlay>
//   );
// };

// export default UserProfileDropdown;

//이거 안쓸거야 header에서 할거야