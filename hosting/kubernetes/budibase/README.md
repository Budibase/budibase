# Budibase

[Budibase](https://budibase.com/) Budibase is an open source low-code platform, helping thousands of teams build apps for their workplace in minutes.

## TL;DR;
```console
$ cd chart
$ helm install budibase .
```

## Introduction

This chart bootstraps a [Budibase](https://budibase.com/) deployment on a [Kubernetes](http://kubernetes.io) cluster using the [Helm](https://helm.sh) package manager.

## Prerequisites

- helm v3 or above
- Kubernetes 1.4+
- PV provisioner support in the underlying infrastructure (with persistence storage enabled)

## Installing the Chart

To install the chart with the release name `budi-release`:

```console
$ helm install budi-release .
```

The command deploys Budibase on the Kubernetes cluster in the default configuration. The [configuration](#configuration) section lists the parameters that can be configured during installation.

> **Tip**: List all releases using `helm list`

## Uninstalling the Chart

To uninstall/delete the `my-release` deployment:

```console
$ helm delete my-release
```
