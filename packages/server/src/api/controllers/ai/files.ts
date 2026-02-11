import { readFile, unlink } from "node:fs/promises"
import { HTTPError } from "@budibase/backend-core"
import {
  AgentFileUploadResponse,
  FetchAgentFilesResponse,
  UserCtx,
} from "@budibase/types"
import sdk from "../../../sdk"

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

export async function uploadAgentFile(
  ctx: UserCtx<void, AgentFileUploadResponse, { agentId: string }>
) {
  const agentId = ctx.params.agentId
  const agent = await sdk.ai.agents.getOrThrow(agentId)

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

  try {
    const updated = await sdk.ai.agents.uploadAgentFile({
      agentId: agent._id!,
      filename,
      mimetype,
      size: fileSize ?? buffer.byteLength,
      buffer,
      uploadedBy: ctx.user?._id!,
    })
    ctx.body = { file: updated }
    ctx.status = 201
  } catch (error: any) {
    console.error("Failed to upload agent file", error)
    throw new HTTPError(
      error?.message || "Failed to process uploaded file",
      400
    )
  } finally {
    await unlinkSafe(filePath)
  }
}

export async function deleteAgentFile(
  ctx: UserCtx<void, { deleted: true }, { agentId: string; fileId: string }>
) {
  const { agentId, fileId } = ctx.params
  const file = await sdk.ai.agents.getAgentFileOrThrow(fileId)
  if (file.agentId !== agentId) {
    throw new HTTPError("File does not belong to this agent", 404)
  }
  const agent = await sdk.ai.agents.getOrThrow(agentId)
  await sdk.ai.agents.removeAgentFile(agent, file)
  ctx.body = { deleted: true }
  ctx.status = 200
}
