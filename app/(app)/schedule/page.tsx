import { ScheduleList } from "@/components/ScheduleList";
import { getPinterestPinDrafts } from "@/services/pinterest";

export default async function SchedulePage() {
  const drafts = await getPinterestPinDrafts();

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-neutral-500">Schedule</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Scheduled pins</h1>
      </header>
      <ScheduleList initialDrafts={drafts} />
    </div>
  );
}
