import { Manifest } from "deno-slack-sdk/mod.ts";
import { GoogleAuth } from "./functions/GoogleFunction.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/future/manifest
 */
export default Manifest({
  name: "Google-Admin",
  description: "A blank template for building Slack apps with Deno",
  icon: "assets/default_new_app_icon.png",
  functions: [GoogleAuth],
  workflows: [],
  outgoingDomains: ["oauth2.googleapis.com", "sheets.googleapis.com"],
  botScopes: [
    "channels:history",
    "channels:join",
    "channels:manage",
    "channels:read",
    "chat:write.customize",
    "chat:write.public",
    "chat:write",
    "emoji:read",
    "groups:history",
    "groups:read",
    "groups:write",
    "im:history",
    "im:read",
    "im:write",
    "metadata.message:read",
    "mpim:history",
    "mpim:read",
    "mpim:write",
    "team:read",
    "triggers:read",
    "triggers:write",
    "usergroups:read",
    "usergroups:write",
    "users:read.email",
    "users:read",
    "users:write",
    "users.profile:read",
    "workflow.steps:execute",
  ],
});
