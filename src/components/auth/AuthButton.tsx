import { cn } from "@/lib/utils/cn";
import { Loader2 } from "lucide-react";
import { Button } from "../ui";

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    children: React.ReactNode;
}

export function AuthButton({
    isLoading,
    children,
    className,
    disabled,
    ...props
}: AuthButtonProps) {
    return (
        <Button
            disabled={disabled ?? isLoading}
            className={cn(
                "w-full flex items-center justify-center gap-2",
                "rounded-lg px-4 py-3 text-sm font-semibold",
                "bg-amber-400 text-cosmos-950 hover:bg-amber-300",
                "active:scale-[0.98] transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50",
                "disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100",
                "glow-amber",
                className,
            )}
            {...props}
        >
            {isLoading && <Loader2 size={15} className="animate-spin" />}
            {children}
        </Button>
    );
}