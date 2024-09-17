import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import gptIcon from "../../assets/images/GPTIcon.png";
import Config from "../Config/config";


const ChatContainer = styled.div`
  //flex-grow: 1;
  border-radius: 1vw;
  padding: 1vw;
  //border: 1px solid #ccc;
  width: 90%;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;

const ChatBox = styled.div`
  height: 20vw;
  overflow-y: auto;
  padding: 1vw;
  background-color: white;
  border-radius: 0 0 1vw 1vw;
`;

const ChatInputContainer = styled.div`
  display: flex;
  margin-top: 1vw;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 1vw;
  border-radius: 0.5vw;
  border: 1px solid #ccc;
  font-size: 1vw;
`;

const SendButton = styled.button`
  background-color: #4144E9;
  color: white;
  border: none;
  border-radius: 1vw;
  padding: 1vw 2vw;
  font-size: 1vw;
  cursor: pointer;
  margin-left: 1vw;

  &:hover {
    background-color: #0056b3;
  }
`;

const RefreshButton = styled.button`
  background-color: #FF7168;
  color: white;
  border: none;
  border-radius: 1vw;
  padding: 1vw 2vw;
  font-size: 1vw;
  cursor: pointer;
  margin-left: 1vw;

  &:hover {
    background-color: #d9332d;
  }
`;

const UserMessage = styled.div`
  display: flex;
  margin-bottom: 1vw;
  padding: 1vw 1.5vw;
   font-size: 1vw;
  background-color: #f2f2f2;
  border-radius: 1vw;
  align-self: flex-end;
  justify-content: flex-end;
`;

const BotMessage = styled.div`
  display: flex;
  margin-bottom: 1vw;
  font-size: 1vw;
  padding: 1vh 1.5vw;
  background-color: #e6e6e6;
  border-radius: 1vw;
  align-self: flex-start;
`;

const GptIcon = styled.img`
  margin-right: 1vw;
  width: 1.5vw;
  height: 1.5vw;
`;

const Chat = ({ visible }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (message.trim() !== "") {
      const newUserMessage = { type: "user", content: message };
      setMessages((prevMessages) => [...prevMessages, newUserMessage]);

      // GPTQuery 함수 호출
      const response = await GPTQuery(message);
      const newBotMessage = { type: "bot", content: response.qAnswer };
      setMessages((prevMessages) => [...prevMessages, newBotMessage]);

      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleRefresh = () => {
    setMessages([]);
    setMessage("");
  };

  return (
    visible && (
      <ChatContainer>
        <ChatBox>
          {messages.map((msg, index) => (
            <>
              {msg.type === "user" ? (
                <UserMessage key={index}>{msg.content}</UserMessage>
              ) : (
                <BotMessage key={index}>
                  <GptIcon src={gptIcon} alt="GPT Icon" />
                  {msg.content}
                </BotMessage>
              )}
            </>
          ))}
          <div ref={messagesEndRef} />
        </ChatBox>
        <ChatInputContainer>
          <ChatInput
            type="text"
            value={message}
            onChange={handleMessageChange}
            onKeyPress={handleKeyPress}
            placeholder="무엇이든 물어보세요..."
          />
          <SendButton onClick={handleSendMessage}>전송</SendButton>
          <RefreshButton onClick={handleRefresh}>새로고침</RefreshButton>
        </ChatInputContainer>
      </ChatContainer>
    )
  );
};

// GPTQuery 함수 정의
const GPTQuery = async (query) => {
  try {
    // 로컬스토리지에서 userId와 videoUrl을 가져옴
    const userId = localStorage.getItem("userId");
    const videoUrl = localStorage.getItem("videoUrl");

    console.log("GPT 모델에 쿼리를 전송하는 중...");
    console.log("[ 쿼리 ] : ", query);
    console.log("[ userId ] : ", userId);
    console.log("[ videoUrl ] : ", videoUrl);

    // 서버에 쿼리와 userId를 함께 전송하고 응답을 기다림
    const response = await fetch(`${Config.baseURL}/api/v1/questions/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        question: query,
        memberEmail: userId,
        videoUrl: videoUrl
      })
    });

    if (!response.ok) {
      console.error("GPTQuery 실행 중 서버에서 오류를 반환했습니다. 개발자에게 문의하세요.");
    }

    // 응답을 텍스트로 처리
    const data = await response.text();
    console.log("[ 받은 답변: ]\n", data);

    // 텍스트를 그대로 반환
    return { qAnswer: data };
  } catch (error) {
    console.error("에러 발생:", error);
    console.error("쿼리 전송 중 에러가 발생했습니다. 개발자에게 문의하세요.");
    return { qAnswer: "쿼리 전송 중 에러가 발생했습니다. 다시 시도해주세요." };
  }
};

export default Chat;
