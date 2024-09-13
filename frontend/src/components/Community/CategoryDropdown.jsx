import React from 'react';
import styled from 'styled-components';

const CategoryDropdownContent = styled.div`
  position: absolute;
  width: 8.9vw;
  top: 55%;
  left: 0;
  right: 40%;
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
    border-bottom: 0.1vw solid #ccc; /* 항목 사이에 라인 추가 */
  }
`;

const CategoryDropdown = ({ onSelectCategory }) => {
  const categories = [
    "일반", "창업", "IT/프로그래밍", "공부", "뉴스", "정보", 
    "언어", "자격증", "취업/이직", "주식/투자", "라이프", "진로", "기타"
  ];

  return (
    <CategoryDropdownContent>
      {categories.map((category) => (
        <DropdownItem key={category} onClick={() => onSelectCategory(category)}>
          {category}
        </DropdownItem>
      ))}
    </CategoryDropdownContent>
  );
};

export default CategoryDropdown;
