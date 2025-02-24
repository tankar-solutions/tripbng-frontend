import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type="text", value, onChange, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      value={value}
    onChange={onChange}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
