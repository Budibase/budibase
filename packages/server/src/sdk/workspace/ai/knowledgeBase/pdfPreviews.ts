import { context, objectStore } from "@budibase/backend-core"
import { KnowledgeBaseFilePreview } from "@budibase/types"
import { promises as fs } from "fs"
import os from "os"
import path from "path"
import { promisify } from "util"
import { execFile } from "child_process"
import { ObjectStoreBuckets } from "../../../../constants"

const execFileAsync = promisify(execFile)

const MAX_PREVIEW_PAGES = 80
const MAX_PAGE_TEXT_LENGTH = 4000
const PREVIEW_WIDTH_PX = 360

const buildPreviewObjectStoreKey = ({
  workspaceId,
  knowledgeBaseId,
  fileId,
  page,
}: {
  workspaceId: string
  knowledgeBaseId: string
  fileId: string
  page: number
}) =>
  `${workspaceId}/ai/knowledge-bases/${knowledgeBaseId}/previews/${fileId}/page-${page}.png`

export const isPdfFile = ({
  filename,
  mimetype,
}: {
  filename?: string
  mimetype?: string
}) => {
  const extension = filename?.trim().toLowerCase().split(".").pop() || ""
  const type = mimetype?.trim().toLowerCase() || ""
  return extension === "pdf" || type === "application/pdf"
}

const getPageFromFilename = (value: string) => {
  const matched = value.match(/-(\d+)\.png$/)
  if (!matched) {
    return undefined
  }
  const parsed = Number(matched[1])
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return undefined
  }
  return parsed
}

export const generatePdfPreviews = async ({
  knowledgeBaseId,
  fileId,
  filename,
  buffer,
}: {
  knowledgeBaseId: string
  fileId: string
  filename: string
  buffer: Buffer
}): Promise<KnowledgeBaseFilePreview[]> => {
  const workspaceId = context.getOrThrowWorkspaceId()
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "bb-kb-preview-"))
  const pdfPath = path.join(tmpDir, filename || "input.pdf")
  const outputPrefix = path.join(tmpDir, "page")

  try {
    await fs.writeFile(pdfPath, buffer)
    const { stdout: extractedText } = await execFileAsync("pdftotext", [
      "-f",
      "1",
      "-l",
      String(MAX_PREVIEW_PAGES),
      "-layout",
      pdfPath,
      "-",
    ])
    const pageTexts = extractedText
      .split("\f")
      .map(page => page.replace(/\s+/g, " ").trim().slice(0, MAX_PAGE_TEXT_LENGTH))

    await execFileAsync("pdftoppm", [
      "-f",
      "1",
      "-l",
      String(MAX_PREVIEW_PAGES),
      "-scale-to-x",
      String(PREVIEW_WIDTH_PX),
      "-scale-to-y",
      "-1",
      "-png",
      pdfPath,
      outputPrefix,
    ])

    const files = await fs.readdir(tmpDir)
    const pageFiles = files
      .map(file => ({ file, page: getPageFromFilename(file) }))
      .filter((entry): entry is { file: string; page: number } => !!entry.page)
      .sort((a, b) => a.page - b.page)

    const previews: KnowledgeBaseFilePreview[] = []
    for (const pageFile of pageFiles) {
      const fileBuffer = await fs.readFile(path.join(tmpDir, pageFile.file))
      const objectStoreKey = buildPreviewObjectStoreKey({
        workspaceId,
        knowledgeBaseId,
        fileId,
        page: pageFile.page,
      })
      await objectStore.upload({
        bucket: ObjectStoreBuckets.APPS,
        filename: objectStoreKey,
        body: fileBuffer,
        type: "image/png",
      })
      previews.push({
        page: pageFile.page,
        objectStoreKey,
        textExcerpt: pageTexts[pageFile.page - 1] || undefined,
      })
    }

    return previews
  } catch (error) {
    console.error("Failed to generate PDF previews", {
      knowledgeBaseId,
      fileId,
      filename,
      error,
    })
    return []
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true })
  }
}
