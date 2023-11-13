import { Manifest } from "deno-slack-sdk/mod.ts";
import { HTTPRequestFunction } from "./functions/http_request.ts";

export default Manifest({
  name: "HTTP_Request",
  description: "A blank template for building Slack apps with Deno",
  icon: "assets/default_new_app_icon.png",
  functions: [HTTPRequestFunction],
  workflows: [],
  // ===================================================================
  outgoingDomains: [], // Add the domain of your proxy server here
  // ===================================================================
  botScopes: ["commands", "chat:write", "chat:write.public"],
});
