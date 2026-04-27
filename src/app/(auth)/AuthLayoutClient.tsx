"use client";

import { usePathname } from "next/navigation";
import { NeonRunner } from "@/components/animation/NeonRunner";
import { useAppSelector } from "@/store/hooks";

interface AuthLayoutClientProps {
  children: React.ReactNode;
}

export function AuthLayoutClient({ children }: AuthLayoutClientProps) {
  const pathname = usePathname();
  const { status, error } = useAppSelector((state) => state.auth);

  const mode: "login" | "register" = pathname.includes("register")
    ? "register"
    : "login";

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-cosmos-950">
      {/* NeonRunner animation — your existing component, wired here */}
      <NeonRunner
        isTyping={status === "loading"}
        isSuccess={status === "succeeded"}
        isError={!!error || status === "failed"}
        mode={mode}
      />

      {/* Overlay gradient to ensure card readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(11,12,16,0.7) 100%)",
          zIndex: 1,
        }}
      />

      {/* Centered card area */}
      <div
        className="relative flex min-h-screen items-center justify-center p-4"
        style={{ zIndex: 2 }}
      >
        {children}
      </div>
    </div>
  );
}
