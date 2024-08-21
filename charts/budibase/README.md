# budibase

Budibase is an open source low-code platform, helping thousands of teams build apps for their workplace in minutes.

## Prerequisites

- `helm` v3 or above
- Kubernetes 1.4+
- A storage controller (if you want to use persistent storage)
- An ingress controller (if you want to define an `Ingress` resource)
- `metrics-server` (if you want to make use of horizontal pod autoscaling)

## Chart dependencies

This chart depends on the official Apache CouchDB chart. You can see its
documentation here:
<https://github.com/apache/couchdb-helm/tree/couchdb-4.3.0/couchdb>.

## Upgrading

### `2.x` to `3.0.0`

We made a number of breaking changes in this release to make the chart more
idiomatic and easier to use.

1. We no longer bundle `ingress-nginx`. If you were relying on this to supply
   an ingress controller to your cluster, you will now need to deploy that
   separately. You'll find guidance for that here:
   <https://kubernetes.github.io/ingress-nginx/>.
2. We've upgraded the version of the [CouchDB chart](https://github.com/apache/couchdb-helm)
   we use from `3.3.4` to `4.3.0`. The primary motivation for this was to align
   the CouchDB chart used with the CouchDB version used, which has also updated
   from 3.1.1 to 3.2.1. Additionally, we're moving away from the official CouchDB
   to one we're building ourselves.
3. We've separated out the supplied AWS ALB ingress resource for those deploying
   into EKS. Where previously you enabled this by setting `ingress.enabled: false`
   and `ingress.aws: true`, you now set `awsAlbIngress.enabled: true` and all
   configuration for it is under `awsAlbIngress`.
4. The `HorizontalPodAutoscaler` that was configured at `hpa.enabled: true` has
   been split into 3 separate HPAs, one for each of `apps`, `worker`, and `proxy`.
   They are configured at `services.{apps,worker,proxy}.autoscaling`.

## Installing

To install the chart from our repository:

```console
$ helm repo add budibase https://budibase.github.io/budibase/
$ helm repo update
$ helm install --create-namespace --namespace budibase budibase budibase/budibase
```

To install the chart from this repo:

```console
$ git clone git@github.com:budibase/budibase.git
$ cd budibase/charts/budibase
$ helm install --create-namespace --namespace budibase budibase .
```

## Example minimal configuration

