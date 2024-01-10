import MaxWidthWrapper from "./MaxWidthWrapper";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import ToggleNavbar from "./toggle-navbar";

const NavbarLinks = () => {
  return (
    <>
      <Link
        href="/pricing"
        className={buttonVariants({
          variant: "ghost",
          size: "sm",
        })}
      >
        Home
      </Link>
      <Link
        href="/conversations"
        className={buttonVariants({
          variant: "ghost",
          size: "sm",
        })}
      >
        <span className="hidden sm:inline">{"✨"}</span>
        <span className="sm:hidden">{"⚡"}</span>
        Conversations
      </Link>
      <Link
        href="/pricing"
        className={buttonVariants({
          variant: "ghost",
          size: "sm",
        })}
      >
        Pricing
      </Link>
    </>
  );
};

const Navbar = () => {
  return (
    <MaxWidthWrapper className="flex justify-center">
      <nav className="text-white p-3 fixed shadow-md rounded-xl top-6 z-30 bg-[rgba(13,13,13,0.8)] backdrop-blur-lg">
        <div className="flex w-full items-center px-4 gap-x-4">
          <Image src="/Logo.svg" alt="logo" width={30} height={30} />

          <div className="hidden items-center space-x-4 sm:flex">
            <NavbarLinks />
          </div>
          <Link
            href="/sign-in"
            className="flex ml-5 sm:ml-0 p-3 justify-center font-medium text-sm bg-zinc-800 hover:bg-zinc-900 transition rounded-xl"
          >
            <p className="text-nowrap">Start For Free</p>
            <ChevronRight className="w-5 h-5" />
          </Link>
          <div className="block sm:hidden">
            <ToggleNavbar>
              <NavbarLinks />
            </ToggleNavbar>
          </div>
        </div>
      </nav>
    </MaxWidthWrapper>
  );
};

export default Navbar;
