import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[#c26e47] text-white shadow hover:bg-[#b05f3b]",
        secondary: "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700",
        destructive: "border-transparent bg-red-600 text-white shadow hover:bg-red-700",
        outline: "text-slate-300 border-slate-700",
        success: "border-[#c26e47]/30 bg-[#c26e47]/15 text-[#e28743]",
        warning: "border-amber-500/30 bg-amber-500/15 text-amber-400",
        muted: "border-slate-800 bg-slate-800/60 text-slate-400",
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
