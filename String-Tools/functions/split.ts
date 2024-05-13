import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const SplitFunction = DefineFunction({
  callback_id: "split_function",
  title: "Split Text",
  description: "Split text",
  source_file: "functions/split.ts",
  input_parameters: {
    properties: {
      input_text: {
        type: Schema.types.string,
        description: "Input text",
        title: "Text",
      },
      split_choice: {
        type: Schema.types.array,
        minItems: 1,
        maxItems: 1,
        description: "Split using either index or text match",
        title: "Split using",
        items: {
          enum: ["Index", "Text Match", "Regex Match"],
          type: Schema.types.string,
          choices: [
            {
              title: "Index",
              value: "Index",
            },
            {
              title: "Text Match",
              value: "Text Match",
            },
            {
              title: "Regex Match",
              value: "Regex Match",
            },
          ],
        },
      },
      split_text: {
        type: Schema.types.string,
        description: "Split at",
        title: "Split at",
      },
    },
    required: ["input_text", "split_choice", "split_text"],
  },
  output_parameters: {
    properties: {
      first_part: {
        type: Schema.types.string,
        description: "Before Match",
      },
      second_part: {
        type: Schema.types.string,
        description: "After Match",
      },
    },
    required: ["first_part", "second_part"],
  },
});

export default SlackFunction(
  SplitFunction,
  ({ inputs }) => {
    const input_text = inputs.input_text;
    const split_choice = inputs.split_choice;
    const split_text = inputs.split_text;
    let first_part = "";
    let second_part = "";
    console.log(split_choice);
    if (split_choice.at(0) === "Index") {
      try {
        first_part = input_text.substring(0, Number(split_text));
        second_part = input_text.substring(Number(split_text));
      } catch (error) {
        console.error("======= ERROR ======");
        console.error(error);
        console.error("======= INPUTS ======");
        console.error(inputs);
        return {
          error: error.message,
        };
      }
    } else {
      if (split_choice.at(0) === "Text Match") {
        try {
          first_part = input_text.split(split_text)[0];
          second_part = input_text.split(split_text)[1];
        } catch (error) {
          console.error("======= ERROR ======");
          console.error(error);
          console.error("======= INPUTS ======");
          console.error(inputs);
          return {
            error: error.message,
          };
        }
      } else {
        try {
          first_part = input_text.split(RegExp(split_text))[0];
          second_part = input_text.split(RegExp(split_text))[1];
        } catch (error) {
          console.error("======= ERROR ======");
          console.error(error);
          console.error("======= INPUTS ======");
          console.error(inputs);
          return {
            error: error.message,
          };
        }
      }
    }
    return {
      outputs: {
        first_part: first_part,
        second_part: second_part,
      },
    };
  },
);
