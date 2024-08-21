<script>
  import { Popover, Layout, Icon } from "@budibase/bbui"
  import UpdateAppForm from "./UpdateAppForm.svelte"

  let formPopover
  let formPopoverAnchor
  let formPopoverOpen = false
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
      <UpdateAppForm
        on:updated={() => {
          formPopover.hide()
        }}
      />
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
