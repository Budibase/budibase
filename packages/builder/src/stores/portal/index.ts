import { writable } from "svelte/store"

export { organisation } from "./organisation"
export { users } from "./users"
export { admin } from "./admin"
export { workspacesStore, enrichedApps, sortBy } from "./workspaces"
export { email } from "./email"
export { auth } from "./auth"
export { oidc } from "./oidc"
export { templates } from "./templates"
export { licensing } from "./licensing"
export { groups } from "./groups"
export { plugins } from "./plugins"
export { backups } from "./backups"
export { environment } from "./environment"
export { menu } from "./menu"
export { auditLogs } from "./auditLogs"
export { features } from "./features"
export { themeStore } from "./theme"
export { temporalStore } from "./temporal"
export { navigation } from "./navigation"
export { featureFlags } from "./featureFlags"
export { projectsStore } from "./projects"
export { agentsStore, selectedAgent } from "./agents"
export type {
  OperationKnowledgePendingUpload,
  OperationKnowledgeUploadResult,
  OperationKnowledgeUploadState,
} from "./agents"
export { knowledgeConnectionsStore } from "./knowledgeConnections"
export { clientAppsStore } from "./clientApps"
export { bannerStore } from "./banners"
export { appCreationStore } from "./workspaceCreation"
export { aiConfigsStore } from "./aiConfigs"
export { translations } from "./translations"
export { aiStore } from "./ai"

export const sideBarCollapsed = writable(false)
