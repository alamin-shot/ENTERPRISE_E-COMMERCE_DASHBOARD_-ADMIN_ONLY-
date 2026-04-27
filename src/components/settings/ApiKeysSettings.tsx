"use client";

import { useState } from "react";
import { Key, Copy, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

interface ApiKey {
    id: string;
    name: string;
    key: string;
    lastUsed: string;
}

const INITIAL_KEYS: ApiKey[] = [
    { id: "1", name: "Production Web Store", key: "pk_live_51P8yX2LzQv8A9B0C1D2E3F4G5H6I7J8K9", lastUsed: "2 mins ago" },
    { id: "2", name: "Development Testing", key: "pk_test_51P8yX2LzQv8A9B0C1D2E3F4G5H6I7J8K9", lastUsed: "Never" },
];

export function ApiKeysSettings() {
    const [keys, setKeys] = useState<ApiKey[]>(INITIAL_KEYS);
    const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

    const toggleVisibility = (id: string) => {
        const next = new Set(visibleKeys);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setVisibleKeys(next);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("API Key copied to clipboard");
    };

    const deleteKey = (id: string) => {
        if (!confirm("Are you sure you want to delete this API Key?")) return;
        setKeys(keys.filter(k => k.id !== id));
        toast.success("API Key deleted");
    };

    const createKey = () => {
        const name = prompt("Enter a name for your new API Key:");
        if (!name) return;
        const newKey: ApiKey = {
            id: Date.now().toString(),
            name,
            key: `pk_live_${Math.random().toString(36).substring(2, 15)}`,
            lastUsed: "Never",
        };
        setKeys([newKey, ...keys]);
        toast.success("API Key created");
    };

    return (
        <Card>
            <CardHeader 
                title="API Keys" 
                description="Manage your keys for external integrations" 
                action={
                    <Button size="sm" leftIcon={<Plus size={14} />} onClick={createKey}>
                        Create Key
                    </Button>
                }
            />
            <CardBody className="flex flex-col gap-4">
                {keys.map((k) => (
                    <div key={k.id} className="group relative rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <p className="text-sm font-semibold text-[var(--text-primary)]">{k.name}</p>
                                <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider">
                                    Last used: {k.lastUsed}
                                </p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => deleteKey(k.id)} className="opacity-0 group-hover:opacity-100 text-danger-400">
                                <Trash2 size={13} />
                            </Button>
                        </div>
                        
                        <div className="flex items-center gap-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] px-3 py-2">
                            <Key size={14} className="text-amber-400" />
                            <code className="flex-1 text-xs font-mono text-[var(--text-secondary)] truncate">
                                {visibleKeys.has(k.id) ? k.key : k.key.replace(/./g, "*").substring(0, 32)}
                            </code>
                            <div className="flex items-center gap-1">
                                <button onClick={() => toggleVisibility(k.id)} className="p-1 hover:text-amber-400 transition-colors">
                                    {visibleKeys.has(k.id) ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                                <button onClick={() => copyToClipboard(k.key)} className="p-1 hover:text-amber-400 transition-colors">
                                    <Copy size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {keys.length === 0 && (
                    <div className="py-8 text-center border-2 border-dashed border-[var(--border-subtle)] rounded-xl">
                        <p className="text-sm text-[var(--text-tertiary)]">No API keys found.</p>
                    </div>
                )}
            </CardBody>
        </Card>
    );
}
