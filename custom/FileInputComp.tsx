"use client";

import * as React from "react";
import { Paperclip } from "lucide-react";
import { Button } from "../ui/button";
import { Field, FieldLabel, FieldDescription } from "../ui/field";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { FileUploadDnD } from "./FileUploadDnD";

export const FileInputComp = React.forwardRef<
    HTMLButtonElement,
    {
        label: string;
        description?: string;
        placeholder?: string;
        required?: boolean;
        error?: string;
        value?: File[];
        onChange?: (files: File[]) => void;
        maxFiles?: number;
        themeColor?: any;
        accept?: any;
    }
>(
    (
        {
            label,
            description,
            placeholder,
            required,
            error,
            value = [],
            onChange,
            maxFiles,
            themeColor,
            accept,
        },
        ref
    ) => {
        const [open, setOpen] = React.useState(false);

        // Determine what text to show on the main form button
        const getDisplayText = () => {
            if (!value || value.length === 0) return placeholder || `Select ${label}...`;
            if (value.length === 1) return value[0].name; // Show file name if only 1
            return `${value.length} files selected`; // Show count if multiple
        };

        return (
            <Field>
                <FieldLabel>
                    {label} {required && <span className="text-red-500">*</span>}
                </FieldLabel>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        {/* This Button looks exactly like a standard text input! */}
                        <Button
                            ref={ref}
                            type="button"
                            variant="outline"
                            className={`w-full justify-start text-left font-normal border ${
                                !value?.length ? "text-muted-foreground" : "text-foreground"
                            } ${error ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                        >
                            <Paperclip className="mr-2 h-4 w-4 opacity-50" />
                            <span className="truncate">{getDisplayText()}</span>
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-3xl">
                        <DialogHeader>
                            <DialogTitle>Upload {label}</DialogTitle>
                        </DialogHeader>

                        <div className="py-4">
                            <FileUploadDnD
                                value={value}
                                onFilesChange={(newFiles) => {
                                    if (onChange) onChange(newFiles);
                                    
                                    if (maxFiles === 1 && newFiles.length > 0) {
                                        setOpen(false);
                                    }
                                }}
                                maxFiles={maxFiles}
                                themeColor={themeColor}
                                accept={accept}
                                label="" 
                            />
                        </div>

                        <div className="flex justify-end mt-2">
                            <Button type="button" onClick={() => setOpen(false)}>
                                Done
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {description && <FieldDescription>{description}</FieldDescription>}
                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </Field>
        );
    }
);

FileInputComp.displayName = "FileInputComp";