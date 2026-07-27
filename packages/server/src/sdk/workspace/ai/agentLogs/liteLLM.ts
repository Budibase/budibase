import fetch from "node-fetch"
import { constants, HTTPError } from "@budibase/backend-core"
import type {
  LiteLLMRequestDetail,
  LiteLLMRequestListResponse,
  LiteLLMRequestPayload,
  LiteLLMRequestRecord,
} from "@budibase/types"
import env from "../../../../environment"
import { parseDate, validateLiteLLMRequestOwnership } from "./shared"

const liteLLMUrl = env.LITELLM_URL
const liteLLMAuthorizationHeader = `Bearer ${env.LITELLM_MASTER_KEY}`

function formatLiteLLMDateTime(date: Date): string {
  const pad = (part: number) => String(part).padStart(2, "0")
  return (
    [
      date.getUTCFullYear(),
      pad(date.getUTCMonth() + 1),
      pad(date.getUTCDate()),
    ].join("-") +
    ` ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(
      date.getUTCSeconds()
    )}`
  )
}

function getLiteLLMDayBoundary(value: string, mode: "start" | "end"): string {
  const parsedDate = parseDate(value)
  if (!parsedDate) {
    throw new Error(`Invalid LiteLLM date: ${value}`)
  }

  const boundary = new Date(parsedDate)
  if (mode === "start") {
    boundary.setUTCHours(0, 0, 0, 0)
  } else {
    boundary.setUTCHours(23, 59, 59, 999)
  }

  return formatLiteLLMDateTime(boundary)
}

export async function fetchLiteLLMRequestSummaryById(
  requestId: string,
  startDate?: string,
  endDate?: string
): Promise<LiteLLMRequestDetail | null> {
  const params = new URLSearchParams({
    request_id: requestId,
    start_date: getLiteLLMDayBoundary(
      startDate || constants.MIN_VALID_DATE.toISOString(),
      "start"
    ),
    end_date: getLiteLLMDayBoundary(
      endDate || constants.MAX_VALID_DATE.toISOString(),
      "end"
    ),
    page: "1",
    page_size: "1",
  })
  const response = await fetch(
    `${liteLLMUrl}/spend/logs/v2?${params.toString()}`,
    {
      headers: {
        Authorization: liteLLMAuthorizationHeader,
      },
    }
  )

  if (!response.ok) {
    if (response.status === 404) {
      return null
    }
    const text = await response.text()
    throw new Error(
      `Error fetching agent log detail: ${text || response.statusText}`
    )
  }

  const data = (await response.json()) as LiteLLMRequestListResponse | null
  return data?.data?.[0] || null
}

export async function fetchLiteLLMSessionRows(
  sessionId: string
): Promise<{ rows: LiteLLMRequestRecord[]; total: number }> {
  const pageSize = 100
  const rows: LiteLLMRequestRecord[] = []
  let page = 1
  let total = 0
  let totalPages = 1

  while (page <= totalPages) {
    const params = new URLSearchParams({
      session_id: sessionId,
      page: String(page),
      page_size: String(pageSize),
    })
    const response = await fetch(
      `${liteLLMUrl}/spend/logs/session/ui?${params.toString()}`,
      {
        headers: {
          Authorization: liteLLMAuthorizationHeader,
        },
      }
    )

    if (response.status === 404) {
      return { rows: [], total: 0 }
    }

    if (!response.ok) {
      const text = await response.text()
      throw new Error(
        `Error fetching agent session detail: ${text || response.statusText}`
      )
    }

    const data = (await response.json()) as LiteLLMRequestListResponse
    rows.push(...(data.data || []))
    total = data.total || total || rows.length
    totalPages = data.total_pages || 1
    page += 1
  }

  return { rows, total }
}

async function fetchLiteLLMRequestPayloadById(
  requestId: string
): Promise<LiteLLMRequestPayload | null> {
  const response = await fetch(
    `${liteLLMUrl}/spend/logs/ui/${encodeURIComponent(requestId)}`,
    {
      headers: {
        Authorization: liteLLMAuthorizationHeader,
      },
    }
  )

  if (!response.ok) {
    if (response.status === 404) {
      return null
    }
    const text = await response.text()
    throw new Error(
      `Error fetching agent log detail: ${text || response.statusText}`
    )
  }

  return (await response.json()) as LiteLLMRequestPayload
}

export async function fetchLiteLLMRequestRaw(
  agentId: string,
  requestId: string
): Promise<LiteLLMRequestDetail> {
  const [payload, summary] = await Promise.all([
    fetchLiteLLMRequestPayloadById(requestId),
    fetchLiteLLMRequestSummaryById(requestId),
  ])

  if (!payload) {
    throw new HTTPError("Agent log detail not found", 404)
  }
  const data: LiteLLMRequestDetail = {
    request_id: requestId,
    model: summary?.model,
    prompt_tokens: summary?.prompt_tokens,
    completion_tokens: summary?.completion_tokens,
    spend: summary?.spend,
    status: summary?.status,
    startTime: summary?.startTime,
    endTime: summary?.endTime,
    end_user: summary?.end_user,
    user: summary?.user,
    metadata: summary?.metadata,
    response: payload.response,
    proxy_server_request: payload.proxy_server_request,
  }

  validateLiteLLMRequestOwnership(agentId, data)

  return data
}
