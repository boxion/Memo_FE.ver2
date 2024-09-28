# 📝MEMO

유튜브, PDF, 오디오를 AI로 요약하고 메모할 수 있는 웹 서비스

## 프로젝트 개요
<div style="border: 1px solid #e1e4e8; color:#000000; padding: 16px; border-radius: 8px; background-color: #d4e7fa;">
2024 트렌드 코리아의 첫 키워드인 '분초 사회'는 시간의 가치가 중요해지는 사회적 변화를 뜻합니다. 현대인은 시간을 쪼개 효율적으로 사용하고, 여러 일을 동시에 처리하며, 결론을 확인한 후 일을 진행하는 경우가 많습니다.  
이러한 시대적 흐름에 발맞춰 **MEMO**는 바쁜 현대인을 위한 최적의 웹 서비스로 기획되었습니다. 본 서비스는 유튜브 영상, PDF 파일, 음성 파일 등의 콘텐츠를 빠르게 요약하여 제공하며, 사용자는 이를 통해 중요한 정보를 신속하게 습득할 수 있습니다. 더불어, 필요에 따라 카테고리별로 정보를 정리하고 저장할 수 있으며, 커뮤니티 기능을 통해 다른 사용자들의 기록을 공유하고 열람할 수 있습니다.
</div>

## 팀원 구성

<div align="center">

|                                                                **박시현**                                                                |                                                                   **김택신**                                                                   |                                                                 **정진혁**                                                                 |                                                                 **최영서**                                                                  |
|:-------------------------------------------------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------------------------------------------------------------------------------------------------------:|
| [<img src="https://avatars.githubusercontent.com/u/93407332?v=4" height=150 width=150> <br/> @sihyun](https://github.com/boxion) | [<img src="https://avatars.githubusercontent.com/u/90402009?v=4" height=150 width=150> <br/> @taeksin](https://github.com/taeksin) | [<img src="https://avatars.githubusercontent.com/u/117005839?v=4" height=150 width=150> <br/> @jinhyuk Jeong](https://github.com/wjdwlsgurdla) | [<img src="https://avatars.githubusercontent.com/u/115892001?v=4" height=150 width=150> <br/> @yeongseo](https://github.com/zeroseoS2) |

</div>

**팀원 및 담당 분야:**
- 박시현: 프론트엔드, 기획
- 김택신: 프론트엔드, 백엔드
- 정진혁: 백엔드, DB설계
- 최영서: 백엔드, DB설계

## 기술 스택
### 프론트엔드
- **React**: 사용된 버전 및 주요 역할
- **라이브러리**:
    - `@fortawesome/fontawesome`: 아이콘 사용
    - `axios`: API 호출을 위한 HTTP 클라이언트
    - `react-router-dom`: 라우팅을 위한 라이브러리
    - `styled-components`: 스타일링을 위한 라이브러리
    - 기타 라이브러리 설명 (PDF 뷰어, YouTube, Speech Kit 등)

### 백엔드
- **Spring Boot**: 백엔드 애플리케이션의 핵심 프레임워크
- **라이브러리**:
    - Spring Boot Web Starter: 웹 애플리케이션 개발용
    - JJWT: JSON Web Token을 이용한 인증 및 인가
    - MySQL: 데이터베이스 연동
    - JPA: 데이터베이스 ORM (Object Relational Mapping)
    - Spring Security: 보안 처리 및 OAuth2 클라이언트 사용
    - 기타 라이브러리 설명 (PDF 처리, Google Cloud API 등)

### Memo 실행 화면

<div align="center" style="margin-top: 20px;">
  <img src="https://github.com/user-attachments/assets/16f29cff-d820-4235-a2ad-765cc2f997f7" width="70%" alt="HomePage">
</div>
<div align="center" style="margin-top: 20px;">
  <img src="https://github.com/user-attachments/assets/409a0509-edef-442c-a584-1c7e01fc5d2e" width="70%" alt="HomePage_검색">
</div>
<div align="center" style="margin-top: 20px;">
  <img src="https://github.com/user-attachments/assets/f7e6e7ef-7e07-4ea3-ab20-ba7992b0ab47" width="70%" alt="MemoryPage">
</div>
<div align="center" style="margin-top: 20px;">
  <img src="https://github.com/user-attachments/assets/879856d7-b57e-46b9-af9a-99508d02b2f5" width="70%" alt="MemoryPage_gpt">
</div>
<div align="center" style="margin-top: 20px;">
  <img src="https://github.com/user-attachments/assets/3059d87f-fc8f-4acd-905f-c1122f5e8166" width="70%" alt="MemoryPage_Save">
</div>
<div align="center" style="margin-top: 20px;">
  <img src="https://github.com/user-attachments/assets/91d2e660-3ab2-4c90-b702-91e0ffe4d287" width="70%" alt="MyPage">
</div>

## 주요 기능
- **사용자 인증 및 보안**
    - JWT 및 Spring Security를 사용한 인증 처리
- **PDF 파일 처리**
    - PDF 파일을 업로드하고 요약본을 생성하여 조회할 수 있는 기능
    - Apache PDFBox를 사용하여 PDF 콘텐츠를 빠르고 정확하게 분석 및 처리
- **비디오 및 오디오 처리**
    - 유튜브 영상 및 오디오 파일에서 음성을 추출하고 이를 텍스트로 변환하여 요약하는 기능
    - 사용자는 장시간의 콘텐츠를 빠르게 요약된 내용으로 습득할 수 있습니다.
    - React를 통해 프론트엔드에서 미디어 데이터를 시각화하고, 백엔드와의 API 통신으로 실시간 데이터 처리가 가능합니다.
- **콘텐츠 요약 기능**
    - 유튜브 영상, PDF 파일, 오디오 파일을 대상으로 한 맞춤형 요약 서비스 제공
    - 사용자는 긴 내용을 빠르게 파악할 수 있도록 요약된 핵심 정보를 확인할 수 있습니다.
    - RESTful API를 활용해 간단한 인터페이스로 다양한 콘텐츠를 요약하여 사용자가 쉽게 접근 가능



## 설치 및 실행 방법
### 프론트엔드
1. 필요한 의존성을 설치합니다:
   ```bash
   npm install --legacy-peer-deps


## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참고하세요.

## 문의

프로젝트에 대한 문의 사항은 [psh2968@naver.com](mailto:psh2968@naver.com)으로 연락해 주세요.
