# NEWS

## 4.5.6

- Add `extraPorts` to the network policy when the network policy is enabled.

## 4.5.5

- Give the default port on the CouchDB `Service` a name so that `service.extraPorts` can be used properly.

## 4.5.4

- Expose `extraPorts` and `service.extraPorts` to allow specifying arbitrary ports to be exposed from the CouchDB pods

## 4.5.3

- Fix ability to define pull secrets using `imagePullSecrets`.

## 4.5.2

- Allow to specify a persistentVolumeClaimRetentionPolicy in both the primary and secondary StatefulSet.

## 4.5.1

- Update default CouchDB version to 3.3.3.

## 4.5.0

- Add capability to set pod and container level securityContext settings.

## 4.4.1

- Add possibility to customize `service.targetPort` from values. Set default to 5984.

## 4.3.0

- Use Ingress `className` instead of `kubernetes.io/ingress.class` annotation which has been deprecated since Kubernetes 1.18+ ([#69](https://github.com/apache/couchdb-helm/issues/69))

## 4.1.0

- Added the `autoSetup` to automatically finalize the cluster after installation

## 4.0.0

- Simplified the `adminHash` in the secret

# 3.6.4

- Add `service.labels` value to pass along labels to the client-facing service
- Update `ingress` to use the service created by `service.enabled=true`,
  instead of the headless service
  ([#94](https://github.com/apache/couchdb-helm/issues/94))
  - This allows setting `service.annotations`, `service.labels`, etc. in a way that will be picked up by the ingress

# 3.6.3

- Add PersistentVolume annotations

## 3.6.2

- Change the `erlangCookie` to be auto-generated in a stateful fashion (i.e. we auto-generate it once, then leave that
  value alone). ([#78](https://github.com/apache/couchdb-helm/issues/78))
