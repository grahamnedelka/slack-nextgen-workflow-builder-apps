import { Trigger } from "deno-slack-api/types.ts";
import { workflow as GoogleWorkflow } from "../workflows/GetUserAuth.ts";

const trigger: Trigger<typeof GoogleWorkflow.definition> = {
  type: "shortcut",
  name: "Setup Google Workflow",
  workflow: `#/workflows/${GoogleWorkflow.definition.callback_id}`,
  inputs: {
    // interactivity is necessary for using OpenForm function
    interactivity: { value: "{{data.interactivity}}" },
    // The following inputs are not necessary for OpenForm
    // You'll use this just for the succeeding functions,
    // which confirm the outputs of OpenForm
    //the_user_id: { value: "{{data.the_user_id}}" },
    //channel_id: { value: "{{data.channel_id}}" },
  },
};
export default trigger;
