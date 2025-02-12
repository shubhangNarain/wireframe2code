"use client";
import { useAuthContext } from "@/app/provider";
import axios from "axios";
import React, { useEffect, useState } from "react";
import DesignCard from "./_components/DesignCard";
import { LoaderCircle } from "lucide-react";

function page() {
  const { user } = useAuthContext();

  const [wireframes, setWireframes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAllWireframes = async () => {
    const result = await axios.get(
      `/api/wireframe-to-code?email=${user?.email}`
    );
    console.log(result.data);
    setWireframes(result.data);
    console.log("Wireframes details:", wireframes);
    setIsLoading(false);
  };

  useEffect(() => {
    user && getAllWireframes();
  }, [user]);

  return !isLoading ? (
    <div>
      <h2 className="font-bold text-2xl">Wifreframes and Codes:</h2>
      {wireframes?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-10">
          {wireframes.map((item, index) => {
            return <DesignCard key={index} item={item} />;
          })}
        </div>
      ) : (
        <div className="mt-10">
          <h2 className="font-bold text-2xl">No wireframes found.</h2>
          <p>
            Please upload your wireframes to see them converted to code. Visit
            your{" "}
            <a className="text-primary" href="/dashboard">
              Dashboard
            </a>{" "}
            page to start uploading wireframes/designs.
          </p>
        </div>
      )}
    </div>
  ) : (
    <div className="font-bold text-2xl text-center p-20 flex items-center justify-center bg-slate-100 h-[80vh] rounded-xl gap-10">
      <LoaderCircle className="animate-spin" />
      <h2 className="">Loading wireframes...</h2>
    </div>
  );
}

export default page;
