import SideNavbar from "@/components/Navbar/SideNavbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full min-h-screen">
      <SideNavbar />
      {children}
    </div>
  );
}
