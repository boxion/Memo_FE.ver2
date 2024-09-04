import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/logo.png";
import Profile from "../../assets/images/profile.png";
import ProfileModal from "../Mypage/ProfileModal";
import SideMenu from "../Home/SideMenu";
import { useNavigate } from "react-router-dom";

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  width: 95%;
  padding: 1vw;
`;

const BottomSection = styled.div`
  display: flex;
  justify-content: space-evenly;
  gap: 2vw;
  width: 100%;
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
  width: 40px;
  height: auto;
  border-radius: 50%;
  cursor: pointer;
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

const UserProfileDropdown = styled(ProfileModal)`
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
`;

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(isLoggedIn === "true");
  }, []);

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  const handleRefresh = () => {
    navigate("/");
    window.location.reload();
  };

  const handleHamburgerButtonClick = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
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
              onClick={openProfileModal}
            />
            {isProfileModalOpen && (
              <UserProfileDropdown closeModal={closeProfileModal} />
            )}
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
