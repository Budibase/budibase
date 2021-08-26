# CouchDB

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
  --set allowAdminParty=true \
  --set couchdbConfig.couchdb.uuid=$(curl https://www.uuidgenerator.net/api/version4 2>/dev/null | tr -d -)
```

## Prerequisites

- Kubernetes 1.9+ with Beta APIs enabled
- Ingress requires Kubernetes 1.14+

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
different nodes you need to addionally add the key `password.ini` to the secret:

```bash
$  kubectl create secret generic my-release-couchdb \
   --from-literal=adminUsername=foo \
   --from-literal=cookieAuthSecret=baz \
   --from-file=./my-password.ini 
```

With the following contents in `my-password.ini`:

```
[admins]
foo = <pbkdf2-hash>
```

and then install the chart while overriding the `createAdminSecret` setting:

```bash
$ helm install \
  --name my-release \
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
  --reuse-values \
  --set couchdbConfig.couchdb.uuid=<UUID> \
  couchdb/couchdb
```

## Migrating from stable/couchdb

This chart replaces the `stable/couchdb` chart previously hosted by Helm and continues the
version semantics. You can upgrade directly from `stable/couchdb` to this chart using:

```bash
$ helm repo add couchdb https://apache.github.io/couchdb-helm
$ helm upgrade my-release couchdb/couchdb
```

## Configuration

The following table lists the most commonly configured parameters of the
CouchDB chart and their default values:

|           Parameter             |             Description                               |                Default                 |
|---------------------------------|-------------------------------------------------------|----------------------------------------|
| `clusterSize`                   | The initial number of nodes in the CouchDB cluster    | 3                                      |
| `couchdbConfig`                 | Map allowing override elements of server .ini config  | *See below*                            |
| `allowAdminParty`               | If enabled, start cluster without admin account       | false (requires creating a Secret)     |
| `createAdminSecret`             | If enabled, create an admin account and cookie secret | true                                   |
| `schedulerName`                 | Name of the k8s scheduler (other than default)        | `nil`                                  |
| `erlangFlags`                   | Map of flags supplied to the underlying Erlang VM     | name: couchdb, setcookie: monster
| `persistentVolume.enabled`      | Boolean determining whether to attach a PV to each node | false
| `persistentVolume.size`         | If enabled, the size of the persistent volume to attach                          | 10Gi
| `enableSearch`                  | Adds a sidecar for Lucene-powered text search         | false                                  |

You can set the values of the `couchdbConfig` map according to the
[official configuration][4]. The following shows the map's default values and
required options to set:

|           Parameter             |             Description                                            |                Default                 |
|---------------------------------|--------------------------------------------------------------------|----------------------------------------|
| `couchdb.uuid`                  | UUID for this CouchDB server instance ([Required in a cluster][5]) |                                        |
| `chttpd.bind_address`           | listens on all interfaces when set to any                          | any                                    |
| `chttpd.require_valid_user`     | disables all the anonymous requests to the port 5984 when true     | false                                  |

A variety of other parameters are also configurable. See the comments in the
`values.yaml` file for further details:

|           Parameter                  |                Default                 |
|--------------------------------------|----------------------------------------|
| `adminUsername`                      | admin                                  |
| `adminPassword`                      | auto-generated                         |
| `adminHash`                          |                                        |
| `cookieAuthSecret`                   | auto-generated                         |
| `image.repository`                   | couchdb                                |
| `image.tag`                          | 3.1.0                                  |
| `image.pullPolicy`                   | IfNotPresent                           |
| `searchImage.repository`             | kocolosk/couchdb-search                |
| `searchImage.tag`                    | 0.1.0                                  |
| `searchImage.pullPolicy`             | IfNotPresent                           |
| `initImage.repository`               | busybox                                |
| `initImage.tag`                      | latest                                 |
| `initImage.pullPolicy`               | Always                                 |
| `ingress.enabled`                    | false                                  |
| `ingress.hosts`                      | chart-example.local                    |
| `ingress.annotations`                |                                        |
| `ingress.path`                       | /                                      |
| `ingress.tls`                        |                                        |
| `persistentVolume.accessModes`       | ReadWriteOnce                          |
| `persistentVolume.storageClass`      | Default for the Kube cluster           |
| `podManagementPolicy`                | Parallel                               |
| `affinity`                           |                                        |
| `annotations`                        |                                        |
| `tolerations`                        |                                        |
| `resources`                          |                                        |
| `service.annotations`                |                                        |
| `service.enabled`                    | true                                   |
| `service.type`                       | ClusterIP                              |
| `service.externalPort`               | 5984                                   |
| `dns.clusterDomainSuffix`            | cluster.local                          |
| `networkPolicy.enabled`              | true                                   |
| `serviceAccount.enabled`             | true                                   |
| `serviceAccount.create`              | true                                   |
| `serviceAccount.imagePullSecrets`    |                                        |
| `sidecars`                           | {}                                     |
| `livenessProbe.enabled`              | true                                   |
| `livenessProbe.failureThreshold`     | 3                                      |
| `livenessProbe.initialDelaySeconds`  | 0                                      |
| `livenessProbe.periodSeconds`        | 10                                     |
| `livenessProbe.successThreshold`     | 1                                      |
| `livenessProbe.timeoutSeconds`       | 1                                      |
| `readinessProbe.enabled`             | true                                   |
| `readinessProbe.failureThreshold`    | 3                                      |
| `readinessProbe.initialDelaySeconds` | 0                                      |
| `readinessProbe.periodSeconds`       | 10                                     |
| `readinessProbe.successThreshold`    | 1                                      |
| `readinessProbe.timeoutSeconds`      | 1                                      |

## Feedback, Issues, Contributing

General feedback is welcome at our [user][1] or [developer][2] mailing lists.

Apache CouchDB has a [CONTRIBUTING][3] file with details on how to get started
with issue reporting or contributing to the upkeep of this project. In short,
use GitHub Issues, do not report anything on Docker's website.

## Non-Apache CouchDB Development Team Contributors

- [@natarajaya](https://github.com/natarajaya)
- [@satchpx](https://github.com/satchpx)
- [@spanato](https://github.com/spanato)
- [@jpds](https://github.com/jpds)
- [@sebastien-prudhomme](https://github.com/sebastien-prudhomme)
- [@stepanstipl](https://github.com/sebastien-stepanstipl)
- [@amatas](https://github.com/amatas)
- [@Chimney42](https://github.com/Chimney42)
- [@mattjmcnaughton](https://github.com/mattjmcnaughton)
- [@mainephd](https://github.com/mainephd)
- [@AdamDang](https://github.com/AdamDang)
- [@mrtyler](https://github.com/mrtyler)
- [@kevinwlau](https://github.com/kevinwlau)
- [@jeyenzo](https://github.com/jeyenzo)
- [@Pinpin31.](https://github.com/Pinpin31)

[1]: http://mail-archives.apache.org/mod_mbox/couchdb-user/
[2]: http://mail-archives.apache.org/mod_mbox/couchdb-dev/
[3]: https://github.com/apache/couchdb/blob/master/CONTRIBUTING.md
[4]: https://docs.couchdb.org/en/stable/config/index.html
[5]: https://docs.couchdb.org/en/latest/setup/cluster.html#preparing-couchdb-nodes-to-be-joined-into-a-cluster
