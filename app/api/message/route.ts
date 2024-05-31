import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { SendMessageValidator } from "@/lib/validators/sendMessageValidator";
import { connectToDB } from "@/lib/connectToDB";
import {
  File,
  FileType,
  Message,
  MessageType,
  User,
  UserType,
} from "@/lib/models/models";

import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { genAI, openAI } from "@/lib/ai";
import { pineconeIndex } from "@/lib/pinecone";
import {
  OpenAIStream,
  StreamingTextResponse,
  GoogleGenerativeAIStream,
} from "ai";
import { TaskType } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId } = auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const user = await User.findOne<UserType | null | undefined>({ userId });

  if (!user) return new NextResponse("user not found", { status: 404 });

  try {
    const { fileId, message } = SendMessageValidator.parse(body);
    connectToDB();

    const file = await File.findOne<FileType | null | undefined>({
      _id: fileId,
      user: user._id,
    });

    if (!file) return new NextResponse("file not found", { status: 404 });

    const userMsg: MessageType | undefined = await Message.create({
      content: message,
      isUserMessage: true,
      userId: user._id,
      fileId: file._id,
    });

    await User.findByIdAndUpdate(user._id, {
      $push: {
        messages: userMsg?._id,
      },
    });

    await File.findByIdAndUpdate(file._id, {
      $push: {
        messages: userMsg?._id,
      },
    });

    await Message.findByIdAndUpdate(userMsg?._id, {
      $set: {
        fileId: file._id,
        userId: user._id,
      },
    });

    // vector embedding
    const genEmbeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_GENAI_API_KEY!,
      model: "embedding-001",
      taskType: TaskType.SEMANTIC_SIMILARITY,
    });

    const vectorStore = await PineconeStore.fromExistingIndex(genEmbeddings, {
      pineconeIndex,
      namespace: file._id.toJSON(),
    });

    const results = await vectorStore.similaritySearch(message, 4);

    const prevMessages = await Message.find<MessageType>({ fileId: file._id })
      .sort({ createdAt: "asc" })
      .limit(5);

    const formattedPrevMsg = prevMessages.map((msg) => ({
      role: msg.isUserMessage ? ("user" as const) : ("model" as const),
      content: msg.content,
    }));

    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
    });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            {
              text: `Only use the provided pieces of context (or previous conversation if needed) to accurately answer the users question either in markdown format or in bullet points. \n Highlight the important headings and words. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.

            PREVIOUS CONVERSATION:
            ${formattedPrevMsg.map((message) => {
              if (message.role === "user") return `User: ${message.content}\n`;
              return `Model: ${message.content}\n`;
            })}
  
            CONTEXT:
            ${results.map((r) => r.pageContent).join("\n")}`,
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "Only use the provided pieces of context (or previous conversation if needed) to accurately answer the users question either in markdown format or in bullet points. \nHighlight the important headings and words.",
            },
          ],
        },
      ],
    });

    const response = await chat.sendMessageStream(message);

    // let text = "";
    // for await (const chunk of response.stream) {
    //   const chunkText = chunk.text();
    //   console.log(chunkText);
    //   text += chunkText;
    // }

    const stream = GoogleGenerativeAIStream(response, {
      async onCompletion(completion) {
        // console.log(completion);
        const res = await Message.create({
          content: completion,
          isUserMessage: false,
          userId: user._id,
          fileId: file._id,
        });

        await File.findByIdAndUpdate(file._id, {
          $push: {
            messages: res?._id,
          },
        });

        await Message.findByIdAndUpdate(res?._id, {
          $set: {
            fileId: file._id,
          },
        });
      },
    });
    return new StreamingTextResponse(stream);

    /** If using OpenAI for chat completion */
    // const response = await openAI.chat.completions.create({
    //   model: "gpt-3.5-turbo-0125",
    //   temperature: 0,
    //   stream: true,
    //   messages: [
    //     {
    //       role: "system",
    //       content:
    //         "Use the following pieces of context (or previous conversation if needed) to answer the users question in markdown format.",
    //     },
    //     {
    //       role: "user",
    //       content: `Use the following pieces of context (or previous conversation if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.

    // \n----------------\n

    // PREVIOUS CONVERSATION:
    // ${formattedPrevMsg.map((message) => {
    //   if (message.role === "user") return `User: ${message.content}\n`;
    //   return `Assistant: ${message.content}\n`;
    // })}

    // \n----------------\n

    // CONTEXT:
    // ${results.map((r) => r.pageContent).join("\n\n")}

    // USER INPUT: ${message}`,
    //     },
    //   ],
    // });
  } catch (error: any) {
    console.log(error.message);
    return new NextResponse("internal server error", { status: 501 });
  }
}
