import { HTTPError, context, db as dbCore } from "@budibase/backend-core"
import {
  AgentFileStatus,
  AgentFileUploadResponse,
  FetchAgentFilesResponse,
  UserCtx,
} from "@budibase/types"
import { readFile, unlink } from "node:fs/promises"
import sdk from "../../../sdk"
import { ingestAgentFile } from "../../../sdk/workspace/ai/rag/files"

const normalizeUpload = (fileInput: any) => {
  if (!fileInput) {
    return undefined
  }
  if (Array.isArray(fileInput)) {
    return fileInput[0]
  }
  return fileInput
}

const unlinkSafe = async (path?: string) => {
  if (!path) {
    return
  }
  try {
    await unlink(path)
  } catch (error) {
    console.log("Failed to delete temp file", error)
  }
}

export async function fetchAgentFiles(
  ctx: UserCtx<void, FetchAgentFilesResponse>
) {
  const agentId = ctx.params.agentId
  await sdk.ai.agents.getOrThrow(agentId)
  const files = await sdk.ai.agents.listAgentFiles(agentId)
  ctx.body = { files }
  ctx.status = 200
}

async function getDevRagVersion(agentId: string) {
  let prodVersion = 0
  try {
    const prodWorkspaceId = dbCore.getProdWorkspaceID(
      context.getOrThrowWorkspaceId()
    )
    await context.doInWorkspaceContext(prodWorkspaceId, async () => {
      const prodAgent = await sdk.ai.agents.getOrThrow(agentId)
      prodVersion = prodAgent.ragVersion ?? 0
    })
  } catch (error) {
    // ignore if prod workspace/agent does not exist yet
  }

  return prodVersion + 1
}

export async function uploadAgentFile(
  ctx: UserCtx<void, AgentFileUploadResponse>
) {
  const agentId = ctx.params.agentId
  const agent = await sdk.ai.agents.getOrThrow(agentId)

  const ragVersion = await getDevRagVersion(agentId)
  const updatedAgent =
    agent.ragVersion === ragVersion
      ? agent
      : await sdk.ai.agents.update({
          ...agent,
          ragVersion: ragVersion,
        })
  const upload = normalizeUpload(
    ctx.request.files?.file ||
      ctx.request.files?.agentFile ||
      ctx.request.files?.upload
  )

  if (!upload) {
    throw new HTTPError("file is required", 400)
  }
  const filePath = upload.filepath || upload.path
  if (!filePath) {
    throw new HTTPError("Invalid upload payload", 400)
  }

  const filename =
    upload.originalFilename || upload.name || "agent-uploaded-document"
  const mimetype = upload.mimetype || upload.type
  const fileSize =
    typeof upload.size === "number"
      ? upload.size
      : Number(upload.size) || undefined

  const buffer = await readFile(filePath)
  const agentFile = await sdk.ai.agents.createAgentFile({
    agentId: agent._id!,
    filename,
    mimetype,
    size: fileSize ?? buffer.byteLength,
    uploadedBy: ctx.user?._id!,
    createdRagVersion: ragVersion,
  })

  try {
    const result = await ingestAgentFile(updatedAgent, agentFile, buffer)
    agentFile.status = AgentFileStatus.READY
    agentFile.chunkCount = result.total
    agentFile.processedAt = new Date().toISOString()
    agentFile.errorMessage = undefined
    const updated = await sdk.ai.agents.updateAgentFile(agentFile)
    ctx.body = { file: updated }
    ctx.status = 201
  } catch (error: any) {
    console.error("Failed to ingest agent file", error)
    agentFile.status = AgentFileStatus.FAILED
    agentFile.errorMessage = error?.message || "Failed to process uploaded file"
    agentFile.chunkCount = 0
    await sdk.ai.agents.updateAgentFile(agentFile)
    throw new HTTPError(agentFile.errorMessage || "", 400)
  } finally {
    await unlinkSafe(filePath)
  }
}

export async function deleteAgentFile(
  ctx: UserCtx<void, { deleted: true }, { agentId: string; fileId: string }>
) {
  const { agentId, fileId } = ctx.params
  const agent = await sdk.ai.agents.getOrThrow(agentId)
  const file = await sdk.ai.agents.getAgentFileOrThrow(fileId)
  if (file.agentId !== agentId) {
    throw new HTTPError("File does not belong to this agent", 404)
  }
  await sdk.ai.agents.removeAgentFile(agent, file)
  ctx.body = { deleted: true }
  ctx.status = 200
}
