"use client";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

import { AlignRight, XCircle } from "lucide-react";
import { useState } from "react";

const ToggleNavbar = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        {isOpen ? (
          <XCircle className="w-5 h-5 cursor-pointer" />
        ) : (
          <AlignRight className="w-5 h-5 cursor-pointer" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-zinc-800  border-0 mt-6 -ml-56 w-60">
        <DropdownMenuItem className="focus:bg-zinc-800 ">
          <div className="flex flex-col items-start text-white">{children}</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ToggleNavbar;
