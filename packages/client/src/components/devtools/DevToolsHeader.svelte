<script>
  import { Heading, Select, ActionButton } from "@budibase/bbui"
  import { devToolsStore } from "../../stores"
  import { getContext } from "svelte"

  const context = getContext("context")

  $: previewOptions = [
    {
      label: "View as yourself",
      value: "self",
    },
    {
      label: "View as public user",
      value: "PUBLIC",
    },
    {
      label: "View as basic user",
      value: "BASIC",
    },
    {
      label: "View as power user",
      value: "POWER",
    },
    {
      label: "View as admin user",
      value: "ADMIN",
    },
  ]
</script>

<div class="dev-preview-header" class:mobile={$context.device.mobile}>
  <Heading size="XS">Preview</Heading>
  <Select
    quiet
    options={previewOptions}
    value={$devToolsStore.role || "self"}
    placeholder={null}
    autoWidth
    on:change={e => devToolsStore.actions.changeRole(e.detail)}
  />
  {#if !$context.device.mobile}
    <ActionButton
      quiet
      icon="Code"
      on:click={() => devToolsStore.actions.setVisible(!$devToolsStore.visible)}
    >
      {$devToolsStore.visible ? "Close" : "Open"} DevTools
    </ActionButton>
  {/if}
  <ActionButton
    quiet
    icon="Close"
    on:click={() => window.parent.closePreview?.()}
  >
    Close preview
  </ActionButton>
</div>

<style>
  .dev-preview-header {
    flex: 0 0 60px;
    display: grid;
    align-items: center;
    background-color: black;
    padding: 0 var(--spacing-xl);
    grid-template-columns: 1fr auto auto auto;
    grid-gap: var(--spacing-xl);
  }
  .dev-preview-header.mobile {
    grid-template-columns: 1fr auto auto;
  }
  .dev-preview-header :global(.spectrum-Heading),
  .dev-preview-header :global(.spectrum-Picker-menuIcon),
  .dev-preview-header :global(.spectrum-Icon),
  .dev-preview-header :global(.spectrum-Picker-label),
  .dev-preview-header :global(.spectrum-ActionButton) {
    font-weight: 600;
    color: white;
  }
  .dev-preview-header :global(.spectrum-Picker) {
    padding-left: 8px;
    padding-right: 8px;
    transition: background 130ms ease-out;
    border-radius: 4px;
  }
  .dev-preview-header :global(.spectrum-ActionButton:hover),
  .dev-preview-header :global(.spectrum-Picker:hover),
  .dev-preview-header :global(.spectrum-Picker.is-open) {
    background: rgba(255, 255, 255, 0.1);
  }
  .dev-preview-header :global(.spectrum-ActionButton:active) {
    background: rgba(255, 255, 255, 0.2);
  }
  @media print {
    .dev-preview-header {
      display: none;
    }
  }
</style>
