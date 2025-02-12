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
  const [record, setRecord] = useState<RECORD | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (uid) getRecordInfo();
  }, [uid]);

  useEffect(() => {
    if (record) {
      console.log("Updated Record:", record);
      if (!record.code) {
        generateCode(record);
      } else {
        setCodeResp(record?.code?.resp || "");
        setLoading(false);
        setIsReady(true);
      }
    }
  }, [record]);

  const getRecordInfo = async () => {
    setIsReady(false);
    setCodeResp("");
    setLoading(true);

    try {
      const result = await axios.get(`/api/wireframe-to-code/?uid=${uid}`);
      console.log("Fetched Record:", result.data);
      setRecord(result.data);
    } catch (error) {
      console.error("Error fetching record:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateCode = async (record: RECORD) => {
    setLoading(true);
    setCodeResp(""); // Reset previous response

    try {
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
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder
          .decode(value)
          .replace("javascript", "")
          .replace("```typescript```", "")
          .replace("```", "");

        fullText += text;
      }

      setCodeResp(fullText);
      setIsReady(true);
      updateCodeToDb(fullText);
    } catch (error) {
      console.error("Error generating code:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateCodeToDb = async (code: string) => {
    if (!record?.uid) return;

    try {
      await axios.put("/api/wireframe-to-code", {
        uid: record.uid,
        codeResp: { resp: code },
      });

      // Update local state to reflect DB change
      setRecord((prev) => (prev ? { ...prev, code: { resp: code } } : prev));
    } catch (error) {
      console.error("Error updating code in DB:", error);
    }
  };

  return (
    <div>
      <AppHeader hideSidebar={true} />
      <div className="grid grid-cols-1 md:grid-cols-5 p-5 gap-10">
        <div>
          <SelectionDetail
            record={record}
            regenerateCode={() => generateCode(record!)}
            isReady={!loading}
          />
        </div>
        <div className="col-span-4">
          {loading ? (
            <h2 className="font-bold text-2xl text-center p-20 flex items-center justify-center bg-slate-100 h-[80vh] rounded-xl">
              <LoaderCircle className="animate-spin" />
              Analyzing wireframe...
            </h2>
          ) : (
            <CodeEditor codeResp={codeResp} isReady={isReady} />
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewCode;
