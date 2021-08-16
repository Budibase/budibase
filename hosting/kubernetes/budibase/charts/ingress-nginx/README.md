# ingress-nginx

[ingress-nginx](https://github.com/kubernetes/ingress-nginx) Ingress controller for Kubernetes using NGINX as a reverse proxy and load balancer

To use, add the `kubernetes.io/ingress.class: nginx` annotation to your Ingress resources.

This chart bootstraps an ingress-nginx deployment on a [Kubernetes](http://kubernetes.io) cluster using the [Helm](https://helm.sh) package manager.

## Prerequisites

- Kubernetes v1.16+

## Get Repo Info

```console
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
```

## Install Chart

**Important:** only helm3 is supported

```console
helm install [RELEASE_NAME] ingress-nginx/ingress-nginx
```

The command deploys ingress-nginx on the Kubernetes cluster in the default configuration.

_See [configuration](#configuration) below._

_See [helm install](https://helm.sh/docs/helm/helm_install/) for command documentation._

## Uninstall Chart

```console
helm uninstall [RELEASE_NAME]
```

This removes all the Kubernetes components associated with the chart and deletes the release.

_See [helm uninstall](https://helm.sh/docs/helm/helm_uninstall/) for command documentation._

## Upgrading Chart

```console
helm upgrade [RELEASE_NAME] [CHART] --install
```

_See [helm upgrade](https://helm.sh/docs/helm/helm_upgrade/) for command documentation._

### Upgrading With Zero Downtime in Production

By default the ingress-nginx controller has service interruptions whenever it's pods are restarted or redeployed. In order to fix that, see the excellent blog post by Lindsay Landry from Codecademy: [Kubernetes: Nginx and Zero Downtime in Production](https://medium.com/codecademy-engineering/kubernetes-nginx-and-zero-downtime-in-production-2c910c6a5ed8).

### Migrating from stable/nginx-ingress

There are two main ways to migrate a release from `stable/nginx-ingress` to `ingress-nginx/ingress-nginx` chart:

1. For Nginx Ingress controllers used for non-critical services, the easiest method is to [uninstall](#uninstall-chart) the old release and [install](#install-chart) the new one
1. For critical services in production that require zero-downtime, you will want to:
    1. [Install](#install-chart) a second Ingress controller
    1. Redirect your DNS traffic from the old controller to the new controller
    1. Log traffic from both controllers during this changeover
    1. [Uninstall](#uninstall-chart) the old controller once traffic has fully drained from it
    1. For details on all of these steps see [Upgrading With Zero Downtime in Production](#upgrading-with-zero-downtime-in-production)

Note that there are some different and upgraded configurations between the two charts, described by Rimas Mocevicius from JFrog in the "Upgrading to ingress-nginx Helm chart" section of [Migrating from Helm chart nginx-ingress to ingress-nginx](https://rimusz.net/migrating-to-ingress-nginx). As the `ingress-nginx/ingress-nginx` chart continues to update, you will want to check current differences by running [helm configuration](#configuration) commands on both charts.

## Configuration

See [Customizing the Chart Before Installing](https://helm.sh/docs/intro/using_helm/#customizing-the-chart-before-installing). To see all configurable options with detailed comments, visit the chart's [values.yaml](./values.yaml), or run these configuration commands:

```console
helm show values ingress-nginx/ingress-nginx
```

### PodDisruptionBudget

Note that the PodDisruptionBudget resource will only be defined if the replicaCount is greater than one,
else it would make it impossible to evacuate a node. See [gh issue #7127](https://github.com/helm/charts/issues/7127) for more info.

### Prometheus Metrics

The Nginx ingress controller can export Prometheus metrics, by setting `controller.metrics.enabled` to `true`.

You can add Prometheus annotations to the metrics service using `controller.metrics.service.annotations`. Alternatively, if you use the Prometheus Operator, you can enable ServiceMonitor creation using `controller.metrics.serviceMonitor.enabled`.

### ingress-nginx nginx\_status page/stats server

Previous versions of this chart had a `controller.stats.*` configuration block, which is now obsolete due to the following changes in nginx ingress controller:

- In [0.16.1](https://github.com/kubernetes/ingress-nginx/blob/master/Changelog.md#0161), the vts (virtual host traffic status) dashboard was removed
- In [0.23.0](https://github.com/kubernetes/ingress-nginx/blob/master/Changelog.md#0230), the status page at port 18080 is now a unix socket webserver only available at localhost.
  You can use `curl --unix-socket /tmp/nginx-status-server.sock http://localhost/nginx_status` inside the controller container to access it locally, or use the snippet from [nginx-ingress changelog](https://github.com/kubernetes/ingress-nginx/blob/master/Changelog.md#0230) to re-enable the http server

### ExternalDNS Service Configuration

Add an [ExternalDNS](https://github.com/kubernetes-incubator/external-dns) annotation to the LoadBalancer service:

```yaml
controller:
  service:
    annotations:
      external-dns.alpha.kubernetes.io/hostname: kubernetes-example.com.
```

### AWS L7 ELB with SSL Termination

Annotate the controller as shown in the [nginx-ingress l7 patch](https://github.com/kubernetes/ingress-nginx/blob/master/deploy/aws/l7/service-l7.yaml):

```yaml
controller:
  service:
    targetPorts:
      http: http
      https: http
    annotations:
      service.beta.kubernetes.io/aws-load-balancer-ssl-cert: arn:aws:acm:XX-XXXX-X:XXXXXXXXX:certificate/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXX
      service.beta.kubernetes.io/aws-load-balancer-backend-protocol: "http"
      service.beta.kubernetes.io/aws-load-balancer-ssl-ports: "https"
      service.beta.kubernetes.io/aws-load-balancer-connection-idle-timeout: '3600'
```

### AWS route53-mapper

To configure the LoadBalancer service with the [route53-mapper addon](https://github.com/kubernetes/kops/tree/master/addons/route53-mapper), add the `domainName` annotation and `dns` label:

```yaml
controller:
  service:
    labels:
      dns: "route53"
    annotations:
      domainName: "kubernetes-example.com"
```

### Additional Internal Load Balancer

This setup is useful when you need both external and internal load balancers but don't want to have multiple ingress controllers and multiple ingress objects per application.

By default, the ingress object will point to the external load balancer address, but if correctly configured, you can make use of the internal one if the URL you are looking up resolves to the internal load balancer's URL.

You'll need to set both the following values:

`controller.service.internal.enabled`
`controller.service.internal.annotations`

If one of them is missing the internal load balancer will not be deployed. Example you may have `controller.service.internal.enabled=true` but no annotations set, in this case no action will be taken.

`controller.service.internal.annotations` varies with the cloud service you're using.

Example for AWS:

```yaml
controller:
  service:
    internal:
      enabled: true
      annotations:
        # Create internal ELB
        service.beta.kubernetes.io/aws-load-balancer-internal: "true"
        # Any other annotation can be declared here.
```

Example for GCE:

```yaml
controller:
  service:
    internal:
      enabled: true
      annotations:
        # Create internal LB. More informations: https://cloud.google.com/kubernetes-engine/docs/how-to/internal-load-balancing
        # For GKE versions 1.17 and later
        networking.gke.io/load-balancer-type: "Internal"
        # For earlier versions
        # cloud.google.com/load-balancer-type: "Internal"
        
        # Any other annotation can be declared here. 
```

Example for Azure:

```yaml
controller:
  service:
      annotations:
        # Create internal LB
        service.beta.kubernetes.io/azure-load-balancer-internal: "true"
        # Any other annotation can be declared here.
```

Example for Oracle Cloud Infrastructure:

```yaml
controller:
  service:
      annotations:
        # Create internal LB
        service.beta.kubernetes.io/oci-load-balancer-internal: "true"
        # Any other annotation can be declared here.
```

An use case for this scenario is having a split-view DNS setup where the public zone CNAME records point to the external balancer URL while the private zone CNAME records point to the internal balancer URL. This way, you only need one ingress kubernetes object.

Optionally you can set `controller.service.loadBalancerIP` if you need a static IP for the resulting `LoadBalancer`.

### Ingress Admission Webhooks

With nginx-ingress-controller version 0.25+, the nginx ingress controller pod exposes an endpoint that will integrate with the `validatingwebhookconfiguration` Kubernetes feature to prevent bad ingress from being added to the cluster.
**This feature is enabled by default since 0.31.0.**

With nginx-ingress-controller in 0.25.* work only with kubernetes 1.14+, 0.26 fix [this issue](https://github.com/kubernetes/ingress-nginx/pull/4521)

### Helm Error When Upgrading: spec.clusterIP: Invalid value: ""

If you are upgrading this chart from a version between 0.31.0 and 1.2.2 then you may get an error like this:

```console
Error: UPGRADE FAILED: Service "?????-controller" is invalid: spec.clusterIP: Invalid value: "": field is immutable
```

Detail of how and why are in [this issue](https://github.com/helm/charts/pull/13646) but to resolve this you can set `xxxx.service.omitClusterIP` to `true` where `xxxx` is the service referenced in the error.

As of version `1.26.0` of this chart, by simply not providing any clusterIP value, `invalid: spec.clusterIP: Invalid value: "": field is immutable` will no longer occur since `clusterIP: ""` will not be rendered.
