# roquet
Webhook deployment plumbing, the real dumb way.

# config

Put `env.json` in this dir with contents like:

```
{
  "secret": "your_webhook_secret",
  "command": "/path/to/a/script.sh"
}
```

or, if you'd like to support multiple repos with the same roquet instance:

```
{
  "secret": "your_webhook_secret",
  "repo-commands": {
    "repo1": "/path/to/a/script.sh",
    "otherrepo": "/path/to/different/script"
  }
}
```

and make sure to register a github webook to point at
your endpoint.  It runs on port 9666 and expects `/`.:

# run

Run it like this:

```
$ node app.js
```

You probably want supervisord to restart this on crash,
and you probably want supervisord to restart your other app
so that it doesn't stay running in the fg in this app.

Recommend that your command script just kills the old one at the end
and lets supervisord restart (or similar).
