import { getToken } from "https://deno.land/x/googlejwtsa@v0.1.8/mod.ts";
import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";
import { SlackFunction } from "deno-slack-sdk/mod.ts";
import Google from "npm:googleapis@128.0.0";

export const GoogleAuth = DefineFunction({
  callback_id: "google_auth",
  title: "Google Auth",
  description: "Google Utils",
  source_file: "functions/GoogleFunction.ts",
  input_parameters: {
    properties: {
      user_id: {
        type: Schema.slack.types.user_id,
        description: "The user to select",
      },
    },
    required: ["user_id"],
  },
});

export default SlackFunction(
  GoogleAuth,
  async ({ env, inputs, client }) => {
    const { user_id } = inputs;

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


    const the_user = await client.users.info({ user: user_id });
    console.log(the_user);
    const email = the_user.user.profile.email;

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

    const response = await fetch(
      "https://sheets.googleapis.com/v4/spreadsheets/1mSVsq3x_FFi9SvyrE6swhGmsewLvWacWqik0HDBSjy0/values/Users!A:AD",
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

    return {};
  },
);
