export const ApiKeyAuth = {
  type: "apiKey",
  in: "header",
  name: "x-budibase-api-key",
  description:
    "A personal API key using the configured RBAC settings of its user, or a service API key using its configured access level and workspace scope.",
}
