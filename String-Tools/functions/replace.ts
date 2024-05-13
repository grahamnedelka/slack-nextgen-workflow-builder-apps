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
      replaced_text: {
        type: Schema.types.string,
        description: "Text After Replacement",
      },
    },
    required: ["replaced_text"],
  },
});

export default SlackFunction(
  ReplaceFunction,
  ({ inputs }) => {
    console.log(inputs);
    const { input_string, search_string, replace_with, is_regex } = inputs;
    if (is_regex === true) {
      try {
        return {
          outputs: {
            replaced_text: input_string.replace(
              RegExp(
                `${search_string}`,
              ),
              replace_with,
            ),
          },
        };
      } catch (error) {
        console.log("======= ERROR ======");
        console.log(error);
      }
    } else {
      try {
        return {
          outputs: {
            replaced_text: input_string.replace(
              search_string,
              replace_with,
            ),
          },
        };
      } catch (error) {
        console.log("======= ERROR ======");
        console.log(error);
      }
    }
  },
);
