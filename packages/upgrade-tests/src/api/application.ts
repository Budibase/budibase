import FormData from "form-data"
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
    const form = new FormData()
    
    // Set content type explicitly for tar.gz files
    const fileStream = fs.createReadStream(filePath)
    const options = {
      filename: filePath.split('/').pop(),
      contentType: 'application/gzip'
    }
    form.append("fileToImport", fileStream, options)
    
    // If no name provided, extract from filename
    if (!name) {
      const filename = filePath.split('/').pop() || 'imported-app'
      name = filename.replace('.tar.gz', '').replace(/-/g, ' ')
    }
    
    form.append("name", name)
    form.append("useTemplate", "true")

    const response = await this.client.post("/api/applications", form, {
      headers: {
        ...form.getHeaders(),
      },
    })

    return response.data.appId || response.data._id
  }
}