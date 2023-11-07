import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";

/** */
const HandleMetadataWorkflow = DefineWorkflow({
  callback_id: "handle_metadata_workflow",
  title: "Handle Metadata",
  description: "handle a message if it contains our app's metadata",
  input_parameters: {
    properties: {
      ts: { type: Schema.types.string },
    },
    required: ["ts"],
  },
});

HandleMetadataWorkflow.addStep(Schema.slack.functions.ReplyInThread, {
  message_context: {
    channel_id: "C064QKCPKD2",
    message_ts: HandleMetadataWorkflow.inputs.ts,
  },
  message: "nice",
});
export default HandleMetadataWorkflow;
