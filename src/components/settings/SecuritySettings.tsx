"use client";

import { Shield, Key, Smartphone } from "lucide-react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function SecuritySettings() {
    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader title="Security" description="Manage your account security settings" />
                <CardBody className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div className="flex gap-4">
                            <div className="p-2 rounded-lg bg-success-500/10 text-success-500">
                                <Shield size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-[var(--text-primary)]">Two-Factor Authentication</p>
                                <p className="text-xs text-success-500 font-medium">Enabled — Protecting your account</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm">Manage</Button>
                    </div>

                    <div className="h-px bg-[var(--border-subtle)]" />

                    <div className="flex items-center justify-between">
                        <div className="flex gap-4">
                            <div className="p-2 rounded-lg bg-info-500/10 text-info-500">
                                <Smartphone size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-[var(--text-primary)]">Trusted Devices</p>
                                <p className="text-xs text-[var(--text-secondary)]">2 devices currently authorized</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm">View All</Button>
                    </div>

                    <div className="h-px bg-[var(--border-subtle)]" />

                    <div className="flex items-center justify-between">
                        <div className="flex gap-4">
                            <div className="p-2 rounded-lg bg-amber-400/10 text-amber-400">
                                <Key size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-[var(--text-primary)]">Password Recovery</p>
                                <p className="text-xs text-[var(--text-secondary)]">Last changed 3 months ago</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm">Update</Button>
                    </div>
                </CardBody>
            </Card>

            <Card className="border-danger-500/20">
                <CardHeader title="Active Sessions" description="Devices currently logged into your account" />
                <CardBody className="flex flex-col gap-4">
                    <div className="flex items-center justify-between text-sm">
                        <div>
                            <p className="font-medium text-[var(--text-primary)]">MacBook Pro — Chrome</p>
                            <p className="text-xs text-success-500">Current Session</p>
                        </div>
                        <span className="text-xs text-[var(--text-tertiary)] font-mono">192.168.1.1</span>
                    </div>
                    <div className="h-px bg-[var(--border-subtle)]" />
                    <div className="flex items-center justify-between text-sm">
                        <div>
                            <p className="font-medium text-[var(--text-primary)]">iPhone 15 Pro — Safari</p>
                            <p className="text-xs text-[var(--text-secondary)]">Last active: 2 hours ago</p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-danger-400">Revoke</Button>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
