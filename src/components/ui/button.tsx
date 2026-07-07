import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        default: "bg-foreground text-background hover:opacity-80",
        destructive:
          "bg-destructive text-destructive-foreground hover:opacity-80",
        outline:
          "border border-border/40 bg-transparent hover:border-foreground",
        secondary: "bg-muted text-muted-foreground hover:bg-muted/80",
        ghost: "hover:bg-accent/50",
        link: "text-foreground underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({
  ref,
  className,
  variant,
  size,
  asChild = false,
  children,
  type = "button",
  ...props
}: ButtonProps & { ref?: React.Ref<HTMLButtonElement> }) {
  const buttonClassName = cn(buttonVariants({ variant, size, className }));

  if (
    asChild &&
    React.isValidElement<{ className?: string; ref?: React.Ref<HTMLElement> }>(
      children,
    )
  ) {
    return React.cloneElement(children, {
      ...props,
      className: cn(buttonClassName, children.props.className),
      ref: ref as React.Ref<HTMLElement>,
    } as React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> });
  }

  return (
    <button
      type={type}
      className={buttonClassName}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
}
Button.displayName = "Button";

export { Button, buttonVariants };
