import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import Config from "../Config/config";

const REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY;
const REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;
const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_CLIENT_ID;
const NAVER_REDIRECT_URI = process.env.REACT_APP_NAVER_REDIRECT_URI;

const Container = styled.div`
  display: flex;
  height: 100vh;
`;


const LeftSection = styled.div`
  flex: 1;
  background-color: #202D94;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LogoTitle = styled.div`
  display: flex;
  align-items: center;
  width: 60%; /* 상자의 너비를 설정 */
  height: 10vw; /* 상자의 높이 설정 */
  border: 1vw solid; /* 테두리 색상과 두께 */
  border-left-color: white; /* 왼쪽 테두리는 흰색 */
  border-right-color: black; /* 오른쪽 테두리는 검은색 */
  border-radius: 0.5vw; /* 테두리 둥글게 설정 */
  overflow: hidden; /* 내용이 상자 밖으로 나가지 않도록 설정 */
`;

const LeftHalf = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RightHalf = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LogoText = styled.div`
  font-size: 4vw;
  font-weight: bold;
  margin: 0;
  color: white;
`;

const SubTitleText = styled.div`
  font-size: 1.2vw;
  font-weight: bold;
  margin: 0;
  color: black;
`;

const RightSection = styled.div`
  flex: 1;
  background-color: #f7f7f7;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 3vw;
  position: relative;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const InputContainer = styled.div`
  width: 50%;
  margin-bottom: 1.5vw;
`;

const Input = styled.input`
  width: 100%;
  padding: 1vw;
  margin-top: 0.5vw;
  border: 0.1vw solid #ccc;
  border-radius: 1vw;
  font-size: 1vw;
`;

const Label = styled.label`
  font-weight: bold;
  font-size: 1vw;
`;

const LoginButton = styled.button`
  padding: 1vw 5vw;
  background-color: #000000;
  color: #fff;
  border: none;
  border-radius: 1vw;
  cursor: pointer;
  font-size: 1.2vw;
`;

const SocialButton = styled.button`
  padding: 1vw 7vw;
  margin-bottom: 2vw;
  border: 0.2vw solid ${(props) => props.borderColor};
  border-radius: 1vw;
  cursor: pointer;
  font-size: 1vw;
  color: #000;
  background-color: transparent;
  //margin: 0.5vw 0;
`;

const SignupContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1vw;
  opacity: 0.5;
  font-size: 1vw;
  margin-top: 1vw;
`;

const SignupLink = styled(Link)`
  text-decoration: underline;
  color: #000000;
`;

const HomeLink = styled(Link)`
  position: absolute;
  top: 2vw;
  left: 2vw;
  font-size: 1.5vw;
  font-weight: bold;
  color: black;
  text-decoration: none;
`;

const Login = () => {
  const [showPass, setShowPass] = useState(false);
  const [userid, setUserId] = useState("");
  const [userpassword, setUserPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const toggleShowPassword = () => {
    setShowPass(!showPass);
  };

  const handleKakaoLogin = (event) => {
    event.preventDefault();
    const link = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    window.location.href = link;
  };

  const handleNaverLogin = (event) => {
    event.preventDefault();
    const link = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${NAVER_REDIRECT_URI}&state=random_state_string`;
    window.location.href = link;
  };

  // 로그인 통신 함수
  const login = async (memberEmail, memberPassword) => {
    try {
      console.log("로그인 시도 중...");
      console.log(
        "  -user 정보- " +
          "\n { 사용자이메일: " +
          memberEmail +
          "\n   비밀번호: " +
          memberPassword +
          " }"
      );
      console.log("보낼 서버 주소 : " + `${Config.baseURL}/api/v1/auth/sign-in`);

      // 서버에 로그인 정보를 전송하고 응답을 기다림
      const response = await fetch(`${Config.baseURL}/api/v1/auth/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          memberEmail,
          memberPassword
        })
      });

      if (response.ok) {
        console.log("로그인 성공!");
        // toast.success("로그인 성공!");

        // 헤더에서 토큰 추출
        const responseData = await response.json();
        const jwtToken = responseData.token;

        localStorage.setItem("token", jwtToken); // 토큰 저장
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("userId", memberEmail); // 사용자 이메일 저장
        setIsLoggedIn(true);
        console.log("토큰이 로컬 스토리지에 저장되었습니다.");
        console.log("[ token ]\n" + jwtToken);

        navigate("/");
        window.location.reload();
      } else {
        console.error("로그인 실패:", response.statusText);
        // 로그인 실패 시 토스트 메시지 표시
        // toast.error("로그인에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("에러 발생:", error);
      // toast.error("로그인 중 에러가 발생했습니다.");
    }
  };

  const handleLogin = (event) => {
    event.preventDefault();
    login(userid, userpassword);  // 로그인 함수 호출
  };

  return (
    <Container>
      <LeftSection>
        <LogoTitle>
          <LeftHalf>
            <LogoText>MEMO</LogoText>
          </LeftHalf>
          <RightHalf>
            <SubTitleText>EVERYTHING SUMMARY</SubTitleText>
          </RightHalf>
        </LogoTitle>
      </LeftSection>

      <RightSection>
        <HomeLink to="/">Home</HomeLink>

        <SocialButton borderColor="#F7E300" onClick={handleKakaoLogin}>
          카카오로 시작하기
        </SocialButton>
        <SocialButton borderColor="#03C75A" onClick={handleNaverLogin}>
          네이버로 시작하기
        </SocialButton>

        <LoginForm onSubmit={handleLogin}>
          <InputContainer>
            <Label htmlFor="userid">이메일(ID)</Label>
            <Input
              type="text"
              id="userid"
              placeholder="memo@naver.com"
              value={userid}
              onChange={(e) => setUserId(e.target.value)}
            />
          </InputContainer>

          <InputContainer>
            <Label htmlFor="password">비밀번호(PW)</Label>
            <Input
              type={showPass ? "text" : "password"}
              id="password"
              placeholder="비밀번호를 입력해주세요."
              value={userpassword}
              onChange={(e) => setUserPassword(e.target.value)}
            />
          </InputContainer>

          <LoginButton type="submit">LOGIN</LoginButton>

          <SignupContainer>
            <p>아직 회원이 아니신가요?</p>
            <SignupLink to="/signup">회원가입하기</SignupLink>
          </SignupContainer>
        </LoginForm>
      </RightSection>
    </Container>
  );
};

export default Login;