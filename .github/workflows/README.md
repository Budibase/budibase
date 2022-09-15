
# Budibase CI Pipelines

Welcome to the budibase CI pipelines directory. This document details what each of the CI pipelines are for, and come common combinations.

## All CI Pipelines

### Note
- When running workflow dispatch jobs, ensure you always run them off the `master` branch. It defaults to `develop`, so double check before running any jobs. The exception to this case is the `deploy-release` job which requires the develop branch. 

### Standard CI Build Job (budibase_ci.yml)
Triggers:
- PR or push to develop
- PR or push to master

The standard CI Build job is what runs when you raise a PR to develop or master. 
- Installs all dependencies,
- builds the project 
- run the unit tests
- Generate test coverage metrics with codecov
- Run the cypress tests

### Release Develop Job (release-develop.yml)
Triggers:
- Push to develop

The job responsible for building, tagging and pushing docker images out to the test and release environments. 
- Installs all dependencies
- builds the project 
- run the unit tests
- publish the budibase JS packages under a prerelease tag to NPM
- build, tag and push docker images under the `develop` tag to docker hub

These images will then be pulled by the test and release environments, updating the latest automatically. Discord notifications are sent to the #infra channel when this occurs.

### Release Job (release.yml)
Triggers:
- Push to master

This job is responsible for building and pushing the latest code to NPM and docker hub, so that it can be deployed.
- Installs all dependencies
- builds the project 
- run the unit tests
- publish the budibase JS packages under a release tag to NPM (always incremented by patch versions)
- build, tag and push docker images under the `v.x.x.x` (the tag of the NPM release) tag to docker hub

### Release Selfhost Job (release-selfhost.yml)
Triggers:
- Manual Workflow Dispatch Trigger

This job is responsible for delivering the latest version of budibase to those that are self-hosting. 

