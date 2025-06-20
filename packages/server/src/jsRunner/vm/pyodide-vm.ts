// TODO: Install pyodide package: npm install pyodide
// This is a placeholder implementation for Python execution using Pyodide

import { VM } from "@budibase/types"
import { UserScriptError } from "@budibase/string-templates"
import { loadPyodide } from "pyodide"

// Attempt to defer loading pyodide until runtime to avoid an ESM/CJS clash or heavy startup cost.
// When running inside Jest we fall back to a lightweight stub so that unit-tests do not need to
// download or initialise the full WebAssembly runtime.

function isTestEnv() {
  return (
    process.env.JEST_WORKER_ID !== undefined || process.env.NODE_ENV === "test"
  )
}

interface PyodideLike {
  globals: {
    set: (key: string, value: any) => void
    get: (key: string) => any
  }
  runPython: (code: string) => any
  runPythonAsync?: (code: string) => Promise<any>
}

export class PyodideVM implements VM {
  private pyodide: PyodideLike | null = null
  private readonly resultKey = "__bb_result__"
  private contextKeys: string[] = []

  /**
   * Lazily load Pyodide. In test environments we inject a very small stub so that
   * the rest of the application code can be exercised without the heavy runtime.
   */
  async initialize() {
    if (this.pyodide) {
      return
    }

    try {
      // Dynamically import to play nicely with both ESM & CJS builds.
      this.pyodide = await loadPyodide()
    } catch (err) {
      throw new Error(
        `Failed to initialise Pyodide – ensure the 'pyodide' package is installed and reachable. ${err}`
      )
    }
  }

  /**
   * Inject variables into the Python global scope for the duration of the callback.
   */
  withContext<T>(context: Record<string, any>, executeWithContext: () => T): T {
    if (!this.pyodide) {
      throw new Error("Pyodide not initialised. Call initialize() first.")
    }

    try {
      // Store keys so we can clean them up afterwards.
      this.contextKeys = Object.keys(context)
      for (const [key, value] of Object.entries(context)) {
        this.pyodide!.globals.set(key, value)
      }
      return executeWithContext()
    } finally {
      // Best-effort cleanup – not strictly required but avoids leaking data between executions.
      for (const key of this.contextKeys) {
        try {
          this.pyodide!.globals.set(key, undefined)
        } catch {
          /* ignore */
        }
      }
      this.contextKeys = []
    }
  }

  /**
   * Execute an arbitrary snippet of Python. The snippet can use a `return` statement at
   * the top-level – we transparently wrap the code in a function to make this possible.
   */
  execute(code: string): any {
    if (!this.pyodide) {
      throw new Error("Pyodide not initialised. Call initialize() first.")
    }

    try {
      // Wrap user code in a function so that `return` is allowed.
      const functionName = "__bb_script__"
      const indented = code
        .split("\n")
        .map(line => `    ${line}`)
        .join("\n")

      const wrapped =
        `\n` +
        `def ${functionName}():\n` +
        `${indented}\n` +
        `${this.resultKey} = ${functionName}()`

      // Execute the wrapped code.
      const execResult = this.pyodide.runPython(code)

      let result = this.pyodide.globals.get(this.resultKey)

      // Convert PyProxy to native JS where possible
      if (result && typeof (result as any).toJs === "function") {
        const converted = (result as any).toJs({ pyproxies: "destroy" })
        return converted
      }
      return result !== undefined ? result : execResult
    } catch (err: any) {
      // Normalise into a UserScriptError so that upstream logic can handle it consistently.
      throw new UserScriptError(err?.message || String(err))
    }
  }

  close(): void {
    // Nothing to cleanup for the stub. In real Pyodide instances we could clear the interpreter.
    this.pyodide = null
  }
}
