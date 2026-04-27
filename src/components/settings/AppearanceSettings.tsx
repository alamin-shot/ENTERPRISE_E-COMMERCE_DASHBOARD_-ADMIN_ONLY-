"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Monitor, PanelLeft, List } from "lucide-react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSidebarCollapsed } from "@/store/slices/uiSlice";
import { cn } from "@/lib/utils/cn";

interface OptionButtonProps {
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}

function OptionButton({ icon, label, isActive, onClick }: OptionButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "flex flex-col items-center gap-2 rounded-xl border p-4",
                "text-sm font-medium transition-all duration-150 cursor-pointer",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50",
                isActive
                    ? "border-amber-400/50 bg-amber-400/10 text-amber-400"
                    : "border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:border-[var(--border-default)] hover:text-[var(--text-primary)]",
            )}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
}

export function AppearanceSettings() {
    const { theme, setTheme } = useTheme();
    const dispatch = useAppDispatch();
    const isCollapsed = useAppSelector((s) => s.ui.sidebarCollapsed);

    const themes = [
        { value: "light", label: "Light", icon: <Sun size={20} /> },
        { value: "dark", label: "Dark", icon: <Moon size={20} /> },
        { value: "system", label: "System", icon: <Monitor size={20} /> },
    ] as const;

    const sidebarOptions = [
        { value: false, label: "Expanded", icon: <PanelLeft size={20} /> },
        { value: true, label: "Collapsed", icon: <List size={20} /> },
    ];

    return (
        <Card>
            <CardHeader title="Appearance" description="Customize the look and feel" />
            <CardBody className="flex flex-col gap-6">

                {/* Theme */}
                <div>
                    <p className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-3">
                        Color Theme
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                        {themes.map((t) => (
                            <OptionButton
                                key={t.value}
                                icon={t.icon}
                                label={t.label}
                                isActive={theme === t.value}
                                onClick={() => setTheme(t.value)}
                            />
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <div>
                    <p className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-3">
                        Sidebar Default
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        {sidebarOptions.map((opt) => (
                            <OptionButton
                                key={String(opt.value)}
                                icon={opt.icon}
                                label={opt.label}
                                isActive={isCollapsed === opt.value}
                                onClick={() => dispatch(setSidebarCollapsed(opt.value))}
                            />
                        ))}
                    </div>
                </div>

                {/* Info */}
                <p className="text-xs text-[var(--text-tertiary)] border-t border-[var(--border-subtle)] pt-4">
                    Theme preference is saved to your browser. Sidebar preference is saved per session.
                </p>
            </CardBody>
        </Card>
    );
}