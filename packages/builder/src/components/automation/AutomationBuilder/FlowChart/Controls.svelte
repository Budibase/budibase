<script lang="ts">
  import { Button } from "@budibase/bbui"
  import { useSvelteFlow } from "@xyflow/svelte"
  import UndoRedoControl from "@/components/common/UndoRedoControl.svelte"
  import type { HistoryStore } from "@/stores/builder/history"
  import type { Automation } from "@budibase/types"

  interface Props {
    historyStore: HistoryStore<Automation>
  }

  let { historyStore }: Props = $props()

  const flow = useSvelteFlow()
</script>

<div class="controls bottom-left">
  <div class="group">
    <UndoRedoControl store={historyStore} showButtonGroup />
  </div>
  <Button secondary on:click={() => flow.fitView()}>Auto layout</Button>
</div>

<style>
  .controls {
    position: absolute;
    z-index: 10;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--spacing-l);
    left: var(--spacing-l);
    bottom: var(--spacing-l);
  }

  /* Make button groups look unified and dark-themed */
  .group {
    border-radius: 8px;
    display: flex;
    flex-direction: row;
    overflow: hidden;
    border: 1px solid var(--spectrum-global-color-gray-300);
    background: var(--spectrum-global-color-gray-100);
  }
  .group :global(> *:not(:first-child)) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  .group :global(> *:not(:last-child)) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
</style>
