import { forwardRef } from "react";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";

export const NumberInputComp = forwardRef
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
                    <InputGroupInput
                        id={`input-${label}`}
                        type={type}
                        placeholder={placeholder}
                        ref={ref}
                        className={"[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none appearance-none"}
                        onKeyDown={
                            type === "number" && maxLength
                                ? (e) => {
                                    const currentLength = (e.target as HTMLInputElement).value.length;
                                    const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
                                    if (currentLength >= maxLength && !allowedKeys.includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }
                                : undefined
                        }
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

NumberInputComp.displayName = "NumberInputComp";