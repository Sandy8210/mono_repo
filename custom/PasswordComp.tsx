import { forwardRef, useState } from "react";
import DynamicIcon from "../shared/DynamicIcon";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";

export const PasswordComp = forwardRef<
  HTMLInputElement,
  {
    label: string;
    description?: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    icon?: string;
    prefix?: string;
    postfix?: string;
    error?: string;
    name?: string;
    maxLength?: number;
    minLength?: number;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
  }
>(({ label, description, type, placeholder, required, icon, prefix, postfix, maxLength, minLength, error, ...rest }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Field>
      <FieldLabel htmlFor={`input-${label}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </FieldLabel>

      <InputGroup>
        {postfix && (
          <InputGroupAddon align="inline-start">{postfix}</InputGroupAddon>
        )}
        {icon && !postfix && (
          <InputGroupAddon>
            <DynamicIcon name={icon || "Phone"} />
          </InputGroupAddon>
        )}

        <InputGroupInput
          id={`input-${label}`}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          ref={ref}
          maxLength={maxLength}
          minLength={minLength}
          className={!showPassword ? "[-webkit-text-security:square]" : ""}
          {...rest}
        />

        {prefix && (
          <InputGroupAddon align="inline-end">{prefix}</InputGroupAddon>
        )}

        <InputGroupAddon align="inline-end">
          <button
            type="button"
            onClick={toggleVisibility}
            className="flex items-center justify-center text-gray-500 hover:text-gray-700 focus:outline-none px-2"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <DynamicIcon name={showPassword ? "EyeOff" : "Eye"} />
          </button>
        </InputGroupAddon>
      </InputGroup>

      {description && <FieldDescription>{description}</FieldDescription>}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </Field>
  );
});

PasswordComp.displayName = "PasswordComp";