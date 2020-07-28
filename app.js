'use strict';

const child_process = require('child_process');
const WebhooksApi = require('@octokit/webhooks');
const express = require('express');
const env = require('./env.json');

const PORT = 9666;

if(env.command && env['repo-commands']){
  console.error('Env contains both "command" and "repo-commands" (only use one)');
  process.exit(1);
}

const webhooks = new WebhooksApi({
  secret: env.secret
});

const app = express();

webhooks.on('push', event => {
  console.log(`event: ${JSON.stringify(event)}`);
  const ref = event.payload.ref;
  const repo = event.payload.repository.name;
  console.log(`repo = ${repo}, ref = ${ref}`);
  const cmd = env.command ? env.command : env['repo-commands'][repo];
  if(!cmd){
    console.log(`Error! Repo ${repo} does not have a command defined!`);
    throw new Error(`Repo ${repo} does not have a command defined`);
  }
  console.log(`Command: ${cmd}`);
  if(ref === 'refs/heads/master'){
    console.log('There was a push to master.  Invoke our script...');
    child_process.execFileSync(cmd, { stdio: 'inherit'});
    console.log('All done (for now)...');
  }
});

app.use(webhooks.middleware);

app.get('/check', (req,res) => { 
	res.send('ok');
});

const listenInterface = env.allInterfaces === true ? null : 'localhost';
app.listen(PORT, listenInterface, () =>
  console.log(`roquet listening on port ${PORT}`)
);
