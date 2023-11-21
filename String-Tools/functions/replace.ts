import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const ReplaceFunction = DefineFunction({
  callback_id: "replace_function",
  title: "Replace",
  description: "Replace text",
  source_file: "functions/replace.ts",
  input_parameters: {
    properties: {
      input_string: {
        type: Schema.types.string,
        description: "The input text",
        title: "Text",
      },
      search_string: {
        type: Schema.types.string,
        description: "The text to search for",
        title: "Search For",
      },
      replace_with: {
        type: Schema.types.string,
        description: "The text to replace with",
        title: "Replace With",
      },
      is_regex: {
        type: Schema.types.boolean,
        description: "Uses regex",
        title: "Use Regex?",
        default: false,
      },
    },
    required: ["input_string", "search_string", "replace_with", "is_regex"],
  },
  output_parameters: {
    properties: {
      new_text: {
        type: Schema.types.string,
        description: "New Text",
      },
    },
    required: ["new_text"],
  },
});

export default SlackFunction(
  ReplaceFunction,
  ({ inputs }) => {
    const { input_string, search_string, replace_with, is_regex } = inputs;
    if (is_regex === true) {
      try {
        const new_text = input_string.replace(
          `/${search_string}/g`,
          replace_with,
        );
        return {
          outputs: {
            new_text: new_text,
          },
        };
      } catch (error) {
        console.error("======= ERROR ======");
        console.error(error);
        console.error("======= INPUTS ======");
        console.error(inputs);
        return { error: error.message };
      }
    } else {
      try {
        const new_text = input_string.replace(search_string, replace_with);
        return {
          outputs: {
            new_text: new_text,
          },
        };
      } catch (error) {
        console.error("======= ERROR ======");
        console.error(error);
        console.error("======= INPUTS ======");
        console.error(inputs);
        return { error: error.message };
      }
    }
  },
);
