<script>
  import { Label, DatePicker, Input, Select, Toggle } from "@budibase/bbui"
  import Dropzone from "./attachments/Dropzone.svelte"
  import LinkedRowSelector from "./LinkedRowSelector.svelte"
  import ErrorsBox from "./ErrorsBox.svelte"
  import { capitalise } from "./helpers"

  export let _bb
  export let table
  export let wide = false

  let store = _bb.store
  let schema = {}
  let rowId
  let errors = {}

  $: schema = $store.data && $store.data._table && $store.data._table.schema
  $: fields = schema ? Object.keys(schema) : []
</script>

<div class="form-content">
  <ErrorsBox errors={$store.saveRowErrors || {}} />
  {#each fields as field}
    <div class="form-field" class:wide>
      {#if !(schema[field].type === 'boolean' && !wide)}
        <Label extraSmall={!wide} grey={!wide}>
          {capitalise(schema[field].name)}
        </Label>
      {/if}
      {#if schema[field].type === 'options'}
        <Select secondary bind:value={$store.data[field]}>
          <option value="">Choose an option</option>
          {#each schema[field].constraints.inclusion as opt}
            <option>{opt}</option>
          {/each}
        </Select>
      {:else if schema[field].type === 'datetime'}
        <DatePicker bind:value={$store.data[field]} />
      {:else if schema[field].type === 'boolean'}
        <Toggle
          text={wide ? null : capitalise(schema[field].name)}
          bind:checked={$store.data[field]} />
      {:else if schema[field].type === 'number'}
        <Input type="number" bind:value={$store.data[field]} />
      {:else if schema[field].type === 'string'}
        <Input bind:value={$store.data[field]} />
      {:else if schema[field].type === 'attachment'}
        <Dropzone bind:files={$store.data[field]} />
      {:else if schema[field].type === 'link'}
        <LinkedRowSelector
          secondary
          showLabel={false}
          bind:linkedRows={$store.data[field]}
          schema={schema[field]} />
      {/if}
    </div>
  {/each}
</div>

<style>
  .form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .form-content {
    margin-bottom: var(--spacing-xl);
    display: grid;
    gap: var(--spacing-xl);
    width: 100%;
  }

  .form-field {
    display: grid;
  }
  .form-field.wide {
    align-items: center;
    grid-template-columns: 30% 1fr;
    gap: var(--spacing-xl);
  }
  .form-field.wide :global(label) {
    margin-bottom: 0;
  }
</style>
