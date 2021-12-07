# Budibase DigitalOcean One Click
You will find in this directory configuration for packaging and creating a snapshot for the Budibase 1 click Digitalocean build. We use this configuration to have an immutable and reproducible build package for Digitalocean, that rarely needs updated.

## Prerequisites
You must install Hashicorps `packer` to build the snapshot for digitalocean. Follow the instructions to install packer [here](https://learn.hashicorp.com/tutorials/packer/get-started-install-cli)

You must have the `DIGITALOCEAN_TOKEN` environment variable set, so that packer can reach out to the digitalocean API for build information.

## Building
Just run the following command:
```
yarn build:digitalocean
```

## Uploading to Marketplace
You can upload the snapshot to the Digitalocean vendor portal at the following link (Requires vendor account):

https://marketplace.digitalocean.com/vendorportal

