"use client";

import React from "react";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { trpc } from "@/app/_trpc/client";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const Upgrade = () => {
  const { mutate } = trpc.createStripeSession.useMutation({
    onSuccess({ url }) {
      window.location.href = url ?? "/conversations";
    },
    onError(error) {
      console.log(error.message);
    },
  });

  return (
    <Button className="w-full" onClick={() => mutate()}>
      Upgrade now <ArrowRight className="h-5 w-5 ml-1.5" />
    </Button>
  );
};

export default Upgrade;
