import { ReadStream } from "fs"
import { ResourceType, UsedResource } from "./resource"

export interface PlaybookResponse {
  _id: string
  _rev: string
  name: string
  description?: string
  color?: string
  createdAt: string
  updatedAt?: string
}

export interface FetchPlaybooksResponse {
  playbooks: PlaybookResponse[]
}

export interface CreatePlaybookRequest {
  name: string
  description?: string
  color?: string
}

export interface CreatePlaybookResponse {
  playbook: PlaybookResponse
}

export interface UpdatePlaybookRequest extends PlaybookResponse {}

export interface UpdatePlaybookResponse {
  playbook: PlaybookResponse
}

export interface ExportPlaybookRequest {
  encryptPassword?: string
}

export type ExportPlaybookResponse = ReadStream

export interface ImportPlaybookRequest {
  encryptPassword?: string
}

export interface PlaybookImportRequirement {
  type: "datasource_secrets" | "agent_secrets"
  resourceId: string
  name: string
  reason: string
}

export interface ImportPlaybookResponse {
  playbook: PlaybookResponse
  resources: Partial<Record<ResourceType, string[]>>
  unsupportedContent: PlaybookPackageUnsupportedContent[]
  requirements: PlaybookImportRequirement[]
}

export type PlaybookPackageImportMode = "dryRun" | "additiveImport"

export interface PlaybookPackageUnsupportedContent {
  type: string
  count: number
  reason: string
}

export interface PlaybookPackageManifest {
  formatVersion: number
  artifactType: "playbook"
  budibaseVersion: string
  exportedAt: string
  playbook: Pick<
    PlaybookResponse,
    "_id" | "name" | "description" | "color" | "createdAt" | "updatedAt"
  >
  sourceWorkspace: {
    id: string
  }
  resourcesByType: Partial<Record<ResourceType, number>>
  containsRows: boolean
  containsAttachments: boolean
  requiresSecrets: boolean
  unsupportedContent: PlaybookPackageUnsupportedContent[]
  supportedImportModes: PlaybookPackageImportMode[]
}

export interface PlaybookPackageDependencyIndex {
  rootPlaybookId: string
  directMembers: UsedResource[]
  resources: Record<string, { dependencies: UsedResource[] }>
}
