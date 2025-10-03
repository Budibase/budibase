<script lang="ts">
  import { ActionButton, Switcher, Button } from "@budibase/bbui"
  import { useSvelteFlow } from "@xyflow/svelte"
  import UndoRedoControl from "@/components/common/UndoRedoControl.svelte"
  import type { HistoryStore } from "@/stores/builder/history"
  import type { Automation } from "@budibase/types"

  export let historyStore: HistoryStore<Automation>
  export let layoutDirection: "TB" | "LR" = "TB"
  export let onChangeDirection: (_dir: "TB" | "LR") => void

  const flow = useSvelteFlow()
  const ZoomDurationMs = 150

  const setDirection = (dir: "TB" | "LR") => {
    if (dir !== layoutDirection) {
      onChangeDirection(dir)
    }
  }
</script>

<div class="controls bottom-left">
  <div class="group">
    <ActionButton
      icon="plus"
      quiet
      on:click={() => flow.zoomIn({ duration: ZoomDurationMs })}
    />
    <ActionButton
      icon="minus"
      quiet
      on:click={() => flow.zoomOut({ duration: ZoomDurationMs })}
    />
  </div>

  <div class="group">
    <UndoRedoControl store={historyStore} showButtonGroup />
  </div>
  <Button secondary on:click={() => flow.fitView()}>Auto layout</Button>

  <Switcher
    leftText="Vertical"
    rightText="Horizontal"
    selected={layoutDirection === "LR" ? "right" : "left"}
    on:left={() => setDirection("TB")}
    on:right={() => setDirection("LR")}
    leftIcon="arrow-down"
    rightIcon="arrow-right"
  />
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
