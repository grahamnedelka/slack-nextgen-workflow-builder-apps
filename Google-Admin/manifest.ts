import { Manifest } from "deno-slack-sdk/mod.ts";
import { GoogleFunction } from "./functions/GoogleFunction.ts";
import { Google_Auth } from "./functions/Google_Auth.ts";
import { UserGoogleTokensDatastore } from "./datastores/UserGoogleTokens.ts";
import { workflow as GoogleWorkflow } from "./workflows/GetUserAuth.ts";
import { UploadedFilesDatastore } from "./datastores/UploadedFiles.ts";
import { ListSpreadsheets } from "./functions/List_Spreadsheets.ts";
import GoogleProvider from "./external_auth/google_provider.ts";

export default Manifest({
  name: "Google-Admin",
  description: "A blank template for building Slack apps with Deno",
  icon: "assets/default_new_app_icon.png",
  functions: [Google_Auth, GoogleFunction, ListSpreadsheets],
  datastores: [UserGoogleTokensDatastore, UploadedFilesDatastore],
  workflows: [GoogleWorkflow],
  externalAuthProviders: [GoogleProvider],
  outgoingDomains: [
    "oauth2.googleapis.com",
    "sheets.googleapis.com",
    "docs.google.com",
    "www.googleapis.com",
  ],
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
    "files:read",
    "files:write",
    "groups:read",
    "groups:write",
    "im:history",
    "im:read",
    "im:write",
    "datastore:read",
    "datastore:write",
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
