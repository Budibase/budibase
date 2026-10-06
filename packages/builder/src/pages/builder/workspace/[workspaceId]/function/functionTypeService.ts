import ts from "typescript"
import {
  createSystem,
  createVirtualTypeScriptEnvironment,
} from "@typescript/vfs"
import type { Completion } from "@codemirror/autocomplete"

export interface FunctionCompletionRequest {
  id: number
  source: string
  declarations: string
  position: number
}

export interface FunctionCompletionResponse {
  id: number
  completions: Completion[]
}

const SOURCE_FILE = "/function.ts"
const DECLARATIONS_FILE = "/budibase-functions.d.ts"

const summarizeType = ({
  checker,
  type,
}: {
  checker: ts.TypeChecker
  type: ts.Type
}): string => {
  if (checker.isArrayType(type)) {
    return "array"
  }
  const label = checker.typeToString(type)
  if (label.length <= 60) {
    return label
  }
  if (type.isUnion()) {
    return [
      ...new Set(type.types.map(type => summarizeType({ checker, type }))),
    ].join(" | ")
  }
  const isObject =
    type.flags & ts.TypeFlags.Object ||
    (type.isIntersection() &&
      type.types.every(type => type.flags & ts.TypeFlags.Object))
  return isObject ? "object" : `${label.slice(0, 57)}…`
}

const getCompletionDetail = ({
  checker,
  symbol,
  sourceFile,
}: {
  checker: ts.TypeChecker
  symbol: ts.Symbol
  sourceFile: ts.SourceFile
}): string => {
  const type = checker.getTypeOfSymbolAtLocation(symbol, sourceFile)
  const [signature] = type.getCallSignatures()
  if (!signature) {
    return summarizeType({ checker, type })
  }
  const parameters = signature.getParameters().map(parameter => {
    const declaration = parameter.valueDeclaration
    const name = parameter.getName()
    if (!declaration || !ts.isParameter(declaration)) {
      return name
    }
    const optional = declaration.questionToken || declaration.initializer
    return `${declaration.dotDotDotToken ? "..." : ""}${name}${optional ? "?" : ""}`
  })
  const returnType = summarizeType({ checker, type: signature.getReturnType() })
  return `(${parameters.join(", ")}) → ${returnType}`
}

const libraries = import.meta.glob<string>(
  [
    "@typescript-libs/lib.es5*.d.ts",
    "@typescript-libs/lib.es201{5,6,7,8,9}*.d.ts",
    "@typescript-libs/lib.es202{0,1,2}*.d.ts",
    "@typescript-libs/lib.decorators*.d.ts",
  ],
  // TypeScript's libraries live in node_modules, which globs exclude by default.
  { query: "?raw", import: "default", eager: true, exhaustive: true }
)

export const createFunctionTypeService = () => {
  const files = new Map(
    Object.entries(libraries).map(([path, content]) => [
      `/${path.split("/").pop()}`,
      content,
    ])
  )
  files.set(SOURCE_FILE, "\n")
  files.set(DECLARATIONS_FILE, "\n")
  const environment = createVirtualTypeScriptEnvironment(
    createSystem(files),
    [SOURCE_FILE, DECLARATIONS_FILE],
    ts,
    {
      lib: ["lib.es2022.d.ts"],
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      noEmit: true,
      strict: true,
      target: ts.ScriptTarget.ES2022,
      types: [],
    }
  )
  let currentSource = "\n"
  let currentDeclarations = "\n"

  return {
    complete: ({
      source,
      declarations,
      position,
    }: Omit<FunctionCompletionRequest, "id">): Completion[] => {
      if (source !== currentSource) {
        environment.updateFile(SOURCE_FILE, source)
        currentSource = source
      }
      if (declarations !== currentDeclarations) {
        environment.updateFile(DECLARATIONS_FILE, declarations)
        currentDeclarations = declarations
      }
      const result = environment.languageService.getCompletionsAtPosition(
        SOURCE_FILE,
        position,
        { includeCompletionsForModuleExports: false, includeSymbol: true }
      )
      if (!result?.isMemberCompletion) {
        return []
      }
      const program = environment.languageService.getProgram()!
      const checker = program.getTypeChecker()
      const sourceFile = program.getSourceFile(SOURCE_FILE)!
      return result.entries.slice(0, 200).map(entry => {
        const details = environment.languageService.getCompletionEntryDetails(
          SOURCE_FILE,
          position,
          entry.name,
          undefined,
          entry.source,
          undefined,
          entry.data
        )
        return {
          label: entry.name,
          type: entry.kind,
          detail: entry.symbol
            ? getCompletionDetail({ checker, symbol: entry.symbol, sourceFile })
            : undefined,
          info: ts.displayPartsToString(details?.documentation) || undefined,
          apply: entry.insertText,
        }
      })
    },
    destroy: () => environment.languageService.dispose(),
  }
}
