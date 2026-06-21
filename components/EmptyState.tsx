import type { LucideIcon } from "lucide-react";

export function EmptyState({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <div className="grid min-h-72 place-items-center rounded-lg border border-dashed border-neutral-300 bg-white p-8 text-center">
      <div>
        <div className="mx-auto grid h-11 w-11 place-items-center rounded-md bg-neutral-100">
          <Icon className="h-5 w-5 text-neutral-500" />
        </div>
        <h2 className="mt-4 text-lg font-semibold">{title}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-600">{description}</p>
      </div>
    </div>
  );
}
