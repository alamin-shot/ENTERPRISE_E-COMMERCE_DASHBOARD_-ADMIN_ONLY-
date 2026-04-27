import type { Metadata } from "next";
import { UserDetailClient } from "@/components/users/UserDetailClient";

export const metadata: Metadata = { title: "User Detail" };

interface Props { params: Promise<{ id: string }> }

export default async function UserDetailPage({ params }: Props) {
    const { id } = await params;
    return <UserDetailClient id={id} />;
}