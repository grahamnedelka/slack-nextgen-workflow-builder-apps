import { Manifest } from "deno-slack-sdk/mod.ts";
import { SendMetadataMessage } from "./functions/SendMetadataMessage.ts";
import HandleMetadataWorkflow from "./workflows/handle_metadata_workflow.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/future/manifest
 */
export default Manifest({
  name: "Send-Message-With-Metadata",
  description:
    "Demonstrates sending a message with metadata, and running a workflow when a message with metadata is posted",
  icon: "assets/default_new_app_icon.png",
  functions: [SendMetadataMessage],
  workflows: [HandleMetadataWorkflow],
  outgoingDomains: [],
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
