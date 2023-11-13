import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const SendMetadataMessage = DefineFunction({
  callback_id: "send_metadata_message",
  title: "Send Metadata Message",
  description: "Send a Slack Message with Metadata",
  source_file: "functions/send_metadata_message.ts",
  input_parameters: {
    properties: {
      channel_id: {
        type: Schema.slack.types.channel_id,
        description: "Channel where the message is",
        title: "Channel",
      },
      message_blocks: {
        type: Schema.slack.types.blocks,
        description: "The message to send",
        title: "Message Content",
      },
      message_metadata: {
        type: Schema.types.string,
        description: "Metadata of the message",
        title: "Message Metadata (JSON)",
      },
    },
    required: ["channel_id", "message_blocks", "message_metadata"],
  },
  output_parameters: {
    properties: {
      message_ts: {
        type: Schema.types.string,
        description: "Timestamp of the message",
      },
    },
    required: [],
  },
});

export default SlackFunction(
  SendMetadataMessage,
  async ({ client, inputs }) => {
    let { channel_id, message_blocks, message_metadata } = inputs;
    try {
      // As a precaution, let's make sure the message handles curly quotes
      message_metadata = message_metadata.replace(/[\u2018\u2019]/g, "'")
        .replace(
          /[\u201C\u201D]/g,
          '"',
        );

      const response = await client.chat.postMessage({
        channel: channel_id,
        blocks: message_blocks,
        metadata: message_metadata,
      });

      return {
        outputs: {
          message_ts: response.ts,
        },
      };
    } catch (error) {
      console.error("======= ERROR ======");
      console.error(error);
      console.error("======= METADATA ======");
      console.error(message_metadata);
      return { error: error.message };
    }
  },
);
