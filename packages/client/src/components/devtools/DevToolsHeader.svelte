<script>
  import { Heading, Button, Select } from "@budibase/bbui"
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
  <Heading size="XS">Budibase App Preview</Heading>
  <Select
    quiet
    options={previewOptions}
    value={$devToolsStore.role || "self"}
    placeholder={null}
    autoWidth
    on:change={e => devToolsStore.actions.changeRole(e.detail)}
  />
  {#if !$context.device.mobile}
    <Button
      quiet
      overBackground
      icon="Code"
      on:click={() => devToolsStore.actions.setVisible(!$devToolsStore.visible)}
    >
      {$devToolsStore.visible ? "Close" : "Open"} DevTools
    </Button>
  {/if}
</div>

<style>
  .dev-preview-header {
    flex: 0 0 50px;
    height: 50px;
    display: grid;
    align-items: center;
    background-color: var(--spectrum-global-color-blue-400);
    padding: 0 var(--spacing-xl);
    grid-template-columns: 1fr auto auto;
    grid-gap: var(--spacing-xl);
  }
  .dev-preview-header.mobile {
    flex: 0 0 50px;
    grid-template-columns: 1fr auto;
  }
  .dev-preview-header :global(.spectrum-Heading),
  .dev-preview-header :global(.spectrum-Picker-menuIcon),
  .dev-preview-header :global(.spectrum-Picker-label) {
    color: white !important;
  }
  @media print {
    .dev-preview-header {
      display: none;
    }
  }
</style>
