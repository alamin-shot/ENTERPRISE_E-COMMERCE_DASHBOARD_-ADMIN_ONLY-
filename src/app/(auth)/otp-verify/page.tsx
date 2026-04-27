import type { Metadata } from "next";
import { OtpForm } from "@/components/auth/OtpForm";

export const metadata: Metadata = { title: "Verify OTP" };

export default function OtpVerifyPage() {
    return <OtpForm />;
}