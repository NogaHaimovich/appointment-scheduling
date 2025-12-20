import "./styles.scss"

type ButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "info" | "danger"; 
}

const Button = ({ onClick, disabled, loading, children, className, variant = "primary" }: ButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled || loading}
    className={`${className ?? ""} ${variant}`}
  >
    {loading ? "Loading..." : children}
  </button>
);

export default Button;
