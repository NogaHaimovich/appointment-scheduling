import { Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import "./styles.scss";
import { useState } from "react";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../../config/api";


type Message = {
  sender: "user" | "bot";
  text: string;
};

const ChatBot = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {

    const [messages, setMessages] = useState<Message[]>([
      {
        sender: "bot",
        text: "Hi there! 👋 This feature is not ready yet – come back soon"
      }
    ]);

    const [input, setInput] = useState("");
    const handleSend = async () => { 
      if (!input.trim()) return; 

     
      const userMessage: Message = {
        sender: "user",
        text: input
      };
      setMessages(prev => [...prev, userMessage]);

      const messageToSend = input;

      setInput("");

      try {
        const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.getChatBotResponse}`, {
          message: messageToSend
        });
        const botMessage: Message = {
          sender: "bot",
          text: response.data.response
        };
        setMessages(prev => [...prev, botMessage]);
      } catch (err) {
        const errorMessage: Message = {
          sender: "bot",
          text: "Oops! Something went wrong. Please try again."
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    };

  return (
    <Modal 
      open={isOpen} 
      onClose={onClose} 
      className="chatBot_modal"
      closeAfterTransition
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            animation: 'fadeIn 0.3s ease',
          }
        }
      }}
    >
      <div className="chatBot_container_inner" onClick={(e) => e.stopPropagation()}>
        <div className="chatBot_header">
          <h2>Chat Bot</h2>
          <button 
            className="chatBot_cancel-button" 
            onClick={onClose}
            aria-label="Close chat"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="chatBot_body">
          <div className="chatBot_messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chatBot_message ${msg.sender}`}
              >
                {msg.text}
              </div>
            ))}
          </div>
        </div>

        <div className="chatBot_input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="chatBot_input"
          />
          <button
            className="chatBot_send-button"
            aria-label="Send message"
            onClick={handleSend}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
          >
            Send
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ChatBot;
