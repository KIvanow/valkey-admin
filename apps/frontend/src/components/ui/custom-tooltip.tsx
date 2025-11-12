import React from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@radix-ui/react-tooltip"

interface CustomTooltipProps {
  children: React.ReactNode;
  content?: string;
  description?: string;
}

export function CustomTooltip({ children, content, description }: CustomTooltipProps) {
  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      {content &&
        <TooltipContent
          align="center"
          className={"bg-tw-primary text-white px-2 py-1 mt-1 rounded text-xs font-light z-10"}
          side="bottom"
        >
          <p>{content}</p>
        </TooltipContent>
      }
      {description &&
        <TooltipContent
          align="center"
          className={"bg-tw-primary text-white px-2 py-1 mt-1 rounded text-xs font-light z-10 w-1/2"}
          side="right"
        >
          <p>{description}</p>
        </TooltipContent>
      }
    </Tooltip>
  )
}
