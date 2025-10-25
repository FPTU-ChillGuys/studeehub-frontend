import React from "react";
import { ChevronLeft, ChevronRight, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface CollapsedItem {
  id: string;
  icon: LucideIcon;
  label: string;
  subtitle?: string;
  onClick?: () => void;
}

interface CollapsedPanelBarProps {
  /** Items to display in the collapsed bar */
  items: CollapsedItem[];
  /** Side of the panel - affects chevron direction and tooltip placement */
  side: "left" | "right";
  /** Callback when expand button is clicked */
  onExpand: () => void;
  /** Label for the expand button tooltip */
  expandLabel: string;
}

const CollapsedPanelBar: React.FC<CollapsedPanelBarProps> = ({
  items,
  side,
  onExpand,
  expandLabel,
}) => {
  const tooltipSide = side === "left" ? "right" : "left";
  const ChevronIcon = side === "left" ? ChevronRight : ChevronLeft;

  return (
    <>
      {/* Collapse/Expand Button */}
      <div className="p-2 border-b border-border">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onExpand}
                variant="ghost"
                size="sm"
                className="h-10 w-10 p-0"
              >
                <ChevronIcon className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side={tooltipSide}>
              <p>{expandLabel}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {items.map((item) => {
          const ItemIcon = item.icon;
          
          return (
            <TooltipProvider key={item.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-10 w-10 p-0 hover:bg-primary/10"
                      onClick={item.onClick}
                    >
                      <ItemIcon className="w-5 h-5" />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent side={tooltipSide}>
                  <p className="max-w-xs truncate">{item.label}</p>
                  {item.subtitle && (
                    <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </>
  );
};

export default CollapsedPanelBar;
