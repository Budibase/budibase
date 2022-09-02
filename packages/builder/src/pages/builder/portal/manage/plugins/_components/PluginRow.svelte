<script>
  import { Icon, Body, ActionMenu, MenuItem, Detail } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()

  export let plugin
  $: console.log(plugin)
  let modal

  function editGroup() {
    modal.show()
  }

  const remove = plugin => {
    dispatch("delete", {
      _id: plugin._id,
      _rev: plugin._rev,
      name: plugin.name,
    })
  }
</script>

<div class="row">
  <div class="title">
    <div class="name">
      <div>
        <Icon size="M" name={plugin.schema.schema.icon} />
      </div>
      <div>
        <Body
          size="S"
          color="var(--spectrum-global-color-gray-900)"
          weight="800"
        >
          {plugin.name}
        </Body>
        <Detail size="S">
          <div class="opacity">{plugin.schema.type}</div>
        </Detail>
      </div>
    </div>
  </div>
  <div class="desktop">{plugin.source || "-"}</div>
  <div class="desktop">{plugin.author || "-"}</div>
  <div class="desktop">{plugin.version}</div>

  <div>
    <div>
      <ActionMenu align="right">
        <span slot="control">
          <Icon hoverable name="More" />
        </span>
        <MenuItem on:click={() => remove(plugin)} icon="Delete">Delete</MenuItem
        >
        <MenuItem on:click={() => editGroup(plugin)} icon="Edit">Edit</MenuItem>
      </ActionMenu>
    </div>
  </div>
</div>

<style>
  .row {
    display: grid;
    grid-template-columns: 0.3fr auto auto auto auto;
    align-items: center;
    background: var(--background);
    height: 50px;
    padding-left: 20px;
    padding-right: 20px;
    justify-content: space-between;
  }

  .name {
    grid-gap: var(--spacing-m);
    grid-template-columns: 75px 75px;
    align-items: center;
    display: flex;
  }

  .opacity {
    opacity: 50%;
  }
  @media (max-width: 640px) {
    .desktop {
      display: none !important;
    }
  }
</style>
