import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import UploadFile from "@/components/fileUpload/UploadFile";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { redirect } from "next/navigation";

const UploadFilePage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const isRedirecting = searchParams?.new === "false" ? false : true;

  if (!isRedirecting) {
    redirect("/conversations");
  }

  const subscriptionPlan = await getUserSubscriptionPlan();

  return (
    <MaxWidthWrapper className="py-16 px-8 xs:px-10 sm:px-12">
      <div className="w-full bg-white rounded-xl">
        <div className="py-5 w-full sm:py-7 px-2 xs:px-6 sm:px-[72px]">
          <div className="two_col_flexbox md:justify-between items-center gap-4">
            <h2 className="max-w-60 text-2xl sm:text-4xl text-[#2f2b43] font-semibold">
              Upload your
              <div className="pt-2 text-yellow-500/75 text-center sm:text-left">
                document
              </div>
            </h2>

            <p className="text-sm text-zinc-900 max-w-96 text-center md:text-left leading-loose font-medium">
              You&apos;ll be able to start a conversation based on the document
              uploaded. You can upgrade your account to increase your limits
            </p>
          </div>
        </div>
        <div className="w-full h-[1px] bg-zinc-300" />
        <UploadFile isSubscribed={subscriptionPlan.isSubscribed} />
      </div>
    </MaxWidthWrapper>
  );
};

export default UploadFilePage;
