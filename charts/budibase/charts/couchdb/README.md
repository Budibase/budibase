# CouchDB

![Version: 4.5.6](https://img.shields.io/badge/Version-4.5.6-informational?style=flat-square) ![AppVersion: 3.3.3](https://img.shields.io/badge/AppVersion-3.3.3-informational?style=flat-square)

Apache CouchDB is a database featuring seamless multi-master sync, that scales
from big data to mobile, with an intuitive HTTP/JSON API and designed for
reliability.

This chart deploys a CouchDB cluster as a StatefulSet. It creates a ClusterIP
Service in front of the Deployment for load balancing by default, but can also
be configured to deploy other Service types or an Ingress Controller. The
default persistence mechanism is simply the ephemeral local filesystem, but
production deployments should set `persistentVolume.enabled` to `true` to attach
storage volumes to each Pod in the Deployment.

## TL;DR

```bash
$ helm repo add couchdb https://apache.github.io/couchdb-helm
$ helm install couchdb/couchdb \
  --version=4.5.6 \
  --set allowAdminParty=true \
  --set couchdbConfig.couchdb.uuid=$(curl https://www.uuidgenerator.net/api/version4 2>/dev/null | tr -d -)
```

## Prerequisites

- Kubernetes 1.9+ with Beta APIs enabled
- Ingress requires Kubernetes 1.19+

## Installing the Chart

To install the chart with the release name `my-release`:

Add the CouchDB Helm repository:

```bash
$ helm repo add couchdb https://apache.github.io/couchdb-helm
```

Afterwards install the chart replacing the UUID
`decafbaddecafbaddecafbaddecafbad` with a custom one:

```bash
$ helm install \
  --name my-release \
  --version=4.5.6 \
  --set couchdbConfig.couchdb.uuid=decafbaddecafbaddecafbaddecafbad \
  couchdb/couchdb
```

This will create a Secret containing the admin credentials for the cluster.
Those credentials can be retrieved as follows:

```bash
$ kubectl get secret my-release-couchdb -o go-template='{{ .data.adminPassword }}' | base64 --decode
```

If you prefer to configure the admin credentials directly you can create a
Secret containing `adminUsername`, `adminPassword` and `cookieAuthSecret` keys:

```bash
$  kubectl create secret generic my-release-couchdb --from-literal=adminUsername=foo --from-literal=adminPassword=bar --from-literal=cookieAuthSecret=baz
```

If you want to set the `adminHash` directly to achieve consistent salts between
different nodes you need to add it to the secret:

```bash
$  kubectl create secret generic my-release-couchdb \
   --from-literal=adminUsername=foo \
   --from-literal=cookieAuthSecret=baz \
   --from-literal=adminHash=-pbkdf2-d4b887da....
```

and then install the chart while overriding the `createAdminSecret` setting:

```bash
$ helm install \
  --name my-release \
  --version=4.5.6 \
  --set createAdminSecret=false \
  --set couchdbConfig.couchdb.uuid=decafbaddecafbaddecafbaddecafbad \
  couchdb/couchdb
```

This Helm chart deploys CouchDB on the Kubernetes cluster in a default
configuration. The [configuration](#configuration) section lists
the parameters that can be configured during installation.

> **Tip**: List all releases using `helm list`

## Uninstalling the Chart

To uninstall/delete the `my-release` Deployment:

```bash
$ helm delete my-release
```

The command removes all the Kubernetes components associated with the chart and
deletes the release.

## Upgrading an existing Release to a new major version

A major chart version change (like v0.2.3 -> v1.0.0) indicates that there is an
incompatible breaking change needing manual actions.

### Upgrade to 3.0.0

Since version 3.0.0 setting the CouchDB server instance UUID is mandatory.
Therefore you need to generate a UUID and supply it as a value during the
upgrade as follows:

```bash
$ helm upgrade <release-name> \
  --version=3.6.4 \
  --reuse-values \
  --set couchdbConfig.couchdb.uuid=<UUID> \
  couchdb/couchdb
```

### Upgrade to 4.0.0

Breaking change between v3 and v4 is the `adminHash` in the secret that no longer uses
the `password.ini`. It stores the `adminHash` only instead, make sure to change it if you
use your own secret.

## Migrating from stable/couchdb

This chart replaces the `stable/couchdb` chart previously hosted by Helm and continues the
version semantics. You can upgrade directly from `stable/couchdb` to this chart using:

```bash
$ helm repo add couchdb https://apache.github.io/couchdb-helm
$ helm upgrade my-release --version=4.5.6 couchdb/couchdb
```

## Configuration

The following table lists the most commonly configured parameters of the
CouchDB chart and their default values:

