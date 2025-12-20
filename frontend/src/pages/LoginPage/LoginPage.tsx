import { useState, useEffect } from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

import { useMutation } from "../../hooks/useMutation";
import { API_ENDPOINTS } from "../../config/api";
import { authUtils } from "../../utils/auth";
import InputField from "../../components/InputField/InputField";
import Button from "../../components/Button/Button";
import type { GetCodeResponse, ValidateCodeResponse } from "../../types/types";
import "./styles.scss";


const phoneSchema = z
  .string().length(10, "Phone number must be exactly 10 digits").regex(/^\d+$/, "Phone number must contain only digits");

const codeSchema = z
  .string().length(5, "Verification code must be exactly 5 digits").regex(/^\d+$/, "Verification code must contain only digits");

const LoginPage = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [isVerificationMode, setIsVerificationMode] = useState(false);
  const [localError, setLocalError] = useState("");
  const [message, setMessage] = useState("");
  
  const { data: OTPCode, loading: loadingCode, error: codeError, mutate: getCode} =
    useMutation<GetCodeResponse, { phone: string }>(API_ENDPOINTS.getCode, "post");

  const {data: validationData, loading: loadingValidation, error: validationError, mutate: validateCode} =
    useMutation<ValidateCodeResponse, { phone: string; code: string }>( API_ENDPOINTS.validateCode, "post");

  const error = localError || codeError || validationError;
  const loading = loadingCode || loadingValidation;

  useEffect(() => {
    if (OTPCode) {
      setMessage(`${OTPCode.message}, the code is: ${OTPCode.code}`);
      setIsVerificationMode(true);
    }
  }, [OTPCode]);

  useEffect(() => {
    if (validationData) {
      setMessage(validationData.message);
      if (validationData.success && validationData.token) {
        authUtils.saveToken(validationData.token);
        navigate("/dashboard");
      }
    }
  }, [validationData, navigate]);

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

  return (
    <div className="signin__form-wrapper">
      <div className="signin__form">
        <h2 className="signin__title">Welcome to Appointment Scheduler</h2>
        <h3 className="signin__subtitle">{isVerificationMode ? "Enter verification code" : "Enter your phone number"}</h3>

        <InputField
          value={isVerificationMode ? inputCode : phone}
          onChange={(val) => {
            if (isVerificationMode) setInputCode(val.replace(/\D/g, ""));
            else setPhone(cleanPhone(val).slice(0, 10));
            if (error) setLocalError("");
          }}
          placeholder={isVerificationMode ? "Verification code" : "Phone number"}
          error={error || undefined}
        />

        {message && <div className="signin__message">{message}</div>}

        <Button
          onClick={isVerificationMode ? handleCodeSubmit : handlePhoneSubmit}
          disabled={loading || (isVerificationMode ? !inputCode : !phone)}
          loading={loading}
          variant={"primary"}
        >
          {isVerificationMode ? "Send" : "Send verification code"}
        </Button>
      </div>
    </div>
  );
};


export default LoginPage;
