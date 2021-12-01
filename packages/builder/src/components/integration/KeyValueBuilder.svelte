<script>
  import { Icon, ActionButton, Input } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { lowercase } from "helpers"

  let dispatch = createEventDispatcher()

  export let defaults
  export let object = defaults || {}
  export let readOnly
  export let noAddButton
  export let name

  let fields = Object.entries(object).map(([name, value]) => ({ name, value }))

  $: object = fields.reduce(
    (acc, next) => ({ ...acc, [next.name]: next.value }),
    {}
  )

  export function addEntry() {
    fields = [...fields, {}]
    changed()
  }

  function deleteEntry(idx) {
    fields.splice(idx, 1)
    changed()
  }

  function changed() {
    fields = fields
    dispatch("change", fields)
  }
</script>

<!-- Builds Objects with Key Value Pairs. Useful for building things like Request Headers. -->
{#if Object.keys(object || {}).length > 0}
  <div class="container" class:readOnly>
    {#each fields as field, idx}
      <Input placeholder="Key" bind:value={field.name} on:change={changed} />
      <Input placeholder="Value" bind:value={field.value} on:change={changed} />
      {#if !readOnly}
        <Icon hoverable name="Close" on:click={() => deleteEntry(idx)} />
      {/if}
    {/each}
  </div>
{/if}
{#if !readOnly && !noAddButton}
  <div>
    <ActionButton icon="Add" secondary thin outline on:click={addEntry}
      >Add{name ? ` ${lowercase(name)}` : ""}</ActionButton
    >
  </div>
{/if}

<style>
  .container {
    display: grid;
    grid-template-columns: 1fr 1fr 20px;
    grid-gap: var(--spacing-m);
    align-items: center;
    margin-bottom: var(--spacing-m);
  }
</style>
