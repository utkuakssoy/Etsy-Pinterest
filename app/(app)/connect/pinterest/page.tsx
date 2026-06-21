import { PinterestConnectCard } from "@/components/PinterestConnectCard";

export default async function ConnectPinterestPage({
  searchParams
}: {
  searchParams: Promise<{ connected?: string; error?: string }>;
}) {
  const { connected, error } = await searchParams;

  return <PinterestConnectCard connected={connected === "1"} error={error} />;
}
