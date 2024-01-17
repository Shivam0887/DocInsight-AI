import ChatHeader from "@/components/ChatHeader";
import SideNavbar from "@/components/Navigation/SideNavbar";
import Slider from "@/components/Slider";
import { auth } from "@clerk/nextjs";
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
      <div className="hidden sm:block">
        <SideNavbar />
      </div>
      <div className="block sm:hidden">
        <Slider side="left">
          <SideNavbar />
        </Slider>
      </div>
      <div className="w-full">
        <ChatHeader />
        {children}
      </div>
    </div>
  );
}
