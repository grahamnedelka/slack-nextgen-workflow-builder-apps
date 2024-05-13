import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";
import { SlackFunction } from "deno-slack-sdk/mod.ts";

export const HTTPRequestFunction = DefineFunction({
  callback_id: "http_request_function",
  title: "HTTP Request",
  description: "Make an HTTP Request",
  source_file: "functions/http_request.ts",
  input_parameters: {
    properties: {
      url: {
        type: Schema.types.string,
        description: "URL to make the request to",
        title: "URL",
      },
      method: {
        type: Schema.types.string,
        description: "HTTP Method",
        title: "Method",
        enum: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      },
      username: {
        type: Schema.types.string,
        description: "Username for basic auth",
        title: "Username for basic auth",
      },
      password: {
        type: Schema.types.string,
        description: "Password for basic auth",
        title: "Password for basic auth",
      },
      bearer_token: {
        type: Schema.types.string,
        description: "Bearer token for auth",
        title: "Bearer token for auth",
      },
      data: {
        type: Schema.types.string,
        description: "Request body",
        title: "Request body",
      },
      format_json: {
        type: Schema.types.boolean,
        description: "Format JSON response",
        title: "Format JSON response",
      }
    },
    required: ["url", "method"],
  },
  output_parameters: {
    properties: {
      status_code: {
        type: Schema.types.number,
        description: "The response status code",
      },
      headers: {
        type: Schema.types.string,
        description: "The response headers",
      },
      body: {
        type: Schema.types.string,
        description: "The response body",
      },
    },
    required: [],
  },
});

export default SlackFunction(
  HTTPRequestFunction,
  async ({ inputs, env }) => {
    const proxy_url = env.PROXY_URL;
    const response = await fetch(
      proxy_url,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "url": inputs.url,
          "body": inputs.data,
          "username": inputs.username,
          "password": inputs.password,
          "bearer_token": inputs.bearer_token,
          "method": inputs.method,
        }),
      },
    );
    
    const resp_body = await response.json();

    let response_json = resp_body['Body'];
    let response_body = {};
    if (inputs.format_json) {
      if (inputs.format_json === true) {
        let formatted_json = JSON.stringify(response_json, null, 2);
        response_body = formatted_json;
      } else {
        response_body = JSON.stringify(resp_body["Body"]);
      }
    } else {
      response_body = JSON.stringify(resp_body["Body"]);
    }

    const response_headers = JSON.stringify(resp_body["Headers"]);
    const response_status_code = resp_body["Status Code"];

    return {
      outputs: {
        body: response_body,
        headers: response_headers,
        status_code: response_status_code,
      },
    };
  },
);
