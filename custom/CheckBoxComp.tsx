"use client"

import * as React from "react";
import { Checkbox } from "../ui/checkbox";
import { FieldDescription, FieldLabel } from "../ui/field";

export const CheckBoxComp = React.forwardRef<
    HTMLButtonElement,
    {
        label: string;
        description?: string;
        required?: boolean;
        error?: string;
        name?: string;
        value?: boolean;
        onChange?: (checked: boolean) => void;
        onBlur?: () => void;
    }
>(
    ({ label, description, required, error, name, value, onChange, onBlur }, ref) => {
        return (
            <div className="flex flex-row gap-3 mt-5">
                <Checkbox
                    id={`checkbox-${name}`}
                    ref={ref}
                    checked={value}
                    onCheckedChange={onChange}
                    onBlur={onBlur}
                    className={`mt-1 shrink-0 ${error ? "border-red-500" : ""}`}
                />

                <div className="space-y-1 leading-normal">
                    <FieldLabel
                        htmlFor={`checkbox-${name}`}
                        className={`font-medium block ${error ? "text-red-500" : "text-foreground"}`}
                    >
                        {label}
                    </FieldLabel>

                    {description && (
                        <FieldDescription className="text-sm text-muted-foreground">
                            {description}
                        </FieldDescription>
                    )}

                    {error && (
                        <p className="text-xs text-red-500">
                            {error}
                        </p>
                    )}
                </div>
            </div>
        );
    }
);

CheckBoxComp.displayName = "CheckBoxComp";