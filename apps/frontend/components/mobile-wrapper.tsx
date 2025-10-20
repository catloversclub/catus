import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface MobileWrapperProps {
  children: ReactNode
  className?: string
}

export function MobileWrapper({ children, className = "" }: MobileWrapperProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile container with fixed width */}
      <div className="mx-auto max-w-[360px] min-h-screen bg-background">
        <div className={cn("w-full min-h-screen", className)}>{children}</div>
      </div>
    </div>
  )
}
