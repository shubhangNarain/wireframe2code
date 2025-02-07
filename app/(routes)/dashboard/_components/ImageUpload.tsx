"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";
import { CloudUpload, Wand, X } from "lucide-react";
import Image from "next/image";
import React, { ChangeEvent, useState } from "react";

function ImageUpload() {
  const AIModelList = [
    { name: "Google Gemini", icon: "/google.png" },
    { name: "Llama by Meta", icon: "/meta.png" },
    { name: "Deepseek", icon: "/deepseek.png" },
  ];
  const [previewUrl, setPreviewUrl] = useState<string | null>();

  const onImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log("files:", files);
    if (files) {
      console.log(files[0]);
      const imageUrl = URL.createObjectURL(files[0]);
      setPreviewUrl(imageUrl);
    }
  };

  return (
    <div className="mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {!previewUrl ? (
          <div className="flex flex-col items-center justify-center p-7 border border-black border-dashed rounded-md shadow-md">
            <CloudUpload className="h-10 w-10 text-primary" />
            <h2 className="font-bold text-lg">Upload Image</h2>
            <p className="text-gray-400 mt-3">
              Click the button to select Wireframe Image
            </p>
            <div className="p-5 border border-black border-dashed w-full flex justify-center mt-7">
              <label htmlFor="imageSelect">
                <h2 className="p-2 bg-blue-300/50 text-primary font-medium rounded-md px-3 cursor-pointer">
                  Select Image
                </h2>
              </label>
            </div>
            <input
              className="hidden"
              type="file"
              id="imageSelect"
              multiple={false}
              onChange={onImageSelect}
            />
          </div>
        ) : (
          <div className="p-5 border border-dashed">
            <Image
              src={previewUrl}
              alt="preview"
              height={500}
              width={500}
              className="w-full h-[300px] object-contain"
            />
            <X
              className="flex justify-end w-full cursor-pointer"
              onClick={() => setPreviewUrl(null)}
            />
          </div>
        )}
        <div className="p-7 border shadow-md rounded-lg">
          <h2 className="font-bold text-lg">Select AI Models</h2>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select AI Model" />
            </SelectTrigger>
            <SelectContent>
              {AIModelList.map((model, idx) => (
                <SelectItem value={model.name}>
                  <div key={idx} className="flex items-center gap-2">
                    <Image
                      src={model.icon}
                      alt={model.name}
                      width={25}
                      height={25}
                    />
                    <h2>{model.name}</h2>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <h2 className="font-bold text-lg mt-7">
            Enter Description about your wireframe
          </h2>
          <Textarea
            className="mt-3 h-[200px]"
            placeholder="Write about your design/webpage"
          />
        </div>
      </div>
      <div className="mt-10 flex items-center justify-center">
        <Button>
          <Wand />
          Convert to code
        </Button>
      </div>
    </div>
  );
}

export default ImageUpload;
