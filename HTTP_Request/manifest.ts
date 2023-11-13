import { Manifest } from "deno-slack-sdk/mod.ts";
import { HTTPRequestFunction } from "./functions/http_request.ts";

export default Manifest({
  name: "HTTP_Request",
  description: "Perform an HTTP Request",
  icon: "assets/default_new_app_icon.png",
  functions: [HTTPRequestFunction],
  workflows: [],
  // ===================================================================
  outgoingDomains: [], // Add the domain of your proxy server here
  // ===================================================================
  botScopes: ["commands", "chat:write", "chat:write.public"],
});
