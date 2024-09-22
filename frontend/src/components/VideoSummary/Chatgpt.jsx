import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import gptIcon from "../../assets/images/GPTIcon.png";
import Config from "../Config/config";
import { marked } from "marked";

const ChatContainer = styled.div`
  border-radius: 1vw;
  padding: 1vw;
  width: 92%;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;

const ChatBox = styled.div`
  height: 23vw;
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
  padding: 0.5vw;
  border-radius: 0.5vw;
  border: 1px solid #ccc;
  font-size: 1vw;
`;

const SendButton = styled.button`
  background-color: #000395;
  color: white;
  border: none;
  border-radius: 1vw;
  padding: 0.5vw 1vw;
  font-size: 1vw;
  cursor: pointer;
  margin-left: 1vw;

  &:hover {
    background-color: #0056b3;
  }
`;

const RefreshButton = styled.button`
  background-color: #0004eb;
  color: white;
  border: none;
  border-radius: 1vw;
  padding: 0.5vw 1vw;
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
  padding: 0.5vw;
  background-color: #e6e6e6;
  border-radius: 1vw;
  align-self: flex-start;
  word-wrap: break-word;
`;

const GptIcon = styled.img`
  margin: 0.5vw 1vw 0 0.5vw;
  width: 2.5vw;
  height: 2.5vw;
`;

const Chat = ({ visible }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // 컴포넌트가 마운트될 때 로컬 스토리지에서 질문 목록을 가져오는 함수
  useEffect(() => {
    const loadQuestions = () => {
      const videoQuestions = JSON.parse(localStorage.getItem("videoQuestions")) || [];
      const initialMessages = videoQuestions.map(q => [
        { type: "user", content: q.question },
        { type: "bot", content: q.answer }
      ]).flat(); // 사용자 질문과 봇 답변을 평탄화하여 배열로 만듭니다.

      setMessages(initialMessages);
    };

    loadQuestions();
    scrollToBottom();
  }, []);

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

      // 입력창을 바로 비움
      setMessage("");

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
                  <div dangerouslySetInnerHTML={{ __html: marked(msg.content) }} />
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
    const userId = localStorage.getItem("userId");
    const videoUrl = localStorage.getItem("videoUrl");

    console.log("GPT 모델에 쿼리를 전송하는 중...");
    console.log("[ 쿼리 ] : ", query);
    console.log("[ userId ] : ", userId);
    console.log("[ videoUrl ] : ", videoUrl);

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

    const data = await response.text();
    console.log("[ 받은 답변: ]\n", data);

    // 텍스트 그대로 반환 (마크다운을 처리 가능하도록)
    return { qAnswer: data };
  } catch (error) {
    console.error("에러 발생:", error);
    return { qAnswer: "쿼리 전송 중 에러가 발생했습니다. 다시 시도해주세요." };
  }
};

export default Chat;
