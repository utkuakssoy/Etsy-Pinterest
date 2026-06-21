import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";
import { DemoModeBadge } from "@/components/DemoModeBadge";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f7f5] px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-lg font-semibold">PinPilot</Link>
          <DemoModeBadge />
        </div>
        <AuthForm />
      </div>
    </main>
  );
}
