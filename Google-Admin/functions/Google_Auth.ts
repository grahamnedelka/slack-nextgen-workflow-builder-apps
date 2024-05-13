import { DefineFunction, Schema, SlackAPI } from "deno-slack-sdk/mod.ts";
import { SlackFunction } from "deno-slack-sdk/mod.ts";

import { DataMapper, Operator } from "deno-slack-data-mapper/mod.ts";
import { workflow } from "../workflows/GetUserAuth.ts";
import { UserGoogleTokensDatastore } from "../datastores/UserGoogleTokens.ts";

export const Google_Auth = DefineFunction({
  callback_id: "google_auth",
  title: "Google Auth",
  description: "Google Auth",
  source_file: "functions/Google_Auth.ts",
  input_parameters: {
    properties: {
      the_user_id: {
        type: Schema.types.string,
        description: "The user to select",
      },
      email_address: {
        type: Schema.types.string,
        description: "The email address",
      },
    },
    required: ["the_user_id", "email_address"],
  },
  output_parameters: {
    properties: {
      user_token: {
        type: Schema.types.string,
        description: "The unique token to use in the workflow",
      },
    },
    required: [],
  },
});

export default SlackFunction(
  Google_Auth,
  async ({ inputs, client }) => {
    const { the_user_id, email_address } = inputs;

    const user_id_req = await client.users.info({
      user: the_user_id,
    });
    console.log("USERID");
    const user_id = user_id_req.user.id;
    console.log(user_id);
    console.log("EMAIL");
    const user_email_data = "gnedelka@lyft.com";
    console.log(user_email_data);

    const mapper = new DataMapper<typeof UserGoogleTokensDatastore.definition>({
      datastore: UserGoogleTokensDatastore.definition,
      client,
      logLevel: "DEBUG",
    });

    if (user_email_data === email_address) {
      console.log("email match");
      const simpleQuery = await mapper.findAllBy({
        where: {
          user_id: user_id,
          user_email: inputs.email_address,
        },
      });

      if (simpleQuery.items.length > 0) {
        const the_item = simpleQuery.items[0];
        await client.chat.postMessage({
          channel: user_id,
          text:
            `Copy your token, and paste it into the Google Workflow Builder Step that requires it: \`${
              the_item["unique_token"]
            }\``,
        });
        return { outputs: { user_token: the_item["unique_token"] } };
      } else {
        const the_token = `${user_id}-${crypto.randomUUID()}`;
        const newRecord = await mapper.save({
          attributes: {
            user_id: user_id,
            user_email: email_address,
            unique_token: the_token,
          },
        });

        await client.chat.postMessage({
          channel: user_id,
          text:
            `:white_check_mark: Token created successfully.\nCopy the following token, and paste it into the Google Workflow Builder Step that requires it: \`${the_token}\``,
        });
        return { outputs: { user_token: the_token } };
      }
    } else {
      await client.chat.postMessage({
        channel: user_id,
        text:
          `Sorry, the email address you entered does not match the one in your Slack profile.`,
      });
    }
    return { outputs: {} };
  },
);
