import { context } from "@budibase/backend-core"
import { processStringSync } from "@budibase/string-templates"
import {
  DatasourceFieldType,
  DocumentType,
  EmailTriggerAuthType,
  isEmailTrigger,
  prefixed,
  RestAuthType,
  SourceName,
  type Agent,
  type Automation,
  type Datasource,
  type Integration,
  type OAuth2Config,
  type Project,
  type ProjectImportRequirement,
  type RestAuthConfig,
} from "@budibase/types"
import { getDefinitions } from "../../../integrations"
import { getEnvironmentVariables, isEnvironmentVariableKey } from "../../utils"
import { isMaskedPassword } from "../automations/utils"
import { hasProject } from "./utils"

type SetupResource = Agent | Automation | Datasource | OAuth2Config

const isConfigured = (value: unknown) =>
  typeof value === "string" && !!value.trim() && !isMaskedPassword(value)

const isDatasourceValueConfigured = ({
  value,
  environmentVariables,
}: {
  value: unknown
  environmentVariables: Record<string, string>
}) =>
  isConfigured(
    typeof value === "string" && isEnvironmentVariableKey(value)
      ? processStringSync(value, { env: environmentVariables })
      : value
  )

const isRestAuthConfigured = ({
  auth,
  environmentVariables,
}: {
  auth: RestAuthConfig
  environmentVariables: Record<string, string>
}) => {
  const configured = (value: unknown) =>
    isDatasourceValueConfigured({ value, environmentVariables })
  switch (auth.type) {
    case RestAuthType.BASIC:
      return (
        configured(auth.config?.username) && configured(auth.config?.password)
      )
    case RestAuthType.BEARER:
      return configured(auth.config?.token)
    case RestAuthType.OAUTH2:
      return configured(auth.clientId) && configured(auth.clientSecret)
  }
}

const datasourceNeedsCredentials = ({
  datasource,
  definition,
  environmentVariables,
}: {
  datasource: Datasource
  definition?: Integration
  environmentVariables: Record<string, string>
}) => {
  const config = datasource.config || {}
  if (datasource.source === SourceName.REST) {
    const authConfigs: RestAuthConfig[] = config.authConfigs || []
    return authConfigs.some(
      auth => !isRestAuthConfigured({ auth, environmentVariables })
    )
  }
  if (definition?.auth?.type === "google") {
    return !isDatasourceValueConfigured({
      value: config.auth?.refreshToken,
      environmentVariables,
    })
  }
  if (!definition) {
    return true
  }
  return Object.entries(definition?.datasource || {}).some(([key, field]) => {
    const secret =
      field.type === DatasourceFieldType.PASSWORD ||
      field.type === DatasourceFieldType.SENSITIVE_LONGFORM
    return (
      secret &&
      (isMaskedPassword(config[key]) ||
        ((field.required ||
          (typeof config[key] === "string" &&
            isEnvironmentVariableKey(config[key]))) &&
          !isDatasourceValueConfigured({
            value: config[key],
            environmentVariables,
          })))
    )
  })
}

const agentNeedsIntegrationCredentials = (agent: Agent) => {
  const slack = agent.slackIntegration
  const teams = agent.MSTeamsIntegration
  return !!(
    (slack &&
      (!isConfigured(slack.botToken) || !isConfigured(slack.signingSecret))) ||
    (teams &&
      (!isConfigured(teams.appId) ||
        !isConfigured(teams.appPassword) ||
        !isConfigured(teams.tenantId)))
  )
}

