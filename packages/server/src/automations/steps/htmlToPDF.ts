import puppeteer from "puppeteer"
import fs from "fs"
import { objectStore } from "@budibase/backend-core"
import { ObjectStoreBuckets } from "../../constants/index"

import {
  AutomationActionStepId,
  AutomationStepSchema,
  AutomationStepInput,
  AutomationStepType,
  AutomationIOType,
} from "@budibase/types"

const uuid = require("uuid")

export const definition: AutomationStepSchema = {
  name: "HtmlToPDF",
  tagline: "HtmlToPDF",
  icon: "FileJson",
  description: "Generate a PDF file from HTML/Text",
  type: AutomationStepType.ACTION,
  internal: true,
  features: {},
  stepId: AutomationActionStepId.HTML_TO_PDF,
  inputs: {
    prompt: "",
  },
  schema: {
    inputs: {
      properties: {
        outputDir: {
          type: AutomationIOType.STRING,
          title: "Output Directory",
        },
        fileName: {
          type: AutomationIOType.STRING,
          title: "Filename (No Extension)",
        },
        template: {
          type: AutomationIOType.STRING,
          title: "HTML Template",
        },
      },
      required: ["outputDir", "fileName", "template"],
    },
    outputs: {
      properties: {
        success: {
          type: AutomationIOType.BOOLEAN,
          description: "Whether the action was successful",
        },
        filePath: {
          type: AutomationIOType.STRING,
          description: "PDF file destination path",
        },
      },
      required: ["success", "filePath"],
    },
  },
}

export async function run({ inputs, context, appId }: AutomationStepInput) {
  try {
    fs.access(inputs.outputDir, function (error) {
      if (error) {
        return {
          success: false,
          response: `"Output directory does not exist."`,
        }
      } else {
        console.log("Directory exists.")
      }
    })
  } catch (e: any) {
    return {
      success: false,
      response: `IO Error: ${e.message}`,
    }
  }

  const browser = await puppeteer.launch({ headless: "new" })
  const page = await browser.newPage()
  const htmlDoc = `<!DOCTYPE html> <html> <body> ${inputs.template} </body> </html>`

  const fileName = `${new Date().getTime()}_${inputs.fileName}`
  const filePath = `${inputs.outputDir}/${fileName}.pdf`

  // waitUntil: 'networkidle0' allow dynamic fetch.
  // Parse content into page.
  try {
    await page.setContent(htmlDoc, { waitUntil: "networkidle2" })
    await page.addStyleTag({
      content:
        'body {font-family: "Source Sans Pro",Helvetica,Arial,sans-serif;}',
    })
  } catch (e: any) {
    console.log(new Error(`HTML source "${e}" is unkown.`))
    await browser.close()
    return {
      success: false,
      response: `${e.message}`,
    }
  }

  try {
    // Download the PDF
    await page.pdf({
      path: `${filePath}`,
      margin: { top: "100px", right: "50px", bottom: "100px", left: "50px" },
      printBackground: true,
      format: "A4",
    })
  } catch (e: any) {
    await browser.close()
    return {
      success: false,
      response: `${e.message}`,
    }
  }

  await browser.close()

  let stats

  try {
    stats = fs.statSync(filePath)
  } catch (e: any) {
    return {
      success: false,
      response: `${e.message}`,
    }
  }

  const fileExtension = "pdf"
  const processedFileName = `${uuid.v4()}.${fileExtension}`

  //Upload file to store.
  const response = await objectStore.upload({
    bucket: ObjectStoreBuckets.APPS,
    metadata: undefined,
    filename: `${appId}/attachments/${processedFileName}`,
    path: filePath,
    type: "application/pdf",
  })

  const storeSync = {
    size: stats.size,
    name: `${fileName}.pdf`,
    url: objectStore.getAppFileUrl(`${appId}/attachments/${processedFileName}`),
    extension: "pdf",
    key: response.Key,
    appId,
  }

  return {
    success: true,
    response: { filePath, storeSync },
  }
}
