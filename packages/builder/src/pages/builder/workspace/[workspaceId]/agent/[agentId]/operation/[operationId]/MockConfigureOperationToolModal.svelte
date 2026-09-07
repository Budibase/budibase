<script lang="ts">
  import type { ToolExecutionPrincipal } from "@budibase/types"
  import type { AgentTool } from "../../toolTypes"

  export let onSave: (args: {
    tool: AgentTool
    executionPrincipal: ToolExecutionPrincipal
  }) => void | Promise<void>

  export const show = (
    tool: AgentTool,
    executionPrincipal: ToolExecutionPrincipal
  ) => {
    onSave({ tool, executionPrincipal })
  }
</script>
