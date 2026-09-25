import { redirect } from "next/navigation";

export default function Home() {
  // Automatically redirect entry traffic to /dashboard
  redirect("/dashboard");
}
