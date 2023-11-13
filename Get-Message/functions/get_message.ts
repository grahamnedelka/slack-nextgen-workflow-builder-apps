import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";
import { SlackFunction } from "deno-slack-sdk/mod.ts";

export const GetMessageFunction = DefineFunction({
  callback_id: "get_message_function",
  title: "Get Message",
  description: "Get a Message",
  source_file: "functions/get_slack_message.ts",
  input_parameters: {
    properties: {
      channel_id: {
        type: Schema.slack.types.channel_id,
        description: "Channel where the message is",
        title: "Channel",
      },
      message_ts: {
        type: Schema.types.string,
        description: "Timestamp of the message",
        title: "Message Timestamps",
      },
      thread_ts: {
        type: Schema.types.string,
        description: "Timestamp of the thread",
        title: "Message Thread Timestamp",
      },
    },
    required: ["channel_id", "message_ts"],
  },
  output_parameters: {
    properties: {
      message_text: {
        type: Schema.types.string,
        description: "The text of the message",
      },
      message_blocks: {
        type: Schema.types.string,
        description: "The blocks of the message, as JSON",
      },
      message_user_id: {
        type: Schema.types.string,
        description: "The user id of the message",
      },
    },
    required: [],
  },
});

export default SlackFunction(
  GetMessageFunction,
  async ({ client, inputs, env }) => {
    const response = await client.conversations.history({
      channel: inputs.channel_id,
      latest: inputs.message_ts,
      inclusive: true,
      limit: 1,
      team: env.TEAM_ID,
    });
    let the_message;

    if (Object.keys(response).includes("messages") === true) {
      if (response.messages.length === 1) {
        the_message = response.messages[0];
      } else {
        return {
          error: "No message found",
        };
      }
    }

    return {
      outputs: {
        message_text: the_message.text,
        message_user_id: the_message.user,
        message_blocks: JSON.stringify(the_message.blocks),
      },
    };
  },
);
