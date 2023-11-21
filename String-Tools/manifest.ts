import { Manifest } from "deno-slack-sdk/mod.ts";
import { ConcatFunction } from "./functions/concat.ts";
import { ReplaceFunction } from "./functions/replace.ts";
import { FindFunction } from "./functions/find.ts";
import { SplitFunction } from "./functions/split.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/future/manifest
 */
export default Manifest({
  name: "StringTools",
  description: "A blank template for building Slack apps with Deno",
  icon: "assets/default_new_app_icon.png",
  functions: [ConcatFunction, ReplaceFunction, FindFunction, SplitFunction],
  workflows: [],
  outgoingDomains: [],
  botScopes: ["commands", "chat:write", "chat:write.public"],
});
