# Deploy to an existing Kubernetes cluster

Use `scripts/deploy-k8s.sh` to deploy this checkout's Helm chart using a kubeconfig for a local or remote cluster. The machine running the script needs Bash 3.2+, Helm 3+, `kubectl`, `jq`, and `openssl`. Docker and `kind` are only needed if you choose to create a kind cluster separately.

```bash
bash scripts/deploy-k8s.sh up \
  --kubeconfig /path/to/kubeconfig \
  --context my-cluster \
  --namespace budibase \
  --release budibase \
  --app-version v3.50.0
```

The script explicitly passes the kubeconfig and context to Helm and kubectl. Omitting `--context` selects the supplied file's current context. It does not modify the kubeconfig, switch your default context, create a cluster, or restart cluster nodes. The API server in the kubeconfig must be reachable from the machine running the script, including any required VPN or SSH tunnel. Pass one kubeconfig file, not a colon-separated list.

`up` is also the default command. Pass a published Budibase image tag, including its `v` prefix, with `--app-version` on each deployment. The script uses that tag for apps, worker, and proxy; it does not build application images.

The default configuration runs one replica per service, bundled CouchDB, MinIO and Redis with persistent volumes, and no ingress. It sets an explicit region for the S3 client used with MinIO. Persistent volumes use the cluster's default storage class. To choose a class explicitly:

```bash
bash scripts/deploy-k8s.sh --kubeconfig ./config --app-version v3.50.0 \
  --storage-class standard
```

This sets the class for all three stores and saves it in `storage-values.json` alongside the generated `values.yaml`. Subsequent upgrades reuse that selection when `--storage-class` is omitted. The saved selection overrides values files; passing `--storage-class` again updates it. The cluster must have a provisioner that supports that class. Configure storage before the initial deployment; changing a class does not migrate existing PVCs or data.

Customize the deployment using Helm values files:

```bash
bash scripts/deploy-k8s.sh --kubeconfig ./config --app-version v3.50.0 \
  --values ./storage.yaml --values ./ingress.yaml
```

Generated values and secrets are stored privately in `~/.local/state/budibase-k8s/<target hash>/` or `--state-dir`. The hash covers the API server, context, namespace, and release; explicit state directories are bound to their original target. Keep the directory and target settings consistent for upgrades, including `storage-values.json` when present. If an existing release's values are missing, restore its saved `values.yaml`; the script won't generate replacement credentials.

Check status or expose the UI locally using the same target options:

```bash
bash scripts/deploy-k8s.sh status --kubeconfig ./config --namespace budibase
bash scripts/deploy-k8s.sh serve --kubeconfig ./config --namespace budibase \
  --port 10000
```
