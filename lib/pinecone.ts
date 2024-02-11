import { Pinecone } from "@pinecone-database/pinecone";

export const pc = new Pinecone({
  apiKey: process.env.PINECON_API_KEY!,
});

export const pineconeIndex = pc.index("doc-insight");
