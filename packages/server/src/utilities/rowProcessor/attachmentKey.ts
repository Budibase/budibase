import { context, db } from "@budibase/backend-core"

export const isWorkspaceAttachmentKey = (key: string): boolean => {
  const workspaceId = context.getWorkspaceId()
  if (!workspaceId) {
    return false
  }
  const prefix = `${db.getProdWorkspaceID(workspaceId)}/attachments/`
  if (!key.startsWith(prefix)) {
    return false
  }

  const filename = key.slice(prefix.length)
  return (
    filename.length > 0 &&
    filename !== "." &&
    filename !== ".." &&
    !filename.includes("/") &&
    !filename.includes("\\") &&
    !/%2e|%2f|%5c/i.test(filename)
  )
}
