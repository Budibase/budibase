import { ACCOUNT_PORTAL_PATHS, BUILDER_URLS } from "../constants/urls"

type LiteralString = string & {}

const hasOwn = <T extends Record<string, string>>(obj: T, key: string) =>
  Object.prototype.hasOwnProperty.call(obj, key)

const normalizePath = (path?: string) => {
  if (!path) {
    return ""
  }
  return path.startsWith("/") ? path : `/${path}`
}

const normalizeBase = (base?: string | null) => {
  if (!base) {
    return ""
  }
  return base.endsWith("/") ? base.slice(0, -1) : base
}

const joinBaseAndPath = (base?: string | null, path?: string) => {
  const sanitizedPath = normalizePath(path)
  if (!base) {
    return sanitizedPath
  }
  const sanitizedBase = normalizeBase(base)
  if (!sanitizedPath) {
    return sanitizedBase
  }
  return `${sanitizedBase}${sanitizedPath}`
}

export const buildAccountPortalUrl = <
  T extends LiteralString | keyof typeof ACCOUNT_PORTAL_PATHS,
>(
  accountPortalUrl?: string | null,
  path?: T
) => {
  const resolvedPath =
    path == null
      ? ""
      : hasOwn(ACCOUNT_PORTAL_PATHS, path)
        ? ACCOUNT_PORTAL_PATHS[path as keyof typeof ACCOUNT_PORTAL_PATHS]
        : (path as LiteralString)
  return joinBaseAndPath(accountPortalUrl, resolvedPath)
}

export const buildBuilderUrl = <
  T extends LiteralString | keyof typeof BUILDER_URLS,
>(
  builderBaseUrl?: string | null,
  path?: T
) => {
  const resolvedPath =
    path == null
      ? ""
      : hasOwn(BUILDER_URLS, path)
        ? BUILDER_URLS[path as keyof typeof BUILDER_URLS]
        : (path as LiteralString)
  return joinBaseAndPath(builderBaseUrl, resolvedPath)
}

export const urlHelpers = {
  buildAccountPortalUrl,
  buildBuilderUrl,
}

export default urlHelpers
