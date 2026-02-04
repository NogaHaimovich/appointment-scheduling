import "./styles.scss"

type ButtonProps = {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "info" | "danger";
  type?: "button" | "submit" | "reset";
}

const Button = ({ 
  onClick,
  disabled, 
  loading, 
  children, 
  className, 
  variant = "primary", 
  type='button'
 }: ButtonProps) => {
 

  
  return(
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${className ?? ""} ${variant}`}
    >
      {loading ? "Loading..." : children}
    </button>
  )

};

export default Button;
