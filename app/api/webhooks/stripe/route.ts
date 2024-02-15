import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import type Stripe from "stripe";
import { User } from "@/lib/models/models";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get("Stripe-Signature") ?? "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.log(
      "Webhook error - ",
      err instanceof Error ? err.message : "Unknown Error"
    );
    return new Response(
      `Webhook Error: ${err instanceof Error ? err.message : "Unknown Error"}`,
      { status: 400 }
    );
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (!session?.metadata?.userId) {
    console.log("userId not found in session's metadata");
    return new Response(null, {
      status: 200,
    });
  }

  // when a user purchase the product for the first time
  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    await User.findOneAndUpdate(
      { userId: session.metadata.userId },
      {
        $set: {
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer as string,
          stripePriceId: subscription.items.data[0]?.price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
        },
      }
    );
  } else if (event.type === "checkout.session.expired") {
    console.log("Checkout session is expired");
  }

  // when the subscription plan renews
  if (event.type === "invoice.payment_succeeded") {
    // Retrieve the subscription details from Stripe.
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    await User.findOneAndUpdate(
      { stripeSubscriptionId: subscription.id },
      {
        $set: {
          stripePriceId: subscription.items.data[0]?.price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
        },
      }
    );
  } else if (event.type === "invoice.payment_failed") {
    console.log("payment_failed");
  }

  return new Response(null, { status: 200 });
}
