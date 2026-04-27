import { redirect } from "next/navigation";
import { DEFAULT_UNAUTH_REDIRECT } from "@/lib/constants/routes";


export default function RootPage() {
  redirect(DEFAULT_UNAUTH_REDIRECT);
}