import React, { useState } from 'react';
import styled from 'styled-components';
import Header from "../components/Header/Header";
import CategoryDropdown from "../components/Community/CategoryDropdown";
import searchIconSrc from '../assets/images/searchicon.png'; // 이미지 경로 가져오기
import favoriteIcon from '../assets/images/favoriteIcon.png'; // 즐겨찾기 아이콘 이미지 경로
import favoriteFilledIcon from '../assets/images/favoriteFilledIcon.png'; // 채워진 즐겨찾기 아이콘 이미지 경로
import profile from '../assets/images/profile.png'; // 즐겨찾기 아이콘 이미지 경로

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
  gap: 2vw;
`;

const Card = styled.div`
  background-color: #f9f9f9;
  border-radius: 0.5vw;
  box-shadow: 0px 0.4vw 0.8vw rgba(0, 0, 0, 0.1);
  padding: 1vw;
  text-align: center;
  height: 17.7vw;
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 요소들을 왼쪽 정렬 */
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  padding-bottom: 50%;
  background-color: #e0e0e0;
  border-radius: 0.5vw;
  margin-bottom: 0.8vw;
`;

const CardTitle = styled.p`
  font-size: 0.98vw;
  font-weight: 600; /* 글씨 두께를 굵게 설정 */
  top: -0.7vw;
  position: relative;
  margin-bottom: 0.8vw;
`;

const FavoriteButton = styled.button`
  border: none;
  background-color: transparent;
  padding: 0;
  cursor: pointer;
  width: 1.15vw;
  height: 1.15vw;
  top: 1.1vw;
  position: relative;
  background-image: url(${props => props.favorited ? favoriteFilledIcon : favoriteIcon});
  background-size: cover;
  background-repeat: no-repeat;
`;
const ImageIcon = styled.img`
  width: 1.95vw; /* 원하는 크기로 설정 */
  height: 1.95vw; /* 원하는 크기로 설정 */
  margin-left: 18.8vw; /* FavoriteButton과의 간격 조정 */
  top: -0.5vw;
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

function Community() {
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('분야를 선택해보세요!');
  const [sortType, setSortType] = useState('정렬');
  const [favorites, setFavorites] = useState(Array(6).fill(false)); // 초기값 false로 설정
  const [searchQuery, setSearchQuery] = useState(''); // 검색어 상태 추가

  const toggleCategoryDropdown = () => {
    setCategoryDropdownOpen(!categoryDropdownOpen);
  };

  const toggleSortDropdown = () => {
    setSortDropdownOpen(!sortDropdownOpen);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCategoryDropdownOpen(false);
  };

  const handleSortSelect = (type) => {
    setSortType(type);
    setSortDropdownOpen(false);
    // 정렬 로직 추가
  };
  const handleSearchSubmit = () => {
    // 검색 로직 추가
    console.log(`검색어: ${searchQuery}`);
  }
  const toggleFavorite = (index) => {
    const newFavorites = [...favorites];
    newFavorites[index] = !newFavorites[index];
    setFavorites(newFavorites);
  };

  return (
    <>
      <Header />
      <Container>
        <FilterContainer>
        <SearchBarContainer>
          <SearchButton onClick={handleSearchSubmit}>
            <SearchIcon src={searchIconSrc} alt="search" />
          </SearchButton>
          <SearchBar placeholder="검색어를 입력하세요" />
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
          {[...Array(6)].map((_, index) => (
            <Card key={index}>
              <ImagePlaceholder />
              <CardTitle>[정보처리기사 필기 절대족보] 핵심이론 1과목-1</CardTitle>
              <FavoriteButton 
                favorited={favorites[index]} 
                onClick={() => toggleFavorite(index)}
              />
              <ImageIcon src={profile} alt="Description" />
            </Card>
          ))}
        </GridContainer>
        
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
