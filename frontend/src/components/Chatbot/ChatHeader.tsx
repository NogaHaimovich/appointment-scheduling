import CloseIcon from "@mui/icons-material/Close";

interface ChatHeaderProps {
  onClose: () => void;
}

export const ChatHeader = ({ onClose }: ChatHeaderProps) => {
  return (
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
  );
};
