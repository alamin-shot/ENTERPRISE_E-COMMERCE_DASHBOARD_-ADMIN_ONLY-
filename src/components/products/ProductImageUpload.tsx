"use client";

import { useState } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ProductImageUploadProps {
    value?: string | null;
    onChange?: (url: string | null) => void;
}

export function ProductImageUpload({ value, onChange }: ProductImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        // In production: upload to Cloudinary/S3 and call onChange(url)
        // For mock: use a placeholder
        onChange?.("https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400");
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
                <div
                    onDrop={handleDrop}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onClick={() => onChange?.("https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400")}
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
            )}
        </div>
    );
}