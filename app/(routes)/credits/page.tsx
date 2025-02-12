"use client";
import { useAuthContext } from "@/app/provider";
import { Button } from "@/components/ui/button";
import Constants from "@/data/Constants";
import axios from "axios";
import React, { useEffect, useState } from "react";
import CreditsCard from "./_components/CreditsCard";

function page() {
  const { user } = useAuthContext();
  const [userData, setUserData] = useState<any>();

  useEffect(() => {
    getUserCredits();
  }, [user]);

  const getUserCredits = async () => {
    const result = await axios.get("/api/user?email=" + user?.email);
    console.log("Credits:", result?.data);
    setUserData(result?.data);
  };

  return (
    <div>
      <h2 className="font-bold text-2xl">Credits</h2>

      <div className="p-5 bg-slate-50 rounded-xl border flex items-center justify-between mt-6">
        <div className="flex">
          <h2 className="font-cold text-xl">My Credits:</h2>
          {userData?.credits && (
            <p className="text-lg text-gray-500">
              {userData?.credits} Credits Left
            </p>
          )}
        </div>
        <Button>Get More Credits</Button>
      </div>

      <div className="h-[70vh] w-full flex items-center justify-center">
        <CreditsCard/>
      </div>
    </div>
  );
}

export default page;
