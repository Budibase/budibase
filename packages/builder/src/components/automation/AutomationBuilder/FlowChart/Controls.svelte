<script lang="ts">
  import { ActionButton, Button } from "@budibase/bbui"
  import { useSvelteFlow } from "@xyflow/svelte"
  import { createEventDispatcher } from "svelte"
  import UndoRedoControl from "@/components/common/UndoRedoControl.svelte"
  import type { HistoryStore } from "@/stores/builder/history"
  import type { Automation } from "@budibase/types"
  import type { FlowLayoutDirection } from "./FlowCanvas/FlowGeometry"

  export let historyStore: HistoryStore<Automation>
  export let layoutDirection: FlowLayoutDirection

  const dispatch = createEventDispatcher<{
    layout: FlowLayoutDirection
  }>()
  const flow = useSvelteFlow()
</script>

<div class="controls bottom-left">
  <div class="group">
    <UndoRedoControl store={historyStore} showButtonGroup />
  </div>
  <div class="group">
    <ActionButton
      quiet
      selected={layoutDirection === "LR"}
      icon="arrow-right"
      on:click={() => dispatch("layout", "LR")}
    >
      Horizontal
    </ActionButton>
    <ActionButton
      quiet
      selected={layoutDirection === "TB"}
      icon="arrow-down"
      on:click={() => dispatch("layout", "TB")}
    >
      Vertical
    </ActionButton>
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
