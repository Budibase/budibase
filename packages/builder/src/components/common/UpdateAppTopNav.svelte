<script>
  import { Popover, Layout, Icon } from "@budibase/bbui"
  import { deploymentStore } from "stores/builder"
  import { appsStore } from "stores/portal"
  import UpdateAppForm from "./UpdateAppForm.svelte"

  export let application

  let formPopover
  let formPopoverAnchor
  let formPopoverOpen = false

  $: filteredApps = $appsStore.apps.filter(app => app.devId === application)
  $: selectedApp = filteredApps?.length ? filteredApps[0] : null
  $: latestDeployments = $deploymentStore
    .filter(deployment => deployment.status === "SUCCESS")
    .sort((a, b) => a.updatedAt > b.updatedAt)
  $: isPublished =
    selectedApp?.status === "published" && latestDeployments?.length > 0
</script>

<div bind:this={formPopoverAnchor}>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="app-heading"
    class:editing={formPopoverOpen}
    on:click={() => {
      formPopover.show()
    }}
  >
    <slot />
    <span class="edit-icon">
      <Icon size="S" name="Edit" color={"var(--grey-7)"} />
    </span>
  </div>
</div>

<Popover
  customZindex={998}
  bind:this={formPopover}
  align="center"
  disabled={!isPublished}
  anchor={formPopoverAnchor}
  offset={20}
  on:close={() => {
    formPopoverOpen = false
  }}
  on:open={() => {
    formPopoverOpen = true
  }}
>
  <Layout noPadding gap="M">
    <div class="popover-content">
      <UpdateAppForm />
    </div>
  </Layout>
</Popover>

<style>
  .popover-content {
    padding: var(--spacing-xl);
  }
  .app-heading {
    display: flex;
    cursor: pointer;
    align-items: center;
    gap: var(--spacing-s);
  }
  .edit-icon {
    display: none;
  }
  .app-heading:hover .edit-icon,
  .app-heading.editing .edit-icon {
    display: inline;
  }
</style>
