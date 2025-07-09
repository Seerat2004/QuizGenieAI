import * as React from "react"
import { cn } from "@/lib/utils"
import { toggleVariants } from "./toggle-variants"

const Toggle = React.forwardRef(({ className, pressed, ...props }, ref) => (
  <button
    type="button"
    className={cn(toggleVariants({ pressed }), className)}
    aria-pressed={pressed}
    ref={ref}
    {...props}
  />
))
Toggle.displayName = "Toggle"

export { Toggle }
