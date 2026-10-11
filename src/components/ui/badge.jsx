import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-2 border-[#4C4541] bg-[#4C4541] text-[#FCF0DA] font-mono uppercase text-[10px] font-bold shadow-[1px_1px_0_#4C4541]",
        secondary: "border-2 border-[#4C4541] bg-[#AEAC78] text-[#4C4541] font-mono uppercase text-[10px] font-bold shadow-[1px_1px_0_#4C4541]",
        destructive: "border-2 border-[#4C4541] bg-red-600 text-white font-mono uppercase text-[10px] font-bold shadow-[1px_1px_0_#4C4541]",
        outline: "border-2 border-[#4C4541] bg-white text-[#4C4541] font-mono uppercase text-[10px] font-bold shadow-[1px_1px_0_#4C4541]",
        success: "border-2 border-[#4C4541] bg-[#F2C46A] text-[#4C4541] font-mono uppercase text-[10px] font-bold shadow-[1px_1px_0_#4C4541]",
        warning: "border-2 border-[#4C4541] bg-amber-400 text-[#4C4541] font-mono uppercase text-[10px] font-bold shadow-[1px_1px_0_#4C4541]",
        muted: "border-2 border-[#4C4541]/40 bg-white/60 text-[#4C4541]/80 font-mono uppercase text-[10px] font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
