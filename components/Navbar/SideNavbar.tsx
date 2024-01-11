import { UserButton } from "@clerk/nextjs";
import {
  BookMinus,
  LogOut,
  MessageSquare,
  Settings,
  Trash2,
  UploadCloud,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ActionTooltip } from "../ActionToolTip";

const SideNavbar = () => {
  return (
    <div className="w-12 sm:w-16 bg-zinc-950">
      <div className="mt-4 flex flex-col items-center gap-y-6 ">
        <Link href="/" className="w-5 sm:w-6">
          <Image
            src="/Logo.svg"
            width={24}
            height={24}
            quality={100}
            alt="logo"
            className="w-full aspect-square"
          />
        </Link>
        <ActionTooltip side="left" align="center" label="conversations">
          <MessageSquare className="box-content w-4 h-4 sm:w-6 sm:h-6  stroke-white hover:bg-zinc-800 transition p-1.5 rounded-md" />
        </ActionTooltip>
        <ActionTooltip side="left" align="center" label="upload doc">
          <UploadCloud className="box-content w-4 h-4 sm:w-6 sm:h-6 stroke-white hover:bg-zinc-800 transition p-1.5 rounded-md" />
        </ActionTooltip>
        <ActionTooltip side="left" align="center" label="delete doc">
          <Trash2 className="box-content w-4 h-4 sm:w-6 sm:h-6 stroke-white hover:bg-zinc-800 transition p-1.5 rounded-md" />
        </ActionTooltip>
        <ActionTooltip side="left" align="center" label="settings">
          <Settings className="box-content w-4 h-4 sm:w-6 sm:h-6 stroke-white hover:bg-zinc-800 transition p-1.5 rounded-md" />
        </ActionTooltip>
        <ActionTooltip side="left" align="center" label="profile">
          <div>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-5 h-5 sm:w-[26px] sm:h-[26px]",
                },
              }}
            />
          </div>
        </ActionTooltip>
        <ActionTooltip side="left" align="center" label="logout">
          <LogOut className="box-content w-4 h-4 sm:w-6 sm:h-6 stroke-white hover:bg-zinc-800 transition p-1.5 rounded-md" />
        </ActionTooltip>
      </div>
    </div>
  );
};

export default SideNavbar;
