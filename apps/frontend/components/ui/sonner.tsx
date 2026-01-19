"use client"

import { CircleCheckIcon, InfoIcon, Loader2Icon, TriangleAlertIcon } from "lucide-react"
import { TiDelete } from "react-icons/ti"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="bottom-center"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "w-80 px-2.5 py-3 bg-background-secondary rounded shadow-[0px_0px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-border",
          title: "flex-1 text-text-primary text-sm font-normal leading-6",
          description: "hidden",
          icon: "relative overflow-hidden shrink-0",
        },
      }}
      icons={{
        success: <CircleCheckIcon />,
        info: <InfoIcon />,
        warning: <TriangleAlertIcon />,
        error: <TiDelete className="text-icon-error size-5" />,
        loading: <Loader2Icon />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
