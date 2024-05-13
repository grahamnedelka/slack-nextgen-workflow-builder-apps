import * as base64Url from "https://deno.land/std@0.160.0/encoding/base64url.ts";
import * as base64 from "https://deno.land/std@0.165.0/encoding/base64.ts";

export type GoogleAuth = {
  access_token: string;
  expires_in: number;
  token_type: string;
};

export interface ClaimSetOptions {
  scope: string[];
  delegationSubject?: string;
}

export interface ClaimSet {
  iss: string;
  scope: string;
  aud: string;
  sub?: string;
  exp: number;
  iat: number;
}

export async function fetchToken(email_address:any) {
  // ========== GET CLAIM SET =============
  // Service Account credentials as a string
  const keyFile = JSON.stringify({
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
  });

  // Define additional parameters including scopes and the user
  // to impersonate
  const options = {
    scope: [
      "https://www.googleapis.com/auth/calendar",
      "https://mail.google.com/",
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive",
    ], // array of Google's endpoint URLs
    delegationSubject: email_address, // optional subject for domain delegation
  };

  // Service Account credentials as a JSON object
  const keys = JSON.parse(keyFile);

  // Create a text encoder instance
  const textEncoder = new TextEncoder();

  // Define JWT Header in JSON format, stringify it,
  // and base64url encode it
  const header = base64Url.encode(
    JSON.stringify({ alg: "RS256", typ: "JWT" }),
  );

  // Get the list of scopes and put them in a string,
  // separated by a single space
  const scope = options.scope.join(" ");

  // Get the email of the user being impersonated, and store in a variable
  //
  // Note: since our function always includes the email address of the user,
  // the || false is not necessary to include, but I'm leaving it here
  // for reference
  const delegationSubject = options.delegationSubject || false;

  // Get the current date in the required format
  const iat = Math.floor(Date.now() / 1000);

  // Get the date for when the token request will be considered expired
  const exp = iat + 3600;

  // Construct a ClaimSet object
  const cs: ClaimSet = {
    iss: keys.client_email,
    scope,
    aud: keys.token_uri,
    exp,
    iat,
  };

  // If a user is being impersonated, then include the target user's email address
  // in the claim set
  if (delegationSubject) {
    cs.sub = delegationSubject;
  }

  // Base64 Encode the claim set
  const claimSet = base64Url.encode(
    JSON.stringify(cs),
  );
  // ====== END GET CLAIM SET =======

  // ========== GET PRIVATE KEY =============
  // Remove all new-lines
  let key = keys.private_key;
  const pem = key.replace(/\n/g, "");
  const pemHeader = "-----BEGIN PRIVATE KEY-----";
  const pemFooter = "-----END PRIVATE KEY-----";
  // Check if key contains the correct header and footer, throw an error if it doesn't.
  if (!pem.startsWith(pemHeader) || !pem.endsWith(pemFooter)) {
    throw new Error("Invalid service account private key");
  }
  // Get the contents of the key
  key = pem.substring(pemHeader.length, pem.length - pemFooter.length);
  // ======== END GET PRIVATE KEY ==========

  // ========== CREATE JWT =============

  // Define the algorithm to use for consuming private key
  const algorithm = {
    name: "RSASSA-PKCS1-v1_5",
    hash: {
      name: "SHA-256",
    },
  };
  // Convert the key into an array buffer
  const keyArrBuffer = base64.decode(key);

  // Load private key using specified algorithm
  const privateKey = await crypto.subtle.importKey(
    "pkcs8",
    keyArrBuffer,
    algorithm,
    false,
    ["sign"],
  );

  // Combine the header and claim set, separated by a period, and then encode string
  // which produces an array buffer
  const inputArrBuffer = textEncoder.encode(`${header}.${claimSet}`);

  // Sign the array buffer using the private key
  const outputArrBuffer = await crypto.subtle.sign(
    { name: "RSASSA-PKCS1-v1_5" },
    privateKey,
    inputArrBuffer,
  );

  // base64url encode the array buffer, which converts it back into a string
  const signature = base64Url.encode(outputArrBuffer);

  // Combine the header string, claimSet string, and signature string, each separated
  // by a period, producing the JWT in string format.
  const assertion = `${header}.${claimSet}.${signature}`;
  const grantType = `urn:ietf:params:oauth:grant-type:jwt-bearer`;
  const body = `grant_type=${
    encodeURIComponent(grantType)
  }&assertion=${assertion}`;

  const response = await fetch(
    `https://oauth2.googleapis.com/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    },
  );

  if (response && !response.ok) {
    const error = {
      status: response.status,
      statusText: response.statusText,
      type: "Google JWT",
      message: await response.json(),
    };
    throw error;
  }

  const jsonData = await response.json();

  return {
    access_token: jsonData.access_token,
    expires_in: jsonData.expires_in,
    token_type: jsonData.token_type,
  };
}
