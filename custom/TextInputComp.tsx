import { forwardRef } from "react";
import DynamicIcon from "../shared/DynamicIcon";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";

export const TextInputComp = forwardRef
  <HTMLInputElement,
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
      maxLength?: number,
      minLength?: number,
      onChange?: React.ChangeEventHandler<HTMLInputElement>;
      onBlur?: React.FocusEventHandler<HTMLInputElement>;
    }
  >(({ label, description, type, placeholder, required, icon, prefix, postfix, maxLength, minLength, error, ...rest }, ref) => {
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
              <DynamicIcon name="Phone" />
            </InputGroupAddon>
          )}

          <InputGroupInput
            id={`input-${label}`}
            type={type}
            placeholder={placeholder}
            ref={ref}
            maxLength={maxLength}
            minLength={minLength}
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
  });

TextInputComp.displayName = "TextInputComp";