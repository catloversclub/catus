import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Platform, Pressable } from "react-native";
import { TextClassContext } from "./text";

const buttonVariants = cva(
  cn(
    "group shrink-0 justify-center items-center rounded-full",
    Platform.select({
      web: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap outline-none transition-all focus-visible:ring-[3px] disabled:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    }),
  ),
  {
    variants: {
      variant: {
        default: cn(
          "bg-primary-normal text-common-100",
          Platform.select({ web: "hover:bg-primary/90" }),
        ),
        outline: cn(
          "bg-primary-extralight-coolgray border border-primary-normal",
          Platform.select({
            web: "hover:bg-accent dark:hover:bg-input/50",
          }),
        ),
        secondary: cn(
          "bg-neutral-95",
          Platform.select({ web: "hover:bg-secondary/80" }),
        ),
        ghost: cn(
          "",
          Platform.select({ web: "hover:bg-accent dark:hover:bg-accent/50" }),
        ),
        link: "",
      },
      size: {
        default: cn("py-3", Platform.select({ web: "has-[>svg]:px-3" })),
        sm: cn("py-1.5", Platform.select({ web: "has-[>svg]:px-2.5" })),
        lg: cn("py-[14px]", Platform.select({ web: "has-[>svg]:px-4" })),
        icon: "h-6 w-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const buttonTextVariants = cva(
  cn(Platform.select({ web: "pointer-events-none transition-colors" })),
  {
    variants: {
      variant: {
        default: "text-common-100",
        outline: cn(
          "text-primary-normal",
          Platform.select({ web: "group-hover:text-accent-foreground" }),
        ),
        secondary: "text-neutral-60",
        ghost: "",
        link: cn(
          "text-primary group-active:underline",
          Platform.select({
            web: "underline-offset-4 hover:underline group-hover:underline",
          }),
        ),
      },
      size: {
        default: "text-[14px] font-medium",
        sm: "text-[14px] font-medium",
        lg: "text-[16px] font-medium",
        icon: "text-[14px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<typeof Pressable> &
  React.RefAttributes<typeof Pressable> &
  VariantProps<typeof buttonVariants>;

function Button({ className, variant, size, children, ...props }: ButtonProps) {
  return (
    <TextClassContext.Provider value={buttonTextVariants({ variant, size })}>
      <Pressable
        className={cn(
          props.disabled && "opacity-50",
          buttonVariants({ variant, size }),
          className,
        )}
        role="button"
        {...props}
      >
        {children}
      </Pressable>
    </TextClassContext.Provider>
  );
}

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
