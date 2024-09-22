import React, { useState,useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from "../components/Header/Header";
import CategoryDropdown from "../components/Community/CategoryDropdown";
import searchIconSrc from '../assets/images/searchicon.png'; // 이미지 경로 가져오기
import favoriteIcon from '../assets/images/favoriteIcon.png'; // 즐겨찾기 아이콘 이미지 경로
import favoriteFilledIcon from '../assets/images/favoriteFilledIcon.png'; // 채워진 즐겨찾기 아이콘 이미지 경로
import profile from '../assets/images/profile.png'; // 즐겨찾기 아이콘 이미지 경로
const BASE_URL = "http://59.5.40.202:8082";

const Container = styled.div`
  padding: 1vw 10vw;
  font-family: Arial, sans-serif;
  margin: 1vw 2vw;
  justify-content: space-between; /* 컨테이너 내 요소들이 상하로 공간을 채우도록 설정 */
  min-height: 80vh; /* 최소 높이 설정 */
`;
const SearchBarContainer = styled.div`
  position: relative;
  width: 18vw;
  margin-bottom: 2vw;
`;
const SearchButton = styled.button`
  position: absolute;
  left: 0.5vw;
  top: 55%;
  transform: translateY(-50%);
  background-color: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
`;
const SearchIcon = styled.img`
  width: 1.2vw;
  height: 1.2vw;
`;
const SearchBar = styled.input`
  width: 100%;
  // width: 20vw;
  padding: 0.5vw 1vw 0.5vw 2vw; /* 왼쪽 패딩을 아이콘 크기에 맞춰 조정 */
  font-size: 1vw;
  border: 0.1vw solid #000000;
  border-radius: 0.4vw;
  // margin-bottom: 2vw;
  &::-webkit-input-placeholder { /* WebKit 브라우저 */
    font-size: 0.85vw;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const RightAlignedFilters = styled.div`
  display: flex;
  gap: 1vw;
`;

const Dropdown = styled.div`
  position: relative;
`;

const CategoryDropdownButton = styled.button`
  width: 11vw;
  padding: 0.5vw 1vw;
  font-size: 0.85vw;
  border: 0.1vw solid #000000;
  border-radius: 0.4vw;
  background-color: #fff;
  cursor: pointer;
  display: flex;
  justify-content: center; /* 가운데 정렬 */
  align-items: center;
`;

const SortDropdownButton = styled.button`
  width: 5vw;
  padding: 0.5vw 1vw;
  font-size: 0.85vw;
  border: 0.1vw solid #000000;
  border-radius: 0.5vw;
  background-color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center; /* 가운데 정렬 */
`;

const SortDropdownContent = styled.div`
  position: absolute;
  width: 2.9vw;
  top: 55%;
  left: 0;
  background-color: #fff;
  border: 0.1vw solid #000000;
  border-radius: 0.5vw;
  padding: 0.5vw 1vw;
  list-style-type: none;
  box-shadow: 0px 0.4vw 0.8vw rgba(0, 0, 0, 0.1);
  z-index: 100;
  
`;

const DropdownItem = styled.li`
  font-size: 0.85vw;
  padding: 0.5vw 0;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
  &:not(:last-child) {
    border-bottom: 0.1vw solid #ccc;
  }
  
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3vw;
`;

const Card = styled.div`
  background-color: #f9f9f9;
  border-radius: 0.5vw;
  box-shadow: 0px 0.4vw 0.8vw rgba(0, 0, 0, 0.1);
  padding: 1vw;
  text-align: center;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 요소들을 왼쪽 정렬 */
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 1.45vw; /* 고정된 높이 설정으로 이미지 비율 유지 */
  padding-bottom: 50%;
  background-color: #e0e0e0;
  background-size: cover;
  object-fit: contain; /* 이미지가 잘리지 않고 전체가 보이도록 설정 */
  background-position: center; /* 이미지를 가운데에 맞춤 */
  border-radius: 0.5vw;
  margin-bottom: 0.8vw;
`;

const CardTitle = styled.p`
  font-size: 0.98vw;
  font-weight: 600; /* 글씨 두께를 굵게 설정 */
  top: -0.7vw;
  position: relative;
  margin-bottom: 0.8vw;
  text-align: center; /* 텍스트를 가운데 정렬 */
  width: 100%; /* 카드 안에서 제목이 중앙에 위치하도록 */
`;
const IconContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%; /* 컨테이너가 카드의 전체 너비를 사용 */
  margin-top: auto; /* 카드 하단에 고정 */
  position: relative; /* 이 줄을 추가하여 상대 위치 설정 */
`;
const FavoriteButton = styled.button`
  border: none;
  background-color: transparent;
  padding: 0;
  cursor: pointer;
  width: 1.5vw;
  height: 1.5vw;
  position: relative;
  background-image: url(${props => props.favorited ? favoriteFilledIcon : favoriteIcon});
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  left: 0.5vw;
`;
const MemberEmail = styled.p`
  position: relative;
  font-size: 0.8vw;
  color: #555;
  margin-right: -10.4vw; /* 왼쪽 여백 조정 */
  top: -1vw; /* 위로 이동 */
`;
const DocumentDate = styled.p`
  font-size: 0.7vw;
  color: #999;
  position: absolute; /* absolute로 위치 고정 */
  top: 0.5vw;
  right: 3.5vw;
  `;
const ImageIcon = styled.img`
  width: 2.1vw; /* 원하는 크기로 설정 */
  height: 2.1vw; /* 원하는 크기로 설정 */
  top: -0.5vw;
  left: -0.5vw;
  position: relative;
  border-radius: 0.5vw; /* 옵션: 이미지에 둥근 모서리 적용 */
`;

const PageNavigation = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2vw;
  `;

const PageButton = styled.button`
  border: none;
  background-color: transparent;
  font-size: 1.2vw;
  margin: 0 0.5vw;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
    /* 현재 페이지일 경우 동그라미 */
  ${({ isActive }) =>
    isActive &&
    `
      border-radius: 20%;  // 동그라미 모양
      border: 2px solid #4144E9;  // 동그라미 외곽선
      background-color: #4144E9;
      color: white;
    `}
`;
// 제목 검색 통신 코드
const searchVideos = async (videoTitle) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/community/search-videos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        videoTitle: videoTitle
      })
    });

    if (!response.ok) {
      throw new Error('searchVideos 함수 처리 중 네트워크 응답에 실패했습니다.');
    }
    const data = await response.json();
    console.log(data); // 받은 응답을 콘솔에 출력
    return data;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
};
// Filter별 영상 정렬 통신 코드
const fetchFilteredVideos = async (filter) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/community/filter-videos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filter }), 
    });

    if (!response.ok) {
      throw new Error('fetchFilteredVideos 함수 처리 중 네트워크 응답에 실패했습니다.');
    }

    const data = await response.json();
    console.log('필터링된 결과:', data); // 받은 응답을 콘솔에 출력
    return data;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
};
//인기순 정렬 통신코드
const fetchPopularVideos = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/community/popular`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('fetchPopularVideos 함수 처리 중 네트워크 응답에 실패했습니다.');
    }

    const data = await response.json();
    console.log(data); // 받은 인기순 데이터를 콘솔에 출력
    return data;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
};
//최신순 정렬 통신코드
const fetchLatestVideos = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/community/latest`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('fetchLatestVideos 함수 처리 중 네트워크 응답에 실패했습니다.');
    }

    const data = await response.json();
    console.log(data); // 최신순 데이터를 콘솔에 출력
    return data;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
};
// 클릭된 비디오 정보 전송 함수
const sendVideoInfo = async (memberEmail, videoUrl) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/community/video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        memberEmail: memberEmail,
        videoUrl: videoUrl
      })
    });

    if (!response.ok) {
      throw new Error('sendVideoInfo 함수 처리 중 네트워크 응답에 실패했습니다.');
    }
    const data = await response.json();
    console.log(data); // 받은 응답을 콘솔에 출력
    return data;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
};


function Community() {
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수 정의
  const [videos, setVideos]= useState([]);// 비디오 데이터를 저장하는 상태
  const [displayedVideos, setDisplayedVideos] = useState([]); // 현재 화면에 표시할 비디오 데이터
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지를 저장하는 상태
  const videosPerPage = 6; // 한 페이지에 표시할 비디오 개수
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('분야를 선택해보세요!');
  const [sortType, setSortType] = useState('정렬');
  const [favorites, setFavorites] = useState(Array(6).fill(false)); // 초기값 false로 설정
  const [searchQuery, setSearchQuery] = useState(''); // 검색어 상태 추가
  const [filteredVideos, setFilteredVideos] = useState([]); // 필터링된 비디오
useEffect(() => {
  const fetchVideos = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/community`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('데이터 가져오기에 실패했습니다.');
      }
      const data = await response.json();
      console.log("서버에서 받아온 데이터: ", data);

      // 전체 비디오를 로드하고 이를 필터링된 비디오로도 초기화
      setVideos([...data]);
      setFilteredVideos([...data]); // 초기에는 전체 비디오가 필터링된 비디오로 설정

      // 비디오를 가져온 후 좋아요 비디오 상태 초기화
      fetchLikedVideos(data);
    } catch (error) {
      console.error('비디오 데이터를 가져오는 중 오류 발생:', error);
    }
  };

  const fetchLikedVideos = async (videos) => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      const response = await fetch(`${BASE_URL}/api/v1/video/saved-videos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ memberEmail: userId }),
      });

      if (!response.ok) {
        throw new Error('좋아요 비디오를 가져오는 중 오류 발생.');
      }

      const savedVideos = await response.json();
      const likedVideoIds = new Set(savedVideos.map(video => video.videoId));
      const initialFavorites = videos.map(video => likedVideoIds.has(video.videoId));

      setFavorites(initialFavorites); // 좋아요 상태 업데이트
    } catch (error) {
      console.error('좋아요 비디오를 가져오는 중 오류 발생:', error);
    }
  };

  fetchVideos();
}, []); // 비어 있는 배열은 컴포넌트 마운트 시 한 번만 실행됨

  useEffect(() => {
    const applyFiltersAndSort = async () => {
      let filteredResults = [...videos];
  
      // 카테고리 필터만 적용 (선택한 카테고리가 기본값이 아닌 경우에만)
      if (selectedCategory !== '분야를 선택해보세요!') {
        filteredResults = await fetchFilteredVideos(selectedCategory);
      }
  
      // 정렬 방식 적용
      if (sortType === '인기순') {
        filteredResults = await fetchPopularVideos();
      } else if (sortType === '최신순') {
        filteredResults = await fetchLatestVideos();
      }
  
      setFilteredVideos(filteredResults);
      setCurrentPage(1); // 필터 적용 후 첫 페이지로 이동
    };
  
    applyFiltersAndSort();
  }, [sortType]); 
  
  useEffect(() => {
    // 페이지에 맞는 비디오만 표시
    const indexOfLastVideo = currentPage * videosPerPage;
    const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
    const currentVideos = filteredVideos.slice(indexOfFirstVideo, indexOfLastVideo);
    setDisplayedVideos(currentVideos);
  }, [currentPage, filteredVideos]);

  useEffect(() => {
    const fetchLikedVideosFromAPI = async () => {
      const userId = localStorage.getItem('userId');
      try {
        const response = await fetch(`${BASE_URL}/api/v1/video/saved-videos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ memberEmail: userId }), // userId는 localStorage에서 가져올 수 있음
        });
  
        if (!response.ok) {
          throw new Error('좋아요 비디오 가져오기 실패');
        }
  
        const likedVideos = await response.json();
        const likedVideoIds = new Set(likedVideos.map(video => video.videoId));
  
        // displayedVideos에 따라 좋아요 상태 초기화
        const initialFavorites = displayedVideos.map(video => likedVideoIds.has(video.videoId));
        setFavorites(initialFavorites);
      } catch (error) {
        console.error('좋아요 비디오 가져오는 중 오류 발생:', error);
      }
    };
  
    fetchLikedVideosFromAPI();
  }, [displayedVideos]);
  
 // 비디오 클릭 핸들러
