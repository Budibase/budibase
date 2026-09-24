import {
  asSchema,
  safeValidateTypes,
  type FlexibleSchema,
} from "@ai-sdk/provider-utils"
import {
  LockName,
  LockType,
  ToolValidationResultStatus,
  type ChatConversationChannel,
} from "@budibase/types"
import { cache, locks } from "@budibase/backend-core"
import type { ModelMessage } from "ai"
import type { RequesterValidationRuntime } from "../../../../ai/tools"

export type RequesterActionStatus =
  | "collecting_input"
  | "awaiting_confirmation"
  | "executing"
  | "completed"
  | "rejected"
  | "failed"

export interface RequesterActionContext {
  agentId: string
  operationId: string
  conversationId: string
  requestId?: string
  requesterId: string
  requesterRole: string
  channel?: ChatConversationChannel["provider"]
  externalUserId?: string
  externalConversationId?: string
  toolName: string
  readableName?: string
  sourceId?: string
  toolCallId: string
  partialArguments: unknown
  confirmedArguments?: unknown
  status: RequesterActionStatus
  validationMessage?: string
  result?: unknown
  error?: string
  responderId?: string
  createdAt: string
  updatedAt: string
}

const requesterActionKey = (conversationId: string) =>
  `agent:requester-action:${conversationId}`

const withRequesterActionLock = async <T>(
  conversationId: string,
  callback: () => Promise<T>
) => {
  const { result } = await locks.doWithLock(
    {
      name: LockName.REQUESTER_CONFIRMATION,
      resource: conversationId,
      type: LockType.DEFAULT,
      ttl: 5000,
    },
    callback
  )
  return result
}

export const getRequesterAction = async (conversationId: string) =>
  ((await cache.get(
    requesterActionKey(conversationId)
  )) as RequesterActionContext | null) ?? undefined

export const getActiveRequesterAction = async (conversationId: string) => {
  const action = await getRequesterAction(conversationId)
  return action &&
    (action.status === "collecting_input" ||
      action.status === "awaiting_confirmation" ||
      action.status === "executing")
    ? action
    : undefined
}

const saveRequesterAction = async (
  action: Omit<RequesterActionContext, "createdAt" | "updatedAt">
) => {
  const existing = await getRequesterAction(action.conversationId)
  const timestamp = new Date().toISOString()
  const next: RequesterActionContext = {
    ...action,
    createdAt: existing?.createdAt ?? timestamp,
    updatedAt: timestamp,
  }
  await cache.store(requesterActionKey(action.conversationId), next)
  return next
}

export const transitionRequesterAction = async ({
  conversationId,
  from,
  to,
  update = {},
}: {
  conversationId: string
  from: RequesterActionStatus
  to: RequesterActionStatus
  update?: Partial<RequesterActionContext>
}) => {
  return withRequesterActionLock(conversationId, async () => {
    const existing = await getRequesterAction(conversationId)
    if (!existing || existing.status !== from) {
      return { confirmation: existing, changed: false }
    }
    const confirmation: RequesterActionContext = {
      ...existing,
      ...update,
      status: to,
      updatedAt: new Date().toISOString(),
    }
    await cache.store(requesterActionKey(conversationId), confirmation)
    return { confirmation, changed: true }
  })
}

export interface RequesterValidationContext {
  agentId: string
  operationId: string
  conversationId: string
  getRequestId?: () => string | undefined
  requesterId: string
  requesterRole: string
  channel?: ChatConversationChannel
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value)

const mergeArguments = (previous: unknown, incoming: unknown): unknown => {
  if (!isRecord(previous) || !isRecord(incoming)) {
    return incoming
  }
  return Object.fromEntries(
    Object.entries({ ...previous, ...incoming }).map(([key, value]) => [
      key,
      key in previous && key in incoming
        ? mergeArguments(previous[key], incoming[key])
        : value,
    ])
  )
}

const messageText = (message: ModelMessage) =>
  (typeof message.content === "string"
    ? message.content
    : JSON.stringify(message.content)
  ).toLocaleLowerCase()

const evidenceText = (messages: ModelMessage[] = []) => ({
  requester: messages
    .filter(message => message.role === "user")
    .map(messageText)
    .join("\n"),
  tools: messages
    .filter(message => message.role === "tool")
    .map(messageText)
    .join("\n"),
})

