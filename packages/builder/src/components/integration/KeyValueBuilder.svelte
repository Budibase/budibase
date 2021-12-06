<script>
  import {
    Icon,
    ActionButton,
    Input,
    Label,
    Toggle,
    Select,
  } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { lowercase } from "helpers"

  let dispatch = createEventDispatcher()

  export let defaults
  export let object = defaults || {}
  export let readOnly
  export let noAddButton
  export let name
  export let headings = false
  export let activity = false
  export let options

  let fields = Object.entries(object).map(([name, value]) => ({ name, value }))

  $: object = fields.reduce(
    (acc, next) => ({ ...acc, [next.name]: next.value }),
    {}
  )

  export function addEntry() {
    fields = [...fields, { name: "", value: "" }]
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
  {#if headings}
    <div class="container" class:container-active={activity}>
      <Label>Key</Label>
      <Label>Value</Label>
      {#if activity}
        <Label>Active</Label>
      {/if}
    </div>
  {/if}
  <div class="container" class:container-active={activity} class:readOnly>
    {#each fields as field, idx}
      <Input placeholder="Key" bind:value={field.name} on:change={changed} />
      {#if options}
        <Select bind:value={field.value} on:change={changed} {options} />
      {:else}
        <Input
          placeholder="Value"
          bind:value={field.value}
          on:change={changed}
        />
      {/if}
      {#if activity}
        <Toggle />
      {/if}
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
  .container-active {
    grid-template-columns: 1fr 1fr 50px 20px;
  }
</style>
