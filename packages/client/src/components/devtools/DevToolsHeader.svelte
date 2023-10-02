<script>
  import { Heading, Select, ActionButton } from "@budibase/bbui"
  import { devToolsStore, appStore, roleStore } from "../../stores"
  import { getContext, onMount } from "svelte"

  const context = getContext("context")
  const SELF_ROLE = "self"

  let staticRoleList

  $: previewOptions = buildRoleList(staticRoleList)

  function buildRoleList(roleIds) {
    const list = []
    list.push({
      label: "View as yourself",
      value: SELF_ROLE,
    })
    if (!roleIds) {
      return list
    }
    for (let roleId of roleIds) {
      list.push({
        label: `View as ${roleId.toLowerCase()} user`,
        value: roleId,
      })
    }
    return list
  }

  onMount(async () => {
    // make sure correct before starting
    await devToolsStore.actions.changeRole(SELF_ROLE)
    staticRoleList = await roleStore.actions.fetchAccessibleRoles()
  })
</script>

<div class="dev-preview-header" class:mobile={$context.device.mobile}>
  <Heading size="XS">Preview</Heading>
  <Select
    quiet
    options={previewOptions}
    value={$devToolsStore.role || SELF_ROLE}
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
      DevTools
    </ActionButton>
  {/if}
  {#if window.parent.isBuilder}
    <ActionButton
      quiet
      icon="LinkOut"
      on:click={() => {
        window.parent.closePreview?.()
        window.open(`/${$appStore.appId}`, "_blank")
      }}
    >
      Fullscreen
    </ActionButton>
    <ActionButton
      quiet
      icon="Close"
      on:click={() => window.parent.closePreview?.()}
    >
      Close
    </ActionButton>
  {/if}
</div>

<style>
  .dev-preview-header {
    flex: 0 0 60px;
    background-color: black;
    padding: 0 var(--spacing-xl);
    display: flex;
    align-items: center;
    gap: var(--spacing-xl);
  }
  .dev-preview-header :global(.spectrum-Heading) {
    flex: 1 1 auto;
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
