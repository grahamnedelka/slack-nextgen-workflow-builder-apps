import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const FindFunction = DefineFunction({
  callback_id: "find_function",
  title: "Find",
  description: "Finds position of matching text within a string",
  source_file: "functions/find.ts",
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

      is_regex: {
        type: Schema.types.boolean,
        description: "Uses regex",
        title: "Use Regex?",
        default: false,
      },
    },
    required: ["input_string", "search_string", "is_regex"],
  },
  output_parameters: {
    properties: {
      index: {
        type: Schema.types.number,
        description: "Position of matching text within a string",
      },
    },
    required: ["index"],
  },
});

export default SlackFunction(
  FindFunction,
  ({ inputs }) => {
    const { input_string, search_string, is_regex } = inputs;

    if (is_regex === true) {
      try {
        const index = input_string.search(`/${search_string}/g`);
        return {
          outputs: {
            index: index,
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
        const index = input_string.indexOf(search_string);
        return {
          outputs: {
            index: index,
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
