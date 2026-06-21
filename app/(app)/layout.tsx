import { Sidebar } from "@/components/Sidebar";
import { DemoModeBadge } from "@/components/DemoModeBadge";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7f7f5] text-neutral-950">
      <Sidebar />
      <main className="min-h-screen px-4 py-4 md:pl-72 md:pr-6">
        <div className="mb-4 flex justify-end">
          <DemoModeBadge />
        </div>
        {children}
      </main>
    </div>
  );
}
