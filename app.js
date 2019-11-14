'use strict';

const child_process = require('child_process');
const WebhooksApi = require('@octokit/webhooks');
const express = require('express');
const env = require('./env.json');

const PORT = 9666;

const webhooks = new WebhooksApi({
  secret: env.secret
});

const app = express();

webhooks.on('push', event => {
  console.log(`friggin event: ${JSON.stringify(event)}`);
  console.log('---');
  console.log('ok, looking at event');
  console.log(`ref = ${event.payload.ref}`)
  if(event.payload.ref === 'refs/heads/master'){
    console.log('There was a push to master.  Invoke our script...');
    child_process.execFileSync(env.command, options = { stdio: 'inherit'});
    console.log('All done (for now)...');
  }
});

app.use(webhooks.middleware);

app.listen(PORT, () =>
  console.log(`roquet listening on port ${PORT}`)
);
