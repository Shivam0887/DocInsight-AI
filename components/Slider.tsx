"use client";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetPortal,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import React from "react";

type Side = "left" | "right" | "top" | "bottom";

export default function Slider({
  children,
  side,
  triggerElement,
  triggerClassName,
  contentClassName,
}: {
  children: React.ReactNode;
  side: Side;
  triggerElement: React.JSX.Element;
  triggerClassName?: string;
  contentClassName?: string;
}) {
  return (
    <Sheet>
      <SheetTrigger
        asChild
        className={cn(
          "flex items-center cursor-pointer min-h-screen",
          triggerClassName
        )}
      >
        <div>{triggerElement}</div>
      </SheetTrigger>
      <SheetPortal>
        <SheetContent
          className={cn("w-max p-0 border-0 outline-none", contentClassName)}
          side={side}
        >
          {children}
        </SheetContent>
      </SheetPortal>
    </Sheet>
  );
}
