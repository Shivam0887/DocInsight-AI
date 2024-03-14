"use client";

import React, { useEffect, useState } from "react";
import { trpc } from "@/app/_trpc/client";
import { Check, Loader2 } from "lucide-react";

type UrlFileUploadProps = {
  setFileInfo: (info: { fileId: string }) => void;
};

const urlRegex =
  /^https:\/\/(?:www\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+(?:\/[^\/]+)*(?:\/[^\/]+\.(?:pdf|txt))$/;

const UrlFileUpload = ({ setFileInfo }: UrlFileUploadProps) => {
  const [url, setUrl] = useState("");
  const [httpProtocol, setHttpProtocol] = useState("");
  const [isValidURL, setIsValidURL] = useState(true);
  const [isClicked, setIsClicked] = useState(false);
  const { data, mutate } = trpc.uploadFileFromUrl.useMutation();

  useEffect(() => {
    if (data) {
      const { fileId } = data;
      setFileInfo({ fileId });
    }
  }, [data, setFileInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const URL = e.target.value.trim();

    let protocol = httpProtocol;
    // If user entering the url for the first time or the user has made changes at the beginning of the url.
    const flag =
      !protocol || (url?.[0] !== URL?.[0] && url.length !== URL.length);
    if (flag) {
      const isHttpProtocol =
        URL.startsWith("https://") || URL.startsWith("http://");
      protocol = isHttpProtocol ? URL.split("/")[0] + "//" : "";
      setHttpProtocol(protocol);
    }

    const trucatedURL = flag ? URL.substring(protocol.length) : URL;
    setUrl(trucatedURL);
    setIsValidURL(!URL ? true : urlRegex.test(protocol + trucatedURL));
  };

  const isButtonDisabled = !isValidURL || !(url.length as unknown as boolean);

  return (
    <div className="mt-10 w-full">
      <div className="flex items-center border-2 border-zinc-300 rounded-lg w-full h-[40px]">
        <span className="text-xs text-zinc-500 ml-2 font-light">https://</span>
        <div className="border-r-2 border-zinc-300 inline-block h-full mx-2" />
        <input
          type="text"
          name="fileUrl"
          placeholder="www.example.pdf"
          value={url}
          onChange={handleChange}
          className={`${
            isValidURL ? "text-green-500" : "text-red-500"
          } w-[80%] border-none outline-none text-xs font-light`}
        />
      </div>
      <div className="flex gap-6 items-center mt-6">
        <button
          disabled={isButtonDisabled}
          onClick={() => {
            mutate({ securedUrl: httpProtocol + url });
            setIsClicked(true);
          }}
          type="button"
          className={`text-white bg-zinc-950 rounded-lg py-2 px-4 text-xs hover:bg-zinc-900 transition ${
            isButtonDisabled ? "cursor-not-allowed" : ""
          }`}
        >
          Get document
        </button>
        {isClicked ? (
          data?.fileId ? (
            <Check className="w-5 h-5 stroke-white bg-emerald-500 rounded-full p-1" />
          ) : (
            <Loader2 className="w-5 h-5 animate-spin" />
          )
        ) : (
          <></>
        )}
      </div>
      {!isValidURL &&
        // isSupportedFormat?
        (!(url.endsWith("pdf") || url.endsWith("txt")) ? (
          <div className="mt-6 flex flex-col items-center">
            <p className="text-xs font-medium text-center text-red-500">
              Unsupported format
            </p>
            <p className="text-xs font-medium text-center">
              Supported format: &apos;.pdf&apos;
            </p>
          </div>
        ) : // isSecured?
        httpProtocol === "http://" ? (
          <p className="text-xs font-medium mt-6 text-center text-red-500">
            please enter a secured url.
          </p>
        ) : (
          <p className="text-xs font-medium mt-6 text-center text-red-500">
            Invalid Url
          </p>
        ))}
    </div>
  );
};

export default UrlFileUpload;
