"use client"

import * as React from "react"
import { forwardRef, useState } from "react";
import { X, ChevronsUpDown, Check } from "lucide-react";

import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldDescription
} from "../ui/field"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../ui/popover"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "../ui/command"

export interface SelectOption {
    label: string;
    value: string;
}

export const SelectComp = forwardRef<
    HTMLButtonElement,
    {
        label?: string;
        description?: string;
        placeholder?: string;
        required?: boolean;
        error?: string;
        name?: string;
        options: SelectOption[];
        value?: string;
        onChange?: (value: string) => void;
        onBlur?: React.FocusEventHandler<HTMLButtonElement>;
        disabled?: boolean;
    }
>(({
    label,
    description,
    placeholder = "Select an option",
    required,
    error,
    options = [],
    value,
    onChange,
    onBlur,
    disabled,
    ...rest
}, ref) => {
    const [open, setOpen] = useState(false);

    const selectedLabel = value
        ? options.find((opt) => opt.value === value)?.label
        : placeholder;

    const handleClear = (e: React.PointerEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        e.preventDefault();
        if (onChange) {
            onChange("");
        }
        setOpen(false);
    };

    return (
        <FieldGroup className="w-full">
            <Field>
                {label && (
                    <FieldLabel>
                        {label} {required && <span className="text-red-500">*</span>}
                    </FieldLabel>
                )}

                <div className="relative w-full">
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <button
                                ref={ref}
                                type="button"
                                disabled={disabled}
                                onBlur={onBlur}
                                aria-invalid={!!error}
                                aria-expanded={open}
                                className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${!value ? "text-muted-foreground" : ""
                                    } ${error ? "border-red-500 focus:ring-red-500" : ""}`}
                                {...rest}
                            >
                                <span className="truncate pr-6">{selectedLabel}</span>

                                {!value && (
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                )}
                            </button>
                        </PopoverTrigger>

                        {value && !disabled && (
                            <button
                                type="button"
                                onPointerDown={handleClear}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 p-1 z-10 transition-colors bg-background"
                                aria-label="Clear selection"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}

                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 z-[9999] bg-white">
                            <Command>
                                <CommandInput placeholder={`Search ${label?.toLowerCase() || 'options'}...`} />
                                <CommandList>
                                    <CommandEmpty>No option found.</CommandEmpty>
                                    <CommandGroup>
                                        {options.map((option) => (
                                            <CommandItem
                                                key={option.value}
                                                value={option.label}
                                                onSelect={() => {
                                                    if (onChange) onChange(option.value);
                                                    setOpen(false);
                                                }}
                                                className="cursor-pointer hover:bg-gray-200"
                                            >
                                                <Check
                                                    className={`mr-2 h-4 w-4 ${value === option.value ? "opacity-100" : "opacity-0"
                                                        }`}
                                                />
                                                {option.label}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>

                {description && <FieldDescription>{description}</FieldDescription>}

                {error && <p className="text-xs text-red-500">{error}</p>}
            </Field>
        </FieldGroup>
    )
});

SelectComp.displayName = "SelectComp";