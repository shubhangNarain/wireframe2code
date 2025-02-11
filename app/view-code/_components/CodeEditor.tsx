import React from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import { Sandpack } from "@codesandbox/sandpack-react";
import { aquaBlue, sandpackDark } from "@codesandbox/sandpack-themes";
import Constants from "@/data/Constants";

function CodeEditor({ codeResp, isReady }: any) {
  return (
    <div>
      {isReady ? (
        <Sandpack
          template="react"
          theme={sandpackDark}
          options={{
            externalResources: ["https://cdn.tailwindcss.com"],
            showNavigator: true,
            showTabs: true,
            editorHeight: 600,
          }}
          customSetup={{
            dependencies: {
              ...Constants.DEPENDANCY,
            },
          }}
          files={{
            "/App.js": `${codeResp}`,
          }}
        />
      ) : (
        <SandpackProvider
          template="react"
          theme={aquaBlue}
          files={{
            "/App.js": {
              code: `${codeResp}`,
              active: true,
            },
          }}
          customSetup={{
            dependencies: {
              ...Constants.DEPENDANCY,
            },
          }}
          options={{
            externalResources: ["https://cdn.tailwindcss.com"],
          }}
        >
          <SandpackLayout>
            <SandpackCodeEditor showTabs={true} style={{ height: "70vh" }} />
            <SandpackPreview style={{ height: "70vh"}}/>
          </SandpackLayout>
        </SandpackProvider>
      )}
    </div>
  );
}

export default CodeEditor;