This job relies on the release job to have run first, so the latest image is pushed to dockerhub. This job then will pull the latest version from `lerna.json` and try to find an image in dockerhub corresponding to that version. For example, if the version in `lerna.json` is `1.0.0`:
- Pull the images for all budibase services tagged `v1.0.0` from dockerhub
- Tag these images as `latest`
- Push them back to dockerhub. This now means anyone who pulls `latest` (self hosters using docker-compose) will get the latest version.
- Build and release the budibase helm chart for kubernetes users
- Perform a github release with the latest version. You can see previous releases here (https://github.com/Budibase/budibase/releases)

### Deploy Release (deploy-release.yml)
Triggers:
- Manual Workflow Dispatch Trigger

This job is responsible for deploying to our release, cloud kubernetes environment. You must run the release job first, to ensure that the latest images have been built and pushed to docker hub. After kicking off this job, the following will occur:

- Checks out the release branch 
- Pulls the latest `values.yaml` from budibase infra, a private repo containing budibases infrastructure configuration
- Gets the latest budibase version from `lerna.json`, if it hasn't been specified in the workflow when you kicked it off
- Configures AWS Credentials  
- Deploys the helm chart in the budibase repo to our preproduction EKS cluster, injecting the `values.yaml` we pulled from budibase-infra
- Fires off a discord webhook in the #infra channel to show that the deployment completely successfully.

### Deploy Preprod (deploy-preprod.yml)
Triggers:
- Manual Workflow Dispatch Trigger

This job is responsible for deploying to our preprod, cloud kubernetes environment. You must run the release job first, to ensure that the latest images have been built and pushed to docker hub. After kicking off this job, the following will occur:

- Checks out the master branch 
- Pulls the latest `values.yaml` from budibase infra, a private repo containing budibases infrastructure configuration
- Gets the latest budibase version from `lerna.json`, if it hasn't been specified in the workflow when you kicked it off
- Configures AWS Credentials  
- Deploys the helm chart in the budibase repo to our preprod EKS cluster, injecting the `values.yaml` we pulled from budibase-infra
- Fires off a discord webhook in the #infra channel to show that the deployment completely successfully.

### Deploy Production (deploy-cloud.yml)
Triggers:
- Manual Workflow Dispatch Trigger

This job is responsible for deploying to our production, cloud kubernetes environment. You must run the release job first, to ensure that the latest images have been built and pushed to docker hub. You can also manually enter a version number for this job, so you can perform rollbacks or upgrade to a specific version. After kicking off this job, the following will occur:

- Checks out the master branch 
- Pulls the latest `values.yaml` from budibase infra, a private repo containing budibases infrastructure configuration
- Gets the latest budibase version from `lerna.json`, if it hasn't been specified in the workflow when you kicked it off
- Configures AWS Credentials  
- Deploys the helm chart in the budibase repo to our production EKS cluster, injecting the `values.yaml` we pulled from budibase-infra
- Fires off a discord webhook in the #infra channel to show that the deployment completely successfully.

## Common Workflows

### Deploy Changes to Production (Release)
- Merge `develop` into `master`
- Wait for budibase CI job and release job to run
- Run cloud deploy job
- Run release selfhost job

### Deploy Changes to Production (Hotfix)
- Branch off `master`
- Perform your hotfix
- Merge back into `master`
- Wait for budibase CI job and release job to run
- Run cloud deploy job
- Run release selfhost job

### Rollback A Bad Cloud Deployment
- Kick off cloud deploy job
- Ensure you are running off master
- Enter the version number of the last known good version of budibase. For example `1.0.0`

## Pro

| **NOTE**: When developing for both pro / budibase repositories, your branch names need to match, or else the correct pro doesn't get run within your CI job.

### Installing Pro

The pro package is always installed from source in our CI jobs. 

This is done to prevent pro needing to be published prior to CI runs in budiabse. This is required for two reasons:
- To reduce developer need to manually bump versions, i.e: 
  - release pro, bump pro dep in budibase, now ci can run successfully
- The cyclic dependency on backend-core, i.e:
  - pro depends on backend-core
  - server depends on pro
  - backend-core lives in the monorepo, so it can't be released independently to be used in pro
  - therefore the only option is to pull pro from source and release it as a part of the monorepo release, as if it were a mono package

The install is performed using the same steps as local development, via the `yarn bootstrap` command, see the [Contributing Guide#Pro](../../docs/CONTRIBUTING.md#pro)

The branch to install pro from can vary depending on ref of the commit that triggered the budibase CI job. This is done to enable branches which have changes in both the monorepo and the pro repo to have their CI pass successfully. 

This is done using the [pro/install.sh](../../scripts/pro/install.sh) script. The script will:
- Clone pro to it's default branch (`develop`)
- Check if the clone worked, on forked versions of budibase this will fail due to no access
  - This is fine as the `yarn` command will install the version from NPM
  - Community PRs should never touch pro so this will always work
- Checkout the `BRANCH` argument, if this fails fallback to `BASE_BRANCH`
  - This enables the more complex case of a feature branch being merged to another feature branch, e.g. 
    - I am working on a branch `epic/stonks` which exists on budibase and pro. 
    - I want to merge a change to this branch in budibase from `feature/stonks-ui`, which only exists in budibase
    - The base branch ensures that `epic/stonks` in pro will still be checked out for the CI run, rather than falling back to `develop`
- Run `yarn setup` to build and install dependencies
  - `yarn` 
  - `yarn bootstrap`
  - `yarn build`
    - The will build .ts files, and also update the `main` and `types` of `package.json` to point to `dist` rather than src
    - The build command will only ever work in CI, it is prevented in local dev

#### `BRANCH` and `BASE_BRANCH` arguments
These arguments are supplied by the various budibase build and release pipelines
- `budibase_ci` 
  - `BRANCH: ${{ github.event.pull_request.head.ref }}` -> The branch being merged
  - `BASE_BRANCH: ${{ github.event.pull_request.base.ref}}` -> The base branch
- `release-develop`
  - `BRANCH: develop` -> always use the `develop` branch in pro
- `release`
  - `BRANCH: master` -> always use the `master` branch in pro 


### Releasing Pro
After budibase dependencies have been released we will release the new version of pro to match the release version of budibase dependencies. This is to ensure that we are always keeping the version of `backend-core` in sync in the pro package and in budibase packages. Without this we could run into scenarios where different versions are being used when installed via `yarn` inside the docker images, creating very difficult to debug cases.

Pro is released using the [pro/release.sh](../../scripts/pro/release.sh) script. The script will:
- Inspect the `VERSION` from the `lerna.json` file in budibase
- Determine whether to use the `latest` or `develop` tag based on the command argument
- Go to pro directory
  - install npm creds
  - update the version of `backend-core` to be `VERSION`, the version just released by lerna
  - publish to npm. Uses a `lerna publish` command, pro itself is a mono repo. 
    - force the version to be the same as `VERSION` to keep pro and budibase in sync
  - reverts the changes to `main` and `types` in `package.json` that were made by the build step, to point back to source
  - commit & push: `Prep next development iteration`
- Go to budibase
  - Update to the new version of pro in `server` and `worker` so the latest pro version is used in the docker builds
  - commit & push: `Update pro version to $VERSION`


#### `COMMAND` argument
This argument is supplied by the existing `release` and `release:develop` budibase commands, which invoke the pro release
- `release` will supply no command and default to use `latest`
- `release:develop` will supply `develop` 

