import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const chipVariants = cva(
  "inline-flex text-sm items-center justify-center gap-2 whitespace-nowrap rounded text-base font-semibold transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-chips-background text-chips-foreground hover:bg-chips-pressed hover:text-chips-pressed-foreground",
        selected: "bg-chips-selected text-chips-selected-foreground hover:bg-primary-pressed",
      },
      size: {
        default: "p-3 font-semibold",
        sm: "px-[10px] py-1 text-xs font-normal",
        lg: "p-3 font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof chipVariants> {}

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => {
    return (
      <button
        type={type}
        className={cn(chipVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Chip.displayName = "Chip"

export { Chip, chipVariants }
