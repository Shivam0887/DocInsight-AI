import { cn } from "@/lib/utils";
import Image from "next/image";

type MaxWidthWrapperProps = {
  className?: string;
  children: React.ReactNode;
};

// To maintain the spacing of left and right side on the all pages
const MaxWidthWrapper = ({ className, children }: MaxWidthWrapperProps) => {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-screen-xl px-2.5 md:px-20 z-20",
        className
      )}
    >
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
