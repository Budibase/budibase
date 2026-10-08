import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import type {
  ActionSession,
  HomeRowType,
  PlatformActionContainerStatus,
  PlatformActionEnvironment,
  PlatformActionSourceType,
} from "@budibase/types"
import { getRowIcon, getRowIconColor } from "../home/_components/rows"
import type { ActivityDetail } from "./ActivityDetailsList.svelte"
import { formatActivityDate } from "./activityDate"

dayjs.extend(relativeTime)

export interface ActionSessionRow {
  _id: string
  typeLabel: string
  typeIcon: string
  typeIconColor: string
  assetLabel: string
  triggeredByLabel: string
  triggeredByPrefix?: string
  status: PlatformActionContainerStatus
  statusLabel: PlatformActionContainerStatus
  actionCount: number
  updatedLabel: string
}

const SOURCE_TYPES: Record<
  PlatformActionSourceType,
  { label: string; rowType: HomeRowType }
> = {
  agent_session: { label: "Agent request", rowType: "agent" },
  automation_run: { label: "Automation run", rowType: "automation" },
  app_session: { label: "App session", rowType: "app" },
}

export const ENVIRONMENT_LABELS: Record<PlatformActionEnvironment, string> = {
  prod: "Production",
  dev: "Development",
}

const getSourceType = (session: ActionSession) => {
  const { label, rowType } = SOURCE_TYPES[session.sourceType]
  return {
    label,
    icon: getRowIcon(rowType),
    iconColor: getRowIconColor(rowType),
  }
}

const getAssetLabel = (session: ActionSession) =>
  session.assetLabel || "Unknown asset"

const getTriggeredByLabel = (session: ActionSession) => {
  const { triggeredByType, triggeredByLabel, triggeredById } = session
  switch (triggeredByType) {
    case "user":
      return triggeredByLabel ? `User: ${triggeredByLabel}` : "User"
    case "agent":
      return triggeredByLabel ? `Agent: ${triggeredByLabel}` : "Agent"
    case "automation":
      return triggeredByLabel ? `Automation: ${triggeredByLabel}` : "Automation"
    case "schedule":
      return "System: Schedule"
    case "webhook":
      return "System: Webhook"
    case "system":
      switch (triggeredById) {
        case "row_change":
          return "System: Row change"
        case "email":
          return "System: Email"
        case "reboot":
          return "System: Reboot"
        default:
          return "System"
      }
    default:
      return triggeredByLabel || "Unknown"
  }
}

const getTriggeredByPrefix = (session: ActionSession) => {
  switch (session.triggeredByType) {
    case "user":
      return session.triggeredByLabel ? "User" : undefined
    case "agent":
      return session.triggeredByLabel ? "Agent" : undefined
    case "automation":
      return session.triggeredByLabel ? "Automation" : undefined
    case "schedule":
    case "webhook":
      return "System"
    case "system":
      return getTriggeredByLabel(session) === "System" ? undefined : "System"
  }
}

export const getActionSessionRowId = ({
  environment,
  sourceType,
  sourceId,
}: ActionSession) => `${environment}/${sourceType}/${sourceId}`

export const toActionSessionRow = ({
  session,
  now,
}: {
  session: ActionSession
  now: number
}): ActionSessionRow => {
  const updatedAt = dayjs(session.updatedAt)
  const sourceType = getSourceType(session)

  return {
    _id: getActionSessionRowId(session),
    typeLabel: sourceType.label,
    typeIcon: sourceType.icon,
    typeIconColor: sourceType.iconColor,
    assetLabel: getAssetLabel(session),
    triggeredByLabel: getTriggeredByLabel(session),
    triggeredByPrefix: getTriggeredByPrefix(session),
    status: session.status,
    statusLabel: session.status,
    actionCount: session.actionCount,
    updatedLabel: updatedAt.isValid() ? updatedAt.from(now) : "Unknown time",
  }
}

export const getActionSessionTitle = (session: ActionSession) =>
  session.assetLabel || getSourceType(session).label

export const getActionSessionDetails = (
  session: ActionSession
): ActivityDetail[] => {
  const sourceType = getSourceType(session)

  return [
    { type: "status-badge", label: "Status", status: session.status },
    {
      type: "text",
      label: "Type",
      value: sourceType.label,
      icon: sourceType.icon,
      iconColor: sourceType.iconColor,
      highlight: true,
    },
    {
      type: "text",
      label: "Asset",
      value: getAssetLabel(session),
      icon: "cube",
    },
    {
      type: "text",
      label: "Triggered by",
      value: getTriggeredByLabel(session),
      prefix: getTriggeredByPrefix(session),
      icon: "user",
    },
    {
      type: "text",
      label: "Environment",
      value: ENVIRONMENT_LABELS[session.environment],
      icon: "globe",
    },
    {
      type: "text",
      label: "Actions",
      value: String(session.actionCount),
      icon: "list-checks",
    },
    {
      type: "text",
      label: "Started at",
      value: formatActivityDate(session.startedAt),
      icon: "calendar",
    },
  ]
}
