import { forwardRef } from "react";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface LinkButtonProps extends NextLinkProps {
  className?: string;
  children?: React.ReactNode;
}

const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <NextLink
        className={cn(buttonVariants(), className)}
        ref={ref}
        {...props}
      >
        {children}
      </NextLink>
    );
  }
);

LinkButton.displayName = "LinkButton";

export { LinkButton };