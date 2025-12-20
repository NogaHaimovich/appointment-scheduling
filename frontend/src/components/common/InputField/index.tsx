import "./style.scss"

type InputFieldProps = {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  error?: string;
  type?: string;
}

const InputField = ({ value, onChange, placeholder, error, type = "text" }: InputFieldProps) => (
  <div className="input-wrapper">
    <input
      className={`input_field ${error ? "input_field--error" : ""}`}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
    {error && <div className="input_field__error">{error}</div>}
  </div>
);

export default InputField