import Link from "next/link";

const ChatHeader = () => {
  return (
    <div className="w-full">
      <div className="h-16 bg-white flex items-center justify-between">
        <div className="flex items-center gap-x-1 ml-5">
          <Link href="/" className="font-semibold">
            DocInsight-AI
          </Link>
          <span className="bg-green-50 text-[10px] font-medium text-green-700 py-[2px] px-2 rounded-xl">
            Free
          </span>
        </div>
        <Link
          href="/#"
          className="mr-10 capitalize text-xs sm:text-sm font-medium px-5 py-2 sm:px-8 sm:py-3 text-yellow-500 bg-zinc-900 rounded-xl hover:bg-zinc-800 transition"
        >
          upgrade
        </Link>
      </div>
    </div>
  );
};

export default ChatHeader;
