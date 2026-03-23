import { env } from "@budibase/backend-core"
import { Environment, EnvironmentVariableValue, Feature } from "@budibase/types"
import { environmentVariables } from "../../db"
import { licensing } from "../../sdk"

type VariableMap = { [key: string]: EnvironmentVariableValue }

export function isEncryptionKeyAvailable() {
  return !!env.ENCRYPTION_KEY
}

export async function fetch(): Promise<string[]> {
  const doc = await environmentVariables.get()
  return Object.keys(doc.variables)
}

export async function fetchValues(environment: Environment) {
  const doc = await environmentVariables.get()
  const decrypted = doc.variables

  const output: { [key: string]: string } = {}
  for (let [key, value] of Object.entries(decrypted)) {
    switch (environment) {
      case Environment.DEVELOPMENT:
        output[key] = value.development
        break
      case Environment.PRODUCTION:
      default:
        output[key] = value.production
        break
    }
  }
  return output
}

async function changeValues(cb: (values: VariableMap) => VariableMap) {
  // only block access when updating values, let users fetch
  const license = await licensing.cache.getCachedLicense()
  if (!license.features.includes(Feature.ENVIRONMENT_VARIABLES)) {
    throw new Error(
      "User does not have access to environment variables feature."
    )
  }
  const doc = await environmentVariables.get()
  doc.variables = cb(doc.variables)
  await environmentVariables.update(doc)
}

export async function update(varName: string, value: EnvironmentVariableValue) {
  const checkName = isValid(varName)
  if (checkName) {
    await changeValues(values => {
      values[varName] = value
      return values
    })
  } else {
    throw new Error("Variable name has characters that are not allowed")
  }
}

export async function remove(varName: string) {
  await changeValues(values => {
    delete values[varName]
    return values
  })
}

export function isValid(str: string) {
  return /^[a-zA-Z0-9-_]+$/.test(str)
}
