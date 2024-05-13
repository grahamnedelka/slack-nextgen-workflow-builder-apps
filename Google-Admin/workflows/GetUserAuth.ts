// ----------------
// Workflow Definition
// ----------------

import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { Google_Auth } from "../functions/Google_Auth.ts";

export const workflow = DefineWorkflow({
  callback_id: "google-auth-workflow",
  title: "Google Auth Workflow",
  input_parameters: {
    properties: {
      interactivity: { type: Schema.slack.types.interactivity },
    },
    required: ["interactivity"],
  },
});

// Step using the built-in form
const formStep = workflow.addStep(Schema.slack.functions.OpenForm, {
  title: "Google Account Details",
  interactivity: workflow.inputs.interactivity,
  submit_label: "Submit",
  fields: {
    // fields.elements will be converted to Block Kit components under the hood
    elements: [
      {
        name: "email",
        title: "Enter your lyft.com email address",
        type: Schema.types.string, // => "plain_text_input"
        long: false, // => multiline: true
        minLength: 1, // inclusive
        maxLength: 100, // inclusive
      },
    ],
    required: ["email"],
  },
});

workflow.addStep(
  Google_Auth,
  {
    the_user_id: workflow.inputs.interactivity.interactor.id,
    email_address: formStep.outputs.fields.email,
  },
);
