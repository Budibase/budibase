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

dayjs.extend(relativeTime)

export interface ActionSessionRow {
  _id: string
  typeLabel: string
  typeIcon: string
  typeIconColor: string
  assetLabel: string
  triggeredByLabel: string
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

const getTriggeredByLabel = (session: ActionSession) =>
  session.triggeredByLabel || "Unknown"

const formatDate = (value: string) => {
  const date = dayjs(value)
  return date.isValid() ? date.format("MMM D, YYYY h:mm A") : "Unknown time"
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
      value: formatDate(session.startedAt),
      icon: "calendar",
    },
  ]
}
