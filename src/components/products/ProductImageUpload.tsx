"use client";

import { useState, useRef } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ProductImageUploadProps {
    value?: string | null;
    onChange?: (url: string | null) => void;
}

export function ProductImageUpload({ value, onChange }: ProductImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const processFile = (file: File) => {
        if (!file.type.startsWith("image/")) return;
        if (file.size > 5 * 1024 * 1024) return; // 5MB limit
        
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                onChange?.(e.target.result as string);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                Product Image
            </label>

            {value ? (
                <div className="relative w-full h-40 rounded-xl overflow-hidden border border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={value} alt="Product" className="w-full h-full object-cover" />
                    <button
                        type="button"
                        onClick={() => onChange?.(null)}
                        className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--bg-elevated)]/80 text-[var(--text-secondary)] hover:text-danger-400 transition-colors"
                    >
                        <X size={13} />
                    </button>
                </div>
            ) : (
                <>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={handleFileSelect}
                    />
                    <div
                        onDrop={handleDrop}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onClick={() => fileInputRef.current?.click()}
                    className={cn(
                        "flex flex-col items-center justify-center gap-2",
                        "w-full h-40 rounded-xl border-2 border-dashed cursor-pointer",
                        "transition-all duration-150",
                        isDragging
                            ? "border-amber-400/60 bg-amber-400/5"
                            : "border-[var(--border-subtle)] hover:border-amber-400/30 hover:bg-[var(--bg-tertiary)]/20",
                    )}
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--bg-secondary)]">
                        {isDragging ? <Upload size={18} className="text-amber-400" /> : <ImageIcon size={18} className="text-[var(--text-tertiary)]" />}
                    </div>
                    <p className="text-xs text-[var(--text-tertiary)]">
                        {isDragging ? "Drop to upload" : "Click or drag to upload"}
                    </p>
                    <p className="text-[10px] text-[var(--text-tertiary)] opacity-60">PNG, JPG up to 5MB</p>
                </div>
                </>
            )}
        </div>
    );
}