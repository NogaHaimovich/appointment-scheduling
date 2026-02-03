import { Modal } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../../config/api";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import type { Message } from "./ChatMessage";
import "./styles.scss";

const INITIAL_MESSAGE: Message = {
  sender: "bot",
  text: "Hi there! 👋 I'm your medical appointment assistant.\n\nI can help you with:\n- Information about our medical specialties\n- Finding doctors by specialty\n- Guidance on which specialist you might need\n\nWhat would you like to know?"
};

const ChatBot = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      sender: "user",
      text: input
    };
    setMessages(prev => [...prev, userMessage]);

    const messageToSend = input;
    setInput("");
    setIsLoading(true);

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
    } finally {
      setIsLoading(false);
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
        <ChatHeader onClose={onClose} />
        <ChatMessages messages={messages} isLoading={isLoading} />
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
          disabled={isLoading}
        />
      </div>
    </Modal>
  );
};

export default ChatBot;
