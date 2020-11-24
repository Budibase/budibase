<p align="center">
  <a href="https://www.budibase.com">
    <img alt="Budibase" src="https://d33wubrfki0l68.cloudfront.net/aac32159d7207b5085e74a7ef67afbb7027786c5/2b1fd/img/logo/bb-emblem.svg" width="60" />
  </a>
</p>
<h1 align="center">
  Budibase
</h1>

<h3 align="center">
  Build business apps 50x faster
</h3>
<p align="center">
  [Budibase](https://www.budibase.com) is an open-source low-code platform that helps developers and IT professionals design, build, and ship business apps 50x faster.
</p>

<h3 align="center">
 🤖 🎨 🚀
</h3>


<p align="center">
  <img src="https://i.imgur.com/tMCahK8.png">
</p>

<p align="center">
  <a href="https://github.com/Budibase/budibase/releases">
    <img alt="GitHub all releases" src="https://img.shields.io/github/downloads/Budibase/budibase/total">
  </a>
  <a href="https://github.com/Budibase/budibase/releases">
    <img alt="GitHub release (latest by date)" src="https://img.shields.io/github/v/release/Budibase/budibase">
  </a>
  <a href="https://discord.gg/rCYayfe">
    <img alt="Discord" src="https://img.shields.io/discord/733030666647765003">  
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=budibase">
    <img src="https://img.shields.io/twitter/follow/budibase?style=social" alt="Follow @budibase" />
  </a>
</p>

<h3 align="center">
  <a href="https://portal.budi.live/signup">Sign-up</a>
  <span> · </span>
  <a href="https://docs.budibase.com">Docs</a>
  <span> · </span>
  <a href="https://github.com/Budibase/budibase/discussions?discussions_q=category%3AIdeas">Feature request</a>
  <span> · </span>
  <a href="https://github.com/Budibase/budibase/issues">Report a bug</a>
  <span> · </span>
  Support: <a href="https://github.com/Budibase/budibase/discussions">Discussions</a>
  <span> & </span>
  <a href="https://discord.gg/rCYayfe">Discord</a>
</h3>


## ✨ Features
When other platforms chose the closed source route, we decided to go open source. When other platforms chose cloud builders, we decided a local builder offered the better developer experience. We like to do things differently at Budibase. 

- **Build and ship real software.** Unlike other platforms, with Budibase you build and ship single page applications. Budibase applications have performance baked in and can be designed reponsively, providing your users with a great experience. 

- **Open source and extensable.** Budibase is open-source. The builder and server are AGPL v3, and the client is MPL. This should fill you with confidence that Budibase will always be around. You can also code against Budibase or fork it and make changes as you please, providing a developer-friendly experience.

- **Load data or start from scratch.** Budibase pulls in data from multiple sources, whether it’s a CSV, an external database, or a REST API. And unlike other platforms, with Budibase you can start from scratch and create business apps with no data sources. [Request new data sources](https://github.com/Budibase/budibase/discussions?discussions_q=category%3AIdeas).

- **Design and build apps with powerful pre-made components.** Budibase comes out of the box with beautifully designed, powerful components which you can use like building blocks to build your UI. We also expose a lot of your favourite CSS styling options so you can go that extra creative mile. [Request new components](https://github.com/Budibase/budibase/discussions?discussions_q=category%3AIdeas).

- **Automate processes, integrate with other tools, and connect to webhooks.** Save time by automating manual processes and workflows. From connecting to webhooks, to automating emails, simply tell Budibase what to do and let it work for you. You can easily [create new automations for Budibase here](https://github.com/Budibase/automations) or [request new integrations here](https://github.com/Budibase/budibase/discussions?discussions_q=category%3AIdeas).

- **Cloud hosting and self-hosting (coming soon) available.** Users will soon have the option to host with Budibase in AWS (available now) or self-host (coming very soon). From the very beginning, we wanted our users to have the option to self-host. We understand the importance of having full control over data. This is why we are working incredibly hard to offer an easy path to self-hosting. If you are interested in self-hosting, please [join the conversation and add your thoughts](https://github.com/Budibase/budibase/discussions/648).


## ⌛ Status
- [x] Alpha: We are demoing Budibase to users and receiving feedback
- [x] Private Beta: We are testing Budibase with a closed set of customers
- [x] Public Beta: Anyone can [sign-up and use Budibase](https://portal.budi.live/signup) but it's not production ready. We cannot ensure backwards compatibility
- [ ] Official Launch: Production-ready


We are currently in Public Beta. Until our official launch, we cannot ensure backwards compatibility for your Budibase applications between versions. Issues may arise when trying to edit apps created with old versions of the Budibase builder.

Watch "releases" of this repo to get notified of major updates, and give the star button a click whilst you're there. 

<p align="center">
  <img src="https://i.imgur.com/cJpgqm8.png">
</p>

If you are having issues between updates of the builder, please use the guide [here](https://github.com/Budibase/budibase/blob/master/CONTRIBUTING.md#troubleshooting) to clear down your environment.


## 🏁 Getting Started with Budibase

The Budibase builder runs in Electron, on Mac, PC and Linux. [Sign-up here](https://portal.budi.live/signup) or [Download the latest release](https://github.com/Budibase/budibase/releases), and start building!

<p align="center">
  <img alt="Budibase design ui" src="https://imgur.com/v8m6v3q.png">
</p>


## 🎓 Learning Budibase

Our documentation and tutorials live here: https://docs.budibase.com

## 🙌 Contributing to Budibase

From opening a bug report to creating a pull request: every contribution is appreciated and welcomed. If you're planning to implement a new feature or change the API please create an issue first. This way we can ensure your work is not in vain.

### Not Sure Where to Start?
Budibase is a monorepo managed by lerna. Lerna manages the building and publishing of the budibase packages. At a high level, here are the packages that make up budibase.

- packages/builder - contains code for the budibase builder client side svelte application.

- packages/client - A module that runs in the browser responsible for reading JSON definition and creating living, breathing web apps from it.

- packages/server - The budibase server. This Koa app is responsible for serving the JS for the builder and budibase apps, as well as providing the API for interaction with the database and file system.

For more information, see [CONTRIBUTING.md](./CONTRIBUTING.md)

## 💬 Get in touch

If you have a question or would like to talk with other Budibase users, please hop over to [Github discussions](https://github.com/Budibase/budibase/discussions) or join our Discord server:

[Discord chatroom](https://discord.gg/rCYayfe)

![Discord Shield](https://discordapp.com/api/guilds/733030666647765003/widget.png?style=shield)
