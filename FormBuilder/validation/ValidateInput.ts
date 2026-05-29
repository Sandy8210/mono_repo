// validation.ts

import dayjs from "dayjs";

export type ValidationType =
  | "email"
  | "number"
  | "phone"
  | "text"
  | "alphanumeric"
  | "tag-email"
  | "url"
  | "password"
  | "pin"
  | "fax"
  | "aadhar"
  | "pan"
  | "voterId"
  | "date";

export interface Field {
  name: string;
  label: string;
  required?: boolean;
  type?: ValidationType;
  maxLength?: number;
  minLength?: number;
}

export interface Errors {
  [key: string]: string;
}

export interface Values {
  [key: string]: any;
}

export const validation = (
  values: Values,
  fields: Field[],
  setErrors: (errors: Errors) => void,
): boolean => {
  let newErrors: Errors = {};
  let hasErrors = false;

  fields.forEach((field) => {
    const fieldValue = values[field.name];

    if (
      field.required &&
      (fieldValue === undefined || fieldValue === null || fieldValue === "")
    ) {
      newErrors[field.name] = `${field.label} is required`;
      hasErrors = true;
    } else if (Array.isArray(fieldValue) && field.required) {
      if (fieldValue.length === 0) {
        newErrors[field.name] = `${field.label} is required`;
        hasErrors = true;
      }
    } else if (field.type) {
      const error = validateInput(fieldValue, field.type);

      if (error) {
        newErrors[field.name] = error;
        hasErrors = true;
      }
    } else if (field?.maxLength && fieldValue?.length > field.maxLength) {
      newErrors[field.name] =
        `${field.label} cannot exceed ${field.maxLength} characters`;
      hasErrors = true;
    } else if (field.minLength && fieldValue?.length < field.minLength) {
      newErrors[field.name] =
        `${field.label} must be at least ${field.minLength} characters`;
      hasErrors = true;
    }
  });
  setErrors(newErrors);

  return hasErrors;
};

export const validateInput = (
  value: any,
  validationType: ValidationType,
): string | null => {
  if (!value) return null;

  switch (validationType) {
    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ? null
        : "Invalid email address";

    case "number":
      return /^\d+$/.test(value) ? null : "Only numbers are allowed";

    case "phone":
      return /^\d{10}$/.test(value)
        ? null
        : "Enter a valid 10-digit phone number";

    case "text":
      return /^[a-zA-Z\s]+$/.test(value) ? null : "Only text is allowed";

    case "alphanumeric":
      return /^[a-zA-Z0-9 ]+$/.test(value)
        ? null
        : "Only alphanumeric characters are allowed";

    case "tag-email":
      if (!Array.isArray(value)) {
        return "Invalid input format";
      }

      const invalidEmails = value.filter(
        (email: string) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      );

      return invalidEmails.length === 0
        ? null
        : `Invalid email(s): ${invalidEmails.join(", ")}`;

    case "url":
      return /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/.test(
        value,
      )
        ? null
        : "Invalid URL format. Example: example.com or https://example.com";

    case "password":
      return /^.{5,}$/.test(value)
        ? null
        : "Password must be at least 5 characters";

    case "pin":
      return /^\d{6}$/.test(value) ? null : "Enter a valid 6-digit PIN code";

    case "aadhar":
      return /^\d{12}$/.test(value)
        ? null
        : "Enter a valid 12-digit Aadhaar number";

    case "pan":
      return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)
        ? null
        : "Enter a valid PAN number";

    case "voterId":
      return /^[A-Z]{3}[0-9]{7}$/.test(value) ? null : "Enter a valid Voter ID";

    case "date":
      return dayjs(value).isValid() ? null : "Enter a valid date";

    default:
      return null;
  }
};

export const getInputFilter = (validationType?: ValidationType) => {
  switch (validationType) {
    case "aadhar":
      return (value: string) => value.replace(/[^0-9]/g, "");
    case "alphanumeric":
      return (value: string) => value.replace(/[^a-zA-Z0-9 ]/g, "");
    case "number":
      return (value: string) => {
        const stripped = value.replace(/[^0-9]/g, "");
        return stripped === "0" ? "" : stripped;
      };
    case "text":
      return (value: string) => value.replace(/[^a-zA-Z\s]/g, "");

    case "date":
      return (value: string) => value.replace(/[^0-9\-\/\s]/g, "");

    default:
      return null;
  }
};
