"use client";

import { useState } from "react";
import { Bell, Mail, MessageSquare, Smartphone } from "lucide-react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface ToggleRowProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    checked: boolean;
    onChange: (val: boolean) => void;
}

function ToggleRow({ icon, title, description, checked, onChange }: ToggleRowProps) {
    return (
        <div className="flex items-center justify-between py-2">
            <div className="flex gap-4 items-start">
                <div className="mt-1 text-[var(--text-tertiary)]">{icon}</div>
                <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{title}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{description}</p>
                </div>
            </div>
            <button
                type="button"
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-amber-400' : 'bg-[var(--bg-tertiary)]'}`}
            >
                <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-4' : 'translate-x-0'}`}
                />
            </button>
        </div>
    );
}

export function NotificationSettings() {
    const [settings, setSettings] = useState({
        email: true,
        push: false,
        sms: true,
        marketing: false,
    });

    const update = (key: keyof typeof settings, val: boolean) => {
        setSettings(prev => ({ ...prev, [key]: val }));
    };

    return (
        <Card>
            <CardHeader title="Notifications" description="Choose how you want to be notified" />
            <CardBody className="flex flex-col gap-4">
                <ToggleRow
                    icon={<Mail size={16} />}
                    title="Email Notifications"
                    description="Receive emails about your account activity and orders."
                    checked={settings.email}
                    onChange={(v) => update("email", v)}
                />
                <div className="h-px bg-[var(--border-subtle)]" />
                <ToggleRow
                    icon={<Smartphone size={16} />}
                    title="Push Notifications"
                    description="Get real-time updates on your mobile device."
                    checked={settings.push}
                    onChange={(v) => update("push", v)}
                />
                <div className="h-px bg-[var(--border-subtle)]" />
                <ToggleRow
                    icon={<MessageSquare size={16} />}
                    title="SMS Notifications"
                    description="Receive text messages for critical alerts."
                    checked={settings.sms}
                    onChange={(v) => update("sms", v)}
                />
                <div className="h-px bg-[var(--border-subtle)]" />
                <ToggleRow
                    icon={<Bell size={16} />}
                    title="Marketing Updates"
                    description="News, feature updates and promotional offers."
                    checked={settings.marketing}
                    onChange={(v) => update("marketing", v)}
                />
                
                <div className="mt-4 flex justify-end">
                    <Button variant="primary">Save Preferences</Button>
                </div>
            </CardBody>
        </Card>
    );
}