Here's an example `values.yaml` that would get a Budibase instance running in a home
cluster using an nginx ingress controller and NFS as cluster storage (basically one of our
staff's homelabs).

<details>

```yaml
ingress:
  enabled: true
  className: "nginx"
  hosts:
    - host: budibase.local # set this to whatever DNS name you'd use
      paths:
        - backend:
            service:
              name: proxy-service
              port:
                number: 10000
          path: /
          pathType: Prefix

couchdb:
  persistentVolume:
    enabled: true
    storageClass: "nfs-client"
  adminPassword: admin

services:
  objectStore:
    storageClass: "nfs-client"
  redis:
    storageClass: "nfs-client"
```

If you wanted to use this when bringing up Budibase in your own cluster, you could save it
to your hard disk and run the following:

```console
$ helm install --create-namespace --namespace budibase budibase . -f values.yaml
```

</details>

## Configuring

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| affinity | object | `{}` | Sets the affinity for all pods created by this chart. Should not ordinarily need to be changed.  See <https://kubernetes.io/docs/tasks/configure-pod-container/assign-pods-nodes-using-node-affinity/> for more information on affinity. |
| awsAlbIngress.certificateArn | string | `""` | If you're wanting to use HTTPS, you'll need to create an ACM certificate and specify the ARN here. |
| awsAlbIngress.enabled | bool | `false` | Whether to create an ALB Ingress resource pointing to the Budibase proxy. Requires the AWS ALB Ingress Controller. |
| couchdb.clusterSize | int | `1` | The number of replicas to run in the CouchDB cluster. We set this to 1 by default to make things simpler, but you can set it to 3 if you need a high-availability CouchDB cluster. |
| couchdb.couchdbConfig.couchdb.uuid | string | `"budibase-couchdb"` | Unique identifier for this CouchDB server instance. You shouldn't need to change this. |
| couchdb.extraPorts[0] | object | `{"containerPort":4984,"name":"sqs"}` | Extra ports to expose on the CouchDB service. We expose the SQS port by default, but you can add more ports here if you need to. |
| couchdb.image | object | `{}` | We use a custom CouchDB image for running Budibase and we don't support using any other CouchDB image. You shouldn't change this, and if you do we can't guarantee that Budibase will work. |
| couchdb.service.extraPorts[0] | object | `{"name":"sqs","port":4984,"protocol":"TCP","targetPort":4984}` | Extra ports to expose on the CouchDB service. We expose the SQS port by default, but you can add more ports here if you need to. |
| globals.apiEncryptionKey | string | `""` | Used for encrypting API keys and environment variables when stored in the database. You don't need to set this if `createSecrets` is true. |
| globals.appVersion | string | `""` | The version of Budibase to deploy. Defaults to what's specified by {{ .Chart.AppVersion }}. Ends up being used as the image version tag for the apps, proxy, and worker images. |
| globals.automationMaxIterations | string | `"200"` | The maximum number of iterations allows for an automation loop step. You can read more about looping here: <https://docs.budibase.com/docs/looping>. |
| globals.budibaseEnv | string | `"PRODUCTION"` | Sets the environment variable BUDIBASE_ENVIRONMENT for the apps and worker pods. Should not ordinarily need to be changed. |
| globals.cookieDomain | string | `""` | Sets the domain attribute of the cookie that Budibase uses to store session information. See <https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#define_where_cookies_are_sent> for details on why you might want to set this. |
| globals.createSecrets | bool | `true` | Create an internal API key, JWT secret, object store access key and secret, and store them in a Kubernetes `Secret`. |
| globals.enableAnalytics | string | `"1"` | Whether to enable analytics or not. You can read more about our analytics here: <https://docs.budibase.com/docs/analytics>. |
| globals.google | object | `{"clientId":"","secret":""}` | Google OAuth settings. These can also be set in the Budibase UI, see <https://docs.budibase.com/docs/sso-with-google> for details. |
| globals.google.clientId | string | `""` | Client ID of your Google OAuth app. |
| globals.google.secret | string | `""` | Client secret of your Google OAuth app. |
| globals.httpMigrations | string | `"0"` | Whether or not to enable doing data migrations over the HTTP API. If this is set to "0", migrations are run on startup. You shouldn't ordinarily need to change this. |
| globals.internalApiKey | string | `""` | API key used for internal Budibase API calls. You don't need to set this if `createSecrets` is true. |
| globals.internalApiKeyFallback | string | `""` | A fallback value for `internalApiKey`. If you're rotating your encryption key, you can set this to the old value for the duration of the rotation. |
| globals.jwtSecret | string | `""` | Secret used for signing JWTs. You don't need to set this if `createSecrets` is true. |
| globals.jwtSecretFallback | string | `""` | A fallback value for `jwtSecret`. If you're rotating your JWT secret, you can set this to the old value for the duration of the rotation. |
| globals.platformUrl | string | `""` | Set the `platformUrl` binding. You can also do this in Settings > Organisation if you are self-hosting. |
| globals.smtp.enabled | bool | `false` | Whether to enable SMTP or not. |
| globals.smtp.from | string | `""` | The email address to use in the "From:" field of emails sent by Budibase. |
| globals.smtp.host | string | `""` | The hostname of your SMTP server. |
| globals.smtp.password | string | `""` | The password to use when authenticating with your SMTP server. |
| globals.smtp.port | string | `"587"` | The port of your SMTP server. |
| globals.smtp.user | string | `""` | The username to use when authenticating with your SMTP server. |
| globals.sqs.enabled | bool | `false` | Whether to use the CouchDB "structured query service" or not. This is disabled by default for now, but will become the default in a future release. |
| globals.tempBucketName | string | `""` |  |
| globals.tenantFeatureFlags | string | `` | Sets what feature flags are enabled and for which tenants. Should not ordinarily need to be changed. |
| imagePullSecrets | list | `[]` | Passed to all pods created by this chart. Should not ordinarily need to be changed. |
| ingress.className | string | `""` | What ingress class to use. |
| ingress.enabled | bool | `true` | Whether to create an Ingress resource pointing to the Budibase proxy. |
| ingress.hosts | list | `[]` | Standard hosts block for the Ingress resource. Defaults to pointing to the Budibase proxy. |
| nameOverride | string | `""` | Override the name of the deployment. Defaults to {{ .Chart.Name }}. |
| service.port | int | `10000` | Port to expose on the service. |
| service.type | string | `"ClusterIP"` | Service type for the service that points to the main Budibase proxy pod. |
| serviceAccount.annotations | object | `{}` | Annotations to add to the service account |
| serviceAccount.create | bool | `true` | Specifies whether a service account should be created |
| serviceAccount.name | string | `""` | The name of the service account to use. If not set and create is true, a name is generated using the fullname template |
| services.apps.autoscaling.enabled | bool | `false` | Whether to enable horizontal pod autoscaling for the apps service. |
| services.apps.autoscaling.maxReplicas | int | `10` |  |
| services.apps.autoscaling.minReplicas | int | `1` |  |
| services.apps.autoscaling.targetCPUUtilizationPercentage | int | `80` | Target CPU utilization percentage for the apps service. Note that for autoscaling to work, you will need to have metrics-server configured, and resources set for the apps pods. |
| services.apps.extraContainers | list | `[]` | Additional containers to be added to the apps pod. |
| services.apps.extraEnv | list | `[]` | Extra environment variables to set for apps pods. Takes a list of name=value pairs. |
| services.apps.extraEnvFromSecret | list | `[]` | Name of the K8s Secret in the same namespace which contains the extra environment variables. This can be used to avoid storing sensitive information in the values.yaml file. |
| services.apps.extraVolumeMounts | list | `[]` | Additional volumeMounts to the main apps container. |
| services.apps.extraVolumes | list | `[]` | Additional volumes to the apps pod. |
| services.apps.httpLogging | int | `1` | Whether or not to log HTTP requests to the apps service. |
| services.apps.livenessProbe | object | HTTP health checks. | Liveness probe configuration for apps pods. You shouldn't need to change this, but if you want to you can find more information here: <https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/> |
| services.apps.logLevel | string | `"info"` | The log level for the apps service. |
| services.apps.readinessProbe | object | HTTP health checks. | Readiness probe configuration for apps pods. You shouldn't need to change this, but if you want to you can find more information here: <https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/> |
| services.apps.replicaCount | int | `1` | The number of apps replicas to run. |
| services.apps.resources | object | `{}` | The resources to use for apps pods. See <https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/> for more information on how to set these. |
| services.apps.startupProbe | object | HTTP health checks. | Startup probe configuration for apps pods. You shouldn't need to change this, but if you want to you can find more information here: <https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/> |
| services.automationWorkers.autoscaling.enabled | bool | `false` | Whether to enable horizontal pod autoscaling for the apps service. |
| services.automationWorkers.autoscaling.maxReplicas | int | `10` |  |
| services.automationWorkers.autoscaling.minReplicas | int | `1` |  |
| services.automationWorkers.autoscaling.targetCPUUtilizationPercentage | int | `80` | Target CPU utilization percentage for the automation worker service. Note that for autoscaling to work, you will need to have metrics-server configured, and resources set for the automation worker pods. |
| services.automationWorkers.enabled | bool | `true` | Whether or not to enable the automation worker service. If you disable this, automations will be processed by the apps service. |
| services.automationWorkers.extraContainers | list | `[]` | Additional containers to be added to the automationWorkers pod. |
| services.automationWorkers.extraEnv | list | `[]` | Extra environment variables to set for automation worker pods. Takes a list of name=value pairs. |
| services.automationWorkers.extraEnvFromSecret | list | `[]` | Name of the K8s Secret in the same namespace which contains the extra environment variables. This can be used to avoid storing sensitive information in the values.yaml file. |
| services.automationWorkers.extraVolumeMounts | list | `[]` | Additional volumeMounts to the main automationWorkers container. |
| services.automationWorkers.extraVolumes | list | `[]` | Additional volumes to the automationWorkers pod. |
| services.automationWorkers.livenessProbe | object | HTTP health checks. | Liveness probe configuration for automation worker pods. You shouldn't need to change this, but if you want to you can find more information here: <https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/> |
| services.automationWorkers.logLevel | string | `"info"` | The log level for the automation worker service. |
| services.automationWorkers.readinessProbe | object | HTTP health checks. | Readiness probe configuration for automation worker pods. You shouldn't need to change this, but if you want to you can find more information here: <https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/> |
| services.automationWorkers.replicaCount | int | `1` | The number of automation worker replicas to run. |
| services.automationWorkers.resources | object | `{}` | The resources to use for automation worker pods. See <https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/> for more information on how to set these. |
| services.automationWorkers.startupProbe | object | HTTP health checks. | Startup probe configuration for automation worker pods. You shouldn't need to change this, but if you want to you can find more information here: <https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/> |
| services.couchdb.backup.enabled | bool | `false` | Whether or not to enable periodic CouchDB backups. This works by replicating to another CouchDB instance. |
| services.couchdb.backup.interval | string | `""` | Backup interval in seconds |
| services.couchdb.backup.resources | object | `{}` | The resources to use for CouchDB backup pods. See <https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/> for more information on how to set these. |
| services.couchdb.backup.target | string | `""` | Target couchDB instance to back up to, either a hostname or an IP address. |
| services.couchdb.enabled | bool | `true` | Whether or not to spin up a CouchDB instance in your cluster. True by default, and the configuration for the CouchDB instance is under the `couchdb` key at the root of this file. You can see what options are available to you by looking at the official CouchDB Helm chart: <https://github.com/apache/couchdb-helm/tree/couchdb-4.3.0/couchdb>. |
| services.couchdb.port | int | `5984` |  |
| services.dns | string | `"cluster.local"` | The DNS suffix to use for service discovery. You only need to change this if you've configured your cluster to use a different DNS suffix. |
| services.objectStore.accessKey | string | `""` | AWS_ACCESS_KEY if using S3 |
| services.objectStore.browser | bool | `true` | Whether to enable the Minio web console or not. If you're exposing Minio to the Internet (via a custom Ingress record, for example), you should set this to false. If you're only exposing Minio to your cluster, you can leave this as true. |
| services.objectStore.cloudfront.cdn | string | `""` | Set the url of a distribution to enable cloudfront. |
| services.objectStore.cloudfront.privateKey64 | string | `""` | Base64 encoded private key for the above public key. |
| services.objectStore.cloudfront.publicKeyId | string | `""` | ID of public key stored in cloudfront. |
| services.objectStore.extraContainers | list | `[]` | Additional containers to be added to the objectStore pod. |
| services.objectStore.extraVolumeMounts | list | `[]` | Additional volumeMounts to the main objectStore container. |
| services.objectStore.extraVolumes | list | `[]` | Additional volumes to the objectStore pod. |
| services.objectStore.minio | bool | `true` | Set to false if using another object store, such as S3. You will need to set `services.objectStore.url` to point to your bucket if you do this. |
| services.objectStore.region | string | `""` | AWS_REGION if using S3 |
| services.objectStore.resources | object | `{}` | The resources to use for Minio pods. See <https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/> for more information on how to set these. |
| services.objectStore.secretKey | string | `""` | AWS_SECRET_ACCESS_KEY if using S3 |
| services.objectStore.storage | string | `"2Gi"` | How much storage to give Minio in its PersistentVolumeClaim. |
| services.objectStore.storageClass | string | `""` | If defined, storageClassName: <storageClass> If set to "-", storageClassName: "", which disables dynamic provisioning If undefined (the default) or set to null, no storageClassName spec is set, choosing the default provisioner. |
| services.objectStore.url | string | `"http://minio-service:9000"` | URL to use for object storage. Only change this if you're using an external object store, such as S3. Remember to set `minio: false` if you do this. |
| services.proxy.autoscaling.enabled | bool | `false` | Whether to enable horizontal pod autoscaling for the proxy service. |
| services.proxy.autoscaling.maxReplicas | int | `10` |  |
| services.proxy.autoscaling.minReplicas | int | `1` |  |
| services.proxy.autoscaling.targetCPUUtilizationPercentage | int | `80` | Target CPU utilization percentage for the proxy service. Note that for autoscaling to work, you will need to have metrics-server configured, and resources set for the proxy pods. |
| services.proxy.extraContainers | list | `[]` |  |
| services.proxy.extraVolumeMounts | list | `[]` | Additional volumeMounts to the main proxy container. |
| services.proxy.extraVolumes | list | `[]` | Additional volumes to the proxy pod. |
| services.proxy.livenessProbe | object | HTTP health checks. | Liveness probe configuration for proxy pods. You shouldn't need to change this, but if you want to you can find more information here: <https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/> |
| services.proxy.readinessProbe | object | HTTP health checks. | Readiness probe configuration for proxy pods. You shouldn't need to change this, but if you want to you can find more information here: <https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/> |
| services.proxy.replicaCount | int | `1` | The number of proxy replicas to run. |
| services.proxy.resources | object | `{}` | The resources to use for proxy pods. See <https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/> for more information on how to set these. |
| services.proxy.startupProbe | object | HTTP health checks. | Startup probe configuration for proxy pods. You shouldn't need to change this, but if you want to you can find more information here: <https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/> |
| services.redis.enabled | bool | `true` | Whether or not to deploy a Redis pod into your cluster. |
| services.redis.extraContainers | list | `[]` | Additional containers to be added to the redis pod. |
| services.redis.extraVolumeMounts | list | `[]` | Additional volumeMounts to the main redis container. |
| services.redis.extraVolumes | list | `[]` | Additional volumes to the redis pod. |
| services.redis.image | string | `"redis"` | The Redis image to use. |
| services.redis.password | string | `"budibase"` | The password to use when connecting to Redis. It's recommended that you change this from the default if you're running Redis in-cluster. |
| services.redis.port | int | `6379` | Port to expose Redis on. |
| services.redis.resources | object | `{}` | The resources to use for Redis pods. See <https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/> for more information on how to set these. |
| services.redis.storage | string | `"100Mi"` | How much persistent storage to allocate to Redis. |
| services.redis.storageClass | string | `""` | If defined, storageClassName: <storageClass> If set to "-", storageClassName: "", which disables dynamic provisioning If undefined (the default) or set to null, no storageClassName spec is set, choosing the default provisioner. |
| services.redis.url | string | `""` | If you choose to run Redis externally to this chart, you can specify the connection details here. |
| services.worker.autoscaling.enabled | bool | `false` | Whether to enable horizontal pod autoscaling for the worker service. |
| services.worker.autoscaling.maxReplicas | int | `10` |  |
| services.worker.autoscaling.minReplicas | int | `1` |  |
| services.worker.autoscaling.targetCPUUtilizationPercentage | int | `80` | Target CPU utilization percentage for the worker service. Note that for autoscaling to work, you will need to have metrics-server configured, and resources set for the worker pods. |
| services.worker.extraContainers | list | `[]` | Additional containers to be added to the worker pod. |
| services.worker.extraEnv | list | `[]` | Extra environment variables to set for worker pods. Takes a list of name=value pairs. |
| services.worker.extraEnvFromSecret | list | `[]` | Name of the K8s Secret in the same namespace which contains the extra environment variables. This can be used to avoid storing sensitive information in the values.yaml file. |
| services.worker.extraVolumeMounts | list | `[]` | Additional volumeMounts to the main worker container. |
| services.worker.extraVolumes | list | `[]` | Additional volumes to the worker pod. |
| services.worker.httpLogging | int | `1` | Whether or not to log HTTP requests to the worker service. |
| services.worker.livenessProbe | object | HTTP health checks. | Liveness probe configuration for worker pods. You shouldn't need to change this, but if you want to you can find more information here: <https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/> |
| services.worker.logLevel | string | `"info"` | The log level for the worker service. |
| services.worker.readinessProbe | object | HTTP health checks. | Readiness probe configuration for worker pods. You shouldn't need to change this, but if you want to you can find more information here: <https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/> |
| services.worker.replicaCount | int | `1` | The number of worker replicas to run. |
| services.worker.resources | object | `{}` | The resources to use for worker pods. See <https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/> for more information on how to set these. |
| services.worker.startupProbe | object | HTTP health checks. | Startup probe configuration for worker pods. You shouldn't need to change this, but if you want to you can find more information here: <https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/> |
| tolerations | list | `[]` | Sets the tolerations for all pods created by this chart. Should not ordinarily need to be changed. See <https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/> for more information on tolerations. |

## Uninstalling

To uninstall the chart, assuming you named the release `budibase` (both commands in the installation section do so):

```console
$ helm uninstall --namespace budibase budibase
```

----------------------------------------------
Autogenerated from chart metadata using [helm-docs v1.13.1](https://github.com/norwoodj/helm-docs/releases/v1.13.1)
