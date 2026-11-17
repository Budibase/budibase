import fs from "fs"
import path from "path"

const repoRoot = path.resolve(__dirname, "../../../../../../..")

const extractCredentialList = (content: string) => {
  const lines = content.split("\n")
  const startIndex = lines.findIndex(line => line.trim() === "credential_list:")
  if (startIndex === -1) {
    throw new Error("LiteLLM config does not contain credential_list")
  }

  const baseIndent = lines[startIndex].search(/\S/)
  const block = [lines[startIndex].slice(baseIndent)]

  for (const line of lines.slice(startIndex + 1)) {
    const indent = line.search(/\S/)
    if (line.trim() && indent <= baseIndent) {
      break
    }
    block.push(line.slice(baseIndent))
  }

  return block.join("\n").trim()
}

describe("LiteLLM configuration", () => {
  it("keeps Compose and Helm credentials in sync", () => {
    const composeConfig = fs.readFileSync(
      path.join(repoRoot, "hosting", "litellm_config.yaml"),
      "utf8"
    )
    const helmValues = fs.readFileSync(
      path.join(repoRoot, "charts", "budibase", "values.yaml"),
      "utf8"
    )

    expect(extractCredentialList(helmValues)).toEqual(
      extractCredentialList(composeConfig)
    )
  })
})
