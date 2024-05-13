import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { SendMetadataMessage } from "../functions/send_metadata_message.ts";

const HandleMetadataWorkflow = DefineWorkflow({
  callback_id: "handle_metadata_workflow",
  title: "Handle Metadata",
  description: "handle a message if it contains our app's metadata",

  input_parameters: {
    properties: {
      ts: {
        type: Schema.types.string,
        description: "Timestamp of the message",
      },
      channel_id: {
        type: Schema.slack.types.channel_id,
        description: "Channel where the message is",
        title: "Channel",
      },
      channel_string: {
        type: Schema.types.string,
        description: "Channel where the message is",
        title: "Channel",
      },
    },
    required: [],
  },
});

console.log("======= INPUTS ======");
console.log(HandleMetadataWorkflow.inputs.channel_id);
const next_step = HandleMetadataWorkflow.addStep(
  SendMetadataMessage,
  {
    channel_id: "C064QKCPKD2",
    message_blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "This message contains metadata!",
        },
      },
    ],
    message_metadata: JSON.stringify({
      "event_type": "la",
      "event_payload": {
        "crm_id": "123456ABCD",
        "external_id": "QWERTY12",
        "nurture_step": "new_account",
      },
    }),
  },
);

export default HandleMetadataWorkflow;
