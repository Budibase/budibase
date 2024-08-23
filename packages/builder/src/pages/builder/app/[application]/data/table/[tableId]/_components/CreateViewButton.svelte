<script>
  import DetailPopover from "components/common/DetailPopover.svelte"
  import { Input, notifications, Button, Icon } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import { viewsV2 } from "stores/builder"

  export let table
  export let firstView = false

  let name
  let popover

  $: views = Object.keys(table?.views || {}).map(x => x.toLowerCase())
  $: trimmedName = name?.trim()
  $: nameExists = views.includes(trimmedName?.toLowerCase())
  $: nameValid = trimmedName?.length && !nameExists

  export const show = () => {
    popover?.show()
  }

  const enrichSchema = schema => {
    // We need to sure that "visible" is set to true for any fields which have
    // not yet been saved with grid metadata attached
    const cloned = { ...schema }
    Object.entries(cloned).forEach(([field, fieldSchema]) => {
      if (fieldSchema.visible == null) {
        cloned[field] = { ...cloned[field], visible: true }
      }
    })
    return cloned
  }

  const saveView = async () => {
    popover.hide()
    try {
      const newView = await viewsV2.create({
        name: trimmedName,
        tableId: table._id,
        schema: enrichSchema(table.schema),
        primaryDisplay: table.primaryDisplay,
      })
      notifications.success(`View ${name} created`)
      $goto(`./${newView.id}`)
    } catch (error) {
      notifications.error("Error creating view")
    }
  }
</script>

<DetailPopover
  title="Create view"
  bind:this={popover}
  on:open={() => (name = null)}
>
  <svelte:fragment slot="anchor" let:open>
    {#if firstView}
      <Button cta>Create a view</Button>
    {:else}
      <div class="icon" class:open>
        <Icon
          name="Add"
          size="L"
          color="var(--spectrum-global-color-gray-600)"
        />
      </div>
    {/if}
  </svelte:fragment>
  <Input
    label="Name"
    thin
    bind:value={name}
    error={nameExists ? "A view already exists with that name" : null}
    autofocus
  />
  <div>
    <Button cta on:click={saveView} disabled={nameExists || !nameValid}>
      Create view
    </Button>
  </div>
</DetailPopover>

<style>
  .icon {
    height: 32px;
    padding: 0 8px;
    border-radius: 4px;
    display: grid;
    place-items: center;
    transition: background 130ms ease-out;
  }
  .icon:hover,
  .icon:active,
  .icon.open {
    background: var(--spectrum-global-color-gray-300);
    cursor: pointer;
  }
  .icon:hover :global(.spectrum-Icon),
  .icon:active :global(.spectrum-Icon),
  .icon.open :global(.spectrum-Icon) {
    color: var(--spectrum-global-color-gray-900) !important;
  }
</style>
