import * as React from "react";
import { cn } from "@/lib/utils";

export function Alert({ className, ...props }) {
  return (
    <div
      role="alert"
      className={cn(
        "relative w-full rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700",
        className
      )}
      {...props}
    />
  );
}
