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
  uid: string;
}

function ViewCode() {
  const { uid } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [codeResp, setCodeResp] = useState("");
  const [record, setRecord] = useState<RECORD | null>();
  const [isReady, setIsReady] = useState(false);
  const [isExisting, setIsExisting] = useState();

  useEffect(() => {
    uid && getRecordInfo();
  }, [uid]);

  useEffect(() => {
    console.log("Record Updated:", record);
  }, [record]);

  const getRecordInfo = async () => {
    setIsReady(false);
    setCodeResp("");
    setLoading(true);
    const result = await axios.get("/api/wireframe-to-code/?uid=" + uid);
    console.log(result.data);
    const resp = result?.data;
    setRecord(result?.data);
    console.log("RECORD:", record);
    if (resp.code == null) {
      generateCode(resp);
    } else {
      setCodeResp(resp?.code?.resp);
      setLoading(false);
      setIsReady(true);
    }
    if (resp?.error) {
      console.error("Error:", resp.error);
      return;
    }
    // setIsReady(false);
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
    setLoading(false);
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
    updateCodeToDb();
    setIsReady(true);
  };

  useEffect(() => {
    if (codeResp != "" && record?.uid && isReady && record?.code == null) {
      updateCodeToDb();
    }
  }, [codeResp && record && isReady]);

  const updateCodeToDb = async () => {
    const result = await axios.put("/api/wireframe-to-code", {
      uid: record?.uid,
      codeResp: { resp: codeResp },
    });

    console.log(result);
    // if (result.status === 200) {
    //   setIsReady(true);
    //   getRecordInfo();
    // } else {
    //   console.error("Error updating code:", result);
    // }
  };

  return (
    <div>
      <AppHeader hideSidebar={true} />
      <div className="grid grid-cols-1 md:grid-cols-5 p-5 gap-10">
        <div>
          {/* Selection Details */}
          <SelectionDetail
            record={record}
            regenerateCode={() => getRecordInfo()}
            isReady={isReady}
          />
        </div>
        <div className="col-span-4">
          {/* Code Editor */}
          {loading ? (
            <div className="">
              <h2 className="font-bold text-2xl text-center p-20 flex items-center justify-center bg-slate-100 h-[80vh] rounded-xl">
                <LoaderCircle className="animate-spin" />
                Analyzing wireframe...
              </h2>
            </div>
          ) : (
            <CodeEditor codeResp={codeResp} isReady={isReady} />
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewCode;
