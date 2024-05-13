import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

// Refer to https://api.slack.com/future/datastores for details
export const UploadedFilesDatastore = DefineDatastore({
  name: "uploaded_files",
  primary_key: "file_id",
  attributes: {
    file_id: { type: Schema.types.string, required: true },
    user_id: { type: Schema.types.string, required: true },
    user_email: { type: Schema.types.string, required: true },
    file_name: { type: Schema.types.string, required: true },
    file_mimetype: { type: Schema.types.string, required: false },
    filetype: { type: Schema.types.string, required: false },
    pretty_type: { type: Schema.types.string, required: false },
    size: { type: Schema.types.number, required: false },
    url_private: { type: Schema.types.string, required: false },
    url_private_download: { type: Schema.types.string },
    permalink: { type: Schema.types.string },
    upload_ts: { type: Schema.types.string },
    message_ts: { type: Schema.types.string },
    conversation_id: { type: Schema.types.string },
    unique_token: { type: Schema.types.string, required: true },
    file_url: { type: Schema.types.string },
    spreadsheet_url: { type: Schema.types.string },
    spreadsheet_id: { type: Schema.types.string },
  },
});
