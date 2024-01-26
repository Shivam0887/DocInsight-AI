import { Schema, model, models, InferSchemaType, Types } from "mongoose";

export enum UploadStatus {
  PENDING,
  PROCESSING,
  FAILED,
  SUCCESS,
}

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
    files: [
      {
        type: Schema.Types.ObjectId,
        ref: "File",
      },
    ],
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    stripePriceId: String,
    stripeCurrentPeriodEnd: Date,
  },
  { timestamps: true }
);

const fileSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    docId: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    uploadStatus: {
      type: Number,
      default: UploadStatus.PENDING,
    },
    url: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export type UserType = InferSchemaType<typeof userSchema> & {
  _id: Types.ObjectId;
};

export type FileType = InferSchemaType<typeof fileSchema> & {
  _id: Types.ObjectId;
};

export const User = models?.User || model<UserType>("User", userSchema);
export const File = models?.File || model<FileType>("File", fileSchema);
