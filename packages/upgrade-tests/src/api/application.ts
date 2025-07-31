import * as fs from "fs"
import { App } from "@budibase/types"
import type { BudibaseClient } from "./BudibaseClient"

export class ApplicationAPI {
  constructor(private client: BudibaseClient) {}

  async fetch(): Promise<App[]> {
    const { data } = await this.client.get<App[]>(
      "/api/applications?status=all"
    )
    return data
  }

  async get(appId: string): Promise<App> {
    const { data } = await this.client.get<App>(`/api/applications/${appId}`)
    return data
  }

  async import(filePath: string, name: string): Promise<string> {
    // Read the file as a buffer
    const fileBuffer = fs.readFileSync(filePath)
    const filename = filePath.split("/").pop()
    if (!filename) {
      throw new Error(`Could not determine filename from path: ${filePath}`)
    }

    // Create native FormData
    const form = new FormData()

    // Create a Blob from the buffer with the correct type
    const blob = new Blob([fileBuffer], { type: "application/gzip" })

    // Append the file
    form.append("fileToImport", blob, filename)
    form.append("name", name)
    form.append("useTemplate", "true")

    // Send the form - native FormData will set the correct headers automatically
    const { data } = await this.client.post<App>("/api/applications", form)
    return data.appId || data._id!
  }
}
