{{/*
Expand the name of the chart.
*/}}
{{- define "budibase.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
*/}}
{{- define "budibase.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- printf "%s-%s" .Values.fullnameOverride .Chart.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}

{{/*
CouchDB secret identifier
*/}}
{{- define "couchdb.fullname" -}}
{{- $name := "couchdb" -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Internal DNS
*/}}
{{- define "budibase.serviceDns" -}}
{{- printf "%s.%s.%s" .Release.Namespace "svc" .Values.services.dns -}}
{{- end -}}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "budibase.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "budibase.labels" -}}
helm.sh/chart: {{ include "budibase.chart" . }}
{{ include "budibase.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "budibase.selectorLabels" -}}
app.kubernetes.io/name: {{ include "budibase.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "budibase.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "budibase.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Create a random string if the supplied key does not exist
*/}}
{{- define "budibase.defaultsecret" -}}
{{- if . -}}
{{- . | toString | b64enc | quote -}}
{{- else -}}
{{- randAlphaNum 20 | b64enc | quote -}}
{{- end -}}
{{- end -}}

{{- define "budibase.secretName" -}}
{{- if .Values.globals.createSecrets -}}
{{- include "budibase.fullname" . -}}
{{- else -}}
budicloud-runtime
{{- end -}}
{{- end -}}

{{- define "budibase.secretKeyRef" -}}
{{- $key := .key -}}
{{- if not .root.Values.globals.createSecrets -}}
{{- $key = get .root.Values.globals.runtimeSecretKeys .key | default .key -}}
{{- end -}}
secretKeyRef:
  name: {{ include "budibase.secretName" .root }}
  key: {{ $key | quote }}
{{- if .optional }}
  optional: true
{{- end }}
{{- end -}}

{{- define "budibase.deploymentAnnotations" -}}
{{- merge (dict "reloader.stakater.com/auto" (toString .root.Values.reloader.enabled)) (.annotations | default dict) | toYaml -}}
{{- end -}}

{{- define "budibase.secretPodAnnotations" -}}
{{- if .Values.globals.createSecrets }}
checksum/budibase-secrets: {{ include "budibase.secretData" . | sha256sum }}
{{- end }}
{{- end -}}

{{- define "budibase.secretData" -}}
{{- if not (hasKey . "budibaseSecretData") }}
{{- $existing := (lookup "v1" "Secret" .Release.Namespace (include "budibase.fullname" .)).data | default dict }}
{{- $generated := list "internalApiKey" "jwtSecret" "objectStoreAccess" "objectStoreSecret" "bbEncryptionKey" "apiEncryptionKey" }}
{{- $values := dict
  "account_portal_api_key" .Values.globals.accountPortalApiKey
  "apiEncryptionKey" .Values.globals.apiEncryptionKey
  "bbEncryptionKey" .Values.globals.bbEncryptionKey
  "bb_admin_user_password" .Values.globals.bbAdminUserPassword
  "bbai_litellm_key" .Values.services.litellm.bbaiKey
  "cloudfront_private_key_64" .Values.services.objectStore.cloudfront.privateKey64
  "couchdb_url" (default (printf "http://%s-svc-couchdb:%v" .Release.Name .Values.services.couchdb.port) .Values.services.couchdb.url)
  "google_client_id" .Values.globals.google.clientId
  "google_client_secret" .Values.globals.google.secret
  "internalApiKey" .Values.globals.internalApiKey
  "internal_api_key_fallback" .Values.globals.internalApiKeyFallback
  "jwtSecret" .Values.globals.jwtSecret
  "jwt_secret_fallback" .Values.globals.jwtSecretFallback
  "litellm_master_key" .Values.services.litellm.masterKey
  "litellm_salt_key" .Values.services.litellm.saltKey
  "litellm_ui_password" .Values.services.litellm.uiPassword
  "litellm_ui_username" .Values.services.litellm.uiUsername
  "objectStoreAccess" .Values.services.objectStore.accessKey
  "objectStoreSecret" .Values.services.objectStore.secretKey
  "posthog_token" .Values.globals.posthogToken
  "redis_password" .Values.services.redis.password
  "redis_username" .Values.services.redis.username
  "smtp_pass" .Values.globals.smtp.password
  "smtp_user" .Values.globals.smtp.user
}}
{{- $data := dict }}
{{- range $key, $value := $values }}
  {{- $stored := get $existing $key }}
  {{- $encoded := $value | default "" | toString | b64enc }}
  {{- if has $key $generated }}
    {{- $encoded = $stored }}
    {{- if and (hasKey $existing $key) (not $stored) }}
      {{- fail (printf "existing Secret key %s is empty; restore its credential before upgrading" $key) }}
    {{- end }}
    {{- if not $stored }}
      {{- $encoded = $value | default (randAlphaNum 20) | toString | b64enc }}
    {{- end }}
  {{- else if and (eq $key "bb_admin_user_password") $stored }}
    {{- $encoded = $stored }}
  {{- end }}
  {{- $_ := set $data $key $encoded }}
{{- end }}
{{- $_ := set . "budibaseSecretData" $data }}
{{- end }}
{{- get . "budibaseSecretData" | toYaml }}
{{- end -}}