const primitiveIsGrounded = (value: unknown, evidence: string) => {
  if (typeof value === "number") {
    const escaped = String(value).replace(".", "\\.")
    return new RegExp(`(^|[^0-9.])${escaped}([^0-9.]|$)`).test(evidence)
  }
  if (typeof value === "string") {
    return evidence.includes(value.toLocaleLowerCase())
  }
  if (typeof value === "boolean") {
    return evidence.includes(String(value))
  }
  return value === null && evidence.includes("null")
}

const isInternalReference = (path: string[]) =>
  /(^|[_\s])(id|rev|key|identifier)$/i.test(path.at(-1) ?? "") ||
  /(Id|ID|Rev|Key)$/.test(path.at(-1) ?? "")

const groundedArguments = (
  value: unknown,
  evidence: ReturnType<typeof evidenceText>,
  path: string[] = []
): unknown => {
  if (Array.isArray(value)) {
    return value
      .map(item => groundedArguments(item, evidence, path))
      .filter(item => item !== undefined)
  }
  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value).flatMap(([key, child]) => {
        const grounded = groundedArguments(child, evidence, [...path, key])
        return grounded === undefined ? [] : [[key, grounded]]
      })
    )
  }
  const source = isInternalReference(path)
    ? `${evidence.requester}\n${evidence.tools}`
    : evidence.requester
  return primitiveIsGrounded(value, source) ? value : undefined
}

interface ValidationIssue {
  path?: Array<PropertyKey>
  message?: string
  values?: unknown[]
  options?: unknown[]
}

const validationIssues = (error: unknown): ValidationIssue[] => {
  if (!isRecord(error)) {
    return []
  }
  if (Array.isArray(error.issues)) {
    return error.issues as ValidationIssue[]
  }
  return validationIssues(error.cause)
}

const friendlyLabel = (path: Array<PropertyKey>) =>
  String(path.at(-1) ?? "value").replace(/([a-z])([A-Z])/g, "$1 $2")

const enumValues = (schema: unknown): unknown[] | undefined => {
  if (!isRecord(schema)) {
    return
  }
  if (Array.isArray(schema.enum)) {
    return schema.enum
  }
  if (isRecord(schema.items) && Array.isArray(schema.items.enum)) {
    return schema.items.enum
  }
  if (Array.isArray(schema.anyOf)) {
    return schema.anyOf.flatMap(option => enumValues(option) ?? [])
  }
}

const normalizeEnumValues = (value: unknown, schema: unknown): unknown => {
  if (!isRecord(schema)) {
    return value
  }
  if (typeof value === "string" && isRecord(schema.items)) {
    const option = enumValues(schema.items)?.find(
      item =>
        typeof item === "string" &&
        item.toLocaleLowerCase() === value.toLocaleLowerCase()
    )
    if (option !== undefined) {
      return [option]
    }
  }
  if (Array.isArray(value)) {
    return value.map(item => normalizeEnumValues(item, schema.items))
  }
  if (isRecord(value) && isRecord(schema.properties)) {
    const properties = schema.properties
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [
        key,
        normalizeEnumValues(child, properties[key]),
      ])
    )
  }
  if (typeof value !== "string") {
    return value
  }
  return (
    enumValues(schema)?.find(
      option =>
        typeof option === "string" &&
        option.toLocaleLowerCase() === value.toLocaleLowerCase()
    ) ?? value
  )
}

const normalizeInputEnumValues = async (
  input: unknown,
  inputSchema: FlexibleSchema
) => normalizeEnumValues(input, await asSchema(inputSchema).jsonSchema)

const schemaOptionsAtPath = async (
  inputSchema: FlexibleSchema,
  path: Array<PropertyKey>
) => {
  let current: unknown = await asSchema(inputSchema).jsonSchema
  for (const segment of path) {
    if (!isRecord(current)) {
      return
    }
    if (typeof segment === "number") {
      current = current.items
      continue
    }
    if (!isRecord(current.properties)) {
      return
    }
    current = current.properties[String(segment)]
  }
  return enumValues(current)
}

const buildClarificationMessage = async (
  error: unknown,
  inputSchema: FlexibleSchema
) => {
  const issue = validationIssues(error)[0]
  const field = friendlyLabel(issue?.path ?? [])
  const options =
    issue?.values ??
    issue?.options ??
    (await schemaOptionsAtPath(inputSchema, issue?.path ?? []))
  const question = `What ${field} should I use?`
  return options?.length
    ? `${question}\nChoose one of: ${options.map(String).join(", ")}.`
    : question
}

