import * as fs from "fs"
import { App } from "@budibase/types"
import type { BudibaseClient } from "./BudibaseClient"

export class ApplicationAPI {
  constructor(private client: BudibaseClient) {}

  async fetch(): Promise<App[]> {
    const response = await this.client.get("/api/applications?status=all")
    return response.data
  }

  async get(appId: string): Promise<App> {
    const response = await this.client.get(`/api/applications/${appId}`)
    return response.data
  }

  async import(filePath: string, name?: string): Promise<string> {
    // Read the file as a buffer
    const fileBuffer = fs.readFileSync(filePath)
    const filename = filePath.split("/").pop() || "imported-app.tar.gz"

    // Create native FormData
    const form = new FormData()

    // Create a Blob from the buffer with the correct type
    const blob = new Blob([fileBuffer], { type: "application/gzip" })

    // Append the file
    form.append("fileToImport", blob, filename)

    // If no name provided, extract from filename
    if (!name) {
      name = filename.replace(".tar.gz", "").replace(/-/g, " ")
    }

    form.append("name", name)
    form.append("useTemplate", "true")

    // Send the form - native FormData will set the correct headers automatically
    const response = await this.client.post("/api/applications", form)

    return response.data.appId || response.data._id
  }
}
