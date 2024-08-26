import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator
} from '@chatscope/chat-ui-kit-react';

function App() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: 'Hello, I am ChatGPT',
      sender: 'ChatGPT',
      direction: 'incoming'
    }
  ]);

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: 'user',
      direction: 'outgoing'
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);

    setTyping(true);

    await processMessagetoChatGPT(newMessages);
  };

  async function processMessagetoChatGPT(chatMessages) {
    const lastMessage = chatMessages[chatMessages.length - 1].message;

    try {
      console.log('User Message: ', lastMessage);
      const response = await fetch('http://127.0.0.1:8000/api/chatbot/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: lastMessage
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        const botMessage = {
          message: data.message,
          sender: 'ChatGPT',
          direction: 'incoming'
        };
        console.log('ChatGPT Response:', data.message);
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } else {
        console.error('Error from server:', data.error);
      }
    } catch (error) {
      console.error('Error while fetching:', error);
    }

    setTyping(false);
  }

  return (
    <div className="App">
      <div style={{ position: 'relative', height: '800px', width: '700px' }}>
        <MainContainer>
          <ChatContainer>
            <MessageList typingIndicator={typing ? <TypingIndicator content="ChatGPT is typing" /> : null}>
              {messages.map((message, i) => (
                <Message key={i} model={message} />
              ))}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default App;
