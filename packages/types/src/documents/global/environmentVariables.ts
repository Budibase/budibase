import { Document } from "../document"

export interface EnvironmentVariablesDoc extends Document {
  variables: string
}

export type EnvironmentVariableValue = {
  production: string
  development: string
}

// what comes out of the "variables" when it is decrypted
export type EnvironmentVariablesDecrypted = Record<
  string,
  EnvironmentVariableValue
>

export interface EnvironmentVariablesDocDecrypted extends Document {
  variables: EnvironmentVariablesDecrypted
}
