import { Button } from "@/components/ui/button";
import { cn } from "@/utils";
import { useEffect } from "react";
import { toast } from "sonner";
import { useAppReload, useAppUpdateAvailable } from "@/components/app-life-cycle/provider";

interface Props {
  className?: string;
  cancel?: () => void;
  visible?: boolean;
}

export function UpdateAvailable({ cancel, className, visible, ...rest }: Props) {
  const reload = useAppReload();
  const updateAvailable = useAppUpdateAvailable();

  const shouldShow = visible ?? updateAvailable;

  if (!shouldShow) return null;

  return (
    <div
      className={cn(
        "flex min-h-[40px] items-center justify-between py-1 px-4 border border-border rounded bg-background",
        className,
      )}
    >
      <div className="flex items-center space-x-1.5 pr-1">
        <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full" />
        <div>App Ready to update.</div>
      </div>
      <div className="flex items-center">
        <Button variant={"ghost"} size="sm" onClick={() => reload()}>
          Update
        </Button>
        {cancel && (
          <Button variant={"ghost"} size="sm" onClick={() => cancel()}>
            Not Now
          </Button>
        )}
      </div>
    </div>
  );
}

export function UpdateAvailableTips({
  cancel,
  className,
  force,
}: {
  force?: boolean;
  className?: string;
  cancel?: () => void;
}) {
  const visible = useAppUpdateAvailable() || force;

  useEffect(() => {
    if (visible) {
      toast.custom(
        (id) => (
          <UpdateAvailable
            cancel={() => {
              toast.dismiss(id);
              cancel?.();
            }}
            visible
          />
        ),
        {
          className: cn("w-[356px]", className),
          duration: Infinity,
        },
      );
    }
  }, [visible, className, cancel]);

  return null;
}
