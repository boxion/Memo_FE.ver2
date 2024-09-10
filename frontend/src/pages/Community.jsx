import React, { useState,useEffect  } from 'react';
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
`;
const FavoriteButton = styled.button`
  border: none;
  background-color: transparent;
  padding: 0;
  cursor: pointer;
  width: 1.15vw;
  height: 1.15vw;
  position: relative;
  background-image: url(${props => props.favorited ? favoriteFilledIcon : favoriteIcon});
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  top: -0.5vw; /* 위로 이동 */
  left: 0.5vw;
`;
const ImageIcon = styled.img`
  width: 2.1vw; /* 원하는 크기로 설정 */
  height: 2.1vw; /* 원하는 크기로 설정 */
  margin-left: 18.8vw; /* FavoriteButton과의 간격 조정 */
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
`;
//제목 검색 통신코드
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
      throw new Error('searchVideos함수 처리 중 네트워크 응답에 실패했습니다.');
    }

    const data = await response.json();
    console.log(data); // 받은 응답을 콘솔에 출력
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

function Community() {
  const [videos, setVideos]= useState([]);// 비디오 데이터를 저장하는 상태
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('분야를 선택해보세요!');
  const [sortType, setSortType] = useState('정렬');
  const [favorites, setFavorites] = useState(Array(6).fill(false)); // 초기값 false로 설정
  const [searchQuery, setSearchQuery] = useState(''); // 검색어 상태 추가
  // 페이지 처음 로드 시 비디오 데이터 요청
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
        setVideos(data); // 가져온 데이터를 상태에 저장
      } catch (error) {
        console.error('비디오 데이터를 가져오는 중 오류 발생:', error);
      }
    };

  fetchVideos();
}, []); // 빈 배열을 두어 컴포넌트가 처음 마운트될 때만 호출
  const toggleCategoryDropdown = () => {
    setCategoryDropdownOpen(!categoryDropdownOpen);
  };

  const toggleSortDropdown = () => {
    setSortDropdownOpen(!sortDropdownOpen);
  };

  // 필터 선택 시 호출하는 함수
  const handleCategorySelect = async (category) => {
    setSelectedCategory(category);
    setCategoryDropdownOpen(false);

    // 필터링된 비디오 데이터를 요청하는 함수 호출
    const filteredResults = await fetchFilteredVideos(category);
    console.log('카테고리 선택 후 필터링된 결과:', filteredResults); // 검색 결과 처리 (추후 UI 업데이트 가능)
  };

  const handleSearchSubmit = async() => {
    // 검색 로직 추가
    console.log(`검색어: ${searchQuery}`);
    const searchResults = await searchVideos(searchQuery); // 검색 함수 호출
    console.log('검색 결과:', searchResults); // 검색 결과 처리 (추후 UI 업데이트 가능)
  }
  const toggleFavorite = (index) => {
    const newFavorites = [...favorites];
    newFavorites[index] = !newFavorites[index];
    setFavorites(newFavorites);
  };
  const handleSortSelect = async (type) => {
    setSortType(type);
    setSortDropdownOpen(false);
  
    if (type === '인기순') {
      // 인기순 데이터를 요청하는 함수 호출
      const popularResults = await fetchPopularVideos();
      console.log('인기순 결과:', popularResults); // 검색 결과 처리 (추후 UI 업데이트 가능)
    }
    if (type === '최신순') {
      const latestResults = await fetchLatestVideos();
      console.log('최신순 결과:', latestResults);
    }  };
  
  return (
    <>
      <Header />
      <Container>
        <FilterContainer>
        <SearchBarContainer>
          <SearchButton onClick={handleSearchSubmit}>
            <SearchIcon src={searchIconSrc} alt="search" />
          </SearchButton>
          <SearchBar placeholder="검색어를 입력하세요" 
            value={searchQuery} // 입력 값 상태 연결
            onChange={(e) => setSearchQuery(e.target.value)} // 입력 값 변경 시 상태 업데이트
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
          {videos.map((video, index) => (
            <Card key={video.videoId}>
              <ImagePlaceholder style={{ backgroundImage: `url(${video.thumbnailUrl})`, backgroundSize: 'cover' }} />
              <CardTitle> {video.videoTitle.length > 67 ? video.videoTitle.slice(0, 65) + '...' : video.videoTitle}</CardTitle>
              <IconContainer>
                <FavoriteButton 
                  favorited={favorites[index]} 
                  onClick={() => toggleFavorite(index)}
                />
                <ImageIcon src={profile} alt="Description" />
              </IconContainer>
            </Card>
          ))}
        </GridContainer>

        {/* <GridContainer>
          {[...Array(6)].map((_, index) => (
            <Card key={index}>
              <ImagePlaceholder />
              <CardTitle>[정보처리기사 필기 절대족보] 핵심이론 1과목-1</CardTitle>
              <IconContainer>
              <FavoriteButton 
                favorited={favorites[index]} 
                onClick={() => toggleFavorite(index)}
              />
              <ImageIcon src={profile} alt="Description" />
              </IconContainer>
            </Card>
          ))}
        </GridContainer> */}
        
        <PageNavigation>
          <PageButton>1</PageButton>
          <PageButton>2</PageButton>
          <PageButton>3</PageButton>
          <PageButton>4</PageButton>
          <PageButton>5</PageButton>
        </PageNavigation>
      </Container>
    </>
  );
}

export default Community;
