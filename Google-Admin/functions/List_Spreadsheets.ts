import { DefineFunction, Schema, SlackAPI } from "deno-slack-sdk/mod.ts";
import { SlackFunction } from "deno-slack-sdk/mod.ts";
import { DataMapper, Operator } from "deno-slack-data-mapper/mod.ts";
import { workflow } from "../workflows/GetUserAuth.ts";
import { UserGoogleTokensDatastore } from "../datastores/UserGoogleTokens.ts";
import { fetchToken } from "./User_Impersonation.ts";
import { containeranalysis_v1, google } from "npm:googleapis@129.0.0";
import { soxa } from "soxa/mod.ts";

import { Auth, drive_v3, GoogleApis } from "npm:googleapis";
import { GoogleAuth } from "npm:google-auth-library";
export const ListSpreadsheets = DefineFunction({
  callback_id: "list_spreadsheets",
  title: "List Google Sheets",
  description: "List Google Sheets",
  source_file: "functions/List_Spreadsheets.ts",
  input_parameters: {
    properties: {
      gtoken: {
        type: Schema.slack.types.oauth2,
        oauth2_provider_key: "google",
        require_end_user_auth: true,
        description: "Google Auth Workflow Token",
      },
    },
    required: ["gtoken"],
  },
  output_parameters: {
    properties: {
      spreadsheets: {
        type: Schema.types.string,
        description: "The unique token to use in the workflow",
      },
    },
    required: [],
  },
});

interface File {
  // Define the structure of your "File" object here
}

async function getResultsWithPagination(
  apiEndpoint: any,
  googleToken?: any,
) {
  let allData: Array<Object> = [];
  let apiEndpointString = apiEndpoint;
  try {
    const response1 = await soxa.get(apiEndpointString, {
      headers: { "Authorization": `Bearer ${googleToken}` },
      responseType: "json",
    })
      .then(function (response) {
        console.log(response);
        if (response.status === 200) {
          if (response.data.nextPageToken) {
            let nextPageToken = response.data.nextPageToken;
            while (nextPageToken) {
              const nextPageResponses = soxa.get(apiEndpointString, {
                headers: { Authorization: `Bearer ${googleToken}` },
                params: { pageToken: nextPageToken },
              }).then(function (another_response) {
                allData = allData.concat(another_response.data);
                if (another_response.data.nextPageToken) {
                  nextPageToken = another_response.data.nextPageToken;
                } else {
                  nextPageToken = null;
                }
              });
            }
          } else {
            allData = allData.concat(response.data);
          }
        } else {
          throw new Error(`Error fetching data: ${response.status}`);
        }
      });
    return allData;
  } catch (error) {
    console.log(error);
  }
}

export default SlackFunction(
  ListSpreadsheets,
  async ({ inputs, client }) => {
    const tokenResponse = await client.apps.auth.external.get({
      external_token_id: inputs.gtoken,
    });

    if (tokenResponse.error) {
      const error = `Fail ${tokenResponse.error}`;
      return { error };
    }

    const externalToken = tokenResponse.external_token;

    console.log("external token");
    console.log(externalToken);

    const gtoken = externalToken;
    console.log(gtoken);

    const auth = {
      keyFile: {
        "type": "service_account",
        "project_id": "xxxxx-gam-xxxxxxxxx",
        "private_key_id": "54exxxxxxxxxxxxxxx",
        "private_key":
          "-----BEGIN PRIVATE KEY-----\nxxxxxxxxxxxxxx\n-----END PRIVATE KEY-----\n",
        "client_email": "gnedelka@xxxxxxxxx",
        "client_id": "xxxxxxxxxxxxx",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url":
          "https://www.googleapis.com/robot/v1/metadata/x509/gnedelka%40xxxxx-gam-xxxxx.iam.gserviceaccount.com",
      },
      scopes: "https://www.googleapis.com/auth/drive",
    };

    const a = soxa.get("https://www.googleapis.com/drive/v3/files", {
      headers: { "Authorization": gtoken },
    }).then(function (response) {
      console.log(response);
    });

    /*const { unique_token, show_name, show_id } = inputs;
    const mapper = new DataMapper<typeof UserGoogleTokensDatastore.definition>({
      datastore: UserGoogleTokensDatastore.definition,
      client,
      logLevel: "DEBUG",
    });

    let user_id;
    let email;

    const simpleQuery = await mapper.findAllBy({
      where: {
        unique_token: unique_token,
      },
    });
    if (simpleQuery.items.length > 0) {
      const the_item = simpleQuery.items[0];
      user_id = the_item["user_id"];
      email = the_item["user_email"];
    }

    const token = await fetchToken(email);
    console.log(token);
    const query = "mimeType = 'application/vnd.google-apps.spreadsheet'";
    const url =
      `https://www.googleapis.com/drive/v3/files?pageSize=1000&q=${query}`;
    const h = new Headers(
      { "Authorization": `Bearer ${token.access_token}` },
    );

    const response = await fetch(url, {
      headers: h,
    });
    const response_json = await response.json();

    let temp_json = [];
    if (show_name) {
      temp_json = response_json.files.map((x: any) => {
        return {
          name: x.name,
        };
      });
    }
    if (show_id) {
      temp_json = response_json.files.map((x: any) => {
        return {
          id: x.id,
        };
      });
    }
    const temp_json_string = JSON.stringify(temp_json);
    return {
      outputs: {
        spreadsheets: JSON.stringify(temp_json),
      },
    };
  },*/

    return await { outputs: { spreadsheets: "" } };
  },
);
