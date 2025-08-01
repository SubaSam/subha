import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Badge({ className, ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-transparent bg-black px-3 py-2 text-xs font-semibold text-white", 
        className
      )}
      {...props}
    />
  )
}
