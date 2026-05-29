"use client";

import * as React from "react";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import { UploadCloud, File as FileIcon, X, Ban } from "lucide-react"; // Added Ban icon

type ThemeColor = "sky" | "green" | "blue" | "purple" | "red";

interface FileUploadDnDProps extends Omit<DropzoneOptions, "onDrop" | "disabled"> {
    value?: File[];
    onFilesChange?: (files: File[]) => void;
    maxFiles?: number;
    accept?: Record<string, string[]>;
    maxSize?: number;
    className?: string;
    label?: string;
    themeColor?: ThemeColor;
    disabled?: boolean;
}

const themeMap: Record<ThemeColor, { border: string; bg: string; text: string }> = {
    sky: { border: "border-sky-500", bg: "bg-sky-50", text: "text-sky-500" },
    green: { border: "border-green-500", bg: "bg-green-50", text: "text-green-500" },
    blue: { border: "border-blue-500", bg: "bg-blue-50", text: "text-blue-500" },
    purple: { border: "border-purple-500", bg: "bg-purple-50", text: "text-purple-500" },
    red: { border: "border-red-500", bg: "bg-red-50", text: "text-red-500" },
};

export function FileUploadDnD({
    value = [],
    onFilesChange,
    maxFiles = 0,
    accept,
    maxSize,
    className,
    label,
    themeColor = "sky",
    disabled = false,
    ...dropzoneProps
}: FileUploadDnDProps) {
    const [files, setFiles] = React.useState<File[]>(value);

    React.useEffect(() => {
        setFiles(value);
    }, [value]);

    const activeTheme = themeMap[themeColor];

    // 1. Check if the strict limit is reached (Only applies if maxFiles > 1)
    const isLimitReached = maxFiles > 1 && files.length >= maxFiles;
    
    // 2. The dropzone is disabled if passed via props OR if the limit is reached
    const isDropzoneDisabled = disabled || isLimitReached;

    const onDrop = React.useCallback(
        (acceptedFiles: File[]) => {
            let newFiles = maxFiles === 1 ? acceptedFiles : [...files, ...acceptedFiles];
            
            if (maxFiles > 0 && maxFiles !== 1) {
                newFiles = newFiles.slice(0, maxFiles);
            }
            
            setFiles(newFiles);
            if (onFilesChange) {
                onFilesChange(newFiles);
            }
        },
        [maxFiles, onFilesChange, files]
    );

    const removeFile = (indexToRemove: number) => {
        const newFiles = files.filter((_, index) => index !== indexToRemove);
        setFiles(newFiles);
        if (onFilesChange) {
            onFilesChange(newFiles);
        }
    };

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        maxFiles,
        accept,
        maxSize,
        disabled: isDropzoneDisabled, // 3. Pass the disabled state to react-dropzone
        ...dropzoneProps,
    });

    const formatBytes = (bytes: number, decimals = 2) => {
        if (!+bytes) return "0 Bytes";
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

    console.log('activeTheme' , activeTheme)
    return (
        <div className={`w-full ${className || ""}`}>
            {label && <label className="block text-sm font-medium text-foreground mb-2">{label}</label>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                
                <div
                    {...getRootProps()}
                    className={`relative flex flex-col items-center justify-center ${activeTheme.bg} w-full h-48 border-2 border-dotted rounded-lg transition-colors
                        ${isDropzoneDisabled 
                            ? "opacity-60 cursor-not-allowed border-muted-foreground/30 bg-muted/30" 
                            : `cursor-pointer ${isDragActive ? `${activeTheme.border} ${activeTheme.bg}` : "border-muted-foreground/30 hover:border-muted-foreground/50 bg-muted/20"}`
                        }
                        ${isDragReject ? "border-red-500 bg-red-50" : ""}
                    `}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                        {isLimitReached ? (
                            <>
                                <Ban className="w-10 h-10 mb-3 text-muted-foreground" />
                                <p className="mb-2 text-sm text-foreground font-semibold">
                                    Maximum limit reached
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Remove a file to upload more
                                </p>
                            </>
                        ) : (
                            <>
                                <UploadCloud className={`w-10 h-10 mb-3 ${isDragActive ? activeTheme.text : "text-muted-foreground"}`} />
                                <p className="mb-2 text-sm text-foreground">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {accept ? "Specific files allowed" : "SVG, PNG, JPG or PDF"}
                                    {maxSize && ` (Max ${formatBytes(maxSize)})`}
                                </p>
                            </>
                        )}
                    </div>
                </div>

                {/* RIGHT SIDE: Uploaded Files Details */}
                <div className="flex flex-col gap-3 h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {files.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-sm text-muted-foreground italic border rounded-lg bg-muted/10 border-dashed">
                            No files selected yet.
                        </div>
                    ) : (
                        files.map((file, index) => (
                            <div key={`${file.name}-${index}`} className="flex items-center justify-between p-3 bg-background border rounded-lg shadow-sm group">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className={`p-2 rounded-md shrink-0 ${activeTheme.bg} ${activeTheme.text}`}>
                                        <FileIcon className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                        <p className="text-sm font-medium truncate text-foreground">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFile(index);
                                    }}
                                    className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-md transition-colors shrink-0"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}