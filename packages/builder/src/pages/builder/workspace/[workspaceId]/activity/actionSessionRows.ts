import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import type {
  ActionSession,
  HomeRowType,
  PlatformActionContainerStatus,
  PlatformActionSourceType,
} from "@budibase/types"
import { getRowIcon, getRowIconColor } from "../home/_components/rows"

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
  const sourceType = SOURCE_TYPES[session.sourceType]

  return {
    _id: getActionSessionRowId(session),
    typeLabel: sourceType.label,
    typeIcon: getRowIcon(sourceType.rowType),
    typeIconColor: getRowIconColor(sourceType.rowType),
    assetLabel: session.assetLabel || "Unknown asset",
    triggeredByLabel: session.triggeredByLabel || "Unknown",
    status: session.status,
    statusLabel: session.status,
    actionCount: session.actionCount,
    updatedLabel: updatedAt.isValid() ? updatedAt.from(now) : "Unknown time",
  }
}
