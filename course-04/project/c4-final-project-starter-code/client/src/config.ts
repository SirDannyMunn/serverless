// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'esn3gpys40'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  domain: 'dev-yvbchxqk.us.auth0.com',            // Auth0 domain
  clientId: '3PIHeIIIVNN6XbWxpb9EKYA4f5tniN3P',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
