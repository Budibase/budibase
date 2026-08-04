import type { ReadStream } from "fs"
import { ResourceType, UsedResource } from "./resource"

export interface ProjectResponse {
  _id: string
  _rev: string
  name: string
  description?: string
  color?: string
  createdAt: string
  updatedAt: string
}

export interface FetchProjectsResponse {
  projects: ProjectResponse[]
}

export interface CreateProjectRequest {
  name: string
  description?: string
  color?: string
}

export interface CreateProjectResponse {
  project: ProjectResponse
}

export interface UpdateProjectRequest {
  _id: string
  _rev: string
  name: string
  description?: string
  color?: string
}

export interface UpdateProjectResponse {
  project: ProjectResponse
}

export interface PreviewProjectAssignmentRequest {
  resourceId: string
  projectIds: string[]
}

export interface ProjectAssignmentDependency extends UsedResource {
  projectIdsToAdd: string[]
}

export interface PreviewProjectAssignmentResponse {
  dependencies: ProjectAssignmentDependency[]
}

export interface UpdateProjectAssignmentRequest {
  resourceRev: string
  projectIds: string[]
  dependencyIds: string[]
}

export interface UpdateProjectAssignmentResponse {
  resourceId: string
  resourceRev: string
  projectIds: string[]
  assignedDependencyIds: string[]
}

export interface ExportProjectRequest {
  encryptPassword?: string
}

export type ExportProjectResponse = ReadStream

export interface ImportProjectRequest {
  encryptPassword?: string
}

export interface ProjectImportRequirement {
  type: "datasource_secrets" | "agent_secrets"
  resourceId: string
  name: string
  reason: string
}

export interface ImportProjectResponse {
  project: ProjectResponse
  resources: Partial<Record<ResourceType, string[]>>
  unsupportedContent: ProjectPackageUnsupportedContent[]
  requirements: ProjectImportRequirement[]
}

export interface ProjectManifestSummary {
  _id: string
  name: string
  description?: string
  color?: string
  createdAt: string
  updatedAt: string
}

export interface ProjectPackageUnsupportedContent {
  type: string
  count: number
  reason: string
}

export interface ProjectPackageManifest {
  formatVersion: number
  artifactType: "project"
  budibaseVersion: string
  exportedAt: string
  project: ProjectManifestSummary
  sourceWorkspace: {
    id: string
  }
  resourcesByType: Partial<Record<ResourceType, number>>
  containsRows: boolean
  containsAttachments: boolean
  requiresSecrets: boolean
  unsupportedContent: ProjectPackageUnsupportedContent[]
}

export interface ProjectPackageDependencyIndex {
  rootProjectId: string
  directMembers: UsedResource[]
  resources: Record<string, { dependencies: UsedResource[] }>
}
