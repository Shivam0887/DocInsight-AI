"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { PLANS } from "@/config/stripe";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { ArrowRight, Check, HelpCircle, Minus } from "lucide-react";
import Link from "next/link";
import Upgrade from "@/components/Upgrade";
import { buttonVariants } from "@/components/ui/button";

const PricingPage = () => {
  const { userId } = useAuth();

  const pricingItems = [
    {
      plan: "Free",
      tagline: "For small side projects.",
      quota: PLANS.find((p) => p.slug === "free")!.quota,
      features: [
        {
          text: "5 pages per PDF",
          footnote: "The maximum amount of pages per PDF-file.",
        },
        {
          text: "4MB file size limit",
          footnote: "The maximum file size of a single PDF file.",
        },
        {
          text: "Mobile-friendly interface",
        },
        {
          text: "Higher-quality responses",
          footnote: "Better algorithmic responses for enhanced content quality",
          negative: true,
        },
        {
          text: "Priority support",
          negative: true,
        },
      ],
    },
    {
      plan: "Pro",
      tagline: "For larger projects with higher needs.",
      quota: PLANS.find((p) => p.slug === "pro")!.quota,
      features: [
        {
          text: "25 pages per PDF",
          footnote: "The maximum amount of pages per PDF-file.",
        },
        {
          text: "16MB file size limit",
          footnote: "The maximum file size of a single PDF file.",
        },
        {
          text: "Mobile-friendly interface",
        },
        {
          text: "Higher-quality responses",
          footnote: "Better algorithmic responses for enhanced content quality",
        },
        {
          text: "Priority support",
        },
      ],
    },
  ];

  return (
    <MaxWidthWrapper className="mb-8 mt-24 text-center max-w-6xl">
      <div className="mx-auto mb-10 sm:max-w-lg">
        <h1 className="text-6xl font-bold sm:text-7xl">Pricing</h1>
        <p className="mt-5 text-gray-600 sm:text-lg">
          Whether you&apos;re just trying out our service or need more,
          we&apos;ve got you covered.
        </p>
      </div>

      <div className="pt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TooltipProvider>
          {pricingItems.map(({ plan, features, quota, tagline }) => {
            const price =
              PLANS.find((p) => p.slug === plan.toLowerCase())?.price.amount ||
              0;

            return (
              <div
                key={plan}
                className={cn(
                  "relative rounded-2xl bg-white shadow-lg m-4",
                  plan === "Pro"
                    ? "border-2 border-yellow-600 shadow-yellow-100"
                    : "border border-gray-300"
                )}
              >
                {plan === "Pro" && (
                  <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 px-3 py-2 text-sm font-medium text-white">
                    Upgrade now
                  </div>
                )}

                <div className="p-5 text-center">
                  <h3 className="my-3 font-bold text-3xl">{plan}</h3>
                  <p className="text-gray-500">{tagline}</p>
                  <p className="my-5 font-semibold text-6xl">&#8377;{price}</p>
                  <p className="text-ray-500">per month</p>
                </div>

                <div className="flex h-16 items-center justify-center border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center space-x-1">
                    <p>{quota.toLocaleString()} PDFs/month included</p>

                    <Tooltip delayDuration={300}>
                      <TooltipTrigger className="cursor-default ml-1.5">
                        <HelpCircle className="h-4 w-4 text-zinc-500" />
                      </TooltipTrigger>
                      <TooltipContent className="w-80 p-2">
                        Number of PDFs you can upload per month
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                <ul className="my-10 space-y-5 px-8">
                  {features.map(({ text, footnote, negative }) => (
                    <li key={text} className="flex space-x-5">
                      <div className="flex-shrink-0">
                        {negative ? (
                          <Minus className="h-6 w-6 text-gray-300" />
                        ) : (
                          <Check className="h-6 w-6 text-yellow-600" />
                        )}
                      </div>
                      {footnote ? (
                        <div className="flex items-center space-x-1">
                          <p
                            className={cn("text-gray-400", {
                              "text-gray-600": negative,
                            })}
                          >
                            {text}
                          </p>
                          <Tooltip delayDuration={300}>
                            <TooltipTrigger className="cursor-default ml-1.5">
                              <HelpCircle className="h-4 w-4 text-zinc-500" />
                            </TooltipTrigger>
                            <TooltipContent className="w-80 p-2">
                              {footnote}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      ) : (
                        <p
                          className={cn("text-gray-400", {
                            "text-gray-600": negative,
                          })}
                        >
                          {text}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
                <div className="border-t border-gray-200" />
                <div className="p-5">
                  {plan === "Free" ? (
                    <Link
                      href={userId ? "/conversations" : "/sign-in"}
                      className={buttonVariants({
                        variant: "secondary",
                        className: "w-full",
                      })}
                    >
                      {userId ? "Upgrade now" : "Sign-up"}
                      <ArrowRight className="h-5 w-5 ml-1.5" />
                    </Link>
                  ) : userId ? (
                    <Upgrade />
                  ) : (
                    <Link
                      href="/sign-in"
                      className={buttonVariants({
                        variant: "secondary",
                        className: "w-full",
                      })}
                    >
                      Sign-up
                      <ArrowRight className="h-5 w-5 ml-1.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </TooltipProvider>
      </div>
    </MaxWidthWrapper>
  );
};

export default PricingPage;
