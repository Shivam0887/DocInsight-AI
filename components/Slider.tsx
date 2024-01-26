"use client";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetPortal,
} from "@/components/ui/sheet";
import { ChevronRight } from "lucide-react";

type Side = "left" | "right" | "top" | "bottom";

export default function Slider({
  children,
  side,
}: {
  children: React.ReactNode;
  side: Side;
}) {
  return (
    <Sheet>
      <SheetTrigger
        asChild
        className="flex items-center cursor-pointer min-h-screen "
      >
        <div>
          <ChevronRight className="ml-3 p-1 w-6 h-6 fixed stroke-white bg-zinc-800 rounded-full" />
        </div>
      </SheetTrigger>
      <SheetPortal>
        <SheetContent
          className="w-max p-0 border-0 outline-none bg-zinc-950"
          side={side}
        >
          {children}
        </SheetContent>
      </SheetPortal>
    </Sheet>
  );
}
