import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const ConcatFunction = DefineFunction({
  callback_id: "concat_function",
  title: "Concat",
  description: "Concatinate text",
  source_file: "functions/concat.ts",
  input_parameters: {
    properties: {
      input_string: {
        type: Schema.types.string,
        description: "Part one of the text",
        title: "Text",
      },
      input_string2: {
        type: Schema.types.string,
        description: "The text to add",
        title: "Text",
      },
    },
    required: ["input_string", "input_string2"],
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
  ConcatFunction,
  ({ inputs }) => {
    const { input_string, input_string2 } = inputs;
    try {
      const new_text = input_string + input_string2;
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
  },
);
