import { context, roles } from "@budibase/backend-core"
import { findHBSBlocks } from "@budibase/string-templates"
import {
  type Component,
  DocumentType,
  type GetSignedUploadUrlRequest,
  type GetSignedUploadUrlResponse,
  type Layout,
  type Screen,
  type UserBindings,
  type UserCtx,
} from "@budibase/types"
import { getUserFullName } from "../../../utilities/users"

export const MAX_S3_KEY_BYTES = 1024

const destinationSettings = new Set(["datasourceId", "bucket", "key"])
const bindingSegment = String.raw`(?:\[[^\[\]]+\]|[\w$]+)`
const bindingPath = new RegExp(`^${bindingSegment}(?:\\.${bindingSegment})*$`)

const findComponent = ({
  component,
  componentId,
}: {
  component: Component
  componentId: string
}): Component | undefined => {
  if (component._id === componentId) {
    return component
  }
  for (const child of component._children || []) {
    const match = findComponent({ component: child, componentId })
    if (match) {
      return match
    }
  }
}

export const matchesConfiguredKey = ({
  template,
  key,
  user,
}: {
  template: string
  key: string
  user: UserBindings
}): boolean => {
  if (
    template.length > 8192 ||
    Buffer.byteLength(key, "utf8") > MAX_S3_KEY_BYTES
  ) {
    return false
  }
  if (key.split("/").some(segment => segment === "." || segment === "..")) {
    return false
  }

  const blocks = findHBSBlocks(template)
  const tokens: (string | null)[] = []
  const userValues = new Map(Object.entries(user))
  let cursor = 0
  for (const block of blocks) {
    const blockIndex = template.indexOf(block, cursor)
    tokens.push(...template.slice(cursor, blockIndex))
    cursor = blockIndex + block.length
    const expression = block.replace(/^\{\{\{?|\}\}\}?$/g, "").trim()
    if (!bindingPath.test(expression)) {
      return false
    }
    const segments = expression.match(/\[[^[\]]+\]|[\w$]+/g) || []
    const path = segments.map(segment => segment.replace(/^\[|\]$/g, ""))
    if (path[0] === "this") {
      path.shift()
    }
    if (path[0] === "user" || path[0] === "Current User") {
      const value = userValues.get(path[1])
      if (
        path.length !== 2 ||
        typeof value !== "string" ||
        !value ||
        Buffer.byteLength(value, "utf8") > MAX_S3_KEY_BYTES ||
        value.includes("/")
      ) {
        return false
      }
      tokens.push(...value)
    } else {
      // Browser bindings may choose a filename, never a directory or identity.
      if (template.slice(cursor).includes("/")) {
        return false
      }
      tokens.push(null)
    }
    if (tokens.length > key.length) {
      return false
    }
  }
  tokens.push(...template.slice(cursor))

  // Track reachable positions instead of backtracking over adjacent bindings.
  const characters = [...key]
  if (tokens.length > characters.length) {
    return false
  }
  let positions = new Uint8Array(characters.length + 1)
  positions[0] = 1
  for (const token of tokens) {
    const next = new Uint8Array(characters.length + 1)
    for (let index = 1; index <= characters.length; index++) {
      if (token === null) {
        next[index] =
          characters[index - 1] !== "/" &&
          (positions[index - 1] || next[index - 1])
            ? 1
            : 0
      } else if (characters[index - 1] === token) {
        next[index] = positions[index - 1]
      }
    }
    positions = next
  }
  return positions[characters.length] === 1
}

interface S3UploadAuthorization extends GetSignedUploadUrlRequest {
  ctx: UserCtx<GetSignedUploadUrlRequest, GetSignedUploadUrlResponse>
  datasourceId: string
}

export const authorizeS3Upload = async ({
  ctx,
  datasourceId,
  bucket,
  componentId,
  key,
  screenId,
}: S3UploadAuthorization): Promise<void> => {
  if (!screenId.startsWith(`${DocumentType.SCREEN}_`)) {
    ctx.throw(403, "The S3 upload component is not accessible")
  }
  const db = context.getWorkspaceDB()
  const screen = await db.tryGet<Screen>(screenId)
  const accessibleScreen =
    screen?.routing && screen.props
      ? await new roles.AccessController().checkScreenAccess(
          screen,
          ctx.roleId || roles.BUILTIN_ROLE_IDS.PUBLIC
        )
      : undefined
  if (!accessibleScreen) {
    ctx.throw(403, "The S3 upload component is not accessible")
    return
  }

  let component = findComponent({
    component: accessibleScreen.props,
    componentId,
  })
  if (
    !component &&
    accessibleScreen.layoutId?.startsWith(`${DocumentType.LAYOUT}_`)
  ) {
    const layout = await db.tryGet<Layout>(accessibleScreen.layoutId)
    if (layout?.props) {
      component = findComponent({ component: layout.props, componentId })
    }
  }

  const changesDestination = component?._conditions?.some(
    condition =>
      !condition.disabled &&
      condition.action === "update" &&
      condition.setting &&
      destinationSettings.has(condition.setting)
  )
  if (changesDestination) {
    ctx.throw(403, "S3 upload destinations cannot depend on UI conditions")
  }

  const isConfiguredUpload =
    component?._component === "@budibase/standard-components/s3upload" &&
    component.datasourceId === datasourceId &&
    component.bucket === bucket &&
    typeof component.key === "string" &&
    matchesConfiguredKey({
      template: component.key,
      key,
      user: {
        _id: ctx.user._id,
        globalId: ctx.user.globalId,
        userId: ctx.user.userId,
        email: ctx.user.email,
        firstName: ctx.user.firstName,
        lastName: ctx.user.lastName,
        fullName: getUserFullName(ctx.user),
        roleId: ctx.roleId,
      },
    })
  if (!isConfiguredUpload) {
    ctx.throw(403, "The S3 upload destination is not configured")
  }
}