const handleVideoClick = async (video) => {
  try {
    // memberEmail과 videoUrl을 서버로 전송
    const response = await fetch(`${BASE_URL}/api/v1/community/video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        memberEmail: video.memberEmail,
        videoUrl: video.videoUrl,
      }),
    });

    if (!response.ok) {
      throw new Error('비디오 정보를 불러오는데 실패했습니다.');
    }

    const videoAndQuestions = await response.json();
    console.log('불러온 비디오 정보:', videoAndQuestions);

    // 전송 성공 시 videoSummary 페이지로 이동 (로컬 저장된 정보가 아닌 클릭한 비디오 정보로 이동)
    navigate(`/video-summary2`, {
      state: {
        memberEmail: video.memberEmail,
        videoUrl: video.videoUrl,
        videoTitle: video.videoTitle,
        summary: video.summary,
        fullScript: video.fullScript
      },
    });
  } catch (error) {
    console.error('비디오 클릭 처리 중 오류 발생:', error);
  }
};
  const toggleCategoryDropdown = () => {
    setCategoryDropdownOpen(!categoryDropdownOpen);
  };

  const toggleSortDropdown = () => {
    setSortDropdownOpen(!sortDropdownOpen);
  };
  const handleCategorySelect = async (category) => {
    setSelectedCategory(category);
    setSortType('정렬'); // 카테고리를 선택하면 정렬 타입을 '정렬'로 리셋
    setCategoryDropdownOpen(false);
    if (category === '전체') {
      setFilteredVideos(videos); // 전체 비디오를 필터링된 비디오로 설정
    } else {
      // 선택된 카테고리에 맞는 필터링 작업만 수행
      const filteredResults = await fetchFilteredVideos(category);
      if (filteredResults && filteredResults.length > 0) {
        setFilteredVideos(filteredResults);
      } else {
        console.log("Video not found");
        setFilteredVideos([]); // 비디오가 없을 때 빈 배열을 설정
      }
    }
  };

  const handleSearchSubmit = async () => {
    if (searchQuery) {
      // 검색어가 있을 경우 검색을 수행
      const searchResults = await searchVideos(searchQuery);
      if (searchResults) {
        setFilteredVideos(searchResults); // 검색 결과를 상태에 저장
      }
    } else {
      // 검색어가 없을 경우 전체 비디오를 다시 설정
      setFilteredVideos(videos); // 전체 비디오를 상태에 저장
    }
    setCurrentPage(1); // 검색 후 또는 전체 비디오로 돌아올 때 첫 페이지로 리셋
  };

  const toggleFavorite = async (index) => {
    const newFavorites = [...favorites];
    const videoId = displayedVideos[index].videoId;
    const isCurrentlyFavorited = newFavorites[index];
    
    // Toggle the favorite status
    newFavorites[index] = !isCurrentlyFavorited;
    setFavorites(newFavorites);
    
    // Update localStorage with the new favorite status
    const userId = localStorage.getItem('userId');
    
    if (userId) {
      try {
        const url = isCurrentlyFavorited
          ? `${BASE_URL}/api/v1/video/unlike`
          : `${BASE_URL}/api/v1/video/like`;
    
        const method = isCurrentlyFavorited ? 'DELETE' : 'POST';
    
        const response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            memberEmail: userId,
            videoId: videoId,
          }),
        });
    
        if (!response.ok) {
          throw new Error('Failed to update favorite status.');
        }
    
        console.log('Favorite status updated successfully.');
    
        // Update local storage
        const likedVideos = JSON.parse(localStorage.getItem('likedVideos')) || {};
        if (isCurrentlyFavorited) {
          delete likedVideos[videoId];
        } else {
          likedVideos[videoId] = true;
        }
        localStorage.setItem('likedVideos', JSON.stringify(likedVideos));
    
      } catch (error) {
        console.error('Error updating favorite status:', error);
      }
    } else {
      console.error('User ID not found in localStorage.');
    }
  };  
  const handleSortSelect = async (type) => {
    setSortType(type);
    setSelectedCategory('전체'); // 카테고리를 '전체'로 설정
    setSortDropdownOpen(false);
  };
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredVideos.length / videosPerPage); i++) {
    pageNumbers.push(i);
  }
  // 현재 페이지에 해당하는 비디오 데이터 슬라이스
  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = videos.slice(indexOfFirstVideo, indexOfLastVideo);

  return (
    <>
      <Header />
      <Container>
        <FilterContainer>
          <SearchBarContainer>
            <SearchButton onClick={handleSearchSubmit}>
              <SearchIcon src={searchIconSrc} alt="search" />
            </SearchButton>
            <SearchBar
              placeholder="검색어를 입력하세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBarContainer>
          <RightAlignedFilters>
            <Dropdown>
              <CategoryDropdownButton onClick={toggleCategoryDropdown}>
                {selectedCategory}
              </CategoryDropdownButton>
              {categoryDropdownOpen && (
                <CategoryDropdown onSelectCategory={handleCategorySelect} />
              )}
            </Dropdown>
            <Dropdown>
              <SortDropdownButton onClick={toggleSortDropdown}>
                {sortType}
              </SortDropdownButton>
              {sortDropdownOpen && (
                <SortDropdownContent>
                  <DropdownItem onClick={() => handleSortSelect('인기순')}>인기순</DropdownItem>
                  <DropdownItem onClick={() => handleSortSelect('최신순')}>최신순</DropdownItem>
                </SortDropdownContent>
              )}
            </Dropdown>
          </RightAlignedFilters>
        </FilterContainer>
        <GridContainer>
          {displayedVideos.map((video, index) => (
            <Card key={video.videoId}>
            <ImagePlaceholder style={{ backgroundImage: `url(${video.thumbnailUrl})`, backgroundSize: 'cover' }}  onClick={() => handleVideoClick(video)} />
              <CardTitle> {video.videoTitle.length > 60 ? video.videoTitle.slice(0, 60) + '...' : video.videoTitle}</CardTitle>
              <IconContainer>
                <FavoriteButton 
                  favorited={favorites[index]} 
                  onClick={() => toggleFavorite(index)}
                />
                <MemberEmail>{video.memberEmail}</MemberEmail>
                <DocumentDate>{video.documentDate}</DocumentDate>
                <ImageIcon src={profile} alt="Description" />
              </IconContainer>
            </Card>
          ))}
        </GridContainer>
        <PageNavigation>
          {pageNumbers.map((number) => (
            <PageButton key={number} onClick={() => paginate(number)}
            isActive={currentPage === number}>
              {number}
            </PageButton>
          ))}
        </PageNavigation>
      </Container>
    </>
  );
}

export default Community;
