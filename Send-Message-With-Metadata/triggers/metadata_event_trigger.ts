import { Trigger } from "deno-slack-api/types.ts";
import {
  TriggerContextData,
  TriggerEventTypes,
  TriggerTypes,
} from "deno-slack-api/mod.ts";
import HandleMetadataWorkflow from "../workflows/handle_metadata_workflow.ts";

/**
 * Triggers determine when Workflows are executed. A trigger
 * file describes a scenario in which a workflow should be run,
 * such as a user pressing a button or when a specific event occurs.
 * https://api.slack.com/future/triggers
 */
const metadataEventTrigger: Trigger<typeof HandleMetadataWorkflow.definition> =
  {
    type: TriggerTypes.Event,
    name: "Metadata Posted",
    description: "Handle a message that contains metadata",
    workflow: "#/workflows/handle_metadata_workflow",
    event: {
      event_type: TriggerEventTypes.MessageMetadataPosted,
      channel_ids: ["C064QKCPKD2"],
      metadata_event_type: "some_value",
    },
    inputs: {
      ts: {
        value: TriggerContextData.Event.MessageMetadataPosted.message_ts,
      },
    },
  };

export default metadataEventTrigger;
