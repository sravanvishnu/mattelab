import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-xl border-2 border-[#4C4541] bg-white px-3.5 py-2 text-sm text-[#4C4541] placeholder:text-[#4C4541]/50 shadow-[2px_2px_0_#4C4541] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C46A] disabled:cursor-not-allowed disabled:opacity-50 transition-all",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
