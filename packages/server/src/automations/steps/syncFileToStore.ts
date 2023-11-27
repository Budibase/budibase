import fs from "fs"

import { objectStore, db as dbCore } from "@budibase/backend-core"
import { ObjectStoreBuckets } from "../../constants/index"

import {
  AutomationActionStepId,
  AutomationStepSchema,
  AutomationStepInput,
  AutomationStepType,
  AutomationIOType,
} from "@budibase/types"

enum Bucket {
  GLOBAL = "global",
  APP = "app_global",
  APP_ATTACHMENTS = "app_attachments",
}

export const definition: AutomationStepSchema = {
  name: "Sync To Store",
  tagline: "Sync files to object store",
  icon: "Box",
  description: "Move local files into the Busibase store",
  type: AutomationStepType.ACTION,
  internal: true,
  features: {},
  stepId: AutomationActionStepId.SYNC_TO_STORE,
  inputs: {
    prompt: "",
  },
  schema: {
    inputs: {
      properties: {
        sourceDir: {
          type: AutomationIOType.STRING,
          title: "Source Directory",
        },
        fileName: {
          type: AutomationIOType.STRING,
          title: "File name",
        },
        bucket: {
          type: AutomationIOType.STRING,
          title: "Bucket",
          enum: Object.values(Bucket),
        },
      },
      required: ["sourceDir", "fileName", "bucket"],
    },
    outputs: {
      properties: {
        success: {
          type: AutomationIOType.BOOLEAN,
          description: "Whether the action was successful",
        },
        filePath: {
          type: AutomationIOType.STRING,
          description: "Sync file name",
        },
        storeSync: {
          type: AutomationIOType.OBJECT,
          description: "Store sync response",
        },
      },
      required: ["success", "fileName", "storeSync"],
    },
  },
}

export async function run({ inputs, context, appId }: AutomationStepInput) {
  const sourceFileDirectory = inputs.sourceDir
  const sourceFilePath = `${sourceFileDirectory}/${inputs.fileName}`

  let stats
  try {
    stats = fs.statSync(sourceFilePath)
  } catch (e: any) {
    return {
      success: false,
      response: `IO Error: ${e.message}`,
    }
  }

  // Enforce file limit.
  // Mime detection
  // const stream = fs.createReadStream(sourceFilePath)
  const sourceType = "demo" // await fileTypeFromFilex(sourceFilePath)
  const prodId = dbCore.getProdAppID(appId)

  // Upload file to store.
  try {
    let destBucket
    let fileKey

    if (inputs.bucket === Bucket.GLOBAL) {
      destBucket = ObjectStoreBuckets.GLOBAL
    } else if (
      inputs.bucket === Bucket.APP_ATTACHMENTS ||
      inputs.bucket === Bucket.APP
    ) {
      destBucket = ObjectStoreBuckets.APPS
    }

    if (inputs.bucket === Bucket.APP_ATTACHMENTS) {
      fileKey = `${prodId}/attachments/${inputs.fileName}`
    } else if (inputs.bucket === Bucket.APP) {
      fileKey = `${prodId}/${inputs.fileName}`
    } else {
      fileKey = inputs.fileName
    }

    if (!destBucket) {
      return {
        success: false,
        response: `Invalid bucket`,
      }
    }

    const response = await objectStore.upload({
      bucket: destBucket,
      metadata: {
        name: inputs.fileName,
        prodId,
        timestamp: new Date().toISOString(),
      },
      filename: fileKey,
      path: sourceFilePath,
      type: "unknown", //sourceType?.mime,
    })

    // Sample response from above
    // {
    //   service: "@budibase/server",
    //   tenantId: "default",
    //   appId: "app_dev_def45a0c101f429194b0d7f471950c42",
    //   identityId: "us_193e4d305b8f4d3a94ddcb9a5bd02887",
    //   identityType: "user",
    //   correlationId: "88e36a0c-8d62-4dd6-a3c8-a77c1ce2cacb",
    //   data: {
    //     "0": {
    //       ETag: '"c3771be6338e81332878987eb412bc75"',
    //       Location:
    //         "http://localhost:4004/global/1688720732575_4_Leah-Freeman.pdf",
    //       key: "1688720732575_4_Leah-Freeman.pdf",
    //       Key: "1688720732575_4_Leah-Freeman.pdf",
    //       Bucket: "global",
    //     },
    //   },
    // }

    /*
      What an actual attachment looks like
      [{
        "size": 6769,
        "name": "testUser2 (1).jpeg",
        "extension": "jpeg",
        "key": "app_def45a0c101f429194b0d7f471950c42/attachments/d5479365-af66-4706-860f-02bc57fbc4a8.jpeg"
      }]
    */

    console.log("UPLOAD REPSPONSE", response)

    const storeSync = {
      size: stats.size,
      name: inputs.fileName,
      extension: "unknown", //sourceType?.ext,
      source: sourceFilePath,
      key: response.Key,
      url: objectStore.getAppFileUrl(`${destBucket}/${inputs.fileName}`),
      appId: prodId,
    }

    return {
      success: true,
      filePath: sourceFilePath,
      storeSync,
    }
  } catch (e: any) {
    return {
      success: false,
      response: `Store Error: ${e.message}`,
    }
  }
}
