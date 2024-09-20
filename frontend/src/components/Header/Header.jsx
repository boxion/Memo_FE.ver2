import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/logo.png";
import Profile from "../../assets/images/profile.png";
import SideMenu from "../Home/SideMenu";
import Config from "../Config/config";

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  width: 94%;
  padding: 1vw;
`;

const BottomSection = styled.div`
  display: flex;
  justify-content: space-evenly;
  gap: 2vw;
  width: 99.7%;
  border-top: 1px solid #e0e0e0;
  padding: 0.7vw;
  background-color: #202D94;
`;

const LogoTitle = styled.div`
  display: flex;
  align-items: center;
`;

const LogoImage = styled.img`
  width: 13vw;
  height: auto;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: #fff;
  font-size: 1.2vw;
  &:hover {
    color: #ddd;
  }
`;

const HamburgerButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 2vw;
  font-weight: bold;
  color: #000000;
`;

const ProfileTitle = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const ProfileImage = styled.img`
  width: 3vw;
  height: 3vw;
  border-radius: 50%;
  cursor: pointer;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border: 0.1vw solid #ccc;
  border-radius: 1.5vw;
  overflow: hidden;
  z-index: 1;
  box-shadow: 0 0.2vw 1vw rgba(0, 0, 0, 0.1);
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 1vw 1.5vw;
  color: #333;
  font-size: 1.2vw;
  text-decoration: none;
  white-space: nowrap;
  border-bottom: 0.1vw solid #e0e0e0;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const Button = styled.button`
  padding: 0.7vw 1.2vw;
  background-color: #000000;
  color: white;
  border: none;
  border-radius: 0.4vw;
  cursor: pointer;
  font-size: 1vw;

  &:hover {
    background-color: #555;
  }
`;

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(isLoggedIn === "true");
  }, []);

  const handleRefresh = () => {
    navigate("/");
    window.location.reload();
  };

  const handleHamburgerButtonClick = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  return (
    <HeaderContainer>
      <TopSection>
        <HamburgerButton onClick={handleHamburgerButtonClick}>
          ☰
        </HamburgerButton>
        <LogoTitle>
          <Link to="/" onClick={handleRefresh}>
            <LogoImage src={Logo} alt="Logo" />
          </Link>
        </LogoTitle>
        {isLoggedIn ? (
          <ProfileTitle>
            <ProfileImage
              src={Profile}
              alt="Profile"
              onClick={handleProfileClick}
            />
            <DropdownMenu isOpen={isDropdownOpen}>
              <DropdownItem to="/mypage">내 게시물</DropdownItem>
              <DropdownItem to="/savemypage">저장 게시물</DropdownItem>
              <DropdownItem to="/team">팀 정보</DropdownItem>
              <DropdownItem onClick={handleLogout}>로그아웃</DropdownItem>
            </DropdownMenu>
          </ProfileTitle>
        ) : (
          <ProfileTitle>
            <Link to="/login">
              <Button>로그인</Button>
            </Link>
          </ProfileTitle>
        )}
      </TopSection>
      <BottomSection>
        <NavLink to="/">영상요약</NavLink>
        <NavLink to="/audio-ai">오디오AI</NavLink>
        <NavLink to="/pdfpage">PDF요약</NavLink>
        <NavLink to="/community">커뮤니티</NavLink>
      </BottomSection>
      {isSideMenuOpen && (
        <SideMenu
          isOpen={isSideMenuOpen}
          onClose={() => setIsSideMenuOpen(false)}
        />
      )}
    </HeaderContainer>
  );
}

export default Header;
