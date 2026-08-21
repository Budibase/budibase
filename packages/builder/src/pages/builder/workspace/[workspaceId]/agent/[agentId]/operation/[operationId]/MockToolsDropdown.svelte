<script lang="ts">
  import type { AgentTool } from "../../toolTypes"

  export let filteredTools: AgentTool[] = []
  export let onToolClick: (tool: AgentTool) => void

  let open = false

  export const show = () => {
    open = true
  }
</script>

{#if open && filteredTools[0]}
  <button type="button" on:click={() => onToolClick(filteredTools[0])}>
    Select tool
  </button>
{/if}
