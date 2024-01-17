import { Schema, model, models, InferSchemaType } from "mongoose";

export const userSchema = new Schema(
  {
    userId: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    isConversation: {
      type: Boolean,
      default: false,
    },
    stripeCustomerId: {
      type: String,
      unique: true,
    },
    stripeSubscriptionId: {
      type: String,
      unique: true,
    },
    stripePriceId: String,
    stripeCurrentPeriodEnd: Date,
  },
  { timestamps: true }
);

export type UserType = InferSchemaType<typeof userSchema>;

export const User = models?.User || model("User", userSchema);
