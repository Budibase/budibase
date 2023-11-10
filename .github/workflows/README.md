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
- Run the integration tests

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
