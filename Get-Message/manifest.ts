import { Manifest } from "deno-slack-sdk/mod.ts";
import { GetMessageFunction } from "./functions/get_message.ts";

export default Manifest({
  name: "Get-Message",
  description: "Get a message from a channel",
  icon: "assets/default_new_app_icon.png",
  functions: [GetMessageFunction],
  workflows: [],
  outgoingDomains: [],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "users:read",
    "channels:history",
    "groups:history",
    "im:history",
    "mpim:history",
  ],
});
