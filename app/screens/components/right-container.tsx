import React from "react";

export function RightContainer({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex-1">
      <div className="h-full flex flex-col bg-secondary">{children}</div>
    </div>
  );
}
