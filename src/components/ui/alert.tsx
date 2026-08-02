import * as React from "react";
import { cn } from "@/lib/utils";
export function Alert({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div className={cn("rounded-lg border border-border bg-white p-4 text-sm", className)} role="alert" {...props} />; }
type AlertTitleProps = React.HTMLAttributes<HTMLElement> & { as?: React.ElementType };
export function AlertTitle({ as: Comp = "h3", className, ...props }: AlertTitleProps) { return <Comp className={cn("mb-1 font-medium leading-none", className)} {...props} />; }
export function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) { return <div className={cn("text-muted-foreground", className)} {...props} />; }
