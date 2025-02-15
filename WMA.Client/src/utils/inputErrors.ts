import { Dispatch, SetStateAction } from "react";

export const EmailReqs: InputErrorsType = {
  required: true,
  format: {
    regex: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    message: "Must be a valid email",
  },
};

export const PasswordReqs: InputErrorsType = {
  required: true,
  format: {
    regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
    message: "Must be a valid password",
  },
};

export const VerificationCodeReqs: InputErrorsType = {
  required: true,
  format: {
    // Alphanumeric 6 digit code
    regex: /^[a-zA-Z0-9]{6}$/,
    message: "Must be a 6 digit code",
  },
};

export const resolveInputErrorMessage = (
  text: string,
  inputErrors: InputErrorsType = {}
) => {
  if (inputErrors.required && !text) {
    return "This field is required";
  }
  if (inputErrors.length) {
    const { min, max } = inputErrors.length;
    if (text.length < min) {
      return `Minimum length is ${min}`;
    } else if (text.length > max) {
      return `Maximum length is ${max}`;
    }
  }
  if (inputErrors.format) {
    const { regex, message } = inputErrors.format;
    if (!regex.test(text)) return message;
  }
  if (inputErrors.state) {
    const { active, message } = inputErrors.state;
    if (active) return message;
  }
  return null;
};

export const handleErrors = (
  setErrors: Dispatch<SetStateAction<boolean[]>>,
  errors: boolean[],
  state: boolean,
  i: number
) => {
  errors[i] = state;
  setErrors(errors);
};
