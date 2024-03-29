"use client";

import Image from "next/image";
import Link from "next/link";

import { SignOutButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LogOut,
  MessageSquare,
  Settings,
  Trash2,
  UploadCloud,
} from "lucide-react";

import { ActionTooltip } from "../ActionToolTip";
import { cn } from "@/lib/utils";
import UploadFileModal from "../models/UploadFile.model";

const SideNavbar = ({ isSubscribed }: { isSubscribed: boolean }) => {
  const pathName = usePathname().split("/")[1];

  return (
    <div className="h-full w-14 sm:w-[4.5rem] bg-zinc-950">
      <div className="h-full pt-5 flex flex-col items-center gap-y-6 ">
        <Link href="/" className="w-6 sm:w-8">
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
          <Link
            href="/conversations"
            className={cn(
              "hover:bg-zinc-800 transition p-1.5 rounded-md",
              (pathName === "conversations" || pathName === "chat") &&
                "bg-zinc-800"
            )}
          >
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6  stroke-white" />
          </Link>
        </ActionTooltip>
        <ActionTooltip side="left" align="center" label="upload doc">
          <UploadFileModal onlyDropdown isSubscribed={isSubscribed}>
            <UploadCloud className="w-5 h-5 sm:w-6 sm:h-6 stroke-white" />
          </UploadFileModal>
        </ActionTooltip>
        <ActionTooltip side="left" align="center" label="delete doc">
          <Link
            href="/delete"
            className={cn(
              "hover:bg-zinc-800 transition p-1.5 rounded-md",
              pathName === "delete" && "bg-zinc-800"
            )}
          >
            <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 stroke-white" />
          </Link>
        </ActionTooltip>
        <ActionTooltip side="left" align="center" label="settings">
          <Link href="/settings">
            <Settings className="box-content w-4 h-4 sm:w-6 sm:h-6 stroke-white hover:bg-zinc-800 transition p-1.5 rounded-md" />
          </Link>
        </ActionTooltip>
        <ActionTooltip side="left" align="center" label="profile">
          <div>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-6 h-6 sm:w-[26px] sm:h-[26px]",
                },
              }}
            />
          </div>
        </ActionTooltip>
        <ActionTooltip side="left" align="center" label="logout">
          <SignOutButton
            signOutCallback={() => {
              window.location.href = "/sign-in";
            }}
          >
            <LogOut className="box-content w-5 h-5 sm:w-6 sm:h-6 stroke-white hover:bg-zinc-800 transition p-1.5 rounded-md" />
          </SignOutButton>
        </ActionTooltip>
      </div>
    </div>
  );
};

export default SideNavbar;
