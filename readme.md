# Aethor hooks

This repository hosts the webhook forwarder of aethor you can contribute by adding samples the samples.json file or by modifying the code

### Setup

[![image](https://user-images.githubusercontent.com/23035000/116934239-b0d4a400-ac32-11eb-83f6-0c4119d59fa8.png)](https://dash.deno.com/new?url=https://raw.githubusercontent.com/AethorBot/github-updates/master/mod.ts&env=TOKEN,ICON,NAME,CHANNELS,WEBSITE_AUTH,CHANNELS)

- env vars
  - TOKEN: bot token
  - ICON: image in embed
  - NAME: name in embed
  - CHANNELS: channels to post in split by |
  - WEBSITE_AUTH: The header auth to check for

### Current events

- issues/comments
- commits
- forks
- release
- stars

### Contributing

- Feel free to pr more samples
- Pr fixing types
- Add more events

### Goals

- write test ( feel free to make a pr )

![preview](assets/commit.png)
