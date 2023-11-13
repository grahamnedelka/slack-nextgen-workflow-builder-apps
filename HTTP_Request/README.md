This is a Custom Step for use in Slack's Next-Gen Workflow Builder that allows users to perform HTTP requests by routing traffic to a single domain in order to bypass the restriction that requires developers to specify all domain names that the app interacts with. In my case, I had configured a Webhook URL in Okta workflows that receives the field values, performs the HTTP request on behalf of the slack app, and returns the response.

To test this, one could create a simple Flask / Express server that listens for POST requests, parses data from the request body, and returns the response in JSON format. Run the server application and use a tool like Ngrok to forward the application traffic to a public URL and then enter the domain name assigned to you into the 'outgoingDomains' list in the manifest file.

![HTTP Request](https://github.com/grahamnedelka/slack-nextgen-workflow-builder-apps/blob/main/HTTP_Request/assets/example_request.png?raw=true)
