import ChatHeader from "@/components/ChatHeader";
import SideNavbar from "@/components/Navigation/SideNavbar";
import Slider from "@/components/Slider";
import UserFiles from "@/components/document/UserFiles";
import { auth } from "@clerk/nextjs";
import { ChevronRight } from "lucide-react";
import { redirect } from "next/navigation";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();
  if (!userId) redirect("auth-callback?origin=chat");

  return (
    <div className="flex w-full min-h-screen">
      <div className="hidden xl:block min-h-[200%]">
        <SideNavbar />
      </div>
      <div className="xl:hidden h-full">
        <Slider
          side="left"
          contentClassName="h-full"
          triggerElement={
            <ChevronRight className="ml-3 p-1 w-6 h-6 fixed z-50 stroke-white bg-zinc-800 mix-blend-difference rounded-full" />
          }
        >
          <div className="flex h-full">
            <SideNavbar />
            <UserFiles className="shadow-none" />
          </div>
        </Slider>
      </div>
      <div className="w-full">
        <ChatHeader />
        {children}
      </div>
    </div>
  );
}
