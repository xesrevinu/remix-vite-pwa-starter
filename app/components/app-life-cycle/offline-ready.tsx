import { cn } from "@/utils";
import { useAppOfflineReady } from "@/components/app-life-cycle/provider";

interface Props {
  className?: string;
  visible?: boolean;
}

export function OfflineReady({ className, visible }: Props) {
  const offlineReady = useAppOfflineReady();
  const shouldShow = visible ?? offlineReady;

  if (!shouldShow) return null;

  return (
    <div className={cn("flex min-h-[40px] items-center py-1 space-x-1", className)}>
      <div className="w-2.5 h-2.5 bg-green-600 rounded-full"></div>
      <div>Ready to work offline</div>
    </div>
  );
}
