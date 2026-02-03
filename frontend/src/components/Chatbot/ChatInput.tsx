interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export const ChatInput = ({ value, onChange, onSend, disabled }: ChatInputProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !disabled) {
      onSend();
    }
  };

  return (
    <div className="chatBot_input-container">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="chatBot_input"
        disabled={disabled}
      />
      <button
        className="chatBot_send-button"
        aria-label="Send message"
        onClick={onSend}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      >
        Send
      </button>
    </div>
  );
};
