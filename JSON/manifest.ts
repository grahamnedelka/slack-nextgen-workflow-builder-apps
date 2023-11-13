import { Manifest } from "deno-slack-sdk/mod.ts";
import { GetElementDefinition } from "./functions/GetElement.ts";
import { GetKeysDefinition } from "./functions/GetKeys.ts";
import { GetValuesDefinition } from "./functions/GetValues.ts";
import { GetKeyIndexDefinition } from "./functions/GetKeyIndex.ts";

export default Manifest({
  name: "JSON",
  description: "A template for building Slack apps with Deno",
  icon: "assets/default_new_app_icon.png",
  functions: [
    GetElementDefinition,
    GetKeysDefinition,
    GetValuesDefinition,
    GetKeyIndexDefinition,
  ],
  workflows: [],
  // ===================================================================
  outgoingDomains: [], // Add the domain of your proxy server here
  // ===================================================================
  datastores: [],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "datastore:read",
    "datastore:write",
    "users:read",
    "users:read.email",
    "users.profile:read",
    "channels:join",
    "channels:manage",
    "channels:history",
    "groups:write",
    "groups:history",
    "im:write",
    "im:history",
    "mpim:write",
    "triggers:write",
    "triggers:read",
  ],
});
