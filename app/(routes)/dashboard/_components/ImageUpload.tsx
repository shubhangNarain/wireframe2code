"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
//@ts-ignore
import uuid4 from "uuid4";
import { Textarea } from "@/components/ui/textarea";
import { storage } from "@/configs/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { CloudUpload, Loader2Icon, Wand, X } from "lucide-react";
import Image from "next/image";
import React, { ChangeEvent, useState } from "react";
import { useAuthContext } from "@/app/provider";
import axios from "axios";
import { useRouter } from "next/navigation";
import Constants from "@/data/Constants";
import { toast } from "sonner";

function ImageUpload() {
  const [previewUrl, setPreviewUrl] = useState<string | null>();
  const [file, setFile] = useState<any>();
  const [model, setModel] = useState<string>();
  const [description, setDescription] = useState<string>();
  const { user } = useAuthContext();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const onImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log("files:", files);
    if (files) {
      console.log(files[0]);
      const imageUrl = URL.createObjectURL(files[0]);
      setFile(files[0]);
      setPreviewUrl(imageUrl);
    }
  };

  const onConvertToCodeButtonClick = async () => {
    if (!file || !model || !description) {
      alert("Please fill all fields");
      return;
    }
    setLoading(true);
    // saving image to firebase
    const fileName = Date.now() + ".png";
    const imageRef = ref(storage, "wireframe2code-web/" + fileName);
    await uploadBytes(imageRef, file).then((resp) =>
      console.log("Image uploaded:", resp)
    );

    const imageUrl = await getDownloadURL(imageRef);
    console.log("Image URL:", imageUrl);

    const uid = uuid4();
    console.log("Uploaded id:", uid);
    // save image to db
    const result = await axios.post("/api/wireframe-to-code", {
      uid: uid,
      imageUrl: imageUrl,
      model: model,
      description: description,
      email: user?.email,
    });
    if (result.data?.error) {
      console.log("Error saving to db:", result.data?.error);
      toast("Not enough Credits!");
      setLoading(false);
      return;
    }
    setLoading(false);
    router.push("/view-code/" + uid);
  };

  return (
    <div className="mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {!previewUrl ? (
          <div className="flex flex-col items-center justify-center p-7 border border-gray-400 border-dashed rounded-md shadow-lg">
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
          <Select onValueChange={(val) => setModel(val)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select AI Model" />
            </SelectTrigger>
            <SelectContent>
              {Constants?.AIModelList.map((model, idx) => (
                <SelectItem key={idx} value={model.name}>
                  <div className="flex items-center gap-2">
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
            onChange={(e) => setDescription(e?.target.value)}
            className="mt-3 h-[200px]"
            placeholder="Write about your design/webpage"
          />
        </div>
      </div>
      <div className="mt-10 flex items-center justify-center">
        <Button
          onClick={onConvertToCodeButtonClick}
          disabled={loading ? true : false}
        >
          {loading ? <Loader2Icon className="animate-spin" /> : <Wand />}
          Convert to code
        </Button>
      </div>
    </div>
  );
}

export default ImageUpload;
