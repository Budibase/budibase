# Changelog

This file documents all notable changes to [ingress-nginx](https://github.com/kubernetes/ingress-nginx) Helm Chart. The release numbering uses [semantic versioning](http://semver.org).

### 3.34.0

- [7256] https://github.com/kubernetes/ingress-nginx/pull/7256 Add namespace field in the namespace scoped resource templates

### 3.33.0

- [7164] https://github.com/kubernetes/ingress-nginx/pull/7164 Update nginx to v1.20.1

### 3.32.0

- [7117] https://github.com/kubernetes/ingress-nginx/pull/7117 Add annotations for HPA

### 3.31.0

- [7137] https://github.com/kubernetes/ingress-nginx/pull/7137 Add support for custom probes

### 3.30.0

- [#7092](https://github.com/kubernetes/ingress-nginx/pull/7092) Removes the possibility of using localhost in ExternalNames as endpoints

### 3.29.0

- [X] [#6945](https://github.com/kubernetes/ingress-nginx/pull/7020) Add option to specify job label for ServiceMonitor

### 3.28.0

- [ ] [#6900](https://github.com/kubernetes/ingress-nginx/pull/6900) Support existing PSPs

### 3.27.0

- Update ingress-nginx v0.45.0

### 3.26.0

- [X] [#6979](https://github.com/kubernetes/ingress-nginx/pull/6979) Changed servicePort value for metrics

### 3.25.0

- [X] [#6957](https://github.com/kubernetes/ingress-nginx/pull/6957) Add ability to specify automountServiceAccountToken

### 3.24.0

- [X] [#6908](https://github.com/kubernetes/ingress-nginx/pull/6908) Add volumes to default-backend deployment

### 3.23.0

- Update ingress-nginx v0.44.0

### 3.22.0

- [X] [#6802](https://github.com/kubernetes/ingress-nginx/pull/6802) Add value for configuring a custom Diffie-Hellman parameters file
- [X] [#6815](https://github.com/kubernetes/ingress-nginx/pull/6815) Allow use of numeric namespaces in helm chart

### 3.21.0

- [X] [#6783](https://github.com/kubernetes/ingress-nginx/pull/6783) Add custom annotations to ScaledObject
- [X] [#6761](https://github.com/kubernetes/ingress-nginx/pull/6761) Adding quotes in the serviceAccount name in Helm values
- [X] [#6767](https://github.com/kubernetes/ingress-nginx/pull/6767) Remove ClusterRole when scope option is enabled
- [X] [#6785](https://github.com/kubernetes/ingress-nginx/pull/6785) Update kube-webhook-certgen image to v1.5.1

### 3.20.1

- Do not create KEDA in case of DaemonSets.
- Fix KEDA v2 definition

### 3.20.0

- [X] [#6730](https://github.com/kubernetes/ingress-nginx/pull/6730) Do not create HPA for defaultBackend if not enabled.

### 3.19.0

- Update ingress-nginx v0.43.0

### 3.18.0

- [X] [#6688](https://github.com/kubernetes/ingress-nginx/pull/6688) Allow volume-type emptyDir in controller podsecuritypolicy
- [X] [#6691](https://github.com/kubernetes/ingress-nginx/pull/6691) Improve parsing of helm parameters

### 3.17.0

- Update ingress-nginx v0.42.0

### 3.16.1

- Fix chart-releaser action

### 3.16.0

- [X] [#6646](https://github.com/kubernetes/ingress-nginx/pull/6646) Added LoadBalancerIP value for internal service

### 3.15.1

- Fix chart-releaser action

### 3.15.0

- [X] [#6586](https://github.com/kubernetes/ingress-nginx/pull/6586) Fix 'maxmindLicenseKey' location in values.yaml

### 3.14.0

- [X] [#6469](https://github.com/kubernetes/ingress-nginx/pull/6469) Allow custom service names for controller and backend

### 3.13.0

- [X] [#6544](https://github.com/kubernetes/ingress-nginx/pull/6544) Fix default backend HPA name variable

### 3.12.0

- [X] [#6514](https://github.com/kubernetes/ingress-nginx/pull/6514) Remove helm2 support and update docs

### 3.11.1

- [X] [#6505](https://github.com/kubernetes/ingress-nginx/pull/6505) Reorder HPA resource list to work with GitOps tooling

### 3.11.0

- Support Keda Autoscaling

### 3.10.1

- Fix regression introduced in 0.41.0 with external authentication

### 3.10.0

- Fix routing regression introduced in 0.41.0 with PathType Exact

### 3.9.0

- [X] [#6423](https://github.com/kubernetes/ingress-nginx/pull/6423) Add Default backend HPA autoscaling

### 3.8.0

- [X] [#6395](https://github.com/kubernetes/ingress-nginx/pull/6395) Update jettech/kube-webhook-certgen image
- [X] [#6377](https://github.com/kubernetes/ingress-nginx/pull/6377) Added loadBalancerSourceRanges for internal lbs
- [X] [#6356](https://github.com/kubernetes/ingress-nginx/pull/6356) Add securitycontext settings on defaultbackend
- [X] [#6401](https://github.com/kubernetes/ingress-nginx/pull/6401) Fix controller service annotations
- [X] [#6403](https://github.com/kubernetes/ingress-nginx/pull/6403) Initial helm chart changelog

### 3.7.1

- [X] [#6326](https://github.com/kubernetes/ingress-nginx/pull/6326) Fix liveness and readiness probe path in daemonset chart

### 3.7.0

- [X] [#6316](https://github.com/kubernetes/ingress-nginx/pull/6316) Numerals in podAnnotations in quotes [#6315](https://github.com/kubernetes/ingress-nginx/issues/6315)

### 3.6.0

- [X] [#6305](https://github.com/kubernetes/ingress-nginx/pull/6305) Add default linux nodeSelector

### 3.5.1

- [X] [#6299](https://github.com/kubernetes/ingress-nginx/pull/6299) Fix helm chart release

### 3.5.0

- [X] [#6260](https://github.com/kubernetes/ingress-nginx/pull/6260) Allow Helm Chart to customize admission webhook's annotations, timeoutSeconds, namespaceSelector, objectSelector and cert files locations

### 3.4.0

- [X] [#6268](https://github.com/kubernetes/ingress-nginx/pull/6268) Update to 0.40.2 in helm chart #6288

### 3.3.1

- [X] [#6259](https://github.com/kubernetes/ingress-nginx/pull/6259) Release helm chart
- [X] [#6258](https://github.com/kubernetes/ingress-nginx/pull/6258) Fix chart markdown link
- [X] [#6253](https://github.com/kubernetes/ingress-nginx/pull/6253) Release v0.40.0

### 3.3.1

- [X] [#6233](https://github.com/kubernetes/ingress-nginx/pull/6233) Add admission controller e2e test

### 3.3.0

- [X] [#6203](https://github.com/kubernetes/ingress-nginx/pull/6203) Refactor parsing of key values
- [X] [#6162](https://github.com/kubernetes/ingress-nginx/pull/6162) Add helm chart options to expose metrics service as NodePort
- [X] [#6180](https://github.com/kubernetes/ingress-nginx/pull/6180) Fix helm chart admissionReviewVersions regression
- [X] [#6169](https://github.com/kubernetes/ingress-nginx/pull/6169) Fix Typo in example prometheus rules

### 3.0.0

- [X] [#6167](https://github.com/kubernetes/ingress-nginx/pull/6167) Update chart requirements

### 2.16.0

- [X] [#6154](https://github.com/kubernetes/ingress-nginx/pull/6154) add `topologySpreadConstraint` to controller

### 2.15.0

- [X] [#6087](https://github.com/kubernetes/ingress-nginx/pull/6087) Adding parameter for externalTrafficPolicy in internal controller service spec

### 2.14.0

- [X] [#6104](https://github.com/kubernetes/ingress-nginx/pull/6104) Misc fixes for nginx-ingress chart for better keel and prometheus-operator integration

### 2.13.0

- [X] [#6093](https://github.com/kubernetes/ingress-nginx/pull/6093) Release v0.35.0

### 2.13.0

- [X] [#6093](https://github.com/kubernetes/ingress-nginx/pull/6093) Release v0.35.0
- [X] [#6080](https://github.com/kubernetes/ingress-nginx/pull/6080) Switch images to k8s.gcr.io after Vanity Domain Flip

### 2.12.1

- [X] [#6075](https://github.com/kubernetes/ingress-nginx/pull/6075) Sync helm chart affinity examples

### 2.12.0

- [X] [#6039](https://github.com/kubernetes/ingress-nginx/pull/6039) Add configurable serviceMonitor metricRelabelling and targetLabels
- [X] [#6044](https://github.com/kubernetes/ingress-nginx/pull/6044) Fix YAML linting

### 2.11.3

- [X] [#6038](https://github.com/kubernetes/ingress-nginx/pull/6038) Bump chart version PATCH

### 2.11.2

- [X] [#5951](https://github.com/kubernetes/ingress-nginx/pull/5951) Bump chart patch version

### 2.11.1

- [X] [#5900](https://github.com/kubernetes/ingress-nginx/pull/5900) Release helm chart for v0.34.1

### 2.11.0

- [X] [#5879](https://github.com/kubernetes/ingress-nginx/pull/5879) Update helm chart for v0.34.0
- [X] [#5671](https://github.com/kubernetes/ingress-nginx/pull/5671) Make liveness probe more fault tolerant than readiness probe

### 2.10.0

- [X] [#5843](https://github.com/kubernetes/ingress-nginx/pull/5843) Update jettech/kube-webhook-certgen image

### 2.9.1

- [X] [#5823](https://github.com/kubernetes/ingress-nginx/pull/5823) Add quoting to sysctls because numeric values need to be presented as strings (#5823)

### 2.9.0

- [X] [#5795](https://github.com/kubernetes/ingress-nginx/pull/5795) Use fully qualified images to avoid cri-o issues


### TODO

Keep building the changelog using *git log charts* checking the tag
