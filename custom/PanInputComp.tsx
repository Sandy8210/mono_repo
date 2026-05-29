import { forwardRef } from "react";
import DynamicIcon from "../shared/DynamicIcon";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";

export const PanInputComp = forwardRef<
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
>(
  (
    {
      label,
      description,
      type = "text",
      placeholder = "ABCDE1234F",
      required,
      icon,
      prefix,
      postfix,
      maxLength = 10,
      minLength = 10,
      error,
      onChange,
      ...rest
    },
    ref
  ) => {

    const handlePanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.toUpperCase();
      let formattedValue = "";

      for (let i = 0; i < rawValue.length; i++) {
        const char = rawValue[i];

        if (formattedValue.length < 5) {
          if (/[A-Z]/.test(char)) formattedValue += char;
        } else if (formattedValue.length < 9) {
          if (/[0-9]/.test(char)) formattedValue += char;
        } else if (formattedValue.length === 9) {
          if (/[A-Z]/.test(char)) formattedValue += char;
        }
      }

      e.target.value = formattedValue.slice(0, 10);

      if (onChange) {
        onChange(e);
      }
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
              <DynamicIcon name={icon} />
            </InputGroupAddon>
          )}

          <InputGroupInput
            id={`input-${label}`}
            type={type}
            placeholder={placeholder}
            ref={ref}
            maxLength={maxLength}
            minLength={minLength}
            onChange={handlePanChange}
            {...rest}
          />

          {prefix && (
            <InputGroupAddon align="inline-end">{prefix}</InputGroupAddon>
          )}
        </InputGroup>

        {description && <FieldDescription>{description}</FieldDescription>}

        {error && <p className="text-xs text-red-500">{error}</p>}
      </Field>
    );
  }
);

PanInputComp.displayName = "PanInputComp";