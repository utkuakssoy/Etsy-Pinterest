import { FlaskConical } from "lucide-react";
import { demoMode } from "@/lib/env";

export function DemoModeBadge() {
  if (!demoMode) {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
      <FlaskConical className="h-3.5 w-3.5" />
      Local Mode
    </div>
  );
}
