"use client";

import { useEffect } from "react";
import { User, Lock, Palette, AlertTriangle, Bell, Key } from "lucide-react";
import { Tabs } from "@/components/ui/Tabs";
import { ProfileSettings } from "./ProfileSettings";
import { PasswordSettings } from "./PasswordSettings";
import { AppearanceSettings } from "./AppearanceSettings";
import { NotificationSettings } from "./NotificationSettings";
import { SecuritySettings } from "./SecuritySettings";
import { ApiKeysSettings } from "./ApiKeysSettings";
import { DangerZone } from "./DangerZone";
import { useAppDispatch } from "@/store/hooks";
import { setPageTitle, setBreadcrumbs } from "@/store/slices/uiSlice";

const TABS = [
    { value: "profile", label: "Profile", icon: <User size={14} /> },
    { value: "notifications", label: "Notifications", icon: <Bell size={14} /> },
    { value: "appearance", label: "Appearance", icon: <Palette size={14} /> },
    { value: "security", label: "Security", icon: <Lock size={14} /> },
    { value: "keys", label: "API Keys", icon: <Key size={14} /> },
    { value: "danger", label: "Danger", icon: <AlertTriangle size={14} /> },
] as const;

export function SettingsClient() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setPageTitle("Settings"));
        dispatch(setBreadcrumbs([
            { label: "Dashboard", href: "/dashboard" },
            { label: "Settings", href: null },
        ]));
    }, [dispatch]);

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-12">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Settings</h1>
                <p className="text-sm text-[var(--text-secondary)]">
                    Manage your organization preferences and security settings.
                </p>
            </div>

            <Tabs.Root defaultValue="profile">
                <div className="!mb-6">
                    <Tabs.List className="flex flex-wrap gap-1 border-b border-[var(--border-subtle)] pb-px">
                        {TABS.map((tab) => (
                            <Tabs.Trigger key={tab.value} value={tab.value} icon={tab.icon}>
                                {tab.label}
                            </Tabs.Trigger>
                        ))}
                    </Tabs.List>
                </div>

                <div className="animate-fade-in">
                    <Tabs.Content value="profile" className="flex flex-col gap-6">
                        <ProfileSettings />
                        <PasswordSettings />
                    </Tabs.Content>

                    <Tabs.Content value="notifications">
                        <NotificationSettings />
                    </Tabs.Content>

                    <Tabs.Content value="appearance">
                        <AppearanceSettings />
                    </Tabs.Content>

                    <Tabs.Content value="security">
                        <SecuritySettings />
                    </Tabs.Content>

                    <Tabs.Content value="keys">
                        <ApiKeysSettings />
                    </Tabs.Content>

                    <Tabs.Content value="danger">
                        <DangerZone />
                    </Tabs.Content>
                </div>
            </Tabs.Root>
        </div>
    );
}