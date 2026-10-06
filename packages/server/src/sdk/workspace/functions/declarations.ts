import { createHash } from "crypto"
import type { FunctionInputDefinition } from "@budibase/types"

export { generateFunctionDeclarations } from "@budibase/shared-core"

export const hashFunctionDeclarations = ({
  declarations,
  inputSchema = [],
}: {
  declarations: string
  inputSchema?: readonly FunctionInputDefinition[]
}) => {
  const hash = createHash("sha256").update(declarations)
  if (inputSchema.length) {
    hash.update(
      JSON.stringify(
        [...inputSchema]
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(({ name, type }) => ({
            name,
            type,
          }))
      )
    )
  }
  return hash.digest("hex")
}
