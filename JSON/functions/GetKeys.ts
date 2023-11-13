import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const GetKeysDefinition = DefineFunction({
  callback_id: "GetKeys",
  title: "Get keys",
  description: "gets keys in a json object",
  source_file: "functions/GetKeys.ts",
  input_parameters: {
    properties: {
      json_string: {
        type: Schema.types.string,
        description: "json_string",
      },
    },
    required: ["json_string"],
  },
  output_parameters: {
    properties: {
      keys_as_string: {
        type: Schema.types.string,
        description: "The Keys as a string",
      },
    },
    required: ["keys_as_string"],
  },
});

export default SlackFunction(
  GetKeysDefinition,
  ({ inputs }) => {
    const json_string_input = inputs.json_string;
    const keys_as_string = JSON.stringify(
      Object.keys(JSON.parse(json_string_input)),
    );

    return {
      outputs: {
        keys_as_string: keys_as_string,
      },
    };
  },
);
