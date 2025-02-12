import { Button } from "@/components/ui/button";
import Constants from "@/data/Constants";
import { Code } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function DesignCard({ item }: any) {
  if (!item) return null;

  // Debugging logs
  console.log("Item model:", item?.model);
  console.log("AIModelList:", Constants.AIModelList);

  // Ensure correct matching
  const modelObj = Constants.AIModelList.find(
    (i) => i.name === item?.model
  );

  return (
    <div className="p-5 border rounded-lg">
      <Image
        src={item?.imageUrl || "/placeholder-image.png"}
        alt="Image"
        height={200}
        width={300}
        className="w-full h-[200px] object-cover bg-white rounded-lg"
      />

      <div className="mt-2">
        <h2 className="line-clamp-3 text-sm text-gray-400">
          {item?.description || "No description available"}
        </h2>
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-full max-w-[170px]">
            {modelObj?.icon ? (
              <Image
                src={modelObj.icon}
                alt={modelObj?.name || "Model"}
                height={30}
                width={30}
              />
            ) : (
              <span className="text-xs text-gray-400">No model icon</span>
            )}
            <h2>{modelObj?.name || "Unknown Model"}</h2>
          </div>
          <Link href={`/view-code/${item?.uid}`}>
            <Button>
              <Code /> View Code
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DesignCard;
