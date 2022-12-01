<script>
  import { Popover, Select, Heading } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { store } from "builderStore"
  import { makePropSafe as safe } from "@budibase/string-templates"

  export let value = {}
  export let bindings = []

  const dispatch = createEventDispatcher()
  let anchorRight, dropdownRight

  $: text = value?.label ?? "Choose an option"
  $: links = bindings
    .filter(x => x.fieldSchema?.type === "link" && x.category === "Repeater")
    .map(binding => {
      const { providerId, readableBinding, fieldSchema } = binding || {}
      const { name, tableId } = fieldSchema || {}
      const safeProviderId = safe(providerId)
      return {
        providerId,
        label: readableBinding,
        fieldName: name,
        tableId,
        type: "link",
        // These properties will be enriched by the client library and provide
        // details of the parent row of the relationship field, from context
        rowId: `{{ ${safeProviderId}.${safe("_id")} }}`,
        rowTableId: `{{ ${safeProviderId}.${safe("tableId")} }}`,
      }
    })

  const handleSelected = selected => {
    dispatch("change", selected)
    dropdownRight.hide()
  }
</script>

<div class="container" bind:this={anchorRight}>
  <Select
    readonly
    value={text}
    options={[text]}
    on:click={dropdownRight.show}
  />
</div>
<Popover
  bind:this={dropdownRight}
  anchor={anchorRight}
  dataCy={`dataSource-popover-${$store.selectedComponentId}`}
>
  <div class="dropdown">
    {#if links?.length}
      <div class="title">
        <Heading size="XS">Relationships</Heading>
      </div>
      <ul>
        {#each links as link}
          <li on:click={() => handleSelected(link)}>{link.label}</li>
        {/each}
      </ul>
    {/if}
  </div>
</Popover>

<style>
  .container {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .container :global(:first-child) {
    flex: 1 1 auto;
  }

  .dropdown {
    padding: var(--spacing-m) 0;
    z-index: 99999999;
    overflow-y: scroll;
  }
  .title {
    padding: 0 var(--spacing-m) var(--spacing-s) var(--spacing-m);
  }

  ul {
    list-style: none;
    padding-left: 0px;
    margin: 0px;
  }

  li {
    cursor: pointer;
    margin: 0px;
    padding: var(--spacing-s) var(--spacing-m);
    font-size: var(--font-size-m);
  }

  li:hover {
    background-color: var(--spectrum-global-color-gray-200);
  }
</style>
