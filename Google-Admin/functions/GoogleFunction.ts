import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";
import { SlackFunction } from "deno-slack-sdk/mod.ts";
import { getToken } from "googlejwtsa/mod.ts";
import { Google_Auth } from "./Google_Auth.ts";
import { DataMapper } from "deno-slack-data-mapper/mod.ts";
import { UserGoogleTokensDatastore } from "../datastores/UserGoogleTokens.ts";
import { UploadedFilesDatastore } from "../datastores/UploadedFiles.ts";
import { fetchToken } from "./User_Impersonation.ts";

import { Buffer } from "https://deno.land/std@0.208.0/io/buffer.ts";
import { writeAll } from "https://deno.land/std@0.208.0/streams/write_all.ts";

import { JWT } from "npm:google-auth-library";
import * as std from "https://deno.land/std@0.208.0/streams/write_all.ts";
import { Auth, Common, drive_v3 } from "npm:googleapis";
import { auth } from "npm:google-auth-library";

export const GoogleFunction = DefineFunction({
  callback_id: "google_function",
  title: "Google",
  description: "Google Utils",
  source_file: "functions/GoogleFunction.ts",
  input_parameters: {
    properties: {
      ua: {
        type: Schema.types.string,
        description: "Google Auth Workflow Token",
      },

      spreadsheet_url: {
        type: Schema.types.string,
        description: "Spreadsheet URL",
      },
    },
    required: ["ua", "spreadsheet_url"],
  },
  output_parameters: {
    properties: {
      response_data: {
        type: Schema.types.string,
        description: "The API Response",
      },
    },
    required: [],
  },
});

export default SlackFunction(
  GoogleFunction,
  async ({ env, inputs, client }) => {
    const { ua, spreadsheet_url } = inputs;

    const mapper = new DataMapper<typeof UserGoogleTokensDatastore.definition>({
      datastore: UserGoogleTokensDatastore.definition,
      client,
      logLevel: "DEBUG",
    });

    const uploadedFilesMapper = new DataMapper<
      typeof UploadedFilesDatastore.definition
    >({
      datastore: UploadedFilesDatastore.definition,
      client,
      logLevel: "DEBUG",
    });
    let response_data = "";
    let user_id;
    let email;

    const simpleQuery = await mapper.findAllBy({
      where: {
        unique_token: ua,
      },
    });
    if (simpleQuery.items.length > 0) {
      const the_item = simpleQuery.items[0];
      user_id = the_item["user_id"];
      email = the_item["user_email"];
      const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Bearer ",
      };
      const google_sa_project_id = env.PROJECT_ID;
      const google_sa_private_key_id = env.PRIVATE_KEY_ID;
      const google_sa_private_key = env.PRIVATE_KEY;
      const google_sa_client_email = env.CLIENT_EMAIL;
      const google_sa_client_id = env.CLIENT_ID;
      const google_sa_auth_uri = env.AUTH_URI;
      const google_sa_token_uri = env.TOKEN_URI;
      const google_sa_auth_provider_x509_cert_url =
        env.AUTH_PROVIDER_X509_CERT_URL;
      const google_sa_client_x509_cert_url = env.CLIENT_X509_CERT_URL;

      const oauth2 = {
        "type": "service_account",
        "project_id": google_sa_project_id,
        "private_key_id": google_sa_private_key_id,
        "private_key": google_sa_private_key,
        "client_email": google_sa_client_email,
        "client_id": google_sa_client_id,
        "auth_uri": google_sa_auth_uri,
        "token_uri": google_sa_token_uri,
        "auth_provider_x509_cert_url": google_sa_auth_provider_x509_cert_url,
        "client_x509_cert_url": google_sa_client_x509_cert_url,
      };

      console.log("======= OAUTH =========");
      Deno.writeAllSync(
        Deno.stdout,
        new TextEncoder().encode(JSON.stringify(oauth2)),
      );

      const the_user = await client.users.info({ user: user_id });

      console.log(the_user);

      const googleAuthOptions = {
        scope: [
          "https://www.googleapis.com/auth/calendar",
          "https://mail.google.com/",
          "https://www.googleapis.com/auth/spreadsheets",
          "https://www.googleapis.com/auth/drive",
        ], // array of Google's endpoint URLs
        delegationSubject: email, // optional subject for domain delegation
      };
      const token = await getToken(JSON.stringify(oauth2), googleAuthOptions);

      const impersonated_token = await fetchToken({ email_address: email });

      console.log("====================== impersonated token ===============");
      console.log(impersonated_token);

      //const gauth = google.auth.fromJSON(oauth2);
      let scopes = [
        "https://www.googleapis.com/auth/calendar",
        "https://mail.google.com/",
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive",
      ];

      let first_part = spreadsheet_url.replace(
        "https://docs.google.com/spreadsheets/d/",
        "",
      );
      const spreadsheet_id = first_part.split("/")[0];
      let api_spreadsheet_url =
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheet_id}`;

      const response = await fetch(
        api_spreadsheet_url,
        {
          headers: {
            "Authorization": `Bearer ${token.access_token}`,
          },
        },
      );

      console.log("t1:");
      console.log(token);
      console.log("sheets response");
      console.log(response);

      const response_text = await response.text();
      console.log("============= len =============");
      console.log(response_text.length);

      if (response_text.length < 20000) {
        return { outputs: { response_data: response_text } };
      } else {
        const f = await client.files.upload({
          channels: "U026VELFU3T",
          content: response_text,
        });
        const conversation_id = Object.keys(f.file.shares.private)[0];
        const conversation_info = f.file.shares.private[conversation_id][0];
        const message_ts = conversation_info.ts;
        try {
          const fileSearchResult = await uploadedFilesMapper.findFirstBy({
            where: {
              file_url: spreadsheet_url,
            },
          });

          if (fileSearchResult.items.length === 0) {
            const datastore_attributes = {
              file_id: f.file.id,
              user_id: user_id,
              user_email: email,
              file_name: f.file.name,
              file_mimetype: f.file.mimetype,
              filetype: f.file.filetype,
              pretty_type: f.file.pretty_type,
              size: f.file.size,
              url_private: f.file.url_private,
              url_private_download: f.file.url_private_download,
              permalink: f.file.permalink,
              upload_ts: String(f.file.timestamp),
              message_ts: String(message_ts),
              conversation_id: conversation_id,
              unique_token: ua,
              file_url: spreadsheet_url,
              spreadsheet_url: spreadsheet_url,
              spreadsheet_id: spreadsheet_id,
            };
            await uploadedFilesMapper.save({
              datastore: "uploaded_files",
              attributes: datastore_attributes,
            });
          }
          return {
            outputs: { response_data: JSON.stringify(f.file) },
          };
        } catch {}
      }
    }
    return {
      outputs: { response_data: "" },
    };
  },
);
