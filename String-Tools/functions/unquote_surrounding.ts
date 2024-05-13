import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const UnquoteSurroundingFunction = DefineFunction({
  callback_id: "unquote_surrounding_function",
  title: "Remove surrounding quotation marks",
  description: "Unquote text",
  source_file: "functions/unquote_surrounding.ts",
  input_parameters: {
    properties: {
      input_string: {
        type: Schema.types.string,
        description: "Text to remove surrounding quotation marks from",
        title: "Input Text",
      },
    },
    required: ["input_string"],
  },
  output_parameters: {
    properties: {
      unquoted_text: {
        type: Schema.types.string,
        description: "Unquoted Text",
      },
    },
    required: ["unquoted_text"],
  },
});

export default SlackFunction(
  UnquoteSurroundingFunction,
  ({ inputs }) => {
    const { input_string } = inputs;
    try {
      const unquoted_text = input_string.replace(/^"(.*)"$/, "$1");
      return {
        outputs: {
          unquoted_text: unquoted_text,
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
