"use client";
import AppHeader from "@/app/_components/AppHeader";
import Constants from "@/data/Constants";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import SelectionDetail from "../_components/SelectionDetail";
import CodeEditor from "../_components/CodeEditor";

export interface RECORD {
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
  const [codeResp, setCodeResp] = useState("");
  const [record, setRecord] = useState<RECORD | null>(null as RECORD | null);

  useEffect(() => {
    uid && getRecordInfo();
  }, [uid]);

  // useEffect(() => {
  //   console.log("Record Updated:", record);
  // }, [record]);

  const getRecordInfo = async () => {
    setLoading(true);
    const result = await axios.get("/api/wireframe-to-code/?uid=" + uid);
    console.log(result.data);
    const resp = result?.data;
    setRecord(result?.data)
    console.log("RECORD:",record)
    if (resp.code == null) {
      // generateCode(resp);
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

      const text = decoder
        .decode(value)
        .replace("javascript", "")
        .replace("```typescript```", "")
        .replace("```", "");
      console.log(text);
      setCodeResp((prev) => prev + text);
    }
    setLoading(false);
  };

  return (
    <div>
      <AppHeader hideSidebar={true} />
      <div className="grid grid-cols-1 md:grid-cols-5 p-5 gap-10">
        <div>
          {/* Selection Details */}
          <SelectionDetail record={record}/>
        </div>
        <div className="col-span-4">
          {/* Code Editor */}
          <CodeEditor />
        </div>
      </div>
    </div>
  );
}

export default ViewCode;
