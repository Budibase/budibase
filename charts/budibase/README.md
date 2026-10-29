# budibase

Budibase is an open source low-code platform, helping thousands of teams build apps for their workplace in minutes.

## Prerequisites

- Helm 3
- Kubernetes 1.21+
- Dynamic volume provisioning or suitable pre-provisioned volumes. The default
  installation creates persistent volume claims for CouchDB, MinIO, and Redis.
- An ingress controller, unless you set `ingress.enabled: false`. The chart
  creates an Ingress by default.
- `metrics-server` (if you want to make use of horizontal pod autoscaling)

## Chart dependencies

This chart depends on the official Apache CouchDB chart. You can see its
documentation here:
<https://github.com/apache/couchdb-helm/tree/couchdb-4.5.6/couchdb>.

## Upgrading

### Changing `globals.secretName`

> [!WARNING]
> Before changing `globals.secretName` on an existing installation, copy all
> data from the current Secret to a Secret with the new name. The chart cannot
> migrate Secret data between names. If the encryption keys are regenerated,
> existing encrypted data becomes unreadable. Create the copied Secret before
> upgrading the release with the new value.

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

## Traffic and services

The chart-created Ingress sends traffic to `proxy-service` on port `10000`.
The separate top-level Service named from the Helm release is retained for
resource compatibility and is not used by that Ingress. Its selector does not
match the current workloads, so it has no endpoints. Use `proxy-service` for
in-cluster traffic and set `service.enabled: false` unless another workflow
expects the legacy Service resource.

## Service accounts

`serviceAccount.create` creates a ServiceAccount resource, but the Budibase
workloads currently use the namespace's default ServiceAccount. Setting
`serviceAccount.name` or `serviceAccount.annotations` does not attach that
ServiceAccount to the pods.

## Secrets

With `globals.createSecrets: true` (the default), the chart creates or updates
the Secret named by `globals.secretName`. If no name is set, it uses the release
fullname. Existing Secret data takes precedence, and missing keys are populated
from chart values or generated defaults.

Values supplied to Helm are stored in Helm release metadata. To manage secrets
outside Helm, create the Secret first, set `globals.secretName` to its name, and
set `globals.createSecrets: false`. The external Secret must contain these keys:

- `apiEncryptionKey`, `bbEncryptionKey`, `internalApiKey`, `jwtSecret`,
  `objectStoreAccess`, and `objectStoreSecret`
- `internal_api_key_fallback`, `cloudfront_private_key_64`, `redis_password`,
  `litellm_master_key`, `account_portal_api_key`, `google_client_secret`, and
  `smtp_pass`

`jwt_secret_fallback` is optional. `bbai_litellm_key`,
`bb_admin_user_password`, `litellm_salt_key`, and `litellm_ui_password` are
required only when their corresponding features or values are enabled.

Environment variables sourced from a Secret do not update in running pods.
Redis rotation depends on where Redis runs. With in-cluster Redis
(`services.redis.enabled: true`), an existing `redis_password` value in the
Budibase Secret takes precedence over `services.redis.password`. Changing the
Helm value alone does not rotate an existing password. Update the Secret's
`redis_password` key, then restart `redis-service` and the app, worker, and
automation worker deployments.

With external Redis (`services.redis.enabled: false` and `services.redis.url`
set), rotate the password on the external Redis server using its provider's
procedure. Update the Budibase Secret's `redis_password` key to the same value,
then restart the app, worker, and automation worker deployments. There is no
`redis-service` deployment in this configuration.

After rotating other externally managed keys, restart the deployments that
consume those keys, including LiteLLM when its credentials change.

## Example minimal configuration

