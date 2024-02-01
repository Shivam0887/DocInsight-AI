import { Ghost } from "lucide-react";

const Page = () => {
  return (
    <div className="flex-1 flex items-center justify-center ">
      <div className="flex flex-col gap-2 items-center">
        <Ghost className="w-6 h-6" />
        <p className="text-zinc-400 text-sm">Pretty empty around here</p>
      </div>
    </div>
  );
};

export default Page;
