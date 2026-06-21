import Link from "next/link";
import { Plug } from "lucide-react";

export function ConnectAccountButton({ provider, href, label }: { provider: string; href: string; label: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 rounded-md bg-neutral-950 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-neutral-800">
      <Plug className="h-4 w-4" />
      <span>{label}</span>
      <span className="sr-only">for {provider}</span>
    </Link>
  );
}
