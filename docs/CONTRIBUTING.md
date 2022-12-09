# Contributing

From opening a bug report to creating a pull request: every contribution is appreciated and welcome. If you're planning to implement a new feature or change the api please [create an issue](https://github.com/Budibase/budibase/issues/new/choose) first. This way we can ensure that your precious work is not in vain.

## Table of contents

- [Where to start](#not-sure-where-to-start)
- [Contributor Licence Agreement](#contributor-license-agreement-cla)
- [Glossary of Terms](#glossary-of-terms)
- [Contributing to Budibase](#contributing-to-budibase)


## Not Sure Where to Start?

Budibase is a low-code web application builder that creates svelte-based web applications.

Budibase is a monorepo managed by [lerna](https://github.com/lerna/lerna). Lerna manages the building and publishing of the budibase packages. At a high level, here are the packages that make up budibase.

- **packages/builder** - contains code for the budibase builder client side svelte application.

- **packages/client** - A module that runs in the browser responsible for reading JSON definition and creating living, breathing web apps from it.

- **packages/server** - The budibase server. This [Koa](https://koajs.com/) app is responsible for serving the JS for the builder and budibase apps, as well as providing the API for interaction with the database and file system.

- **packages/worker** - This [Koa](https://koajs.com/) app is responsible for providing global apis for managing your budibase installation. Authentication, Users, Email, Org and Auth configs are all provided by the worker. 

## Contributor License Agreement (CLA)

In order to accept your pull request, we need you to submit a CLA. You only need to do this once. If you are submitting a pull request for the first time, just submit a Pull Request and our CLA Bot will give you instructions on how to sign the CLA before merging your Pull Request.

All contributors must sign an [Individual Contributor License Agreement](https://github.com/budibase/budibase/blob/next/.github/cla/individual-cla.md).

If contributing on behalf of your company, your company must sign a [Corporate Contributor License Agreement](https://github.com/budibase/budibase/blob/next/.github/cla/corporate-cla.md). If so, please contact us via community@budibase.com.

If for any reason, your first contribution is in a PR created by other contributor, please just add a comment to the PR
with the following text to agree our CLA: "I have read the CLA Document and I hereby sign the CLA".

## Glossary of Terms

To understand the budibase API, it can be helpful to understand the top level entities that make up Budibase.

### Client

A client represents a single budibase customer. Each budibase client will have 1 or more budibase servers. Every client is assigned a unique ID.

### App

A client can have one or more budibase applications. Budibase applications would be things like "Developer Inventory Management" or "Goat Herder CRM". Think of a budibase application as a tree. 

### Database

An App can have one or more databases. Keeping with our [dendrology](https://en.wikipedia.org/wiki/Dendrology) analogy - think of an database as a branch on the tree. Databases are used to keep data separate for different instances of your app. For example, if you had a CRM app, you may create a database for your US office, and a database for your Australian office. Databases allow us to support [multitenancy](https://www.gartner.com/en/information-technology/glossary/multitenancy) in budibase applications.

### Table

Tables in budibase are almost akin to tables in relational databases. A table may be a "Car" or an "Employee". They are the main building blocks for the creation and management of backend data in budibase.

### View

A View is an advanced feature in budibase that allows you to write a custom query using [MapReduce](https://pouchdb.com/guides/queries.html) queries. Views enable powerful query functionality and calculations, allowing you to do more with your data.

### Page

A page in budibase is actually a single, self contained svelte web app. There are only 2 pages in budibase. The **login** page and the **main** page.

### Screen

A screen is a component within a single page. Generally, screens represent client side routes, and can be switched without refreshing the page.

### Component

A component is the basic frontend building block of a budibase app.

### Component Library

Component libraries are collections of components as well as the definition of their props contained in a file called `components.json`. 

## Contributing to Budibase

* Please maintain the existing code style. 

* Please try to keep your commits small and focused.

* Please write tests.

* If the project diverges from your branch, please rebase instead of merging. This makes the commit graph easier to read.

* Once your work is completed, please raise a PR against the `develop` branch with some information about what has changed and why.

### Getting Started For Contributors
#### 1.  Prerequisites

NodeJS Version `14.x.x`

*yarn -* `npm install -g yarn`

*jest* - `npm install -g jest`

#### 2. Clone this repository

`git clone https://github.com/Budibase/budibase.git`

then `cd ` into your local copy.

#### 3.  Install and Build

| **NOTE**: On Windows, all yarn commands must be executed on a bash shell (e.g. git bash)

To develop the Budibase platform you'll need [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed.

##### Quick method

`yarn setup` will check that all necessary components are installed and setup the repo for usage.

##### Manual method

The following commands can be executed to manually get Budibase up and running (assuming Docker/Docker Compose has been installed).

`yarn` to install project dependencies

`yarn bootstrap` will install all budibase modules and symlink them together using lerna.

`yarn build` will build all budibase packages.

#### 4. Running

To run the budibase server and builder in dev mode (i.e. with live reloading):

1. Open a new console
2. `yarn dev` (from root)
3. Access the builder on http://localhost:10000/builder

This will enable watch mode for both the builder app, server, client library and any component libraries.

#### 5. Debugging using VS Code

To debug the budibase server and worker a VS Code launch configuration has been provided. 

Visit the debug window and select `Budibase Server` or `Budibase Worker` to debug the respective component. 
Alternatively to start both components simultaneously select `Start Budibase`.

In addition to the above, the remaining budibase components may be run in dev mode using: `yarn dev:noserver`.

#### 6. Cleanup

If you wish to delete all the apps created in development and reset the environment then run the following:

1. `yarn nuke:docker` will wipe all the Budibase services
2. `yarn dev` will restart all the services

### Backend

For the backend we run [Redis](https://redis.io/), [CouchDB](https://couchdb.apache.org/), [MinIO](https://min.io/) and [NGINX](https://www.nginx.com/) in Docker compose. This means that to develop Budibase you will need Docker and Docker compose installed. The backend services are then run separately as Node services with nodemon so that they can be debugged outside of Docker.

### Data Storage

When you are running locally, budibase stores data on disk using docker volumes. The volumes and the types of data associated with each are:

- `redis_data` 
  - Sessions, email tokens
- `couchdb3_data` 
  - Global and app databases
- `minio_data` 
  - App manifest, budibase client, static assets

### Development Modes

A combination of environment variables controls the mode budibase runs in.

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

### Pro

@budibase/pro is the closed source package that supports licensed features in budibase. By default the package will be pulled from NPM and will not normally need to be touched in local development. If you require to update code inside the pro package it can be cloned to the same root level as budibase, e.g. 

```
.
|_ budibase
|_ budibase-pro
```

Note that only budibase maintainers will be able to access the pro repo. 

The `yarn bootstrap` command can be used to replace the NPM supplied dependency with the local source aware version. This is achieved using the `yarn link` command. To see specifically how dependencies are linked see [scripts/link-dependencies.sh](../scripts/link-dependencies.sh). The same link script is used to link dependencies to account-portal in local dev. 

### Troubleshooting

Sometimes, things go wrong. This can be due to incompatible updates on the budibase platform. To clear down your development environment and start again follow **Step 6. Cleanup**, then proceed from **Step 3. Install and Build** in the setup guide above to create a fresh Budibase installation.
### Running tests

#### End-to-end Tests

Budibase uses Cypress to run a number of E2E tests. To run the tests execute the following command in the root folder:

```
yarn test:e2e
```

Or if you are in the builder you can run `yarn cy:test`.


### Other Useful Information

* The contributors are listed in [AUTHORS.md](https://github.com/Budibase/budibase/blob/master/.github/AUTHORS.md) (add yourself).

* This project uses a modified version of the MPLv2 license, see [LICENSE](https://github.com/budibase/server/blob/master/LICENSE).

* We use the [C4 (Collective Code Construction Contract)](https://rfc.zeromq.org/spec:42/C4/) process for contributions.
  Please read this if you are unfamiliar with it.
