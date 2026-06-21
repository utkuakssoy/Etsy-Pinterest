import { Sidebar } from "@/components/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-neutral-100">
      <Sidebar />
      <main className="min-h-screen md:pl-64">
        <div className="sticky top-0 z-20 flex h-14 items-center border-b border-neutral-900 bg-black/90 px-4 backdrop-blur md:px-6">
          <div className="text-sm font-semibold text-neutral-100">PinPilot</div>
        </div>
        <div className="px-4 py-4 md:px-6">{children}</div>
      </main>
    </div>
  );
}
