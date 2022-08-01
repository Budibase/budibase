<script>
  import { ActionButton, Icon, Search, Divider, Detail } from "@budibase/bbui"

  export let searchTerm = ""
  export let selected
  export let filtered = []
  export let addAll
  export let select
  export let title
  export let key
</script>

<div style="padding: var(--spacing-m)">
  <Search placeholder="Search" bind:value={searchTerm} />
  <div class="header sub-header">
    <div>
      <Detail
        >{filtered.length} {title}{filtered.length === 1 ? "" : "s"}</Detail
      >
    </div>
    <div>
      <ActionButton on:click={addAll} emphasized size="S">Add all</ActionButton>
    </div>
  </div>
  <Divider noMargin />
  <div>
    {#each filtered as item}
      <div
        on:click={() => {
          select(item._id)
        }}
        style="padding-bottom: var(--spacing-m)"
        class="selection"
      >
        <div>
          {item[key]}
        </div>

        {#if selected.includes(item._id)}
          <div>
            <Icon
              color="var(--spectrum-global-color-blue-600);"
              name="Checkmark"
            />
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .header {
    align-items: center;
    padding: var(--spacing-m) 0 var(--spacing-m) 0;
    display: flex;
    justify-content: space-between;
  }

  .selection {
    align-items: end;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
  }

  .selection > :first-child {
    padding-top: var(--spacing-m);
  }

  .sub-header {
    display: flex;
    justify-content: space-between;
  }
</style>
