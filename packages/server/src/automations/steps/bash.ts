import execa from "execa"
import path from "path"
import { findHBSBlocks, processStringSync } from "@budibase/string-templates"
import * as automationUtils from "../automationUtils"
import environment from "../../environment"
import { BashStepInputs, BashStepOutputs } from "@budibase/types"

const INVALID_INPUTS = "Budibase bash automation failed: Invalid inputs"
const COMMAND_BINDINGS_ERROR =
  "Budibase bash automation failed: Command bindings are not supported. Use the args field for dynamic values."
const ARGS_VALIDATION_ERROR =
  "Budibase bash automation failed: Args must be a JSON array of strings."
const SCRIPT_BINDINGS_ERROR =
  "Budibase bash automation failed: Script bindings are not supported. Pass dynamic values as positional arguments to a fixed script."

interface JsonEditorInput {
  value?: unknown
}

const validateArgs = (args: unknown): string[] => {
  if (!Array.isArray(args) || args.some(arg => typeof arg !== "string")) {
    throw new Error(ARGS_VALIDATION_ERROR)
  }

  return args
}

const parseArgs = (args: unknown) => {
  if (args == null) {
    return []
  }

  if (Array.isArray(args)) {
    return validateArgs(args)
  }

  if (typeof args === "object" && "value" in (args as JsonEditorInput)) {
    const value = (args as JsonEditorInput).value

    if (Array.isArray(value)) {
      return validateArgs(value)
    }

    if (typeof value === "string") {
      try {
        return validateArgs(JSON.parse(value))
      } catch {
        throw new Error(ARGS_VALIDATION_ERROR)
      }
    }
  }

  throw new Error(ARGS_VALIDATION_ERROR)
}

type WrapperResult =
  | { kind: "possibleScriptArgs"; fromIndex: number }
  | { kind: "nested"; index: number }
  | { kind: "none" }

type WrapperParser = (args: string[]) => WrapperResult

interface InterpreterSpec {
  matches: (executable: string) => boolean
  codeInNextArg: (arg: string) => boolean
  codeAttached: (arg: string) => boolean
}

const parseEnvArgs: WrapperParser = args => {
  for (let index = 0; index < args.length; index++) {
    const arg = args[index]
    if (arg === "--split-string" || /^-[a-zA-Z]*S$/.test(arg)) {
      const command = args[index + 1]
      return command && /^[a-zA-Z0-9_./][a-zA-Z0-9_./-]*$/.test(command)
        ? { kind: "nested", index: index + 1 }
        : { kind: "possibleScriptArgs", fromIndex: index + 1 }
    }
    if (arg.startsWith("--split-string=") || /^-[a-zA-Z]*S.+/.test(arg)) {
      return { kind: "possibleScriptArgs", fromIndex: index }
    }
    if (["-u", "--unset", "-C", "--chdir"].includes(arg)) {
      index++
      continue
    }
    if (
      arg === "--" ||
      arg.startsWith("-") ||
      /^[A-Za-z_][A-Za-z_0-9]*=/.test(arg)
    ) {
      continue
    }
    return { kind: "nested", index }
  }
  return { kind: "none" }
}

const parseTimeoutArgs: WrapperParser = args => {
  for (let index = 0; index < args.length; index++) {
    const arg = args[index]
    if (["-s", "--signal", "-k", "--kill-after"].includes(arg)) {
      index++
      continue
    }
    if (arg.startsWith("-")) {
      continue
    }
    if (index + 1 < args.length) {
      return { kind: "nested", index: index + 1 }
    }
    return { kind: "none" }
  }
  return { kind: "none" }
}

const WRAPPERS = new Map<string, WrapperParser>([
  ["env", parseEnvArgs],
  ["timeout", parseTimeoutArgs],
])

