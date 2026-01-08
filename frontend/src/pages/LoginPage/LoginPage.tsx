import { useState, useEffect } from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

import { useMutation } from "../../hooks/useMutation";
import { API_ENDPOINTS } from "../../config/api";
import { authUtils } from "../../utils/auth";
import InputField from "../../components/InputField/InputField";
import Button from "../../components/Button/Button";
import type { GetCodeResponse, ValidateCodeResponse, CreateAccountResponse } from "../../types/types";
import "./styles.scss";


const phoneSchema = z
  .string().length(10, "Phone number must be exactly 10 digits").regex(/^\d+$/, "Phone number must contain only digits");

const codeSchema = z
  .string().length(5, "Verification code must be exactly 5 digits").regex(/^\d+$/, "Verification code must contain only digits");

const nameSchema = z
  .string().min(2, "Name must be at least 2 characters").max(50, "Name must be at most 50 characters");

const LoginPage = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [name, setName] = useState("");
  const [isVerificationMode, setIsVerificationMode] = useState(false);
  const [isNameMode, setIsNameMode] = useState(false);
  const [localError, setLocalError] = useState("");
  const [message, setMessage] = useState("");
  
  const { data: OTPCode, loading: loadingCode, error: codeError, mutate: getCode} =
    useMutation<GetCodeResponse, { phone: string }>(API_ENDPOINTS.getCode, "post");

  const {data: validationData, loading: loadingValidation, error: validationError, mutate: validateCode} =
    useMutation<ValidateCodeResponse, { phone: string; code: string }>( API_ENDPOINTS.validateCode, "post");

  const {data: createAccountData, loading: loadingCreateAccount, error: createAccountError, mutate: createAccount} =
    useMutation<CreateAccountResponse, { phone: string; name: string }>( API_ENDPOINTS.createAccount, "post");

  const error = localError || codeError || validationError || createAccountError;
  const loading = loadingCode || loadingValidation || loadingCreateAccount;

  useEffect(() => {
    if (OTPCode) {
      setMessage(`${OTPCode.message}, the code is: ${OTPCode.code}`);
      setIsVerificationMode(true);
    }
  }, [OTPCode]);

  useEffect(() => {
    if (validationData) {
      setMessage(validationData.message);
      if (validationData.success) {
        if (validationData.requiresName) {
          // User doesn't exist, need to get name
          setIsNameMode(true);
          setIsVerificationMode(false);
        } else if (validationData.token) {
          // User exists, login successful
          authUtils.saveToken(validationData.token);
          navigate("/dashboard");
        }
      }
    }
  }, [validationData, navigate]);

  useEffect(() => {
    if (createAccountData) {
      setMessage(createAccountData.message);
      if (createAccountData.success && createAccountData.token) {
        authUtils.saveToken(createAccountData.token);
        navigate("/dashboard");
      }
    }
  }, [createAccountData, navigate]);

  const cleanPhone = (raw: string) => raw.replace(/\D/g, "");

  const handlePhoneSubmit = async () => {
    try {
      phoneSchema.parse(phone);
      setLocalError("");
      setMessage("");
      await getCode({ phone });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setLocalError(err.issues[0].message);
      }
    }
  };

  const handleCodeSubmit = async () => {
    try {
      codeSchema.parse(inputCode);
      setLocalError("");
      setMessage("");
      await validateCode({ phone, code: inputCode });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setLocalError(err.issues[0].message);
      }
    }
  };

  const handleNameSubmit = async () => {
    try {
      nameSchema.parse(name);
      setLocalError("");
      setMessage("");
      await createAccount({ phone, name });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setLocalError(err.issues[0].message);
      }
    }
  };

  const getSubtitle = () => {
    if (isNameMode) return "Enter your name";
    if (isVerificationMode) return "Enter verification code";
    return "Enter your phone number";
  };

  const getPlaceholder = () => {
    if (isNameMode) return "Your name";
    if (isVerificationMode) return "Verification code";
    return "Phone number";
  };

  const getInputValue = () => {
    if (isNameMode) return name;
    if (isVerificationMode) return inputCode;
    return phone;
  };

  const handleInputChange = (val: string) => {
    if (isNameMode) {
      setName(val);
    } else if (isVerificationMode) {
      setInputCode(val.replace(/\D/g, ""));
    } else {
      setPhone(cleanPhone(val).slice(0, 10));
    }
    if (error) setLocalError("");
  };

  const handleSubmit = () => {
    if (isNameMode) return handleNameSubmit();
    if (isVerificationMode) return handleCodeSubmit();
    return handlePhoneSubmit();
  };

  const isSubmitDisabled = () => {
    if (isNameMode) return loading || !name;
    if (isVerificationMode) return loading || !inputCode;
    return loading || !phone;
  };

  const getButtonText = () => {
    if (isNameMode) return "Create account";
    if (isVerificationMode) return "Send";
    return "Send verification code";
  };

  return (
    <div className="signin__form-wrapper">
      <div className="signin__form">
        <h2 className="signin__title">Welcome to Appointment Scheduler</h2>
        <h3 className="signin__subtitle">{getSubtitle()}</h3>

        <InputField
          value={getInputValue()}
          onChange={handleInputChange}
          placeholder={getPlaceholder()}
          error={error || undefined}
        />

        {message && <div className="signin__message">{message}</div>}

        <Button
          onClick={handleSubmit}
          disabled={isSubmitDisabled()}
          loading={loading}
          variant={"primary"}
        >
          {getButtonText()}
        </Button>
      </div>
    </div>
  );
};


export default LoginPage;