const displayEntries = (value: unknown, prefix = ""): string[] => {
  if (!isRecord(value)) {
    return [`- ${prefix || "Value"}: ${JSON.stringify(value)}`]
  }
  return Object.entries(value).flatMap(([key, child]) => {
    if (!prefix && key === "data" && isRecord(child)) {
      return displayEntries(child)
    }
    const label = prefix ? `${prefix} · ${key}` : key
    if (isRecord(child)) {
      return displayEntries(child, label)
    }
    const rendered = Array.isArray(child)
      ? child.map(String).join(", ")
      : String(child)
    return [`- ${label}: ${rendered}`]
  })
}

const actionDescription = (readableName?: string, toolName?: string) =>
  (() => {
    const value = readableName ?? toolName ?? "perform this action"
    const [source, action] = value.split(".")
    if (action === "create_row") {
      return `create a new entry in ${source}`
    }
    if (action === "update_row") {
      return `update the entry in ${source}`
    }
    if (action === "delete_row") {
      return `delete the entry from ${source}`
    }
    return value.replace(/[._-]+/g, " ").trim()
  })()

export const buildConfirmationMessage = ({
  readableName,
  toolName,
  arguments: args,
}: {
  readableName?: string
  toolName: string
  arguments: unknown
}) =>
  [
    `Please confirm that you want me to ${actionDescription(readableName, toolName)}:`,
    "",
    ...displayEntries(args),
    "",
    "Should I go ahead?",
  ].join("\n")

const confirmationBase = ({
  context,
  toolName,
  readableName,
  sourceId,
  toolCallId,
  partialArguments,
}: {
  context: RequesterValidationContext
  toolName: string
  readableName?: string
  sourceId?: string
  toolCallId: string
  partialArguments: unknown
}): Omit<RequesterActionContext, "createdAt" | "updatedAt" | "status"> => ({
  agentId: context.agentId,
  operationId: context.operationId,
  conversationId: context.conversationId,
  requestId: context.getRequestId?.(),
  requesterId: context.requesterId,
  requesterRole: context.requesterRole,
  channel: context.channel?.provider,
  externalUserId: context.channel?.externalUserId,
  externalConversationId:
    context.channel?.conversationId ?? context.channel?.channelId,
  toolName,
  readableName,
  sourceId,
  toolCallId,
  partialArguments,
})

export const createRequesterValidationRuntime = ({
  toolName,
  readableName,
  sourceId,
  inputSchema,
  sanitizeValidationErrors = false,
  context,
}: {
  toolName: string
  readableName?: string
  sourceId?: string
  inputSchema: FlexibleSchema
  sanitizeValidationErrors?: boolean
  context: RequesterValidationContext
}): RequesterValidationRuntime => ({
  intercept: async (input, { toolCallId, messages }) =>
    withRequesterActionLock(context.conversationId, async () => {
      const active = await getActiveRequesterAction(context.conversationId)
      if (
        active &&
        (active.toolName !== toolName || active.status !== "collecting_input")
      ) {
        return {
          status:
            active.status === "collecting_input"
              ? ToolValidationResultStatus.NEEDS_INPUT
              : ToolValidationResultStatus.PENDING,
          message:
            active.validationMessage ??
            "Please finish or cancel the pending action before starting another one.",
        }
      }
      const groundedInput = await normalizeInputEnumValues(
        groundedArguments(input, evidenceText(messages)),
        inputSchema
      )
      const merged = mergeArguments(
        active?.toolName === toolName ? active.partialArguments : undefined,
        groundedInput
      )
      const validation = await safeValidateTypes({
        value: merged,
        schema: inputSchema,
      })
      const base = confirmationBase({
        context,
        toolName,
        readableName,
        sourceId,
        toolCallId,
        partialArguments: merged,
      })
      if (!validation.success) {
        const message = sanitizeValidationErrors
          ? "I couldn't validate those details. Please check the information and try again."
          : await buildClarificationMessage(validation.error, inputSchema)
        await saveRequesterAction({
          ...base,
          status: "collecting_input",
          validationMessage: message,
        })
        return {
          status: ToolValidationResultStatus.NEEDS_INPUT,
          message,
        }
      }

      const message = buildConfirmationMessage({
        readableName,
        toolName,
        arguments: validation.value,
      })
      await saveRequesterAction({
        ...base,
        partialArguments: validation.value,
        confirmedArguments: validation.value,
        status: "awaiting_confirmation",
        validationMessage: message,
      })
      return {
        status: ToolValidationResultStatus.PENDING,
        message,
        arguments: validation.value,
      }
    }),
})
