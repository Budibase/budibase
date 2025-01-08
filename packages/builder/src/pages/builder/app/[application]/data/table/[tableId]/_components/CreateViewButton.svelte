<script>
  import DetailPopover from "@/components/common/DetailPopover.svelte"
  import { Input, notifications, Button, Icon, ListItem } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import { viewsV2 } from "@/stores/builder"
  import { ViewV2Type } from "@budibase/types"

  export let table
  export let firstView = false

  let calculation = false
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
        schema: calculation ? {} : enrichSchema(table.schema),
        primaryDisplay: calculation ? undefined : table.primaryDisplay,
        type: calculation ? ViewV2Type.CALCULATION : undefined,
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
  width={540}
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
  <div class="options">
    <div>
      <ListItem
        title="Table"
        subtitle="Create a subset of your data"
        hoverable
        on:click={() => (calculation = false)}
        selected={!calculation}
        icon="Rail"
      />
    </div>
    <div>
      <ListItem
        title="Calculation"
        subtitle="Calculate groups of rows"
        hoverable
        on:click={() => (calculation = true)}
        selected={calculation}
        icon="123"
      />
    </div>
  </div>
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
  .options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-m);
  }
  .icon {
    height: 32px;
    padding: 0 8px;
    border-radius: 4px;
    display: grid;
    place-items: center;
    transition: background 130ms ease-out;
    cursor: pointer;
  }
  .icon:active,
  .icon.open {
    background: var(--spectrum-global-color-gray-300);
  }
  .icon:hover :global(svg),
  .icon:active :global(svg),
  .icon.open :global(svg) {
    color: var(--spectrum-global-color-gray-900) !important;
  }
</style>
