import type { FunctionQueryCapability } from "@budibase/types"
import { build, type BuildFailure, type Message } from "esbuild"
import {
  FUNCTION_VIRTUAL_SOURCE_FILE,
  FUNCTION_VIRTUAL_MODULE,
  MAX_FUNCTION_BUILD_DIAGNOSTICS,
} from "./constants"
import { createBuildDiagnostic } from "./diagnostics"
import type { FunctionCompilerResult } from "./types"

const VIRTUAL_MODULE_NAMESPACE = "budibase-functions"

const isBuildFailure = (error: unknown): error is BuildFailure => {
  return (
    error instanceof Error && "errors" in error && Array.isArray(error.errors)
  )
}

const toBuildDiagnostic = (message: Message) =>
  createBuildDiagnostic(
    "FUNCTION_BUNDLE_ERROR",
    message.text,
    message.location?.line,
    message.location ? message.location.column + 1 : undefined
  )

const renderRuntimeModule = (capabilities: FunctionQueryCapability[]) => {
  const grouped = new Map<string, FunctionQueryCapability[]>()
  for (const capability of capabilities) {
    const datasourceCapabilities = grouped.get(capability.datasourceAlias) || []
    datasourceCapabilities.push(capability)
    grouped.set(capability.datasourceAlias, datasourceCapabilities)
  }

  const queries = [...grouped.entries()].map(
    ([datasourceAlias, datasourceCapabilities]) =>
      `${JSON.stringify(datasourceAlias)}: Object.freeze({${datasourceCapabilities
        .map(
          capability =>
            `${JSON.stringify(capability.queryAlias)}: (parameters = {}) => globalThis.__budibaseInvokeQuery(${JSON.stringify(capability.capabilityId)}, parameters)`
        )
        .join(",")}})`
  )

  return `export const inputs = globalThis.__budibaseInputs
export const queries = Object.freeze({${queries.join(",")}})`
}

export const bundleFunction = async (
  source: string,
  capabilities: FunctionQueryCapability[]
): Promise<FunctionCompilerResult> => {
  try {
    const result = await build({
      bundle: true,
      format: "esm",
      legalComments: "none",
      outfile: "function.js",
      platform: "neutral",
      plugins: [
        {
          name: VIRTUAL_MODULE_NAMESPACE,
          setup: build => {
            build.onResolve({ filter: /.*/ }, args => {
              if (args.path === FUNCTION_VIRTUAL_MODULE) {
                return {
                  path: args.path,
                  namespace: VIRTUAL_MODULE_NAMESPACE,
                }
              }
              return {
                errors: [{ text: `Importing '${args.path}' is not allowed.` }],
              }
            })
            build.onLoad(
              { filter: /.*/, namespace: VIRTUAL_MODULE_NAMESPACE },
              () => ({
                contents: renderRuntimeModule(capabilities),
                loader: "js",
              })
            )
          },
        },
      ],
      sourcemap: "external",
      sourcesContent: false,
      stdin: {
        contents: source,
        loader: "ts",
        sourcefile: FUNCTION_VIRTUAL_SOURCE_FILE,
      },
      target: "es2022",
      treeShaking: true,
      write: false,
    })
    const compiledJavaScript = result.outputFiles.find(file =>
      file.path.endsWith("function.js")
    )
    const sourceMap = result.outputFiles.find(file =>
      file.path.endsWith("function.js.map")
    )
    if (!compiledJavaScript) {
      throw new Error("The Function compiler did not emit JavaScript.")
    }
    return {
      diagnostics: [],
      output: {
        compiledJavaScript: compiledJavaScript.text,
        sourceMap: sourceMap?.text,
      },
    }
  } catch (error) {
    if (isBuildFailure(error)) {
      return {
        diagnostics: error.errors
          .slice(0, MAX_FUNCTION_BUILD_DIAGNOSTICS)
          .map(toBuildDiagnostic),
      }
    }
    return {
      diagnostics: [
        createBuildDiagnostic(
          "FUNCTION_COMPILE_ERROR",
          "The Function compiler failed unexpectedly."
        ),
      ],
    }
  }
}
