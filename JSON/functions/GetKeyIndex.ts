import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in workflows.
 * https://api.slack.com/automation/functions/custom
 */
export const GetKeyIndexDefinition = DefineFunction({
  callback_id: "GetKeyIndex",
  title: "Get Key Index",
  description: "Finds the index of a key in an array",
  source_file: "functions/GetKeyIndex.ts",
  input_parameters: {
    properties: {
      array_string: {
        type: Schema.types.string,
        description: "array_string",
      },
      array_array: {
        type: Schema.types.array,
        description: "array_object",
        items: {
          type: Schema.types.string,
          description: "array_object",
        },
      },
      array_object: {
        type: Schema.types.object,
        description: "array_object",
      },
      element_name: {
        type: Schema.types.string,
        description: "The element_name",
      },
    },
    required: [],
  },
  output_parameters: {
    properties: {
      the_index: {
        type: Schema.types.integer,
        description: "The index of the key",
      },
    },
    required: ["the_index"],
  },
});

/**
 * SlackFunction takes in two arguments: the CustomFunction
 * definition (see above), as well as a function that contains
 * handler logic that's run when the function is executed.
 * https://api.slack.com/automation/functions/custom
 */
export default SlackFunction(
  GetKeyIndexDefinition,
  ({ inputs }) => {
    // inputs.element_name is set from the interactivity_context defined in sample_trigger.ts
    // https://api.slack.com/automation/forms#add-interactivity
    const the_element: undefined | string = inputs.element_name;
    let the_index = -1;

    try {
      if (the_element === undefined) {
        the_index = -1;
      } else {
        if (inputs.array_string === undefined) {
          if (inputs.array_object === undefined) {
            if (inputs.array_array === undefined) {
              return { outputs: { the_index: -1 } };
            }
          } else {
            the_index = Object.keys(inputs.array_object).indexOf(
              the_element,
            );
          }
        } else {
          the_index = Object.keys(JSON.parse(inputs.array_string))
            .indexOf(
              the_element,
            );
        }
      }
    } catch (error) {
      console.log(error);
      the_index = -1;
    }
    return {
      outputs: {
        the_index: the_index,
      },
    };
  },
);
