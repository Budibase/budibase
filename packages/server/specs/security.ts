export const ApiKeyAuth = {
  type: "apiKey",
  in: "header",
  name: "x-budibase-api-key",
  description:
    "Your individual API key, this will provide access based on the configured RBAC settings of your user.",
}
