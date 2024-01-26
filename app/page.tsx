import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Image from "next/image";
import Link from "next/link";
import { AnimateOnScroll, MoveToTop } from "@/lib/animateOnScroll";
import Navbar from "@/components/Navigation/Navbar";
import { UserButton } from "@clerk/nextjs";
import UploadFileModal from "@/components/models/UploadFile.model";

export default function Home() {
  return (
    <div>
      <Navbar />
      <MoveToTop />
      <AnimateOnScroll />
      <MaxWidthWrapper
        className="bg-[#0a0a0a] max-w-full relative
         sm:pt-52 pt-40 pb-32 overflow-hidden"
      >
        <div
          className="flex flex-col sm:justify-center text-center 
         sm:items-center items-start"
        >
          <div className="absolute z-50 top-10 right-5 sm:right-8">
            <UserButton afterSignOutUrl="/" />
          </div>
          <Image
            src="/Hero.png"
            alt="hero-section"
            priority
            width={1440}
            height={875}
            className="hidden absolute max-w-none -z-10 top-16 lg:animate-resize sm:block"
          />
          <div
            className="flex max-w-fit items-center justify-center
              space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white
              px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300  
              hover:bg-white/95 cursor-pointer"
          >
            <p className="text-sm font-semibold text-gray-700 select-none">
              DocInsight-AI is now public!
            </p>
          </div>
          <div className="mt-10 flex flex-col items-center justify-center select-none">
            <h1 className="max-w-4xl text-muted text-5xl font-medium md:text-6xl leading-snug sm:text-center text-left">
              Chat with your <span className="text-yellow-500">documents</span>{" "}
              in seconds.
            </h1>
            <p className="mt-4 md:mt-10 max-w-2xl pr-4 text-muted sm:text-md sm:text-center text-left select-none">
              DocInsight-AI revolutionizes your interaction with PDF documents,
              transforming them into engaging conversational partners.
            </p>
          </div>
          <UploadFileModal />
          <div className="select-none mt-6 flex flex-col gap-y-4 items-start sm:items-center">
            <p className="text-base text-muted">Supported formats</p>
            <div className="space-x-1">
              <span className="px-2 p-1.5 bg-zinc-800 text-zinc-400 rounded-lg font-medium text-[12px] text-muted">
                PDF
              </span>
              <span className="px-2 py-1.5 bg-zinc-800 text-zinc-400 rounded-lg font-medium text-[12px] text-muted">
                TXT
              </span>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>

      <div className="invisible-animate-scroll mt-10 max-w-[650px] flex flex-col items-center p-2 mx-auto">
        <p className="text-[#2f2b43] text-center text-4xl font-bold leading-relaxed">
          Supercharge Document
        </p>
        <p className="text-yellow-600 text-4xl font-bold">Interactions</p>
        <p className="mt-4 sm:mt-6 text-center text-sm text-zinc-500">
          Have you ever imagined your documents having a voice of their own?
          With DocInsight, this is now a reality! Infused with the power of
          ChatGPT, we transform your documents into interactive and captivating
          entities. Say goodbye to tiresome scrolling or skimming - simply
          upload, inquire, and discover valuable insights straight from your
          documents.
        </p>
      </div>

      {/* Value proposition section */}
      <div className="invisible-animate-scroll opacity-0 translate-y-[100px]  mx-auto max-w-6xl px-6 mt-16">
        <div className="-m-2 flex w-full flex-col-reverse items-start lg:flex-row gap-x-8 lg:items-center rounded-xl bg-[#f8f9ff] p-10 pb-0 lg:-m-4 lg:rounded-3xl">
          <div className="mx-auto relative flex-1 rounded-md border-2 border-zinc-200 border-b-0 border-r-0">
            <Image
              src="/images/dashboard-preview-mini.jpg"
              width={590}
              height={862}
              alt="product-preview"
              quality={100}
            />
            <div className="w-full h-full absolute top-0 bg-gradient-to-r from-transparent from-30% to-[#f8f9ff]" />
          </div>

          <div className="flex flex-col flex-1 items-start gap-y-5">
            <Image
              src="/ChatIcon.svg"
              width={70}
              height={70}
              alt="ChatIcon"
              className="drop-shadow-lg"
            />
            <div className="text-[#2f2b43] text-4xl font-bold">
              <p className="xs:text-nowrap">Converse, Learn, Track -</p>
              <p>All on Your Terms</p>
            </div>
            <p className="text-[#7f7e8e] text-sm leading-relaxed">
              Discover a brand new way to interact with your documents on
              DocInsight.
            </p>
            <p className="text-[#7f7e8e] text-sm leading-relaxed">
              {
                "Here, you give voice to your documents, turning them into engaging chat partners. What's more? You can effortlessly track and revisit all your conversations. Take control, ask questions, get answers, and never lose track of your learning. Ready to make your documents work for you?"
              }
            </p>

            <Link
              className="my-5 rounded-xl bg-black text-white text-sm p-3 hover:bg-black/95 transition"
              href="/chat"
              target="_blank"
            >
              Get Started
              <span className="ml-2 -mt-1 font-bold">{">"}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Feature section */}
      <div className="invisible-animate-scroll mx-auto my-24 max-w-5xl sm:mt-32">
        <div className="mb-12 px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="mt-2 font-bold text-4xl text-[#2f2b43] sm:text-5xl">
              Start conversation in seconds
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Chatting to your documents has never been easier than with
              DocInsight-AI
            </p>
          </div>
        </div>

        {/* steps */}

        <ol className="my-8 space-y-4 px-6 pt-8 md:flex md:space-x-12 md:space-y-0">
          <li className="md:flex-1">
            <div
              className="flex flex-col space-y-2 border-l-4 border-zinc-300 
            py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pt-4"
            >
              <span className="text-sm font-medium text-yellow-600">
                Step 1
              </span>
              <span className="text-xl font-semibold">
                Sign up for an account
              </span>
              <span className="mt-2 text-zinc-700">
                Starting out with a free plan or choose our{" "}
                <Link
                  href="/pricing"
                  className="text-yellow-500 underline underline-offset-2"
                >
                  pro plan
                </Link>
                {"."}
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div
              className="flex flex-col space-y-2 border-l-4 border-zinc-300 
            py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pt-4"
            >
              <span className="text-sm font-medium text-yellow-600">
                Step 2
              </span>
              <span className="text-xl font-semibold">Upload your file</span>
              <span className="mt-2 text-zinc-700">
                We&apos;ll process your file and make it ready for you to chat
                with.
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div
              className="flex flex-col space-y-2 border-l-4 border-zinc-300 
            py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pt-4"
            >
              <span className="text-sm font-medium text-yellow-600">
                Step 3
              </span>
              <span className="text-xl font-semibold">
                Start asking questions
              </span>
              <span className="mt-2 text-zinc-700">
                It&apos;s that simply. Try out DocInsight-AI today - it really
                take less than a minute.
              </span>
            </div>
          </li>
        </ol>

        <div className="invisible-animate-scroll mt-16 sm:mt-24 mx-auto max-w-6xl px-6 md:px-0">
          <div className="rounded-md border-2 border-zinc-200 border-b-0 border-r-0">
            <Image
              src="/images/file-upload-preview.jpg"
              width={1419}
              height={732}
              alt="uploading-preview"
              quality={100}
              className="object-cover rounded-md bg-white shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
