#!/usr/bin/env python3
"""Three sequential Helm secret lifecycle tests; add --kind for real installs.

The default mode renders charts with mocked lookup responses. --kind creates an
isolated kind cluster and uses actual Helm lookups, hooks, and workload readiness.
Only generated test credentials are used. The cluster is retained for inspection.
"""
import argparse
import base64
import copy
import json
import subprocess
import sys
import tempfile
import unittest
import uuid
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CHART = ROOT / "charts/budibase"
CORE = ["internalApiKey", "jwtSecret", "objectStoreAccess", "objectStoreSecret", "bbEncryptionKey", "apiEncryptionKey"]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--kind", action="store_true")
parser.add_argument("--master-ref", default="origin/master")
options, unittest_args = parser.parse_known_args()


def run(command, input=None):
    result = subprocess.run(command, input=input, capture_output=True, text=True)
    if result.returncode:
        raise RuntimeError(f"Command failed: {' '.join(command)}\n{result.stderr}")
    return result.stdout


def yaml_documents(text):
    return json.loads(run(["ruby", "-ryaml", "-rjson", "-e",
                           "puts JSON.generate(YAML.load_stream(STDIN.read).compact)"], text))


class SecretUpgradeTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.directory = Path(tempfile.mkdtemp(prefix="budibase-secret-upgrades-"))
        cls.master = cls.directory / "master"
        cls.master.mkdir()
        archive = subprocess.check_output(["git", "-C", str(ROOT), "archive", options.master_ref, "charts/budibase"])
        subprocess.run(["tar", "-x", "-C", str(cls.master)], input=archive, check=True)
        cls.master = cls.master / "charts/budibase"
        cls.master_sha = run(["git", "-C", str(ROOT), "rev-parse", options.master_ref]).strip()
        cls.cluster = "budibase-secrets-" + uuid.uuid4().hex[:8]
        cls.namespace = "secret-upgrades"
        cls.kubeconfig = cls.directory / "kubeconfig"
        cls.kubectl = ["kubectl", "--kubeconfig", str(cls.kubeconfig), "--context", "kind-" + cls.cluster, "-n", cls.namespace]
        cls.helm = ["helm", "--kubeconfig", str(cls.kubeconfig), "--kube-context", "kind-" + cls.cluster]
        cls.previous_secret = None
        cls.completed = 0
        cls.values = {
            "globals": {"appVersion": "develop", "bbAdminUserPassword": "kind-test-admin-password",
                        "smtp": {"password": "kind-test-smtp-before"}},
            "awsAlbIngress": {"enabled": False}, "ingress": {"enabled": False},
            "services": {
                "apps": {"replicaCount": 1, "extraEnv": [{"name": "DISABLE_THREADING", "value": "1"}]},
                "worker": {"replicaCount": 1},
                "automationWorkers": {"replicaCount": 1, "extraEnv": [{"name": "DISABLE_THREADING", "value": "1"}]},
                "proxy": {"replicaCount": 1},
                "redis": {"password": "kind-test-redis-password"},
                "litellm": {"enabled": True, "replicaCount": 1, "masterKey": "sk-kind-test-master", "saltKey": "kind-test-salt", "migrationJob": {"ttlSecondsAfterFinished": 3600},
                            "extraEnv": [{"name": "DATABASE_URL", "value": "postgresql://test:test@postgres:5432/litellm"}]},
            },
            "couchdb": {"clusterSize": 1, "persistentVolume": {"size": "1Gi"},
                        "resources": {"requests": {"memory": "256Mi"}, "limits": {"memory": "4Gi", "cpu": "2"}},
                        "extraEnvs": [{"name": "DATA_DIR", "value": "/data"},
                                      {"name": "ERL_AFLAGS", "value": "+S 2:2 +A 4"},
                                      {"name": "JAVA_TOOL_OPTIONS", "value": "-Xms64m -XX:ActiveProcessorCount=2"}]},
        }
        print(f"\nMode: {'kind' if options.kind else 'render with mocked lookup'}; master: {cls.master_sha}; artifacts: {cls.directory}", flush=True)
        if options.kind:
            print(f"Kind cluster: {cls.cluster}; kubeconfig: {cls.kubeconfig}", flush=True)
            run(["docker", "info", "--format", "{{.ServerVersion}}"])
            run(["kind", "create", "cluster", "--name", cls.cluster, "--kubeconfig", str(cls.kubeconfig), "--wait", "120s"])
            run(cls.kubectl + ["create", "namespace", cls.namespace])
            postgres = {"apiVersion": "apps/v1", "kind": "Deployment", "metadata": {"name": "postgres"},
                        "spec": {"replicas": 1, "selector": {"matchLabels": {"app": "postgres"}}, "template": {
                            "metadata": {"labels": {"app": "postgres"}}, "spec": {"containers": [{
                                "name": "postgres", "image": "postgres:16-alpine", "ports": [{"containerPort": 5432}],
                                "env": [{"name": "POSTGRES_USER", "value": "test"}, {"name": "POSTGRES_PASSWORD", "value": "test"},
                                        {"name": "POSTGRES_DB", "value": "litellm"}],
                                "readinessProbe": {"exec": {"command": ["pg_isready", "-U", "test", "-d", "litellm"]}}}]}}}}
            service = {"apiVersion": "v1", "kind": "Service", "metadata": {"name": "postgres"},
                       "spec": {"selector": {"app": "postgres"}, "ports": [{"port": 5432}]}}
            run(cls.kubectl + ["apply", "-f", "-"], json.dumps({"apiVersion": "v1", "kind": "List", "items": [postgres, service]}))
            run(cls.kubectl + ["rollout", "status", "deployment/postgres", "--timeout=180s"])

    def deploy(self, chart, values, stage):
        cls = type(self)
        fixture = self.directory / f"{stage}.values.json"
        fixture.write_text(json.dumps(values))
        if options.kind:
            action = "install" if stage == 1 else "upgrade"
            run(self.helm + [action, "budibase", str(chart), "-n", self.namespace, "-f", str(fixture), "--wait", "--timeout", "15m"])
            documents = yaml_documents(run(self.helm + ["get", "manifest", "budibase", "-n", self.namespace]))
            documents += yaml_documents(run(self.helm + ["get", "hooks", "budibase", "-n", self.namespace]))
            secret = json.loads(run(self.kubectl + ["get", "secret", "budibase-budibase", "-o", "json"]))
            if stage > 1:
                job = json.loads(run(self.kubectl + ["get", "job", "litellm-migrations", "-o", "json"]))
                self.assertEqual(job.get("status", {}).get("succeeded"), 1, "Migration hook must complete")
        else:
            # An actual Helm render with only the Kubernetes lookup response mocked.
            # Render each stage from a fresh archive so no mock or cached data leaks.
            temporary = self.directory / f"stage-{stage}"
            import shutil
            shutil.copytree(chart, temporary)
            lookup = 'lookup "v1" "Secret" .Release.Namespace (include "budibase.fullname" .)'
            replacement = "(" + json.dumps(json.dumps(self.previous_secret or {})) + " | fromJson)"
            for template in (temporary / "templates").glob("*"):
                if template.is_file():
                    template.write_text(template.read_text().replace(lookup, replacement))
            documents = yaml_documents(run(["helm", "template", "budibase", str(temporary), "-n", self.namespace, "-f", str(fixture)]))
            secret = next(d for d in documents if d["kind"] == "Secret" and d["metadata"]["name"] == "budibase-budibase")
        cls.previous_secret = secret
        cls.documents = documents
        (self.directory / f"{stage}.resources.json").write_text(json.dumps(documents, indent=2))
        return secret["data"]

    def assert_references_resolve(self):
        secrets = {d["metadata"]["name"]: d.get("data", {}) for d in self.documents if d["kind"] == "Secret"}
        for document in self.documents:
            if document["kind"] not in ["Deployment", "StatefulSet", "Job"]:
                continue
            spec = document["spec"]["template"]["spec"]
            for container in spec.get("containers", []) + spec.get("initContainers", []):
                for entry in container.get("env", []):
                    ref = entry.get("valueFrom", {}).get("secretKeyRef")
                    if ref and not ref.get("optional"):
                        self.assertIn(ref["key"], secrets.get(ref["name"], {}), f"Unresolved reference: {document['metadata']['name']}/{entry['name']}")

    def test_01_install_master(self):
        data = self.deploy(self.master, self.values, 1)
        type(self).original = {key: data[key] for key in CORE}
        self.assertTrue(all(self.original.values()), "All core credentials must be initialized")
        self.assert_references_resolve()
        type(self).completed = 1

    def test_02_upgrade_master_to_branch(self):
        if self.completed != 1:
            self.skipTest("Master install did not complete")
        cls = type(self)
        values = copy.deepcopy(self.values)
        data = self.deploy(CHART, values, 2)
        for key in CORE:
            self.assertTrue(data[key] == self.original[key], f"Credential changed during migration: {key}")
        self.assertTrue(base64.b64decode(data["bb_admin_user_password"]).decode() == "kind-test-admin-password")
        self.assert_references_resolve()
        cls.branch_values = values
        cls.checksum = next(d for d in self.documents if d["kind"] == "Deployment" and d["metadata"]["name"] == "worker-service")["spec"]["template"]["metadata"]["annotations"]["checksum/budibase-secrets"]
        cls.completed = 2

    def test_03_upgrade_branch_to_branch(self):
        if self.completed != 2:
            self.skipTest("First branch upgrade did not complete")
        values = copy.deepcopy(self.branch_values)
        del values["globals"]["bbAdminUserPassword"]
        values["globals"]["smtp"]["password"] = "kind-test-smtp-after"
        data = self.deploy(CHART, values, 3)
        for key in CORE:
            self.assertTrue(data[key] == self.original[key], f"Credential changed on repeat upgrade: {key}")
        self.assertTrue(base64.b64decode(data["bb_admin_user_password"]).decode() == "kind-test-admin-password", "Stored admin password must survive omitted values")
        self.assertTrue(base64.b64decode(data["smtp_pass"]).decode() == "kind-test-smtp-after")
        checksum = next(d for d in self.documents if d["kind"] == "Deployment" and d["metadata"]["name"] == "worker-service")["spec"]["template"]["metadata"]["annotations"]["checksum/budibase-secrets"]
        self.assertNotEqual(checksum, self.checksum, "Credential rotation must change the pod template")
        self.assert_references_resolve()
        if options.kind:
            password = run(self.kubectl + ["exec", "deployment/worker-service", "--", "printenv", "SMTP_PASSWORD"]).strip()
            self.assertTrue(password == "kind-test-smtp-after", "Running worker must receive the rotated credential")
        type(self).completed = 3


if __name__ == "__main__":
    unittest.main(argv=[sys.argv[0]] + unittest_args, verbosity=2)
