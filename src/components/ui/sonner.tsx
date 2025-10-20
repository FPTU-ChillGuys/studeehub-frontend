"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      richColors
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        style: {
          border: "1px solid",
        },
        classNames: {
          error: "!bg-red-500 !text-white !border-red-600",
          success: "!bg-green-500 !text-white !border-green-600",
          warning: "!bg-yellow-500 !text-white !border-yellow-600",
          info: "!bg-blue-500 !text-white !border-blue-600",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
