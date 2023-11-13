import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in workflows.
 * https://api.slack.com/automation/functions/custom
 */
export const GetElementDefinition = DefineFunction({
  callback_id: "GetElement",
  title: "Get Element",
  description: "gets one element from a json object",
  source_file: "functions/GetElement.ts",
  input_parameters: {
    properties: {
      json_string: {
        type: Schema.types.string,
        description: "json_string",
      },
      element_name: {
        type: Schema.types.string,
        description: "The element_name",
      },
    },
    required: ["json_string"],
  },
  output_parameters: {
    properties: {
      new_json_string: {
        type: Schema.types.string,
        description: "Updated json_string",
      },
    },
    required: ["new_json_string"],
  },
});

/**
 * SlackFunction takes in two arguments: the CustomFunction
 * definition (see above), as well as a function that contains
 * handler logic that's run when the function is executed.
 * https://api.slack.com/automation/functions/custom
 */
export default SlackFunction(
  GetElementDefinition,
  ({ inputs }) => {
    let new_json;
    const element_name: undefined | string = inputs.element_name;
    console.log(inputs.json_string);
    const the_json = JSON.parse(inputs.json_string);
    try {
      for (let i = 0; i < Object.keys(the_json).length; i++) {
        if (Object.keys(the_json)[i] === element_name) {
          new_json = Object.values(the_json)[i];
        }
      }
      if (new_json === undefined) {
        new_json = "Error";
      }
    } catch (error) {
      console.log(error);
      return { outputs: { new_json_string: error } };
    }
    return { outputs: { new_json_string: JSON.stringify(new_json) } };
  },
);
