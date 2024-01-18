# ![Qlik logo](./src/img/Qlik_logo.svg) Embed

This is the website for Qlik Sense Embed Objects. Check limitation to object with Qlik Embed html web tag, Nebular.js and Insight Advisor API.

## Contributing

Add .env file with parameter

```.env
PROJECT_NAME="Qlik Embed"
TENANT_URL="https://<tenant>.eu.qlikcloud.com"
APP_ID="<app_id>"
WEB_INTEGRATION_ID="<web_integration_id>"
```

## Managing web integrations

You can create web integrations to add origins that are allowlisted to access the tenant. The web integration containing the allowlist is connected to an ID used in for example a mashup that is connecting to your tenant. When a request arrives, Qlik Cloud confirms that the request derives from an allowlisted domain and then approves the request, else not.

source : https://help.qlik.com/en-US/cloud-services/Subsystems/Hub/Content/Sense_Hub/Admin/mc-adminster-web-integrations.htm

## Installation Qlik mashup

Install package

```bash
npm install
```

Start a local server using:

```bash
npm run server
```

Start a dev on local machine using:

```bash
npm run dev
```

Check version npm package on package.json

```bash
npx npm-check-updates -u
```
