{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "couchdb.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
*/}}
{{- define "couchdb.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- printf "%s-%s" .Values.fullnameOverride .Chart.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}

{{/*
In the event that we create both a headless service and a traditional one,
ensure that the latter gets a unique name.
*/}}
{{- define "couchdb.svcname" -}}
{{- if .Values.fullnameOverride -}}
{{- printf "%s-svc-%s" .Values.fullnameOverride .Chart.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- printf "%s-svc-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}

{{/*
Create a random string if the supplied key does not exist
*/}}
{{- define "couchdb.defaultsecret" -}}
{{- if . -}}
{{- . | b64enc | quote -}}
{{- else -}}
{{- randAlphaNum 20 | b64enc | quote -}}
{{- end -}}
{{- end -}}

{{/*
Labels used to define Pods in the CouchDB statefulset
*/}}
{{- define "couchdb.ss.selector" -}}
app: {{ template "couchdb.name" . }}
release: {{ .Release.Name }}
{{- end -}}

{{/*
Generates a comma delimited list of nodes in the cluster
*/}}
{{- define "couchdb.seedlist" -}}
{{- $nodeCount :=  min 5 .Values.clusterSize | int }}
  {{- range $index0 := until $nodeCount -}}
    {{- $index1 := $index0 | add1 -}}
    {{ $.Values.erlangFlags.name }}@{{ template "couchdb.fullname" $ }}-{{ $index0 }}.{{ template "couchdb.fullname" $ }}.{{ $.Release.Namespace }}.svc.{{ $.Values.dns.clusterDomainSuffix }}{{ if ne $index1 $nodeCount }},{{ end }}
  {{- end -}}
{{- end -}}

{{/*
If serviceAccount.name is specified, use that, else use the couchdb instance name
*/}}
{{- define "couchdb.serviceAccount" -}}
{{- if .Values.serviceAccount.name -}}
{{- .Values.serviceAccount.name }}
{{- else -}}
{{- template "couchdb.fullname" . -}}
{{- end -}}
{{- end -}}

{{/*
Fail if couchdbConfig.couchdb.uuid is undefined
*/}}
{{- define "couchdb.uuid" -}}
{{- required "A value for couchdbConfig.couchdb.uuid must be set" (.Values.couchdbConfig.couchdb | default dict).uuid -}}
{{- end -}} 