const automationNeedsCredentials = ({
  automation,
  resourcesById,
  environmentVariables,
}: {
  automation: Automation
  resourcesById: Map<string, SetupResource>
  environmentVariables: Record<string, string>
}) => {
  const trigger = automation.definition?.trigger
  if (!isEmailTrigger(trigger)) {
    return false
  }
  const inputs = trigger.inputs
  if (!inputs?.host || !inputs.port || !isConfigured(inputs.username)) {
    return true
  }
  if (inputs.authType !== EmailTriggerAuthType.OAUTH2) {
    return !isConfigured(inputs.password)
  }
  if (
    inputs.datasourceId === inputs.authConfigId &&
    inputs.authConfigId?.startsWith(prefixed(DocumentType.OAUTH2_CONFIG))
  ) {
    const oauth = resourcesById.get(inputs.authConfigId) as
      | OAuth2Config
      | undefined
    return !(
      isDatasourceValueConfigured({
        value: oauth?.clientId,
        environmentVariables,
      }) &&
      isDatasourceValueConfigured({
        value: oauth?.clientSecret,
        environmentVariables,
      })
    )
  }
  const datasource = resourcesById.get(inputs.datasourceId || "") as
    | Datasource
    | undefined
  const authConfigs: RestAuthConfig[] = datasource?.config?.authConfigs || []
  const auth = authConfigs.find(auth => auth._id === inputs.authConfigId)
  return !(
    datasource?.source === SourceName.REST &&
    auth?.type === RestAuthType.OAUTH2 &&
    isRestAuthConfigured({ auth, environmentVariables })
  )
}

export const refreshProjectImportSetup = async ({
  projects,
}: {
  projects: Project[]
}): Promise<Project[]> => {
  const requirements = projects.flatMap(
    project => project.importSetup?.requirements || []
  )
  if (!requirements.length) {
    return projects
  }

  const db = context.getWorkspaceDB()
  const resourceIds = [...new Set(requirements.map(item => item.resourceId))]
  const resources = await db.getMultiple<SetupResource>(resourceIds, {
    allowMissing: true,
  })
  const resourcesById = new Map(
    resources.map(resource => [resource._id!, resource])
  )
  const emailDatasourceIds = resources.flatMap(resource => {
    const trigger = (resource as Automation).definition?.trigger
    return isEmailTrigger(trigger) && trigger.inputs?.datasourceId
      ? [trigger.inputs.datasourceId]
      : []
  })
  const missingDatasourceIds = [...new Set(emailDatasourceIds)].filter(
    id => !resourcesById.has(id)
  )
  if (missingDatasourceIds.length) {
    const datasources = await db.getMultiple<Datasource | OAuth2Config>(
      missingDatasourceIds,
      {
        allowMissing: true,
      }
    )
    for (const datasource of datasources) {
      resourcesById.set(datasource._id!, datasource)
    }
  }
  const definitions: Partial<Record<SourceName, Integration>> =
    requirements.some(item => item.type === "datasource_secrets")
      ? await getDefinitions()
      : {}
  const environmentVariables = await getEnvironmentVariables()

  const isPending = ({
    requirement,
    projectId,
  }: {
    requirement: ProjectImportRequirement
    projectId: string
  }) => {
    const resource = resourcesById.get(requirement.resourceId)
    if (!resource || !hasProject(resource, projectId)) {
      return false
    }
    switch (requirement.type) {
      case "datasource_secrets": {
        const datasource = resource as Datasource
        return datasourceNeedsCredentials({
          datasource,
          definition: definitions[datasource.source],
          environmentVariables,
        })
      }
      case "agent_ai_config":
        return !isConfigured((resource as Agent).aiconfig)
      case "agent_secrets":
        return agentNeedsIntegrationCredentials(resource as Agent)
      case "automation_credentials":
        return automationNeedsCredentials({
          automation: resource as Automation,
          resourcesById,
          environmentVariables,
        })
    }
  }

  return projects.map(project => {
    if (!project.importSetup) {
      return project
    }
    return {
      ...project,
      importSetup: {
        ...project.importSetup,
        requirements: project.importSetup.requirements
          .filter(requirement =>
            isPending({ requirement, projectId: project._id! })
          )
          .map(requirement => ({
            ...requirement,
            name:
              resourcesById.get(requirement.resourceId)?.name ||
              requirement.name,
          })),
      },
    }
  })
}
