# Contributing

Thank you for taking the time to contribute!

It is worth noting that a contribution isn't just a PR.

Bringing attention to a bug is very valuable, and with good reproduction steps is always appreciated!

Feature requests allow us to improve the product. Even if we do not ultimately accept the enhancement, the feedback is still helpful.

Smaller "quality of life" requests are more likely to be accepted and implemented, whereas larger features require more input from the product team and may not align with our goals.

You can raise a bug or feature request [here](https://github.com/Budibase/budibase/issues/new/choose).

If you do plan to raise a pull request, please take a look at the guide below.

## Table of contents

- [Vouching](#vouching)
- [Where to start](#not-sure-where-to-start)
- [Contributor Licence Agreement](#contributor-license-agreement-cla)
- [Glossary of Terms](#glossary-of-terms)
- [Contributing to Budibase](#contributing-to-budibase)

## Vouching

We use [Vouch](https://github.com/mitchellh/vouch) to prevent explicitly denounced users from contributing pull requests.

You do not need to be vouched for before opening or merging a pull request. Pull requests from users who have been explicitly denounced will be closed automatically.

All pull requests remain subject to our normal review and contribution requirements.

## Not Sure Where to Start?

Budibase is a low-code web application builder that creates svelte-based web applications.

Budibase is a monorepo managed by [lerna](https://github.com/lerna/lerna). Lerna manages the building and publishing of the Budibase packages. At a high level, here are the packages that make up Budibase.

- **packages/builder** - contains code for the Budibase builder client side svelte application.

- **packages/client** - A module that runs in the browser responsible for reading JSON definition and creating living, breathing web apps from it.

- **packages/server** - The Budibase server. This [Koa](https://koajs.com/) app is responsible for serving the JS for the builder and Budibase apps, as well as providing the API for interaction with the database and file system.

- **packages/worker** - This [Koa](https://koajs.com/) app is responsible for providing global apis for managing your Budibase installation. Authentication, Users, Email, Org and Auth configs are all provided by the worker.

## Contributor License Agreement (CLA)

In order to accept your pull request, we need you to submit a CLA. You only need to do this once. If you are submitting a pull request for the first time, just submit a Pull Request and our CLA Bot will give you instructions on how to sign the CLA before merging your Pull Request.

All contributors must sign an [Individual Contributor License Agreement](https://github.com/budibase/budibase/blob/next/.github/cla/individual-cla.md).

If contributing on behalf of your company, your company must sign a [Corporate Contributor License Agreement](https://github.com/budibase/budibase/blob/next/.github/cla/corporate-cla.md). If so, please contact us via community@budibase.com.

If for any reason, your first contribution is in a PR created by other contributor, please just add a comment to the PR
with the following text to agree our CLA: "I have read the CLA Document and I hereby sign the CLA".

## Glossary of Terms

To understand the Budibase API, it can be helpful to understand the top level entities that make up Budibase.

### Tenant

A tenant is the top-level isolation boundary for users, configuration and workspaces. Self-hosted development normally uses the default tenant, while cloud and multi-tenant environments can contain many tenants.

### Workspace

The primary organizational unit for building and publishing solutions. A workspace encompasses all data resources, automations, UI definitions, theme settings, plugins, and deployment metadata.

### Workspace App

Each workspace app manages its own navigation, routing, and access settings. Multiple apps can exist within a single workspace, and each can be independently enabled, disabled, or designated as the default entry point.

### Table

Tables define structured data in a workspace. A table can be internal, backed by Budibase CouchDB storage, or an external datasource. Tables have a schema, rows, views and metadata such as a primary display field.

### Datasource

A datasource represents a configured external data source such as SQL, REST, MongoDB or Google Sheets. Datasources can expose entities as tables and can also contain queries for custom data operations.

### Query

A query is a reusable operation against a datasource. Queries define inputs, request details, transformers and response schema, and can be used by apps, automations and other workspace features.

### View

A view is a saved representation of table data. Views can apply filters, sorting, calculations and schema metadata so data can be reused consistently across the builder, APIs and app screens.

### Screen

A screen is a routed UI interface within a workspace app. It points at a layout, has route and role metadata, and contains the root component tree for that route.

### Layout

A layout is shared UI structure used by screens. Layouts commonly define navigation, page framing and shared component structure.

### Component

A component is the basic frontend building block used in screens and layouts. Components store their type, settings, styles, children and conditional behaviour.

### Component Library

Component libraries are collections of components as well as the definition of their props contained in a file called `components.json`.

### Automation

An automation is a workflow in a workspace. Automations have a trigger, one or more action steps, status, metadata and execution logs.

### Budibase Agent

A Budibase agent is an AI assistant configured in a workspace. Agents define goals, operations, tools, knowledge sources and chat integrations so users can interact with workspace data and workflows conversationally.

## Contributing to Budibase

- Please maintain the existing code style.

- Please try to keep your commits small and focused.

- Please write tests.

- If the project diverges from your branch, please rebase instead of merging. This makes the commit graph easier to read.

- Once your work is completed, please raise a PR against the `master` branch with some information about what has changed and why.

### Getting Started For Contributors

#### 1. Prerequisites

- NodeJS version `22.x.x`
- Python version `3.x`

### Using asdf (recommended)

Asdf is a package manager that allows managing multiple dependencies.

You can install them following any of the steps described below:

- Install using script (only for mac users):

`./scripts/install-contributor-dependencies.sh`

- Or, manually:

  - Installation steps: https://asdf-vm.com/guide/getting-started.html
  - asdf plugin add nodejs
  - asdf plugin add python
  - asdf plugin add yarn

### Using NVM and pyenv

- NVM:
  - Install: https://github.com/nvm-sh/nvm#installing-and-updating
  - Setup: `nvm use`
- Pyenv:

  - Install: https://github.com/pyenv/pyenv#installation
  - Setup: `pyenv install -v 3.7.2`

- _yarn -_ `npm install -g yarn`

#### 2. Clone this repository

`git clone https://github.com/Budibase/budibase.git`

then `cd ` into your local copy.

#### 3. Install and Build

| **NOTE**: On Windows, all yarn commands must be executed on a bash shell (e.g. git bash)

To develop the Budibase platform you'll need [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed.

##### Quick method

`yarn setup` will check that all necessary components are installed and setup the repo for usage.

If you have access to the `@budibase/pro` submodule then please follow the Pro section of this guide before running the above command.

##### Manual method

The following commands can be executed to manually get Budibase up and running (assuming Docker/Docker Compose has been installed).

`yarn` to install project dependencies

`yarn build` will build all Budibase packages.

If you have access to the `@budibase/pro` submodule then please follow the Pro section of this guide before running the above commands.

#### 4. Running

To run the Budibase server and builder in dev mode (i.e. with live reloading):

1. Open a new console
2. `yarn dev` (from root)
3. Access the builder on http://localhost:10000/builder

This will enable watch mode for both the builder app, server, client library and any component libraries.

#### 5. Debugging using VS Code

To debug the Budibase server and worker a VS Code launch configuration has been provided.

Visit the debug window and select `Budibase Server` or `Budibase Worker` to debug the respective component.
Alternatively to start both components simultaneously select `Start Budibase`.

In addition to the above, the remaining Budibase components may be run in dev mode using: `yarn dev:noserver`.

#### 6. Cleanup

If you wish to delete all the apps created in development and reset the environment then run the following:

1. `yarn nuke:docker` will wipe all the Budibase services
2. `yarn dev` will restart all the services

### Backend

For the backend we run [Redis](https://redis.io/), [CouchDB](https://couchdb.apache.org/), [MinIO](https://min.io/) and [NGINX](https://www.nginx.com/) in Docker compose. This means that to develop Budibase you will need Docker and Docker compose installed. The backend services are then run separately as Node services with nodemon so that they can be debugged outside of Docker.

### Data Storage

When you are running locally, Budibase stores data on disk using docker volumes. The volumes and the types of data associated with each are:

- `redis_data`
  - Sessions, email tokens
- `couchdb3_data`
  - Global and app databases
- `minio_data`
  - App manifest, Budibase client, static assets

### Development Modes

A combination of environment variables controls the mode Budibase runs in.

| **NOTE**: You need to clean your browser cookies when you change between different modes.

Yarn commands can be used to mimic the different modes as described in the sections below:

#### Self Hosted

The default mode. A single tenant installation with no usage restrictions.

To enable this mode, use:

```
yarn mode:self
```

#### Cloud

The cloud mode, with account portal turned off.

To enable this mode, use:

```
yarn mode:cloud
```

#### Cloud & Account

The cloud mode, with account portal turned on. This is a replica of the mode that runs at https://budibase.app

To enable this mode, use:

```
yarn mode:account
```

### CI

An overview of the CI pipelines can be found [here](../.github/workflows/README.md)

### Troubleshooting

Sometimes, things go wrong. This can be due to incompatible updates on the Budibase platform. To clear down your development environment and start again follow **Step 6. Cleanup**, then proceed from **Step 3. Install and Build** in the setup guide above to create a fresh Budibase installation.

### Running tests

#### Unit Tests

Budibase uses Jest to run a number of tests. To run the tests execute the following command in the root folder:

```
yarn test
```

### Other Useful Information

- The contributors are listed in [AUTHORS.md](https://github.com/Budibase/budibase/blob/master/.github/AUTHORS.md) (add yourself).

- We use the [C4 (Collective Code Construction Contract)](https://rfc.zeromq.org/spec:42/C4/) process for contributions.
  Please read this if you are unfamiliar with it.
