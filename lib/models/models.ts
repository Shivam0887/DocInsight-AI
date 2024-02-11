import { Schema, model, models, InferSchemaType, Types } from "mongoose";

export enum UploadStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  FAILED = "FAILED",
  SUCCESS = "SUCCESS",
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
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Message",
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
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
  uploadStatus: {
    type: String,
    default: UploadStatus.PENDING,
  },
  pages: {
    type: Number,
    default: 1,
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

const messageSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  fileId: {
    type: Schema.Types.ObjectId,
    ref: "File",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  chatGptId: String, //if chatGpt sends a reply
  isUserMessage: {
    type: Boolean,
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

export type MessageType = InferSchemaType<typeof messageSchema> & {
  _id: Types.ObjectId;
};

export const User = models.User || model<UserType>("User", userSchema);
export const File = models.File || model<FileType>("File", fileSchema);
export const Message =
  models.Message<MessageType> || model<MessageType>("Message", messageSchema);
