import * as React from "react"
import { cn } from "../lib/utils"

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogContentProps {
  className?: string;
  children: React.ReactNode;
}

export const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 backdrop-blur-xl transition-opacity"
        onClick={() => onOpenChange(false)}
      />
      {children}
    </div>
  )
}

export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative z-50 w-full max-w-2xl max-h-[80vh] overflow-y-auto",
          "bg-gray bg-opacity-95 rounded-xl shadow-lg border border-gray-200",
          "animate-in fade-in-90 zoom-in-95",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

export const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col px-6 pt-6",
      className
    )}
    {...props}
  />
)

export const DialogTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-3xl font-bold text-white",
      className
    )}
    {...props}
  />
))