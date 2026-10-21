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

const scriptArgumentIndex = ({
  command,
  args,
}: {
  command: string
  args: string[]
}): number => {
  const executable = path.basename(command).toLowerCase()

  if (executable === "env") {
    for (let index = 0; index < args.length; index++) {
      const arg = args[index]
      if (arg === "-S") {
        return index + 1
      }
      if (arg.startsWith("-S") && arg.length > 2) {
        return index
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
      const nestedIndex = scriptArgumentIndex({
        command: arg,
        args: args.slice(index + 1),
      })
      return nestedIndex < 0 ? -1 : index + 1 + nestedIndex
    }

    return -1
  }

  if (executable === "timeout") {
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
        const nestedIndex = scriptArgumentIndex({
          command: args[index + 1],
          args: args.slice(index + 2),
        })
        return nestedIndex < 0 ? -1 : index + 2 + nestedIndex
      }
      return -1
    }

    return -1
  }

  const isShell = ["bash", "sh", "dash", "zsh", "ksh"].includes(executable)
  const isPython = /^python(?:\d+(?:\.\d+)?)?$/.test(executable)
  const isNode = ["node", "nodejs"].includes(executable)

  if (!isShell && !isPython && !isNode) {
    return -1
  }

  for (const [index, arg] of args.entries()) {
    if (arg === "--") {
      return -1
    }

    if (isShell && /^-[a-zA-Z]*c$/.test(arg)) {
      return index + 1
    }

    if (isPython && arg === "-c") {
      return index + 1
    }

    if (isNode && ["-e", "--eval", "-p", "--print"].includes(arg)) {
      return index + 1
    }

    if ((isShell || isPython) && /^-[a-zA-Z]*c.+/.test(arg)) {
      return index
    }

    if (isNode && (/^-[ep].+/.test(arg) || /^--(?:eval|print)=/.test(arg))) {
      return index
    }
  }

  return -1
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
  const codeIndex = scriptArgumentIndex({ command, args: parsedArgs })
  if (
    codeIndex >= 0 &&
    codeIndex < parsedArgs.length &&
    findHBSBlocks(parsedArgs[codeIndex]).length > 0
  ) {
    throw new Error(SCRIPT_BINDINGS_ERROR)
  }

  return parsedArgs.map(arg => processStringSync(arg, context))
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
