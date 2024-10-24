<script>
  import { Button, ActionButton } from "@budibase/bbui"
  import { useSvelteFlow } from "@xyflow/svelte"
  import { getContext } from "svelte"
  import { ZoomDuration } from "./constants"

  const { createRole, layoutAndFit } = getContext("flow")
  const flow = useSvelteFlow()
</script>

<div class="control top-right">
  <div class="group">
    <ActionButton
      icon="Add"
      quiet
      on:click={() => flow.zoomIn({ duration: ZoomDuration })}
    />
    <ActionButton
      icon="Remove"
      quiet
      on:click={() => flow.zoomOut({ duration: ZoomDuration })}
    />
  </div>
  <Button secondary on:click={layoutAndFit}>Auto layout</Button>
</div>
<div class="control bottom-right">
  <Button icon="Add" cta on:click={createRole}>Add role</Button>
</div>

<style>
  .control {
    position: absolute;
    z-index: 10;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
  }
  .top-right {
    top: 20px;
    right: 20px;
  }
  .bottom-right {
    bottom: 20px;
    right: 20px;
  }
  .top-right :global(.spectrum-Button),
  .top-right :global(.spectrum-ActionButton),
  .top-right :global(.spectrum-Icon) {
    color: var(--spectrum-global-color-gray-900) !important;
  }
  .top-right :global(.spectrum-Button),
  .top-right :global(.spectrum-ActionButton) {
    background: var(--spectrum-global-color-gray-200) !important;
  }
  .top-right :global(.spectrum-Button:hover),
  .top-right :global(.spectrum-ActionButton:hover) {
    background: var(--spectrum-global-color-gray-300) !important;
  }
  .group {
    border-radius: 4px;
    display: flex;
    flex-direction: row;
  }
  .group :global(> *:not(:first-child)) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-left: 2px solid var(--spectrum-global-color-gray-300);
  }
  .group :global(> *:not(:last-child)) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
</style>