const INTERPRETERS: InterpreterSpec[] = [
  {
    matches: executable =>
      ["bash", "sh", "dash", "zsh", "ksh"].includes(executable),
    codeInNextArg: arg => /^-[a-zA-Z]*c$/.test(arg),
    codeAttached: arg => /^-[a-zA-Z]*c.+/.test(arg),
  },
  {
    matches: executable => /^python(?:\d+(?:\.\d+)?)?$/.test(executable),
    codeInNextArg: arg => /^-[a-zA-Z]*c$/.test(arg),
    codeAttached: arg => /^-[a-zA-Z]*c.+/.test(arg),
  },
  {
    matches: executable => ["node", "nodejs"].includes(executable),
    codeInNextArg: arg =>
      /^-[a-zA-Z]*[ep]$/.test(arg) || ["--eval", "--print"].includes(arg),
    codeAttached: arg => /^-[ep].+/.test(arg) || /^--(?:eval|print)=/.test(arg),
  },
]

const findInlineCode = ({
  spec,
  args,
}: {
  spec: InterpreterSpec
  args: string[]
}): number => {
  for (const [index, arg] of args.entries()) {
    if (arg === "--") {
      return -1
    }
    if (spec.codeInNextArg(arg)) {
      return index + 1
    }
    if (spec.codeAttached(arg)) {
      return index
    }
  }
  return -1
}

const scriptArgumentIndexes = ({
  command,
  args,
}: {
  command: string
  args: string[]
}): number[] => {
  const executable = path.basename(command).toLowerCase()
  const wrapper = WRAPPERS.get(executable)
  if (wrapper) {
    const result = wrapper(args)
    if (result.kind === "possibleScriptArgs") {
      return args
        .map((_, index) => index)
        .filter(index => index >= result.fromIndex)
    }
    if (result.kind !== "nested") {
      return []
    }
    const nestedIndexes = scriptArgumentIndexes({
      command: args[result.index],
      args: args.slice(result.index + 1),
    })
    return nestedIndexes.map(index => result.index + 1 + index)
  }
  const spec = INTERPRETERS.find(spec => spec.matches(executable))
  const index = spec ? findInlineCode({ spec, args }) : -1
  return index < 0 ? [] : [index]
}

const processArgs = ({
  command,
  args,
  context,
}: {
  command: string
  args: unknown
  context: object
}) => {
  const parsedArgs = parseArgs(args)
  const processedArgs = parsedArgs.map(arg => processStringSync(arg, context))
  const codeIndexes = scriptArgumentIndexes({ command, args: processedArgs })
  if (
    codeIndexes.some(
      index =>
        index < parsedArgs.length && findHBSBlocks(parsedArgs[index]).length > 0
    )
  ) {
    throw new Error(SCRIPT_BINDINGS_ERROR)
  }

  return processedArgs
}

export async function run({
  inputs,
  context,
}: {
  inputs: BashStepInputs
  context: object
}): Promise<BashStepOutputs> {
  if (inputs.command == null) {
    return {
      success: false,
      stdout: INVALID_INPUTS,
    }
  }

  try {
    if (findHBSBlocks(inputs.command).length > 0) {
      return {
        success: false,
        stdout: COMMAND_BINDINGS_ERROR,
        response: {
          message: COMMAND_BINDINGS_ERROR,
        },
      }
    }

    const command = inputs.command.trim()
    if (!command) {
      return {
        success: false,
        stdout: INVALID_INPUTS,
      }
    }

    const args = processArgs({ command, args: inputs.args, context })

    let stdout,
      success = true
    try {
      stdout = execa.sync(command, args, {
        timeout: environment.QUERY_THREAD_TIMEOUT,
        stripFinalNewline: false,
      }).stdout
    } catch (err: any) {
      stdout = err.stderr || err.stdout || err.message
      success = false
    }

    return {
      stdout,
      success,
    }
  } catch (err) {
    return {
      success: false,
      response:
        err instanceof Error ? err.message : automationUtils.getError(err),
    }
  }
}
