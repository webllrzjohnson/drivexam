import * as React from "react";
import { cn } from "@/lib/utils";
export function Input({ className, type, ...props }: React.InputHTMLAttributes<HTMLInputElement>) { return <input type={type} className={cn("flex h-10 w-full rounded-lg border border-border bg-white px-3 py-2 text-base shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-green-700 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className)} {...props} />; }
