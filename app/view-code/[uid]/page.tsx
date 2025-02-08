"use client";
import Constants from "@/data/Constants";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface RECORD {
  id: number;
  description: string;
  code: any;
  imageUrl: string;
  model: string;
  createdBy: string;
}

function ViewCode() {
  const { uid } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [codeResp, setCodeResp] = useState('');

  useEffect(() => {
    uid && getRecordInfo();
  }, [uid]);

  const getRecordInfo = async () => {
    setLoading(true);
    const result = await axios.get("/api/wireframe-to-code/?uid=" + uid);
    console.log(result.data);
    const resp = result?.data;
    if (resp.code == null) {
      generateCode(resp);
    }
    if (resp?.error) {
      console.error("Error:", resp.error);
      return;
    }
    setLoading(false);
  };

  const generateCode = async (record: RECORD) => {
    setLoading(true);
    const res = await fetch("/api/ai-model", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: record.description + ":" + Constants.PROMPT,
        model: record.model,
        imageUrl: record?.imageUrl,
      }),
    });

    if (!res.body) return;
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = (decoder.decode(value)).replace('javascript','').replace('```typescript```', '').replace('```', '');
      console.log(text);
      setCodeResp((prev) => prev + text);
    }
    setLoading(false);
  };

  return (
    <div>
      View Code
      {loading && <LoaderCircle className="animate-spin" />}

      <p>{codeResp}</p>
    </div>
  );
}

export default ViewCode;
