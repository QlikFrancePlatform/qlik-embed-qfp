require('dotenv').config({ path: '../../.env' });
const tenantUrl = process.env.TENANT_URL;
const authClientId = process.env.OAUTH_CLIENT_ID;
const embedAccessCode = process.env.EMBED_ACCESS_CODE;

export default class ConnectService {

  /**
   * Authentification at Qlik Sense Cloud
   */

  async qlikLogin() {
    const loggedIn = await fetch(`${tenantUrl}/api/v1/users/me`, {
      mode: 'cors',
      credentials: 'include',
      headers: {
        'client-id': authClientId,
        'embed-access-code': embedAccessCode,
      },
    });
    if (loggedIn.status !== 200) {
      if (sessionStorage.getItem('tryQlikAuth') === null) {
        sessionStorage.setItem('tryQlikAuth', 1);
        window.location = `${tenantUrl}/login?client-id=${authClientId}&embed-access-code=${embedAccessCode}&returnto=${location.href}`;
        return await new Promise((resolve) => setTimeout(resolve, 10000)); // prevents further code execution
      } else {
        sessionStorage.removeItem('tryQlikAuth');
        const message = 'Third-party cookies are not enabled in your browser settings and/or browser mode.';
        alert(message);
        throw new Error(message);
      }
    }
    sessionStorage.removeItem('tryQlikAuth');
    console.log('Logged in!');
    return true;
  }

  /**
   * rest api call to fetch the csrf token - refer: https://qlik.dev/tutorials/build-a-simple-web-app#ensure-your-user-is-signed-in-to-your-tenant
   * and https://qlik.dev/tutorials/managing-iframe-embedded-content-session-state-using-enigmajs-and-json-web-tokens
   */
  async getQCSHeaders() {
    await this.qlikLogin(); // enforce tenant login
    const response = await fetch(`${tenantUrl}/api/v1/csrf-token`, {
      mode: 'cors',
      credentials: 'include',
      headers: {
        'qlik-web-integration-id': webIntegrationId,
      },
    });

    const csrfToken = new Map(response.headers).get('qlik-csrf-token');
    return {
      'qlik-web-integration-id': webIntegrationId,
      'qlik-csrf-token': csrfToken,
    };
  }

}
