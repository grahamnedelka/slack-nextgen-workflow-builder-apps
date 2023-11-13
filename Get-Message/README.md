This app allows users to get the contents of a message in Workflow Builder by specifying the channel ID, message timestamp, and, optionally, the thread timestamp if the message in question is part of a thread.

If using Enterprise Grid, the Team ID must be passed into the conversations.history API call. Add your team ID to the `.env` file, which the step will read during execution.

![Example Step Config](https://github.com/grahamnedelka/slack-nextgen-workflow-builder-apps/blob/main/Get-Message/assets/example_step_config.png?raw=true)

![Example Step Output](https://github.com/grahamnedelka/slack-nextgen-workflow-builder-apps/blob/main/Get-Message/assets/example_step_output.png?raw=true)

![Example Message With Data](https://github.com/grahamnedelka/slack-nextgen-workflow-builder-apps/blob/main/Get-Message/assets/example_message_with_data.png?raw=true)