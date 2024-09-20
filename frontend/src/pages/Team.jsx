import React from 'react';
import styled from 'styled-components';
import teamData from '../util/team';
import Header from '../components/Header/Header';

// 스타일 정의
const TeamContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2vw;
  background-color: #f8f9fa;
`;

const TeamHeader = styled.h1`
  font-size: 2vw;
  margin-bottom: 2vw;
  color: #4144E9;
`;

const MembersContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); 
  grid-gap: 2vw;
  margin: 0 auto;
  width: 80%;
`;

const MemberCard = styled.div`
  background-color: white;
  border-radius: 1vw;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 2vw;
  display: flex; /* 이미지와 텍스트를 나란히 배치 */
  align-items: center; /* 수직 가운데 정렬 */
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-0.5vw);
  }
`;

const MemberImage = styled.img`
  width: 12vw;
  height: 12vw;
  object-fit: cover;
  border-radius: 1vw;
  margin-right: 2vw; /* 이미지와 텍스트 사이 여백 */
`;

const MemberInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
`;

const MemberName = styled.h2`
  font-size: 1.5vw;
  margin-bottom: 0.5vw;
  color: #202020;
`;

const MemberTrack = styled.p`
  font-size: 1vw;
  margin-bottom: 0.5vw;
  color: #6c757d;
`;

const MemberRole = styled.p`
  font-size: 1vw;
  margin-bottom: 1vw;
  color: #6c757d;
`;

const GitLink = styled.a`
  font-size: 1vw;
  color: #4144E9;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Team = () => {
  return (
    <>
      <Header />
      <TeamContainer>
        <TeamHeader>💻 About Team</TeamHeader>
        <MembersContainer>
          {teamData.map((member) => (
            <MemberCard key={member.id}>
              <MemberImage src={member.image} alt={member.name} />
              <MemberInfo>
                <MemberName>{member.name}</MemberName>
                <MemberTrack>{member.track}</MemberTrack>
                <MemberRole>{member.role}</MemberRole>
                <GitLink href={member.git} target="_blank" rel="noopener noreferrer">
                  GitHub
                </GitLink>
              </MemberInfo>
            </MemberCard>
          ))}
        </MembersContainer>
      </TeamContainer>
    </>
  );
};

export default Team;
