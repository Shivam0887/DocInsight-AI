import { cn } from "@/lib/utils";
import Image from "next/image";

type MaxWidthWrapperProps = {
  className?: string;
  children: React.ReactNode;
};

// To maintain the spacing of left and right side on the all pages
const MaxWidthWrapper = ({ className, children }: MaxWidthWrapperProps) => {
  return (
    <div className="bg-[#0a0a0a] relative flex justify-center overflow-hidden">
      <div
        className={cn(
          "mx-auto w-full max-w-screen-xl px-2.5 md:px-20 relative z-20",
          className
        )}
      >
        {children}
      </div>
      <Image
        src="/Hero.png"
        alt="hero-section"
        priority
        width={1440}
        height={1440}
        className="hidden absolute z-10 top-16 lg:animate-resize sm:block"
      />
    </div>
  );
};

export default MaxWidthWrapper;
