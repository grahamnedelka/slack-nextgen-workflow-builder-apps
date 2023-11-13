import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in workflows.
 * https://api.slack.com/automation/functions/custom
 */
export const GetValuesDefinition = DefineFunction({
  callback_id: "GetValues",
  title: "Get values",
  description: "gets values in a json object",
  source_file: "functions/GetValues.ts",
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
      values_as_string: {
        type: Schema.types.string,
        description: "Updated json_string",
      },
      values_as_list: {
        type: Schema.types.array,
        description: "Updated json_string",
        items: {
          type: Schema.types.string,
        },
      },
    },
    required: ["values_as_string", "values_as_list"],
  },
});

/**
 * SlackFunction takes in two arguments: the CustomFunction
 * definition (see above), as well as a function that contains
 * handler logic that's run when the function is executed.
 * https://api.slack.com/automation/functions/custom
 */
export default SlackFunction(
  GetValuesDefinition,
  ({ inputs, client }) => {
    // inputs.element_name is set from the interactivity_context defined in sample_trigger.ts
    // https://api.slack.com/automation/forms#add-interactivity

    console.log(inputs.json_string);
    const the_json: Object = JSON.parse(inputs.json_string);
    the_json;
    Object.values;
    return {
      outputs: {
        values_as_list: Object.values(the_json),
        values_as_string: JSON.stringify(Object.values(the_json)),
      },
    };
  },
);
