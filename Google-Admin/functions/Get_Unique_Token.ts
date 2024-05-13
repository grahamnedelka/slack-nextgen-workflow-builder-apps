import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";
import { SlackFunction } from "deno-slack-sdk/mod.ts";
import { DataMapper } from "deno-slack-data-mapper/mod.ts";
import { UserGoogleTokensDatastore } from "../datastores/UserGoogleTokens.ts";
import { SlackAPI } from "deno-slack-sdk/mod.ts";

const client = SlackAPI({ token: Deno.env.get() });
