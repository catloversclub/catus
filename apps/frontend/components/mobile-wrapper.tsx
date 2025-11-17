import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface MobileWrapperProps {
  children: ReactNode
  className?: string
}

export function MobileWrapper({ children, className = "" }: MobileWrapperProps) {
  return (
    <div className="bg-background min-h-screen">
      {/* Mobile container with fixed width */}
      <div className="bg-background mx-auto min-h-screen max-w-[360px]">
        <div className={cn("min-h-screen w-full", className)}>{children}</div>
      </div>
    </div>
  )
}
