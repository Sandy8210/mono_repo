"use client"

import * as React from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import { Label } from "../ui/label";

export const RadioComp = React.forwardRef<
  HTMLDivElement,
  {
    label: string;
    description?: string;
    required?: boolean;
    error?: string;
    name?: string;
    options: { label: string; value: string }[];
    value?: string;
    onChange?: (value: string) => void;
    onBlur?: () => void;
  }
>(
  ({ label, description, required, error, name, options = [], value, onChange, onBlur }, ref) => {
    return (
      // ADDED w-full here
      <Field className="w-full">
        <div className="mb-3">
          <FieldLabel className={error ? "text-red-500" : "text-foreground"}>
            {label} {required && <span className="text-red-500">*</span>}
          </FieldLabel>
          {description && <FieldDescription>{description}</FieldDescription>}
        </div>

        <RadioGroup
          ref={ref}
          onValueChange={onChange}
          value={value}
          onBlur={onBlur}
          className="flex flex-col space-y-3" // Increased space-y slightly for better click targets
        >
          {options.map((option, index) => (
            <div key={`${option.value}-${index}`} className="flex items-center space-x-3">
              <RadioGroupItem 
                value={option.value} 
                id={`radio-${name}-${option.value}`} 
                className={error ? "border-red-500" : ""}
              />
              <Label 
                htmlFor={`radio-${name}-${option.value}`} 
                className="font-normal cursor-pointer text-foreground leading-none"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>

        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      </Field>
    );
  }
);

RadioComp.displayName = "RadioComp";