import { ComponentProps } from "react";
import { Button } from "@/components/ui/button";

import { twMerge } from "tailwind-merge";

interface IconButtonProps extends ComponentProps<"button"> {
  transparent?: boolean;
}

export function IconButton({ transparent, ...props }: IconButtonProps) {
  return (
    <Button
      {...props}
      className={twMerge(
        "border border-white/10 rounded-md p-1.5 size-7",
        transparent ? "bg-black/20" : "bg-white/10",
        props.disabled ? "opacity-50" : null
      )}
    />
  );
}
