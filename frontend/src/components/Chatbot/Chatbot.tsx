import { Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import "./styles.scss";

const ChatBot = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
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
            <div className="chatBot_message bot">Hi there!👋 This feature is not ready yet- come back soon </div>  
            {/* I'm your friendly chat bot. How can I help you today? */}

          </div>
        </div>

        <div className="chatBot_input-container">
          <input
            type="text"
            placeholder="Type a message..."
            className="chatBot_input"
            aria-label="Chat input"
          />
          <button 
            className="chatBot_send-button"
            aria-label="Send message"
          >
            Send
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ChatBot;
