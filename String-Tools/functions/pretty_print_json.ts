import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const PrettyPrintJsonFunction = DefineFunction({
  callback_id: "pretty_print_json",
  title: "Pretty-Print JSON",
  description: "Formats a JSON string for readability",
  source_file: "functions/pretty_print_json.ts",
  input_parameters: {
    properties: {
      input_string: {
        type: Schema.types.string,
        description: "The JSON to be formatted",
        title: "JSON Text",
      },
    },
    required: ["input_string"],
  },
  output_parameters: {
    properties: {
      formatted_json: {
        type: Schema.types.string,
        description: "The formatted JSON",
      },
    },
    required: ["formatted_json"],
  },
});

export default SlackFunction(
  PrettyPrintJsonFunction,
  ({ inputs }) => {
    const { input_string } = inputs;
    try {
      return {
        outputs: {
          formatted_json: JSON.stringify(JSON.parse(input_string), null, 2),
        },
      };
    } catch (error) {
      console.error("======= ERROR ======");
      console.error(error);
      console.error("======= INPUTS ======");
      console.error(inputs);
      return { error: error.message };
    }
  },
);
