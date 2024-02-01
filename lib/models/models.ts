import { Schema, model, models, InferSchemaType, Types } from "mongoose";

export enum UploadStatus {
  PENDING,
  PROCESSING,
  FAILED,
  SUCCESS,
}

export const userSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const fileSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  docId: {
    type: String,
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
  size: {
    type: Number,
    required: true,
  },
  key: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export type UserType = InferSchemaType<typeof userSchema> & {
  _id: Types.ObjectId;
};

export type FileType = InferSchemaType<typeof fileSchema> & {
  _id: Types.ObjectId;
};

export const User = models?.User || model<UserType>("User", userSchema);
export const File = models?.File || model<FileType>("File", fileSchema);
