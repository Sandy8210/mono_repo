"use client"

import * as React from "react"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../ui/input-otp"
import { Field, FieldLabel, FieldDescription } from "../ui/field"

export const InputOTPComp = React.forwardRef<
  HTMLInputElement,
  {
    label?: string;
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
    digit?: number;
    separatorGap?: number;
    value?: string;
    onChange?: (value: string) => void;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
  }
>(
  (
    {
      label,
      name,
      required,
      digit = 6,
      separatorGap = 0,
      error,
      description,
      value,
      onChange,
    },
    ref
  ) => {
    const slotGroups = React.useMemo(() => {
      const groups = [];

      if (separatorGap > 0) {
        for (let i = 0; i < digit; i += separatorGap) {
          const group = [];
          for (let j = i; j < i + separatorGap && j < digit; j++) {
            group.push(j);
          }
          groups.push(group);
        }
      } else {
        const group = [];
        for (let i = 0; i < digit; i++) {
          group.push(i);
        }
        groups.push(group);
      }

      return groups;
    }, [digit, separatorGap]);

    return (
      <Field>
        {label && (
          <FieldLabel htmlFor={`input-${name}`}>
            {label} {required && <span className="text-red-500">*</span>}
          </FieldLabel>
        )}

        <InputOTP
          maxLength={digit}
          value={value}
          onChange={onChange}
          ref={ref}
        >
          {slotGroups.map((group, groupIndex) => (
            <React.Fragment key={groupIndex}>
              <InputOTPGroup>
                {group.map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    aria-invalid={!!error}
                  />
                ))}
              </InputOTPGroup>

              {groupIndex < slotGroups.length - 1 && <InputOTPSeparator />}
            </React.Fragment>
          ))}
        </InputOTP>

        {description && <FieldDescription>{description}</FieldDescription>}
        {error && <p className="text-xs text-red-500">{error}</p>}
      </Field>
    )
  }
)

InputOTPComp.displayName = "InputOTPComp"