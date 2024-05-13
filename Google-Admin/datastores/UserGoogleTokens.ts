import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

// Refer to https://api.slack.com/future/datastores for details
export const UserGoogleTokensDatastore = DefineDatastore({
  name: "userGoogleTokens",
  primary_key: "user_id",
  attributes: {
    user_id: { type: Schema.types.string, required: true },
    user_email: { type: Schema.types.string, required: true },
    unique_token: { type: Schema.types.string, required: true },
  },
});
