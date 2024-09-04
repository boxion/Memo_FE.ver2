import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";  // useNavigate 추가
// import { toast } from "react-toastify";  // toast 메시지용 라이브러리 추가
// import 'react-toastify/dist/ReactToastify.css';  // toast 스타일 추가
import Config from "../Config/config";

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
  width: 60%;
  height: 10vw;
  border: 1vw solid;
  border-left-color: white;
  border-right-color: black;
  border-radius: 0.5vw;
  overflow: hidden;
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

const SignupForm = styled.form`
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

const SignupButton = styled.button`
  padding: 1vw 5vw;
  background-color: #000000;
  color: #fff;
  border: none;
  border-radius: 1vw;
  cursor: pointer;
  font-size: 1.2vw;
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

const signup = async (memberEmail, memberPassword, memberName, navigate) => {
  try {
    console.log("회원가입 시도 중...");
    console.log(
      "  -user 정보- " +
        "\n { 사용자이메일: " +
        memberEmail +
        "\n   비밀번호: " +
        memberPassword +
        "\n   닉네임:" +
        memberName +
        " }"
    );
    console.log("보낼 서버 주소 : " + `${Config.baseURL}/api/v1/auth/sign-up`);
    // 서버에 회원가입 정보를 전송하고 응답을 기다림
    const response = await fetch(`${Config.baseURL}/api/v1/auth/sign-up`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        memberEmail,
        memberPassword,
        memberName,
      }),
    });
    if (response.ok) {
      console.log("회원가입 성공!");
      // toast.success("회원가입 성공!");

      // 회원가입 후 로그인 처리 또는 메인 페이지로 이동
      navigate("/");

    } else {
      console.error("회원가입 실패:", response.statusText);
      // toast.error("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  } catch (error) {
    console.error("에러 발생:", error);
    // toast.error("회원가입에 실패했습니다. 다시 시도해주세요.");
  }
};

const Signup = () => {
  const [showPass, setShowPass] = useState(false);
  const [userid, setUserId] = useState("");
  const [usernickname, setUserNickname] = useState("");
  const [userpassword, setUserPassword] = useState("");

  const navigate = useNavigate();  // useNavigate 훅 사용

  const toggleShowPassword = () => {
    setShowPass(!showPass);
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    await signup(userid, userpassword, usernickname, navigate);
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
        <SignupForm onSubmit={handleSignup}>
          <InputContainer>
            <Label htmlFor="usernickname">닉네임(NickName)</Label>
            <Input
              type="text"
              id="usernickname"
              placeholder="사용할 이름을 작성해주세요."
              value={usernickname}
              onChange={(e) => setUserNickname(e.target.value)}
            />
          </InputContainer>

          <InputContainer>
            <Label htmlFor="userid">이메일(ID)</Label>
            <Input
              type="text"
              id="userid"
              placeholder="example@gmail.com"
              value={userid}
              onChange={(e) => setUserId(e.target.value)}
            />
          </InputContainer>

          <InputContainer>
            <Label htmlFor="userpassword">비밀번호(PW)</Label>
            <Input
              type={showPass ? "text" : "password"}
              id="userpassword"
              placeholder="비밀번호를 입력해주세요."
              value={userpassword}
              onChange={(e) => setUserPassword(e.target.value)}
            />
          </InputContainer>

          <SignupButton type="submit">회원가입</SignupButton>
        </SignupForm>
      </RightSection>
    </Container>
  );
};

export default Signup;
