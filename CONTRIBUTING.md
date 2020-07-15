# Contributing

From opening a bug report to creating a pull request: every contribution is appreciated and welcome. If you're planning to implement a new feature or change the api please create an issue first. This way we can ensure that your precious work is not in vain.

### Not Sure Where to Start?

Budibase is a low-code web application builder that creates svelte based web applications.

Budibase is a monorepo managed by [lerna](https://github.com/lerna/lerna). Lerna manages the building and publishing of the budibase packages. At a high level, here are the packages that make up budibase.

- **packages/builder** - contains code for the budibase builder client side svelte application.

- **packages/client** - A module that runs in the browser responsible for reading JSON definition and creating living, breathing web apps from it.

- **packages/cli** - The budibase CLI. This is the main module that gets downloaded from NPM and is responsible for creating and managing apps, as well as running the budibase server. 

- **packages/server** - The budibase server. This [Koa](https://koajs.com/) app is responsible for serving the JS for the builder and budibase apps, as well as providing the API for interaction with the database and file system.


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

* Once your work is completed, please raise a PR against the main branch with some information about what has changed and why.

### Getting Started For Contributors

### 1.  Prerequisites

*yarn -* `npm install -g yarn`

*jest* - `npm install -g jest`

### 2. Clone this repository

`git clone https://github.com/Budibase/budibase.git`

then `cd ` into your local copy.

### 3.  Install and Build

`yarn` to install project dependencies

`yarn bootstrap` will install all budibase modules and symlink them together using lerna.

`yarn build` will build all budibase packages.

### 4. Initialising Budibase and Creating a Budibase App

`yarn initialise` will initialise your budibase installation. A Budibase apps folder will have been created in `~/.budibase`.

This is a blank apps folder, so you will need to create yourself an app.

```
cd packages/server
yarn run budi new your-app-name
```

This will create a new budibase application in the `~/.budibase/<your-app-uuid>` directory, and NPM install the component libraries for that application. Let's start building your app with the budibase builder!

### 4. Running

To run the budibase server and builder in dev mode (i.e. with live reloading):

1. Open a new console
2. `yarn dev` (from root)
3. Access the builder on http://localhost:4001/_builder/

This will enable watch mode for both the builder app, server, client library and any component libraries.

### Running Commands from /server Directory

Notice that when inside `packages/server`, you can use any Budibase CLI command via yarn:

e.g. `yarn budi new mikes_app` == `budi new mikes_app`

This will use the CLI directly from `packages/cli`, rather than your globally installed `budi`



## Data Storage

When you are running locally, budibase stores data on disk using [PouchDB](https://pouchdb.com/), as well as some JSON on local files. After setting up budibase, you can find all of this data in the `~/.budibase` directory.

A client can have one or more budibase applications. Budibase applications are stored in `~/.budibase/<app-uuid>`. Files used by your budibase application when running are stored in the `public` directory. Everything else is dev files used for the development of your apps in the builder.

#### Frontend

To see the current individual JSON definitions for your pages and screens used by the builder, have a look at `~/.budibase/<app-uuid>/pages`.

For your actual running application (not in dev), the frontend tree structure of the application (known as `clientFrontendDefinition`) is stored as JSON on disk. This is what the budibase client library reads to create your app at runtime. This can be found at `~/.budibase/<app-uuid>/public/clientFrontendDefinition.js`

The HTML and CSS for your apps runtime pages, as well as the budibase client library JS is stored at:

- `~/.budibase/<app-uuid>/public/main`
- `~/.budibase/<app-uuid>/public/unauthenticated`

#### Backend

The backend schema, models and records are stored using PouchDB when developing locally, and in [CouchDB](https://pouchdb.com/) when running in production.

### Publishing Budibase to NPM

You can publish all the latest versions of the monorepo packages by running:

```
yarn publishnpm
```

from your root directory.

### Troubleshooting

Sometimes, things go wrong. This can be due to incompatible updates on the budibase platform. To clear down your development environment and start again: 

```
rm -rf ~/.budibase
```
Follow from **Step 3. Install and Build** in the setup guide above. You should have a fresh Budibase installation.

### Running tests

#### End-to-end Tests

Budibase uses Cypress to run a number of E2E tests. To run the tests execute the following command in the root folder:

```
yarn test:e2e
```

Or if you are in the builder you can run `yarn cy:test`.


### Other Useful Information

* The contributors are listed in [AUTHORS.md](https://github.com/budibase/server/blob/master/AUTHORS.md) (add yourself).

* This project uses a modified version of the MPLv2 license, see [LICENSE](https://github.com/budibase/server/blob/master/LICENSE).

* We use the [C4 (Collective Code Construction Contract)](https://rfc.zeromq.org/spec:42/C4/) process for contributions.
  Please read this if you are unfamiliar with it.
