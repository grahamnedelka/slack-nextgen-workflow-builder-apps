import { Trigger } from "deno-slack-api/types.ts";
import {
  TriggerContextData,
  TriggerEventTypes,
  TriggerTypes,
} from "deno-slack-api/mod.ts";
import HandleMetadataWorkflow from "../workflows/handle_metadata_workflow.ts";

const metadataPostTrigger: Trigger<typeof HandleMetadataWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "Metadata Shortcut",
  description: "Handle a message that contains metadata",
  workflow: "#/workflows/handle_metadata_workflow",
  inputs: {
    ts: {
      value: TriggerContextData.Shortcut.message_ts,
    },
    channel_id: {
      value: TriggerContextData.Shortcut.channel_id,
    },
  },
};

export default metadataPostTrigger;
