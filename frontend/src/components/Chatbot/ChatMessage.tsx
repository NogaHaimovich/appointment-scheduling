import ReactMarkdown from "react-markdown";

export type Message = {
  sender: "user" | "bot";
  text: string;
};

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div className={`chatBot_message ${message.sender}`}>
      <ReactMarkdown>{message.text}</ReactMarkdown>
    </div>
  );
};
