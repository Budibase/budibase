import ts from "typescript"
import type { FunctionQueryCapability } from "@budibase/types"
import { generateFunctionDeclarations } from "./declarations"

const getDiagnostics = (files: Map<string, string>) => {
  const options: ts.CompilerOptions = {
    module: ts.ModuleKind.CommonJS,
    noEmit: true,
    strict: true,
    target: ts.ScriptTarget.ES2020,
    types: [],
  }
  const host = ts.createCompilerHost(options)
  const getSourceFile = host.getSourceFile.bind(host)

  host.fileExists = fileName =>
    files.has(fileName) || ts.sys.fileExists(fileName)
  host.readFile = fileName => files.get(fileName) || ts.sys.readFile(fileName)
  host.getSourceFile = (
    fileName,
    languageVersion,
    onError,
    shouldCreateNewSourceFile
  ) => {
    const source = files.get(fileName)
    if (source !== undefined) {
      return ts.createSourceFile(fileName, source, languageVersion)
    }
    return getSourceFile(
      fileName,
      languageVersion,
      onError,
      shouldCreateNewSourceFile
    )
  }

  const program = ts.createProgram([...files.keys()], options, host)
  return ts.getPreEmitDiagnostics(program)
}

describe("generateFunctionDeclarations", () => {
  it("generates valid declarations for parameter names requiring quoting", () => {
    const capabilities: FunctionQueryCapability[] = [
      {
        capabilityId: "capability_1",
        queryId: "query_1",
        datasourceAlias: "DataWarehouse",
        queryAlias: "findRooms",
        parameterNames: ['building "name"'],
      },
    ]
    const declarations = generateFunctionDeclarations(capabilities)
    const usage = `import { queries } from "@budibase/functions"

queries.DataWarehouse.findRooms({
  'building "name"': null,
})
`

    expect(
      getDiagnostics(
        new Map([
          ["functions.d.ts", declarations],
          ["usage.ts", usage],
        ])
      )
    ).toEqual([])
  })
})