This example runs Budibase with an nginx ingress controller and an NFS storage
class. Replace the host and storage class with values for your cluster.

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
| awsAlbIngress.accessLogs | object | `{"bucket":"","enabled":false,"prefix":""}` | ALB access logging to S3. The bucket must already exist in the same region as the ALB, with a bucket policy allowing the regional ELB log-delivery principal to write to it. |
| awsAlbIngress.accessLogs.prefix | string | `""` | Object key prefix within the bucket (logs land under <prefix>/AWSLogs/...). |
| awsAlbIngress.certificateArn | string | `""` | If you're wanting to use HTTPS, you'll need to create an ACM certificate and specify the ARN here. |
| awsAlbIngress.deregistrationDelay | int | `30` | Time in seconds ALB waits for in-flight requests during target deregistration. This allows graceful connection draining during pod rollouts. |
| awsAlbIngress.enabled | bool | `false` | Whether to create an ALB Ingress resource pointing to the Budibase proxy. Requires the AWS ALB Ingress Controller. |
| couchdb.clusterSize | int | `1` | The number of replicas to run in the CouchDB cluster. We set this to 1 by default to make things simpler, but you can set it to 3 if you need a high-availability CouchDB cluster. |
| couchdb.couchdbConfig.couchdb.uuid | string | `"budibase-couchdb"` | Unique identifier for this CouchDB server instance. You shouldn't need to change this. |
| couchdb.extraEnvs | list | `[{"name":"DATA_DIR","value":"/data"}]` | Environment variables to pass to the CouchDB container |
| couchdb.extraPorts[0] | object | `{"containerPort":4984,"name":"sqs"}` | Extra ports to expose on the CouchDB service. We expose the SQS port by default, but you can add more ports here if you need to. |
| couchdb.image | object | `{}` | We use a custom CouchDB image for running Budibase and we don't support using any other CouchDB image. You shouldn't change this, and if you do we can't guarantee that Budibase will work. |
| couchdb.persistentVolume | object | `{"accessModes":["ReadWriteOnce"],"enabled":true,"mountPath":"/data","size":"10Gi"}` | Persistent volume configuration for CouchDB data |
| couchdb.persistentVolume.mountPath | string | `"/data"` | The path where the persistent volume will be mounted. If you change this, make sure to also update the DATA_DIR environment variable above. |
| couchdb.service.extraPorts[0] | object | `{"name":"sqs","port":4984,"protocol":"TCP","targetPort":4984}` | Extra ports to expose on the CouchDB service. We expose the SQS port by default, but you can add more ports here if you need to. |
| globals.apiEncryptionKey | string | `""` | Used for encrypting API keys and environment variables when stored in the database. You don't need to set this if `createSecrets` is true. |
| globals.appVersion | string | `""` | The version of Budibase to deploy. Defaults to what's specified by {{ .Chart.AppVersion }}. Ends up being used as the image version tag for the apps, proxy, and worker images. |
| globals.automationMaxIterations | string | `"200"` | The maximum number of iterations allows for an automation loop step. You can read more about looping here: <https://docs.budibase.com/docs/looping>. |
| globals.budibaseEnv | string | `"PRODUCTION"` | Sets the environment variable BUDIBASE_ENVIRONMENT for the apps and worker pods. Should not ordinarily need to be changed. |
| globals.cookieDomain | string | `""` | Sets the domain attribute of the cookie that Budibase uses to store session information. See <https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#define_where_cookies_are_sent> for details on why you might want to set this. |
| globals.createSecrets | bool | `true` | Create or update the Kubernetes `Secret` containing Budibase credentials. Existing data is preserved and missing keys are populated from these values or generated defaults. Set this to false when `secretName` identifies a Secret managed outside Helm. |
| globals.deployTimestamp | string | `""` | Opaque value stamped onto every pod template as an annotation. Changing it (e.g. to a fresh timestamp on each deploy) triggers a rolling restart of the pods without changing the image, which is useful for picking up mutable tags or externally-managed config. Leave empty to disable (no annotation is added). |
| globals.enableAnalytics | string | `"1"` | Whether to enable analytics or not. You can read more about our analytics here: <https://docs.budibase.com/docs/analytics>. |
| globals.google | object | `{"clientId":"","secret":""}` | Google OAuth settings. These can also be set in the Budibase UI, see <https://docs.budibase.com/docs/sso-with-google> for details. |
| globals.google.clientId | string | `""` | Client ID of your Google OAuth app. |
| globals.google.secret | string | `""` | Client secret of your Google OAuth app. |
| globals.httpMigrations | string | `"0"` | Whether or not to enable doing data migrations over the HTTP API. If this is set to "0", migrations are run on startup. You shouldn't ordinarily need to change this. |
| globals.internalApiKey | string | `""` | API key used for internal Budibase API calls. You don't need to set this if `createSecrets` is true. |
| globals.internalApiKeyFallback | string | `""` | A fallback value for `internalApiKey`. If you're rotating your encryption key, you can set this to the old value for the duration of the rotation. |
| globals.jwtSecret | string | `""` | Secret used for signing JWTs. You don't need to set this if `createSecrets` is true. |
| globals.jwtSecretFallback | string | `""` | A fallback value for `jwtSecret`. If you're rotating your JWT secret, you can set this to the old value for the duration of the rotation. |
| globals.litellmUrl | string | `"http://litellm-service:4000"` | Internal URL for the litellm gateway service. |
| globals.platformUrl | string | `""` | Set the `platformUrl` binding. You can also do this in Settings > Organisation if you are self-hosting. |
| globals.secretName | string | `""` | Name of the Kubernetes Secret used for Budibase credentials. Defaults to the release fullname. Before changing this on an existing installation, copy all data from the current Secret to the new Secret name. The chart cannot migrate Secret data between names, and regenerating encryption keys makes existing encrypted data unreadable. |
| globals.smtp.enabled | bool | `false` | Whether to enable SMTP or not. |
| globals.smtp.from | string | `""` | The email address to use in the "From:" field of emails sent by Budibase. |
| globals.smtp.host | string | `""` | The hostname of your SMTP server. |
| globals.smtp.password | string | `""` | The password to use when authenticating with your SMTP server. |
| globals.smtp.port | string | `"587"` | The port of your SMTP server. |
| globals.smtp.user | string | `""` | The username to use when authenticating with your SMTP server. |
| globals.sqs | object | `{}` |  |
| globals.tempBucketName | string | `""` |  |
| globals.tenantFeatureFlags | string | `""` | Sets what feature flags are enabled and for which tenants. Should not ordinarily need to be changed. |
| imagePullSecrets | list | `[]` | Passed to all pods created by this chart. Should not ordinarily need to be changed. |
| ingress.className | string | `""` | What ingress class to use. |
| ingress.enabled | bool | `true` | Whether to create an Ingress resource pointing to the Budibase proxy. |
| ingress.hosts | list | `[]` | Standard hosts block for the Ingress resource. Defaults to pointing to the Budibase proxy. |
| nameOverride | string | `""` | Override the name of the deployment. Defaults to {{ .Chart.Name }}. |
| podDisruptionBudget.enabled | bool | `true` | Whether to create PodDisruptionBudgets for the services. Enabled by default. Requires replicaCount >= 2 per service to avoid blocking voluntary disruptions. |
| podDisruptionBudget.minAvailable | int | `1` | Default minimum number of available pods across all services. Can be overridden per-service via services.<name>.pdb.minAvailable. |
| service.enabled | bool | `true` | Whether to create the chart's legacy top-level Service. The chart-created Ingress sends traffic directly to `proxy-service`; this Service does not select current workloads and therefore has no endpoints. |
| service.port | int | `10000` | Port to expose on the service. |
| service.type | string | `"ClusterIP"` | Service type for the chart's top-level Service. |
| serviceAccount.annotations | object | `{}` | Annotations to add to the created ServiceAccount resource. These do not apply to Budibase workload pods because they use the default ServiceAccount. |
| serviceAccount.create | bool | `true` | Specifies whether a ServiceAccount resource should be created. Budibase workload pods currently use the namespace's default ServiceAccount. |
| serviceAccount.name | string | `""` | Name of the ServiceAccount resource to create. This does not select the ServiceAccount used by Budibase workload pods. |
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
| services.apps.imagePullPolicy | string | `"IfNotPresent"` | Image pull policy for the apps pods. Release tags are immutable, so IfNotPresent avoids a registry round-trip on every pod start. Set to Always if you deploy a mutable tag (e.g. "latest" or a shared "develop" tag). |
| services.apps.livenessProbe | object | HTTP health checks. | Liveness probe configuration for apps pods. You shouldn't need to change this, but if you want to you can find more information here: <https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/> |
| services.apps.logLevel | string | `"info"` | The log level for the apps service. |
| services.apps.minReadySeconds | int | `10` | Seconds to wait after pod is Ready before adding to endpoints. Ensures pods are stable before receiving traffic. |
| services.apps.pdb | object | `{}` | PodDisruptionBudget settings for the apps service. Requires podDisruptionBudget.enabled to be true. Set minAvailable to override the global podDisruptionBudget.minAvailable for this service. |
| services.apps.preStopDelaySeconds | int | `45` | Seconds to sleep before SIGTERM to allow load balancer deregistration. |
| services.apps.readinessGates | list | `[]` | Pod readiness gates for the apps pods. Useful for ALB target group health tracking with the AWS Load Balancer Controller. Example: [{conditionType: "target-health.elbv2.k8s.aws/my-tgb"}] |
| services.apps.readinessProbe | object | HTTP health checks. | Readiness probe configuration for apps pods. You shouldn't need to change this, but if you want to you can find more information here: <https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/> |
| services.apps.replicaCount | int | `2` | The number of apps replicas to run. |
| services.apps.resources | object | `{}` | The resources to use for apps pods. See <https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/> for more information on how to set these. |
| services.apps.rollingUpdate | object | `{"maxSurge":1,"maxUnavailable":0}` | Rolling update strategy for the apps Deployment. maxUnavailable: 0 keeps the rollout zero-downtime; raise maxSurge (int or percentage, e.g. "25%") to replace more pods at once and speed up rollouts when spare capacity exists. |
| services.apps.startupProbe | object | HTTP health checks. | Startup probe configuration for apps pods. You shouldn't need to change this, but if you want to you can find more information here: <https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/> |
| services.apps.terminationGracePeriodSeconds | int | `70` | The amount of time to wait between requesting a shutdown and killing the container. This is used to give the apps service time to finish processing any requests before shutting down. You shouldn't need to change this. |
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
| services.automationWorkers.imagePullPolicy | string | `"IfNotPresent"` | Image pull policy for the automation worker pods. Release tags are immutable, so IfNotPresent avoids a registry round-trip on every pod start. Set to Always if you deploy a mutable tag (e.g. "latest"). |
| services.automationWorkers.livenessProbe | object | HTTP health checks. | Liveness probe configuration for automation worker pods. You shouldn't need to change this, but if you want to you can find more information here: <https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/> |
| services.automationWorkers.logLevel | string | `"info"` | The log level for the automation worker service. |
| services.automationWorkers.pdb | object | `{}` | PodDisruptionBudget settings for the automation worker service. Requires podDisruptionBudget.enabled to be true. Set minAvailable to override the global podDisruptionBudget.minAvailable for this service. |
| services.automationWorkers.preStopDelaySeconds | int | `45` | Seconds to sleep before SIGTERM to allow load balancer deregistration. |
| services.automationWorkers.readinessGates | list | `[]` | Pod readiness gates for the automation worker pods. Useful for ALB target group health tracking with the AWS Load Balancer Controller. Example: [{conditionType: "target-health.elbv2.k8s.aws/my-tgb"}] |
| services.automationWorkers.readinessProbe | object | HTTP health checks. | Readiness probe configuration for automation worker pods. You shouldn't need to change this, but if you want to you can find more information here: <https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/> |
| services.automationWorkers.replicaCount | int | `2` | The number of automation worker replicas to run. |
| services.automationWorkers.resources | object | `{}` | The resources to use for automation worker pods. See <https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/> for more information on how to set these. |
| services.automationWorkers.startupProbe | object | HTTP health checks. | Startup probe configuration for automation worker pods. You shouldn't need to change this, but if you want to you can find more information here: <https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/> |
| services.automationWorkers.terminationGracePeriodSeconds | int | `70` | The amount of time to wait between requesting a shutdown and killing the container. This is used to give the automation worker service time to finish processing any requests before shutting down. You shouldn't need to change this. |
| services.couchdb.backup.enabled | bool | `false` | Whether or not to enable periodic CouchDB backups. This works by replicating to another CouchDB instance. |
| services.couchdb.backup.interval | string | `""` | Backup interval in seconds |
| services.couchdb.backup.resources | object | `{}` | The resources to use for CouchDB backup pods. See <https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/> for more information on how to set these. |
| services.couchdb.backup.target | string | `""` | Target couchDB instance to back up to, either a hostname or an IP address. |
| services.couchdb.enabled | bool | `true` | Whether or not to spin up a CouchDB instance in your cluster. True by default, and the configuration for the CouchDB instance is under the `couchdb` key at the root of this file. You can see what options are available to you by looking at the official CouchDB Helm chart: <https://github.com/apache/couchdb-helm/tree/couchdb-4.5.6/couchdb>. |
| services.couchdb.port | int | `5984` |  |
| services.dns | string | `"cluster.local"` | The DNS suffix to use for service discovery. You only need to change this if you've configured your cluster to use a different DNS suffix. |
| services.litellm.bbaiKey | string | `""` | The Budibase AI virtual key (BBAI_LITELLM_KEY) used by agents. When set it is rendered onto both the app service and the automation worker. |
| services.litellm.config | string | `"general_settings:\n  store_model_in_db: true\n  store_prompts_in_spend_logs: true\nlitellm_settings:\n  drop_params: true\n  extra_spend_tag_headers:\n    - \"x-litellm-tags\"\n  disable_add_user_agent_to_request_tags: true\n  num_retries: 3\n  retry_after: 5\n  retry_policy:\n    RateLimitErrorRetries: 4\n"` | Inline configuration passed to litellm as config.yaml. |
| services.litellm.enabled | bool | `false` | Whether or not to deploy the litellm gateway. |
| services.litellm.extraEnv | list | `[{"name":"LITELLM_REASONING_AUTO_SUMMARY","value":"true"}]` | Extra environment variables for the litellm container. Budibase uses LiteLLM virtual keys/models and requires database-backed proxy mode. If `general_settings.store_model_in_db: true` (default), set DATABASE_URL here. |
| services.litellm.extraVolumeMounts | list | `[]` | Additional volumeMounts on the litellm container. |
| services.litellm.extraVolumes | list | `[]` | Additional volumes on the litellm pod. |
| services.litellm.image | string | `"ghcr.io/berriai/litellm:main-v1.83.10-stable"` | litellm image to use. |
| services.litellm.masterKey | string | `""` | The master key to use for litellm. |
| services.litellm.pdb | object | `{}` | PodDisruptionBudget settings for the litellm service. Requires podDisruptionBudget.enabled to be true. Set minAvailable to override the global podDisruptionBudget.minAvailable for this service. |
| services.litellm.port | int | `4000` | Port exposed by the litellm container. |
| services.litellm.preStopDelaySeconds | int | `45` | Seconds to sleep before SIGTERM to allow load balancer deregistration. |
| services.litellm.readinessGates | list | `[]` | Pod readiness gates for the litellm pods. Useful for ALB target group health tracking with the AWS Load Balancer Controller. Example: [{conditionType: "target-health.elbv2.k8s.aws/my-tgb"}] |
| services.litellm.replicaCount | int | `2` | Number of litellm replicas. |
| services.litellm.resources | object | `{}` | Resources for litellm pods. |
| services.litellm.saltKey | string | `""` | The salt key to use for litellm. |
| services.litellm.startupProbe | object | TCP socket check on the litellm port. | Startup probe configuration for litellm pods. Uses a TCP socket check because litellm doesn't expose a dedicated /health endpoint on startup. |
| services.litellm.tailscale.expose | bool | `false` | Whether to expose the litellm service to a Tailscale tailnet via annotation. |
| services.litellm.terminationGracePeriodSeconds | int | `70` | The time in seconds to wait before sending SIGKILL after SIGTERM. |
| services.litellm.uiPassword | string | `""` | Optional password for LiteLLM Admin UI login. If not set, LiteLLM uses its built-in defaults. |
| services.litellm.uiUsername | string | `""` | Optional username for LiteLLM Admin UI login. If not set, LiteLLM uses its built-in defaults. |
| services.objectStore.accessKey | string | `""` | AWS_ACCESS_KEY if using S3 |
| services.objectStore.browser | bool | `true` | Whether to enable the Minio web console or not. If you're exposing Minio to the Internet (via a custom Ingress record, for example), you should set this to false. If you're only exposing Minio to your cluster, you can leave this as true. |
| services.objectStore.cloudfront.cdn | string | `""` | Set the url of a distribution to enable cloudfront. |
| services.objectStore.cloudfront.privateKey64 | string | `""` | Base64 encoded private key for the above public key. |
| services.objectStore.cloudfront.publicKeyId | string | `""` | ID of public key stored in cloudfront. |
| services.objectStore.extraContainers | list | `[]` | Additional containers to be added to the objectStore pod. |
| services.objectStore.extraVolumeMounts | list | `[]` | Additional volumeMounts to the main objectStore container. |
| services.objectStore.extraVolumes | list | `[]` | Additional volumes to the objectStore pod. |
| services.objectStore.ignoreSelfSigned | bool | `false` | Set to true to skip TLS certificate verification for S3-compatible storage endpoints using self-signed certificates. Only applies when using HTTPS endpoints. Defaults to false. |
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
| services.proxy.extraContainers | list | `[]` | Additional containers to be added to the proxy pod. |
| services.proxy.extraVolumeMounts | list | `[]` | Additional volumeMounts to the main proxy container. |
| services.proxy.extraVolumes | list | `[]` | Additional volumes to the proxy pod. |
| services.proxy.imagePullPolicy | string | `"IfNotPresent"` | Image pull policy for the proxy pods. Release tags are immutable, so IfNotPresent avoids a registry round-trip on every pod start. Set to Always if you deploy a mutable tag (e.g. "latest" or a shared "develop" tag). |
| services.proxy.livenessProbe | object | HTTP health checks. | Liveness probe configuration for proxy pods. You shouldn't need to change this, but if you want to you can find more information here: <https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/> |
| services.proxy.pdb | object | `{}` | PodDisruptionBudget settings for the proxy service. Requires podDisruptionBudget.enabled to be true. Set minAvailable to override the global podDisruptionBudget.minAvailable for this service. |
| services.proxy.preStopDelaySeconds | int | `45` | Seconds to sleep before SIGTERM to allow load balancer deregistration. |
| services.proxy.readinessGates | list | `[]` | Pod readiness gates for the proxy pods. Useful for ALB target group health tracking with the AWS Load Balancer Controller. Example: [{conditionType: "target-health.elbv2.k8s.aws/my-tgb"}] |
| services.proxy.readinessProbe | object | HTTP health checks. | Readiness probe configuration for proxy pods. You shouldn't need to change this, but if you want to you can find more information here: <https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/> |
| services.proxy.replicaCount | int | `2` | The number of proxy replicas to run. |
| services.proxy.resolver | string | `""` | The DNS resolver the nginx proxy uses to resolve upstreams at request time. MUST be an IP address (nginx resolves this once at config-load and exits fatally if it is an unresolvable DNS name). Leave empty to auto-detect the kube-dns ClusterIP at install/upgrade time; only set this if auto-detection cannot run (e.g. restricted RBAC for `lookup`) — then use your cluster's DNS ClusterIP, e.g. `kubectl -n kube-system get svc kube-dns -o jsonpath='{.spec.clusterIP}'`. |
| services.proxy.resources | object | `{}` | The resources to use for proxy pods. See <https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/> for more information on how to set these. |
| services.proxy.rollingUpdate | object | `{"maxSurge":1,"maxUnavailable":0}` | Rolling update strategy for the proxy Deployment. maxUnavailable: 0 keeps the rollout zero-downtime; raise maxSurge (int or percentage, e.g. "25%") to replace more pods at once and speed up rollouts when spare capacity exists. |
| services.proxy.startupProbe | object | HTTP health checks. | Startup probe configuration for proxy pods. You shouldn't need to change this, but if you want to you can find more information here: <https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/> |
| services.proxy.terminationGracePeriodSeconds | int | `70` | The time in seconds to wait before sending SIGKILL after SIGTERM. Must be greater than preStopDelaySeconds to allow graceful shutdown. |
| services.redis.enabled | bool | `true` | Whether or not to deploy a Redis pod into your cluster. |
| services.redis.extraContainers | list | `[]` | Additional containers to be added to the redis pod. |
| services.redis.extraVolumeMounts | list | `[]` | Additional volumeMounts to the main redis container. |
| services.redis.extraVolumes | list | `[]` | Additional volumes to the redis pod. |
| services.redis.image | string | `"redis"` | The Redis image to use. |
| services.redis.password | string | `"budibase"` | The password to use when connecting to Redis. It's recommended that you change this from the default if you're running Redis in-cluster. With chart-managed Secrets, an existing `redis_password` value takes precedence over this setting. To rotate it, update that Secret key and restart redis-service and its clients. |
| services.redis.port | int | `6379` | Port to expose Redis on. |
| services.redis.resources | object | `{}` | The resources to use for Redis pods. See <https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/> for more information on how to set these. |
| services.redis.storage | string | `"100Mi"` | How much persistent storage to allocate to Redis. |
| services.redis.storageClass | string | `""` | If defined, storageClassName: <storageClass> If set to "-", storageClassName: "", which disables dynamic provisioning If undefined (the default) or set to null, no storageClassName spec is set, choosing the default provisioner. |
| services.redis.url | string | `""` | If you choose to run Redis externally to this chart, you can specify the connection details here. |
| services.redis.username | string | `""` | The username to use when connecting to Redis. Only required for Redis 6+ with ACL authentication enabled. |
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
| services.worker.imagePullPolicy | string | `"IfNotPresent"` | Image pull policy for the worker pods. Release tags are immutable, so IfNotPresent avoids a registry round-trip on every pod start. Set to Always if you deploy a mutable tag (e.g. "latest" or a shared "develop" tag). |
| services.worker.livenessProbe | object | HTTP health checks. | Liveness probe configuration for worker pods. You shouldn't need to change this, but if you want to you can find more information here: <https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/> |
| services.worker.logLevel | string | `"info"` | The log level for the worker service. |
| services.worker.minReadySeconds | int | `10` | Seconds to wait after pod is Ready before adding to endpoints. Ensures pods are stable before receiving traffic. |
| services.worker.pdb | object | `{}` | PodDisruptionBudget settings for the worker service. Requires podDisruptionBudget.enabled to be true. Set minAvailable to override the global podDisruptionBudget.minAvailable for this service. |
| services.worker.preStopDelaySeconds | int | `45` | Seconds to sleep before SIGTERM to allow load balancer deregistration. |
| services.worker.readinessGates | list | `[]` | Pod readiness gates for the worker pods. Useful for ALB target group health tracking with the AWS Load Balancer Controller. Example: [{conditionType: "target-health.elbv2.k8s.aws/my-tgb"}] |
| services.worker.readinessProbe | object | HTTP health checks. | Readiness probe configuration for worker pods. You shouldn't need to change this, but if you want to you can find more information here: <https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/> |
| services.worker.replicaCount | int | `2` | The number of worker replicas to run. |
| services.worker.resources | object | `{}` | The resources to use for worker pods. See <https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/> for more information on how to set these. |
| services.worker.rollingUpdate | object | `{"maxSurge":1,"maxUnavailable":0}` | Rolling update strategy for the worker Deployment. maxUnavailable: 0 keeps the rollout zero-downtime; raise maxSurge (int or percentage, e.g. "25%") to replace more pods at once and speed up rollouts when spare capacity exists. |
| services.worker.startupProbe | object | HTTP health checks. | Startup probe configuration for worker pods. You shouldn't need to change this, but if you want to you can find more information here: <https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/> |
| services.worker.terminationGracePeriodSeconds | int | `70` | The amount of time to wait between requesting a shutdown and killing the container. This is used to give the worker service time to finish processing any requests before shutting down. You shouldn't need to change this. |
| tolerations | list | `[]` | Sets the tolerations for all pods created by this chart. Should not ordinarily need to be changed. See <https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/> for more information on tolerations. |

## Uninstalling

To uninstall the chart, assuming you named the release `budibase` (both commands in the installation section do so):

```console
$ helm uninstall --namespace budibase budibase
```

----------------------------------------------
Autogenerated from chart metadata using [helm-docs v1.14.2](https://github.com/norwoodj/helm-docs/releases/v1.14.2)
