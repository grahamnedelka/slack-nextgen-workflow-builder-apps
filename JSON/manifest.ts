import { Manifest } from "deno-slack-sdk/mod.ts";
import { GetElementDefinition } from "./functions/GetElement.ts";
import { GetKeysDefinition } from "./functions/GetKeys.ts";
import { GetValuesDefinition } from "./functions/GetValues.ts";
import { GetKeyIndexDefinition } from "./functions/GetKeyIndex.ts";

export default Manifest({
  name: "JSON",
  description: "Interact with JSON objects",
  icon: "assets/default_new_app_icon.png",
  functions: [
    GetElementDefinition,
    GetKeysDefinition,
    GetValuesDefinition,
    GetKeyIndexDefinition,
  ],
  workflows: [],
  outgoingDomains: [],
  datastores: [],
  botScopes: ["commands", "chat:write", "chat:write.public"],
});
