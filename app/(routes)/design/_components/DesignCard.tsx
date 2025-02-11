import { Button } from "@/components/ui/button";
import Constants from "@/data/Constants";
import { Code } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function DesignCard({ item }: any) {
  const modelObj =
    item != null && Constants.AIModelList.find((i) => i.name == item?.model);
  return (
    <div className="p-5 border rounded-lg">
      <Image
        src={item?.imageUrl}
        alt="Image"
        height={200}
        width={300}
        className="w-full h-[200px] object-cover bg-white rounded-lg"
      />

      <div className="mt-2">
        <h2 className="line-clamp-3 text-sm text-gray-400">
          {item?.description}
        </h2>
        <div className="flex justify-between items-center mt-2">
          <div className=" flex  items-center gap-2 p-2 bg-gray-50 rounded-full max-w-[170px]">
            {modelObj && (
              <Image
                src={modelObj?.icon}
                alt={modelObj?.modelName ?? ""}
                height={30}
                width={30}
              />
            )}
            <h2>{modelObj?.name}</h2>
          </div>
          <Link href={`/view-code/${item?.uid}`}>
            <Button className="">
              <Code /> View Code
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DesignCard;
