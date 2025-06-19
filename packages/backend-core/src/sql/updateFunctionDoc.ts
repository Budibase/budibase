// @ts-nocheck

import { DesignDocuments } from "../constants"

export default function () {
  return {
    _id: DesignDocuments.UPDATE_FUNCTIONS,
    language: "javascript",
    updates: {
      preserveAuditFiles: function (doc, req) {
        const now = new Date().toISOString()
        let body = {}

        if (req.body) {
          try {
            body = JSON.parse(req.body)
          } catch (e) {
            return [null, "Invalid JSON body"]
          }
        }

        if (!doc) {
          doc = {
            _id: req.id,
          }
          doc.createdAt = now
          doc.createdVersion = body.createdVersion
        }

        // Always update updatedAt
        doc.updatedAt = now

        // Merge the rest of the fields from body into doc, excluding reserved keys
        for (let key in body) {
          if (
            key !== "_id" &&
            key !== "_rev" &&
            key !== "createdAt" &&
            key !== "createdVersion" &&
            key !== "updatedAt"
          ) {
            doc[key] = body[key]
          }
        }

        return [doc, "Updated"]
      }.toString(),
    },
  }
}
