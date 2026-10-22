import { HTTPError } from "@budibase/backend-core"
import type { ProjectTemplateMetadata } from "@budibase/types"
import { createHash } from "crypto"
import fs from "fs"
import fsp from "fs/promises"
import { join } from "path"
import { Transform, type TransformCallback } from "stream"
import { pipeline } from "stream/promises"
import { v4 as uuid } from "uuid"
import { budibaseTempDir } from "../../../utilities/budibaseDir"
import {
  readProjectTemplateRepositoryPath,
  resolveProjectTemplate,
} from "./templates"

const ARTIFACT_DOWNLOAD_TIMEOUT_MS = 60000

export interface DownloadedProjectTemplate {
  path: string
  template: ProjectTemplateMetadata
}

class ArtifactVerifier extends Transform {
  bytes = 0
  private readonly hash = createHash("sha256")

  constructor(private readonly expectedBytes: number) {
    super()
  }

  _transform(chunk: Buffer, _encoding: string, callback: TransformCallback) {
    this.bytes += chunk.length
    if (this.bytes > this.expectedBytes) {
      callback(
        new HTTPError("Project template artifact size does not match.", 502)
      )
      return
    }
    this.hash.update(new Uint8Array(chunk))
    callback(null, chunk)
  }

  digest() {
    return this.hash.digest("hex")
  }
}

export const downloadProjectTemplate = async (
  templateKey: string
): Promise<DownloadedProjectTemplate> => {
  const resolved = await resolveProjectTemplate(templateKey)
  const { artifact, slug, template } = resolved
  const path = join(budibaseTempDir(), uuid())
  const verifier = new ArtifactVerifier(artifact.sizeBytes)
  try {
    await readProjectTemplateRepositoryPath({
      path: `artifacts/project/${slug}/${template.version}/project.tar.gz`,
      read: async response => {
        const contentLength = response.headers.get("content-length")
        if (contentLength && Number(contentLength) !== artifact.sizeBytes) {
          throw new HTTPError(
            "Project template artifact size does not match.",
            502
          )
        }

        await pipeline(response.body, verifier, fs.createWriteStream(path))
        if (verifier.bytes !== artifact.sizeBytes) {
          throw new HTTPError(
            "Project template artifact size does not match.",
            502
          )
        }
        if (verifier.digest() !== artifact.sha256) {
          throw new HTTPError(
            "Project template artifact checksum does not match.",
            502
          )
        }
      },
      timeoutMs: ARTIFACT_DOWNLOAD_TIMEOUT_MS,
    })
  } catch (err) {
    await fsp.rm(path, { force: true }).catch(cleanupError => {
      console.log("Failed to remove downloaded Project template", cleanupError)
    })
    throw err
  }

  return { path, template }
}
