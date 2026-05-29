import { forwardRef, useState } from "react";
import DynamicIcon from "../shared/DynamicIcon";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";

export const MaskedInputComp = forwardRef
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
            maxLength?: number;
            minLength?: number;
            mask?: number;
            space?: number;
            maskedValue?: string
            onChange?: React.ChangeEventHandler<HTMLInputElement>;
            onBlur?: React.FocusEventHandler<HTMLInputElement>;
        }
    >(({ label, description, type, placeholder, required, icon, prefix, postfix, maxLength, minLength, maskedValue, mask, space, error, onChange, ...rest }, ref) => {

        const [actualValue, setActualValue] = useState("");
        const [displayValue, setDisplayValue] = useState("");

        const getMaskedDisplay = (value: string, maskedValue?: string) => {
            const masked = value
                .split("")
                .map((char, index) => (index < (mask ?? 0) ? maskedValue ? maskedValue : "." : char))
                .join("");

            if (!space) return masked;

            return masked
                .split("")
                .reduce((acc, char, index) => {
                    return index > 0 && index % space === 0 ? acc + " " + char : acc + char;
                }, "");
        };
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const rawInput = e.target.value;

            const maskChar = maskedValue ?? ".";
            const escapedMaskChar = maskChar.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

            const rawInputStripped = rawInput.replace(/\s/g, "");
            const prevDisplayStripped = displayValue.replace(/\s/g, "");

            let updatedActual: string;

            if (rawInputStripped.length < prevDisplayStripped.length) {
                const charsRemoved = prevDisplayStripped.length - rawInputStripped.length;
                updatedActual = actualValue.slice(0, actualValue.length - charsRemoved);
            } else {
                const realCharsInInput = rawInputStripped.replace(
                    new RegExp(escapedMaskChar, "g"),
                    ""
                );
                const realCharsInDisplay = prevDisplayStripped.replace(
                    new RegExp(escapedMaskChar, "g"),
                    ""
                );
                const newChars = realCharsInInput.slice(realCharsInDisplay.length);
                updatedActual = actualValue + newChars;
            }

            if (maxLength && updatedActual.length > maxLength) return;

            const masked = getMaskedDisplay(updatedActual, maskedValue);

            setActualValue(updatedActual.replace(/[^0-9]/g, ""));
            setDisplayValue(masked);

            e.target.value = updatedActual;
            onChange?.(e);
        };
        const totalSpaces = space ? Math.floor((maxLength ?? 0) / space) : 0;
        const displayMaxLength = (maxLength ?? 0) + totalSpaces;

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
                        type={'text'}
                        placeholder={placeholder}
                        ref={ref}
                        maxLength={displayMaxLength}
                        minLength={minLength}
                        value={displayValue}
                        onChange={handleChange}
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

MaskedInputComp.displayName = "MaskedInputComp";