"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils/cn";
import toast from "react-hot-toast";

interface DangerActionProps {
    title: string;
    description: string;
    buttonLabel: string;
    onConfirm: () => void;
    isLoading?: boolean;
}

function DangerAction({ title, description, buttonLabel, onConfirm, isLoading }: DangerActionProps) {
    return (
        <div className="flex items-center justify-between gap-4 py-4 border-b border-danger-500/10 last:border-0">
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)]">{title}</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{description}</p>
            </div>
            <Button
                variant="danger"
                size="sm"
                onClick={onConfirm}
                isLoading={isLoading}
                className="shrink-0"
            >
                {buttonLabel}
            </Button>
        </div>
    );
}

export function DangerZone() {
    const { handleLogout } = useAuth();
    const [isDeactivating, setIsDeactivating] = useState(false);

    const handleLogoutAll = () => {
        toast.success("All sessions have been terminated");
        handleLogout();
    };

    const handleDeactivate = async () => {
        const confirmed = window.confirm(
            "Are you sure? This will deactivate your account. Contact your administrator to restore access.",
        );
        if (!confirmed) return;
        setIsDeactivating(true);
        await new Promise((r) => setTimeout(r, 1000));
        toast.error("Account deactivated");
        handleLogout();
        setIsDeactivating(false);
    };

    return (
        <Card className={cn("border-danger-500/20")}>
            <CardHeader
                title="Danger Zone"
                description="Irreversible and destructive actions"
            />
            <CardBody noPadding>
                <div className="px-6">
                    {/* Warning banner */}
                    <div className="flex !mt-2  items-start gap-3 rounded-lg border border-danger-500/20 bg-danger-500/5 p-3">
                        <AlertTriangle size={15} className="text-danger-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-danger-400">
                            Actions in this section are permanent and cannot be undone.
                            Please proceed with caution.
                        </p>
                    </div>

                    <DangerAction
                        title="Sign Out All Devices"
                        description="Terminate all active sessions across all devices."
                        buttonLabel="Sign Out All"
                        onConfirm={handleLogoutAll}
                    />

                    <DangerAction
                        title="Deactivate Account"
                        description="Temporarily disable your account. An administrator can restore it."
                        buttonLabel="Deactivate"
                        onConfirm={handleDeactivate}
                        isLoading={isDeactivating}
                    />
                </div>
            </CardBody>
        </Card>
    );
}