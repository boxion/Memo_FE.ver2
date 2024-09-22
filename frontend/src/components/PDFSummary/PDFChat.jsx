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
  background-color: #0004EB;
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

const PDFChat = ({ visible }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 컴포넌트가 렌더링될 때 API 요청을 자동으로 수행
  useEffect(() => {
    const fetchQuestions = async () => {
      const userId = localStorage.getItem("userId");
      const pdfTitle = localStorage.getItem("PDFFileName");

      try {
        const response = await fetch(`${Config.baseURL}/api/v1/questions/pdf-questions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            memberEmail: userId,
            pdfTitle: pdfTitle,
          }),
        });

        if (!response.ok) {
          console.error("서버에서 오류가 발생했습니다.");
          return;
        }

        const data = await response.json();
        console.log("질문/답변 데이터를 가져옴:", data);

        // 질문을 사용자 메시지로, 답변을 봇 메시지로 추가
        const newMessages = data.flatMap((item) => [
          { type: "user", content: item.question }, // 질문을 사용자 메시지로
          { type: "bot", content: item.answer },    // 답변을 봇 메시지로
        ]);
        setMessages(newMessages);
      } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생:", error);
      }
    };

    fetchQuestions();
  }, []); // 컴포넌트가 처음 렌더링될 때 한 번만 실행

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
            <div key={index}>
              {msg.type === "user" ? (
                <UserMessage>{msg.content}</UserMessage>
              ) : (
                <BotMessage>
                  <GptIcon src={gptIcon} alt="GPT Icon" />
                  <div dangerouslySetInnerHTML={{ __html: marked(msg.content) }} />
                </BotMessage>
              )}
            </div>
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
    const pdfTitle = localStorage.getItem("PDFFileName");

    console.log("GPT 모델에 쿼리를 전송하는 중...");
    console.log("[ 쿼리 ] : ", query);
    console.log("[ userId ] : ", userId);
    console.log("[ pdfTitle ] : ", pdfTitle);

    const response = await fetch(`${Config.baseURL}/api/v1/questions/askPDF`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: query,
        memberEmail: userId,
        pdfTitle: pdfTitle,
      }),
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

export default PDFChat;
