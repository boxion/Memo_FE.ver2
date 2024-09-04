//참고할 통신코드



import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // useNavigate를 import합니다.
import { toast } from "react-toastify";
import axios from "axios"; // axios를 import합니다.

// 공통 URL 정의
// const BASE_URL = "http://localhost:8080";
const BASE_URL = "http://taeksin.iptime.org:8081";
// const BASE_URL = "http://52.78.68.15:8080";
// const FLASK_BASE_URL = "http://localhost:5000";
const FLASK_BASE_URL = "http://taeksin.iptime.org:5002";
// const FLASK_BASE_URL = "http://taeksin.iptime.org:5003";
// const FLASK_BASE_URL = "http://3.27.236.22:5005";
// 카카오 REST API 키와 리다이렉트 URI 설정

const getWindowSize = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
};

const AuthContext = createContext({ windowSize: getWindowSize() });

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [windowSize, setWindowSize] = useState(getWindowSize());
  // const [token, setToken] = useState(""); // 토큰 상태 추가
  const navigate = useNavigate(); // useNavigate를 통해 navigate 함수를 가져옵니다.

  useEffect(() => {
    // 페이지 로드 시 로컬 스토리지에서 로그인 정보 및 토큰 확인
    const loggedIn = localStorage.getItem("isLoggedIn");
    // const storedToken = localStorage.getItem("token");
    // if (loggedIn && storedToken) {
    if (loggedIn) {
      setIsLoggedIn(true);
      // setToken(storedToken); // 저장된 토큰 상태로 설정
      console.log("로컬 스토리지에서 로그인 여부 및 토큰을 가져왔습니다.");
    }

    const handleResize = () => {
      setWindowSize(getWindowSize());
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 문자열의 처음과 끝에 쌍따옴표가 있는 경우 이를 제거하는 함수
  const removeSurroundingQuotes = (str) => {
    // 처음과 끝이 쌍따옴표인 경우 쌍따옴표 제거
    if (str.startsWith('"') && str.endsWith('"')) {
      return str.slice(1, -1);
    }
    // 쌍따옴표가 아닌 경우 원래 문자열 반환
    return str;
  };

  // -----------------------------------------------------------------------------
  // - Name : getTokenFromLocalStorage
  // - Desc : 로컬 스토리지에서 토큰을 가져오는 함수
  // -----------------------------------------------------------------------------
  const getTokenFromLocalStorage = () => {
    const token = localStorage.getItem("token");
    return token;
  };

  // -----------------------------------------------------------------------------
  // - Name : getEmailFromLocalStorage
  // - Desc : 로컬 스토리지에서 email을 가져오는 함수
  // -----------------------------------------------------------------------------
  const getEmailFromLocalStorage = () => {
    return localStorage.getItem("userId");
  };

  // -----------------------------------------------------------------------------
  // - Name : getVideoFromLOcaltorage
  // - Desc : 로컬 스토리지에서 videoUrl을 가져오는 함수
  // -----------------------------------------------------------------------------
  const getVideoUrlFromLocalStorage = () => {
    return localStorage.getItem("videoUrl");
  };

  // -----------------------------------------------------------------------------
  // - Name : getRankingDataFromLocalStorage
  // - Desc : 로컬 스토리지에서 rankingData를 가져오는 함수
  // -----------------------------------------------------------------------------
  const getRankingDataFromLocalStorage = () => {
    const rankingData = localStorage.getItem("rankingData");
    return rankingData;
  };

  // -----------------------------------------------------------------------------
  // - Name : saveContentToLocal
  // - Desc : 메모를 html로 로컬스토리지에 저장함
  // -----------------------------------------------------------------------------
  const saveContentToLocal = (htmlContent) => {
    localStorage.setItem("document", htmlContent);
    console.log("텍스트 내용이 로컬스토리지에 저장되었씁니다.");
  };

  const checkLoginStatus = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "false" || !isLoggedIn) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  };

  // 날짜를 "YYYY-MM-DD" 형식으로 반환하는 함수
  const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // -----------------------------------------------------------------------------
  // - Name : signup
  // - Desc : 사용자를 회원가입하는 함수
  // - Input
  //   1) userid : 사용자 이메일
  //   2) userpassword : 사용자 비밀번호
  //   3) usernickname : 사용자 닉네임
  // -----------------------------------------------------------------------------
  const signup = async (memberEmail, memberPassword, memberName) => {
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
      console.log("보낼 서버 주소 : " + `${BASE_URL}/api/v1/auth/sign-up`);
      // 서버에 회원가입 정보를 전송하고 응답을 기다림
      const response = await fetch(`${BASE_URL}/api/v1/auth/sign-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          memberEmail,
          memberPassword,
          memberName
        })
      });
      if (response.ok) {
        console.log("회원가입 성공!");
        toast.success("회원가입 성공!");
        login(memberEmail, memberPassword);

        navigate("/");

        // 회원가입 후 추가 작업 수행
        // 예: 로그인 처리 등
      } else {
        console.error("회원가입 실패:", response.statusText);
        // 회원가입 실패 시 토스트 메시지 표시
        toast.error("회원가입에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("에러 발생:", error);
      toast.error("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // -----------------------------------------------------------------------------
  // - Name : login
  // - Desc : 사용자를 로그인하는 함수
  // - Input
  //   1) memberEmail : 사용자 이름
  //   2) memberPassword : 사용자 비밀번호
  // - Output
  // -----------------------------------------------------------------------------
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
      console.log("보낼 서버 주소 : " + `${BASE_URL}/api/v1/auth/sign-in`);

      // 서버에 로그인 정보를 전송하고 응답을 기다림
      const response = await fetch(`${BASE_URL}/api/v1/auth/sign-in`, {
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
        toast.success("로그인 성공!");

        // 헤더에서 토큰 추출
        const responseData = await response.json();
        const jwtToken = responseData.token;

        localStorage.setItem("token", jwtToken); // 토큰 저장
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("userId", memberEmail); // 토큰 저장
        setIsLoggedIn(true);
        console.log("토큰이 로컬 스토리지에 저장되었습니다.");
        console.log("[ token ]\n" + jwtToken);

        navigate("/");
        window.location.reload();
      } else {
        console.error("로그인 실패:", response.statusText);
        // 로그인 실패 시 토스트 메시지 표시
        toast.error("로그인에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("에러 발생:", error);
      toast.error("로그인 중 에러가 발생했습니다.");
    }
  };

  // -----------------------------------------------------------------------------
  // - Name : logout
  // - Desc : 사용자를 로그아웃하는 함수
  // -----------------------------------------------------------------------------
  const logout = () => {
    // ranking1에 해당하는 내용만 제외하고 나머지는 모두 clear
    const ranking1Data = localStorage.getItem("ranking1");
    const ranking2Data = localStorage.getItem("ranking2");
    const ranking3Data = localStorage.getItem("ranking3");
    localStorage.clear();
    localStorage.setItem("isLoggedIn", false);
    setIsLoggedIn(false);
    // setUser(null);
    console.log("로그인 정보 및 인증 정보가 로컬 스토리지에서 삭제되었습니다.");
    // ranking1Data가 null이 아니면 다시 저장
    if (ranking1Data) {
      localStorage.setItem("ranking1", ranking1Data);
      localStorage.setItem("ranking2", ranking2Data);
      localStorage.setItem("ranking3", ranking3Data);
    }

    navigate("/");

    window.location.reload();
  };

  // -----------------------------------------------------------------------------
  // - Name : homePageDataGET
  // - Desc : 백엔드의 / 주소로 GET 요청을 보내는 함수
  // -----------------------------------------------------------------------------
  const homePageDataGET = async () => {
    try {
      // console.log("백엔드로 TOP3 영상 GET 요청을 보내는 중...");

      // 서버에 GET 요청 보내기
      const response = await axios.get(
        `${BASE_URL}/api/v1/video/most-frequent-url`
      );

      if (response.status === 200) {
        // 성공적으로 데이터를 받으면 추가 작업 수행
        let data = response.data;
        console.log("TOP3 받은 데이터:", data);

        // videoTitle에서 "_"를 " "로 변경하는 함수
        const replaceUnderscoreWithSpace = (data) => {
          return data.map((video) => ({
            ...video,
            videoTitle: video.videoTitle.replace(/_/g, " ")
          }));
        };

        // 데이터를 변환
        data = replaceUnderscoreWithSpace(data);
        // console.log("변환된 데이터:", data);

        // 받은 데이터를 각각의 영상 정보로 나누어 저장
        if (data.length >= 1) {
          saveVideoToLocalstorage("ranking1", data[0]);
        }
        if (data.length >= 2) {
          saveVideoToLocalstorage("ranking2", data[1]);
        }
        if (data.length >= 3) {
          saveVideoToLocalstorage("ranking3", data[2]);
        }

        // 만약 isLoggedIn 상태가 true이면 getMyData 함수 호출
        const loggedIn = localStorage.getItem("isLoggedIn");
        if (loggedIn) {
          // console.log("🔴로그인 O");
          // console.log("getMyData함수를 실행합니다.");
          await getMyData();
        } else {
          console.log("🔴로그인 X");
        }

        // 받은 데이터 반환
        return data;
      } else {
        console.error("TOP3 영상 데이터를 받아오는데 실패했습니다.");
        // 데이터를 받아오는데 실패한 경우 에러 처리
      }
    } catch (error) {
      console.error("에러 발생:", error);
      // 에러가 발생한 경우 에러 처리
    }
  };

  // -----------------------------------------------------------------------------
  // - Name : getMyData
  // - Desc : 백엔드에 POST 요청을 보내어 사용자 데이터를 가져오는 함수
  // - Input
  //   1) data: 전송할 데이터 객체
  // - Output
  //   - 서버에서 받은 응답 데이터
  // -----------------------------------------------------------------------------
  const getMyData = async () => {
    const memberEmail = getEmailFromLocalStorage();

    try {
      // console.log("getMyData 함수 사용자 카테고리 데이터를 가져오는 중...");

      const response = await fetch(`${BASE_URL}/api/v1/home/send-to-home`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ memberEmail: memberEmail })
      });

      if (!response.ok) {
        // toast.error("getMyData함수 실행 중 네트워크 응답이 실패했습니다. 개발자에게 문의하세요.");
        console.log(
          "getMyData함수 실행 중 네트워크 응답이 실패했습니다. 개발자에게 문의하세요."
        );
      }

      const responseData = await response.json();
      console.log(
        "[받은 닉네임, categoryList ]:",
        responseData
      ); // 받은 데이터를 로그로 출력

      // 이미 있던 categoryList 삭제
      localStorage.removeItem("categoryList");

      // "최근 본 영상" 카테고리 (기본 값) 추가
      responseData.unshift({ categoryName: "최근 본 영상" });

      // 각 categoryName을 새로운 카테고리 목록에 추가합니다.
      const newCategoryList = responseData
        .filter(category => category && category.categoryName) // null 값과 categoryName이 없는 항목 제외
        .map(category => category.categoryName);

      // 새로운 카테고리 목록을 로컬스토리지에 저장합니다.
      localStorage.setItem("categoryList", JSON.stringify(newCategoryList));

      // memberName을 추출하여 로컬스토리지에 저장합니다.
      const memberName = responseData[1].memberName; // 응답 데이터에서 첫 번째 객체의 memberName 추출
      localStorage.setItem("memberName", memberName);

      return responseData;
    } catch (error) {
      console.error("에러 발생:", error);
      // toast.error("getMyData함수 실행 중 에러가 발생했습니다. 개발자에게 문의하세요.");
    }
  };


  // -----------------------------------------------------------------------------
  // - Name : searchMarkdown
  // - Desc : 주어진 키워드를 사용하여 마크다운을 검색하는 함수
  // - Input
  //   1) keyword: 검색할 키워드
  // -----------------------------------------------------------------------------
  const searchMarkdown = async (keyword) => {
    try {
      console.log("[ 검색할 키워드 ]", keyword);
      const memberEmail = getEmailFromLocalStorage();

      // 서버에 POST 요청을 보내고 응답을 기다림
      const response = await fetch(`${BASE_URL}/api/v1/video/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          keyword: keyword,
          memberEmail: memberEmail
        })
      });

      if (!response.ok) {
        console.log(
          "searchMarkdown함수 처리 중 네트워크 응답에 실패했습니다. 개발자에게 문의하세요."
        );
        // toast.error("searchMarkdown함수 처리 중 네트워크 응답에 실패했습니다. 개발자에게 문의하세요.");
      }

      const searchData = await response.json();
      console.log(keyword + " 검색 결과: ", searchData); // 검색 결과를 로그로 출력

      return searchData.length > 0 ? searchData : null;
    } catch (error) {
      console.error("에러 발생:", error);
      // toast.error("searchMarkdown 함수 처리 중 입력하신 검색어를 검색하던 중 에러가 발생했습니다. 개발자에게 문의하세요.");
      console.log(
        "searchMarkdown 함수 처리 중 입력하신 검색어를 검색하던 중 에러가 발생했습니다. 개발자에게 문의하세요."
      );
    }
  };

  // 각 영상 정보를 로컬 스토리지에 저장하는 함수
  const saveVideoToLocalstorage = (ranking, videoData) => {
    // localStorage.setItem(`${ranking}_videoTitle`, videoData.videoTitle);
    // localStorage.setItem(`${ranking}_thumbnailUrl`, videoData.thumbnailUrl);
    // localStorage.setItem(`${ranking}_videoUrl`, videoData.videoUrl);
    localStorage.setItem(`${ranking}`, JSON.stringify(videoData));
  };

  // -----------------------------------------------------------------------------
  // - Name : saveCategoryToDB
  // - Desc : 카테고리를 DB에 저장함
  // -----------------------------------------------------------------------------
  const saveCategoryToDB = async (categoryName) => {
    try {
      console.log(categoryName + " 저장해보겠습니다");
      const memberEmail = getEmailFromLocalStorage();

      // 서버에 POST 요청을 보내고 응답을 기다림
      const response = await fetch(`${BASE_URL}/api/v1/category/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          categoryName: categoryName,
          memberEmail: memberEmail
        })
      });

      if (!response.ok) {
        toast.error("네트워크 응답이 실패했습니다. 개발자에게 문의하세요.");
      }

      // const responseData = response;
      console.log("카테고리가 성공적으로 생성되었습니다:", response);
      toast.success("생성 완료!");
      
      // 필요한 작업 수행 (예: 성공 메시지 표시, 상태 업데이트 등)
    } catch (error) {
      console.error("카테고리 생성 중 오류가 발생했습니다:", error);
      // 필요한 작업 수행 (예: 오류 메시지 표시, 상태 업데이트 등)
    }
  };

  // -----------------------------------------------------------------------------
  // - Name : saveCategoryToLocal
  // - Desc : 메모를 html로 로컬스토리지에 저장함
  // -----------------------------------------------------------------------------
  const saveCategoryToLocal = (categoryName) => {
    console.log(categoryName + "을 로컬에 저장해보겠습니다");

    // 기존에 저장된 카테고리 리스트를 가져옴
    const existingCategories = localStorage.getItem("categoryList");

    // 기존에 저장된 카테고리가 없다면 새로운 카테고리 배열로 설정
    let categories = [];
    if (existingCategories) {
      categories = JSON.parse(existingCategories);
    }

    // 새로운 카테고리를 배열에 추가
    categories.push(categoryName);

    // 배열을 JSON 형식으로 변환하여 로컬 스토리지에 저장
    localStorage.setItem("categoryList", JSON.stringify(categories));
    console.log(categoryName + "이 로컬에 저장되었습니다.");
  };

  // -----------------------------------------------------------------------------
  // - Name : saveMarkdownToServer
  // - Desc : 마크다운을 서버에 저장하는 함수
  // - Input
  //   1) markdownContent: 저장할 마크다운 내용
  // - Output
  // -----------------------------------------------------------------------------
  const saveMarkdownToServer = async (markdownContent) => {
    try {
      console.log("[ 저장할 마크다운 내용 ]\n", markdownContent);
      const userEmail = getEmailFromLocalStorage(); // 로컬 스토리지에서 이메일 가져오기
      const videoUrl = getVideoUrlFromLocalStorage(); // 로컬 스토리지에서 비디오 URL 가져오기
      const documentDate = getCurrentDate(); // 현재 날짜 가져오기

      // 서버에 POST 요청 보내기
      const response = await fetch(`${BASE_URL}/api/v1/video/document-save`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          memberEmail: userEmail,
          videoUrl: videoUrl,
          document: markdownContent,
          documentDate: documentDate // 현재 날짜 추가
        })
      });

      if (response.ok) {
        console.log("마크다운 저장 성공!");
        toast.success("메모 저장 성공");
        // 저장 성공 시 추가 작업 수행
      } else {
        console.error("마크다운 저장 실패:", response.statusText);
        // 저장 실패 시 에러 처리
      }
    } catch (error) {
      console.error(" 마크다운 저장 중 에러 발생:", error);
      // 에러 발생 시 에러 처리
    }
  };

  // -----------------------------------------------------------------------------
  // - Name : sendAuthorizationCode
  // - Desc : 백엔드로 인가코드를 전송하는 함수
  // - Input
  //   1) code: 카카오 로그인 후 받은 인가코드
  // - Output
  // -----------------------------------------------------------------------------
  const sendAuthorizationCode = async (code) => {
    try {
      console.log("인가코드를 백엔드로 전송하는 중...");
      console.log("[ 인가코드 ]\n", code);

      // 인가코드를 URL의 쿼리 파라미터로 포함하여 백엔드로 전송
      const response = await axios.post(
        `${BASE_URL}/login/oauth2/code/kakao?code=${code}`
      );

      if (response.status === 200) {
        console.log("인가코드 전송 성공!");
        // 성공 시 추가 작업 수행
      } else {
        console.error("인가코드 전송 실패:", response.statusText);
        // 실패 시 에러 처리
      }
    } catch (error) {
      console.error("sendAuthorizationCode 함수 실행 중 에러 발생:", error);
      // 에러 발생 시 에러 처리
    }
  };

  // -----------------------------------------------------------------------------
  // - Name : GPTQuery
  // - Desc : GPT 모델에 쿼리를 보내는 함수
  // - Input
  //   1) query: GPT 모델에 전달할 쿼리
  // - Output
  // -----------------------------------------------------------------------------
  const GPTQuery = async (query) => {
    try {
      // 로컬스토리지에서 userId 값을 가져옴
      const userId = getEmailFromLocalStorage();
      const videoUrl = getVideoUrlFromLocalStorage();

      console.log("GPT 모델에 쿼리를 전송하는 중...");
      console.log("[ 쿼리 ] : ", query);
      console.log("[ userId ] : ", userId);
      console.log("[ videoUrl ] : ", videoUrl);

      // 서버에 쿼리와 userId를 함께 전송하고 응답을 기다림
      const response = await fetch(`${FLASK_BASE_URL}/questionurl`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          question: query,
          userId: userId,
          videoUrl: videoUrl
        })
      });

      if (!response.ok) {
        toast.error(
          "GPTQuery 실행 중 서버에서 오류를 반환했습니다. 개발자에게 문의하세요."
        );
      }

      const data = await response.json();
      // console.log("쿼리 전송 성공!");
      // console.log("받은 답변:", data); // 받은 답변을 로그로 출력
      console.log("[ 받은 답변: ]\n", data.qAnswer); // 받은 답변을 로그로 출력

      return data;
    } catch (error) {
      console.error("에러 발생:", error);
      toast.error("쿼리 전송 중 에러가 발생했습니다. 개발자에게 문의하세요.");
    }
  };

  // -----------------------------------------------------------------------------
  // - Name : duplicate
  // - Desc : URL 중복 확인
  // - Input
  //   1) memberEmail : 사용자 이메일
  //   2) videoUrl : 비디오 URL
  // -----------------------------------------------------------------------------
  const checkDuplicate = async (memberEmail, videoUrl) => {
    // console.log("memberEmail: ", memberEmail, "videoUrl" , videoUrl);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/video/check-duplicate`,
        {
          memberEmail,
          videoUrl
        }
      );

      console.log("[checkDuplicate 결과]", response.data);
      return response.data; // JSON 형태의 데이터 반환
    } catch (error) {
      console.error("중복 확인 실패:", error);
      return { isDuplicate: false }; // 오류 발생 시 false 반환
    }
  };

  // -----------------------------------------------------------------------------
  // - Name : GPTSummary
  // - Desc : GPT 모델에 summary 요청을 보내는 함수
  // - Input
  //   1) url: summary를 생성할 대상 URL
  // - Output
  //   - 서버에서 받은 summary 데이터
  // -----------------------------------------------------------------------------
  const GPTSummary = async (url) => {
    try {
      // 로컬스토리지에서 userId 값을 가져옴
      const userId = getEmailFromLocalStorage();

      console.log("GPT 모델에 summary 요청을 전송하는 중...");
      console.log("[ 대상 URL ] : ", url);
      console.log("[ userId ] : ", userId);

      // 중복 확인
      const isDuplicate = await checkDuplicate(userId, url);

      if (isDuplicate) {
        // 중복인 경우 selectVideo 함수 호출
        console.log("중복된 URL입니다. selectVideo 함수를 호출합니다.");
        await duplicateVideo(userId, url);
      } else {
        // 중복이 아닌 경우 summary 요청을 전송
        console.log("중복되지 않은 URL입니다. summary 요청을 전송합니다.");

        const response = await fetch(`${FLASK_BASE_URL}/summaryurl`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            url: url,
            userId: userId // userId 값을 함께 전송
          })
        });

        if (!response.ok) {
          // toast.error("서버에서 오류를 반환했습니다. 개발자에게 문의하세요.");
          return;
        }

        const data = await response.json();
        // console.log("summary 요청 전송 성공!");
        console.log("받은 summary:", data); // 받은 summary를 로그로 출력

        let cleanedSummary = removeSurroundingQuotes(JSON.stringify(data.summary));
        let cleanedTitle = removeSurroundingQuotes(JSON.stringify(data.cleaned_title));

        // 받은 summary 데이터를 로컬스토리지에 저장
        localStorage.setItem("summary", cleanedSummary);
        localStorage.setItem("videoTitle", cleanedTitle);
        localStorage.setItem("documentDate", data.documentDate);

        return data;
      }
    } catch (error) {
      console.error("에러 발생:", error);
      toast.error(
        "summary 요청 중 에러가 발생했습니다. 개발자에게 문의하세요."
      );
    }
  };

  // -----------------------------------------------------------------------------
  // - Name: selectVideo
  // - Desc: 멤버 이메일과 비디오 URL을 로컬 스토리지에서 가져와서 서버에 전송하는 함수
  // - Input
  //   - 없음
  // - Output
  //   - 서버에서 받은 응답 데이터
  // -----------------------------------------------------------------------------
  const selectVideo = async (videoUrl) => {
    // 로컬 스토리지에서 멤버 이메일과 비디오 URL을 가져옵니다.
    const memberEmail = getEmailFromLocalStorage();
    const videoUrlA = videoUrl;

    // 요청할 데이터를 콘솔에 출력합니다.
    console.log("전송할 데이터:", { memberEmail, videoUrl });

    try {
      // 주소와 바디를 설정하여 POST 요청을 보냅니다.
      const response = await fetch(`${BASE_URL}/api/v1/video/select-video`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          memberEmail,
          videoUrl: videoUrlA
        })
      });

      // 응답이 성공적인지 확인합니다.
      if (!response.ok) {
        toast.error("서버에서 오류를 반환했습니다. 개발자에게 문의하세요.");
      }

      // 응답 데이터를 콘솔에 출력합니다.
      const responseData = await response.json();
      console.log("[ 선택한 video의 데이터: ] ", responseData);

      // 받은 데이터에서 필요한 정보를 추출합니다.
      const { summary, document, videoUrl, documentDate, categoryName, videoTitle } = responseData.video;
      const { questions } = responseData;
      var document2 = document == null ? "" : document;
      // 질문과 답변을 추출합니다.
      const extractedQuestions = questions.map((question) => question.question);
      const extractedAnswers = questions.map((question) => question.answer);
      
      // let cleanedSummary = removeSurroundingQuotes(JSON.stringify(data.summary));
      // let cleanedTitle = removeSurroundingQuotes(JSON.stringify(data.cleaned_title));

      // 로컬 스토리지에 정보를 저장합니다.
      localStorage.setItem("summary", summary);
      localStorage.setItem("document", document2);
      localStorage.setItem("videoUrl", videoUrl);
      localStorage.setItem("videoTitle", videoTitle);
      localStorage.setItem("documentDate", documentDate);
      localStorage.setItem("categoryName", categoryName);
      localStorage.setItem("questions", JSON.stringify(extractedQuestions));
      localStorage.setItem("answers", JSON.stringify(extractedAnswers));

      navigate("/memory");

      // 응답 데이터를 반환합니다.
      return responseData;
    } catch (error) {
      console.error("에러 발생:", error);
      toast.error("영상 선택 중 에러가 발생했습니다. 개발자에게 문의하세요.");
    }
  };

  // -----------------------------------------------------------------------------
  // - Name: duplicateVideo
  // - Desc: 멤버 이메일과 비디오 URL을 로컬 스토리지에서 가져와서 서버에 전송하는 함수
  // - Input
  //   - 없음
  // - Output
  //   - 서버에서 받은 응답 데이터
  // -----------------------------------------------------------------------------
  const duplicateVideo = async (memberEmail, videoUrl) => {
    const videoUrlA = videoUrl;

    // // 요청할 데이터를 콘솔에 출력합니다.
    // console.log("전송할 데이터:", { memberEmail, videoUrl });

    try {
      // 주소와 바디를 설정하여 POST 요청을 보냅니다.
      const response = await fetch(`${BASE_URL}/api/v1/video/select-video`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          memberEmail,
          videoUrl: videoUrlA
        })
      });

      // 응답이 성공적인지 확인합니다.
      if (!response.ok) {
        toast.error("서버에서 오류를 반환했습니다. 개발자에게 문의하세요.");
      }

      // 응답 데이터를 콘솔에 출력합니다.
      const responseData = await response.json();
      console.log("[ 선택한 video의 데이터: ] ", responseData);

      // 받은 데이터에서 필요한 정보를 추출합니다.
      const { summary, document, videoUrl, documentDate, categoryName } = responseData.video;
      const { questions } = responseData;
      var document2 = document == null ? "" : document;
      // 질문과 답변을 추출합니다.
      const extractedQuestions = questions.map((question) => question.question);
      const extractedAnswers = questions.map((question) => question.answer);

      // 로컬 스토리지에 정보를 저장합니다.
      localStorage.setItem("summary", summary);
      localStorage.setItem("document", document2);
      localStorage.setItem("videoUrl", videoUrl);
      localStorage.setItem("documentDate", documentDate);
      localStorage.setItem("categoryName", categoryName);
      localStorage.setItem("questions", JSON.stringify(extractedQuestions));
      localStorage.setItem("answers", JSON.stringify(extractedAnswers));

      // 응답 데이터를 반환합니다.
      return responseData;
    } catch (error) {
      console.error("에러 발생:", error);
      toast.error("영상 선택 중 에러가 발생했습니다. 개발자에게 문의하세요.");
    }
  };

  // -----------------------------------------------------------------------------
  // - Name: getVideoList
  // - Desc: 해당 카테고리의 전체 영상 가져오기
  // - Input
  //   - categoryName
  // - Output
  //   - 서버에서 받은 응답 데이터
  // -----------------------------------------------------------------------------
  const getVideoList = async (categoryName) => {
    try {
      localStorage.setItem("categoryName", categoryName);
      if (categoryName === "최근 본 영상") {
        categoryName = null;
      }
      // 로컬 스토리지에서 멤버 이메일 가져오기
      const memberEmail = getEmailFromLocalStorage();

      // POST 요청 보내기
      const response = await fetch(`${BASE_URL}/api/v1/video/category-video`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        // 멤버 이메일과 categoryName을 바디에 넣어서 보내기
        body: JSON.stringify({ memberEmail, categoryName })
      });

      // 응답 확인
      if (!response.ok) {
        toast.error("네트워크 응답이 실패했습니다. 개발자에게 문의하세요.");
      }

      // 응답 데이터 파싱
      let responseData = await response.json();
      console.log("[" + categoryName + "의 데이터를 가져옴]");
      console.log(responseData);

      // videoTitle에서 "_"를 " "로 변경하는 함수
      const replaceUnderscoreWithSpace = (data) => {
        return data.map((video) => ({
          ...video,
          videoTitle: video.videoTitle.replace(/_/g, " ")
        }));
      };

      // 데이터를 변환
      responseData = replaceUnderscoreWithSpace(responseData);
      console.log("변환된 데이터:", responseData);

      // videoList를 내림차순으로 정렬
      responseData.reverse();

      // 받아온 videoList를 로컬 스토리지에 저장
      localStorage.setItem("videoList", JSON.stringify(responseData));
      console.log("받아온 videoList를 로컬 스토리지에 저장");
      navigate("/mypage"); // 클릭 시 '/mypage'로 이동

      // 새로고침
      window.location.reload();

      // videoList 반환
      return responseData;
    } catch (error) {
      console.error("에러 발생:", error);
      toast.error("해당 카테고리가 비어있습니다.");
    }
  };

  // -----------------------------------------------------------------------------
  // - Name: saveVideoToCategory
  // - Desc: 새로운 카테고리를 DB에 저장
  // - Input
  //   - categoryName
  // - Output
  //   - 서버에서 받은 응답 데이터
  // -----------------------------------------------------------------------------
  const saveVideoToCategory = async (categoryName) => {
    try {
      // 로컬 스토리지에서 멤버 이메일을 가져옵니다.
      const memberEmail = getEmailFromLocalStorage();
      const videoUrlA = getVideoUrlFromLocalStorage();
      // console.log(
      //   "memberEmail:" +
      //     memberEmail +
      //     ", categoryName:" +
      //     categoryName +
      //     ". videoUrl:" +
      //     videoUrlA
      // );
      // 주소와 바디를 설정하여 POST 요청을 보냅니다.
      const response = await fetch(`${BASE_URL}/api/v1/category/add-video`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ memberEmail, categoryName, videoUrl: videoUrlA })
      });

      // 응답이 성공적인지 확인합니다.
      if (!response.ok) {
        // toast.error("서버에서 오류를 반환했습니다. 개발자에게 문의하세요.");
        console.error(
          "비디오를 카테고리에 추가하는 중 에러 발생 서버에서 오류를 반환했습니다. 개발자에게 문의하세요."
        );
      }
      console.log("🟢카테고리에 저장 성공🟢");
      toast.success("저장 완료 !");
      // 응답 데이터를 반환합니다.
      return response;
    } catch (error) {
      console.error("비디오를 카테고리에 추가하는 중 에러 발생:", error);
      // toast.error("비디오를 카테고리에 추가하는 중 에러가 발생했습니다. 개발자에게 문의하세요.");
    }
  };

  const updateCategoryName = async (oldCategoryName, newCategoryName) => {
    try {
      // 로컬 스토리지에서 멤버 이메일을 가져옵니다.
      const memberEmail = getEmailFromLocalStorage();

      // PUT 요청 보내기
      const response = await fetch(`${BASE_URL}/api/v1/category/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          memberEmail,
          oldCategoryName,
          newCategoryName
        })
      });

      // 응답 확인
      if (!response.ok) {
        toast.error("서버에서 오류를 반환했습니다. 개발자에게 문의하세요.");
      }

      console.log("🟢카테고리 이름 업데이트 성공🟢");

      // 응답 데이터를 반환합니다.
      return response;
    } catch (error) {
      console.error("에러 발생:", error);
      toast.error(
        "카테고리 이름을 업데이트하는 중 에러가 발생했습니다. 개발자에게 문의하세요."
      );
    }
  };

  const deleteCategory = async (categoryName) => {
    try {
      // 로컬 스토리지에서 멤버 이메일을 가져옵니다.
      const memberEmail = getEmailFromLocalStorage();

      // DELETE 요청 보내기
      const response = await fetch(
        `${BASE_URL}/api/v1/category/delete-category`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            memberEmail,
            categoryName
          })
        }
      );

      // 응답 확인
      if (!response.ok) {
        toast.error(
          "deleteCategory 서버에서 오류를 반환했습니다. 개발자에게 문의하세요."
        );
      }

      console.log("🟢", categoryName, "카테고리 삭제 성공🟢");

      // 응답 데이터를 반환합니다.
      return response;
    } catch (error) {
      console.error("에러 발생:", error);
      toast.error(
        "카테고리를 삭제하는 중 에러가 발생했습니다. 개발자에게 문의하세요."
      );
    }
  };

  // 영상 삭제 함수
  const deleteVideo = async (videoUrl) => {
    try {
      // 로컬 스토리지에서 memberEmail 가져오기
      const memberEmail = getEmailFromLocalStorage();
      const videoList = JSON.parse(localStorage.getItem("videoList")) || [];

      // DELETE 요청 보내기
      const response = await fetch(`${BASE_URL}/api/v1/video/delete-video`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          memberEmail,
          videoUrl
        })
      });

      if (response.status === 200) {
        console.log("영상을 스프링 서버에서 성공적으로 삭제했습니다.");
        // alert("영상이 성공적으로 삭제되었습니다.");
        toast.success("영상 삭제완료 !");
        // videoList에서 videoUrl에 해당하는 항목 삭제
        const updatedVideoList = videoList.filter(
          (video) => video.videoUrl !== videoUrl
        );
        localStorage.setItem("videoList", JSON.stringify(updatedVideoList));
        window.location.reload();
      } else {
        console.error(
          `스프링 서버에서 영상을 삭제하는 중 오류가 발생했습니다. 응답 상태코드: ${response.status}`
        );
      }
    } catch (error) {
      console.error(
        `스프링 서버에 DELETE 요청 중 오류가 발생했습니다: ${error}`
      );
      toast.error(
        "영상을 삭제하는 중 에러가 발생했습니다. 개발자에게 문의하세요."
      );
    }
  };

  const changeNickname = async (newNickname) => {
    try {
      console.log("[ 변경할 닉네임 ]\n", newNickname);
      const userEmail = getEmailFromLocalStorage(); // 로컬 스토리지에서 이메일 가져오기

      // 서버에 POST 요청 보내기
      const response = await fetch(`${BASE_URL}/api/v1/user/update-name`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          memberEmail: userEmail,
          newName: newNickname
        })
      });

      if (response.ok) {
        console.log("닉네임 변경 성공!");
        // 저장 성공 시 추가 작업 수행
      } else {
        console.error("닉네임 변경 실패:", response.statusText);
        // 저장 실패 시 에러 처리
      }
    } catch (error) {
      console.error(" 닉네임 변경 중 에러 발생:", error);
      // 에러 발생 시 에러 처리
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        getTokenFromLocalStorage,
        getEmailFromLocalStorage,
        saveContentToLocal,
        signup,
        login,
        logout,
        sendAuthorizationCode,
        GPTQuery,
        GPTSummary,
        saveMarkdownToServer,
        saveCategoryToDB,
        saveCategoryToLocal,
        homePageDataGET,
        getMyData,
        searchMarkdown,
        selectVideo,
        getVideoList,
        saveVideoToCategory,
        checkLoginStatus,
        updateCategoryName,
        deleteCategory,
        deleteVideo,
        changeNickname,
        getWindowSize
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth는 AuthProvider 안에서 사용되어야 합니다.");
  }
  return context;
};
