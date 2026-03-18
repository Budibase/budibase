export function isEnvironmentVariableKey(str: unknown) {
  return /^{{\s*env\.([^\s]+)\s*}}$/.test(String(str))
}
