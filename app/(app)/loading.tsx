import { LoadingState } from "@/components/LoadingState";

export default function Loading() {
  return (
    <div className="grid min-h-96 place-items-center rounded-lg border border-neutral-200 bg-white">
      <LoadingState />
    </div>
  );
}
