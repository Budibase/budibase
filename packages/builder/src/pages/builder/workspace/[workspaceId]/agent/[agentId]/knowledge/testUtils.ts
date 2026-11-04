import {
  AgentKnowledgeSourceType,
  KnowledgeBaseFileSourceType,
  KnowledgeBaseFileStatus,
  SharePointScopeMode,
  type Agent,
  type AgentOperation,
  type KnowledgeBaseFile,
} from "@budibase/types"
import { agentsStore } from "@/stores/portal"

export const createKnowledgeFile = ({
  filename = "support-policy.txt",
  sourceId,
  siteId = "site-1",
}: {
  filename?: string
  sourceId?: string
  siteId?: string
} = {}): KnowledgeBaseFile => ({
  _id: filename,
  knowledgeBaseId: "kb-1",
  filename,
  objectStoreKey: `workspace-1/${filename}`,
  uploadedBy: "user-1",
  status: KnowledgeBaseFileStatus.READY,
  source: sourceId
    ? {
        type: KnowledgeBaseFileSourceType.SHAREPOINT_SITE,
        knowledgeSourceId: sourceId,
        siteId,
        driveId: "drive-1",
        itemId: filename,
        path: filename,
      }
    : undefined,
})

export const seedKnowledge = ({
  files = [],
}: { files?: KnowledgeBaseFile[] } = {}) => {
  const operation: AgentOperation = {
    id: "operation-1",
    name: "Support operation",
    live: false,
    promptInstructions: "",
    allowKnowledgeSourceDownload: true,
    knowledgeSources: [1, 2].map(index => ({
      id: `source-${index}`,
      type: AgentKnowledgeSourceType.SHAREPOINT,
      config: {
        datasourceId: "datasource-1",
        authConfigId: "auth-1",
        site: { id: `site-${index}`, name: `Support site ${index}` },
        scope: { mode: SharePointScopeMode.ALL },
      },
    })),
  }
  const agent: Agent = {
    _id: "agent-1",
    name: "Support",
    aiconfig: "default",
    operations: [operation],
  }
  agentsStore.update(state => ({
    ...state,
    agents: [agent],
    agentsLoaded: true,
    currentAgentId: "agent-1",
    knowledgeConfiguration: { knowledgeSearchConfigured: true },
    knowledgeByOperation: {
      "agent-1:operation-1": { files, sharePointSources: [] },
    },
    knowledgeUploadByOperation: {},
  }))
  return operation
}
