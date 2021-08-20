cd docs
helm package ../hosting/kubernetes/budibase
helm repo index . --url https://budibase.github.io/budibase