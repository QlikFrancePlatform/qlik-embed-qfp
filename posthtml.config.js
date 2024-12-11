require('dotenv').config({ path: '.env' });
const fs = require('fs');

const locals = {
  "PROJECT_NAME": process.env.PROJECT_NAME,
  "TENANT_URL": process.env.TENANT_URL,
  "APP_ID": process.env.APP_ID,
  "WEB_INTEGRATION_ID": process.env.WEB_INTEGRATION_ID,
  "OAUTH_CLIENT_ID": process.env.OAUTH_CLIENT_ID,
  "EMBED_ACCESS_CODE": process.env.EMBED_ACCESS_CODE,
  "ASSISTANT_ID": process.env.ASSISTANT_ID,
};

// Read the existing .posthtmlrc file
const posthtmlrcPath = '.posthtmlrc';
const posthtmlrc = JSON.parse(fs.readFileSync(posthtmlrcPath, 'utf8'));

// Update the locals in the .posthtmlrc file
posthtmlrc.plugins['posthtml-expressions'].locals = locals;

// Write the updated .posthtmlrc file back to disk
fs.writeFileSync(posthtmlrcPath, JSON.stringify(posthtmlrc, null, 2));