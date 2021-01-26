<script>
  import { getContext } from "svelte"
  import {
    Label,
    DatePicker,
    Input,
    Select,
    Toggle,
    RichText,
  } from "@budibase/bbui"
  import Dropzone from "./attachments/Dropzone.svelte"
  import LinkedRowSelector from "./LinkedRowSelector.svelte"
  import { capitalise } from "./helpers"

  const { styleable, API } = getContext("sdk")
  const component = getContext("component")
  const dataContext = getContext("data")

  export let wide = false

  let row
  let schema
  let fields = []

  // Fetch info about the closest data context
  $: getFormData($dataContext[$dataContext.closestComponentId])

  const getFormData = async context => {
    if (context) {
      const tableDefinition = await API.fetchTableDefinition(context.tableId)
      schema = tableDefinition?.schema
      fields = Object.keys(schema ?? {})

      // Use the draft version for editing
      row = $dataContext[`${$dataContext.closestComponentId}_draft`]
    }
  }
</script>

<div class="form-content" use:styleable={$component.styles}>
  <!--  <ErrorsBox errors={$store.saveRowErrors || {}} />-->
  {#each fields as field}
    <div class="form-field" class:wide>
      {#if !(schema[field].type === 'boolean' && !wide)}
        <Label extraSmall={!wide} grey>{capitalise(schema[field].name)}</Label>
      {/if}
      {#if schema[field].type === 'options'}
        <Select secondary bind:value={row[field]}>
          <option value="">Choose an option</option>
          {#each schema[field].constraints.inclusion as opt}
            <option>{opt}</option>
          {/each}
        </Select>
      {:else if schema[field].type === 'datetime'}
        <DatePicker bind:value={row[field]} />
      {:else if schema[field].type === 'boolean'}
        <Toggle
          text={wide ? null : capitalise(schema[field].name)}
          bind:checked={row[field]} />
      {:else if schema[field].type === 'number'}
        <Input type="number" bind:value={row[field]} />
      {:else if schema[field].type === 'string'}
        <Input bind:value={row[field]} />
      {:else if schema[field].type === 'longform'}
        <RichText bind:value={row[field]} />
      {:else if schema[field].type === 'attachment'}
        <Dropzone bind:files={row[field]} />
      {:else if schema[field].type === 'link'}
        <LinkedRowSelector
          secondary
          showLabel={false}
          bind:linkedRows={row[field]}
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
    display: grid;
    gap: var(--spacing-xl);
    width: 100%;
  }

  .form-field {
    display: grid;
  }
  .form-field.wide {
    align-items: center;
    grid-template-columns: 20% 1fr;
    gap: var(--spacing-xl);
  }
  .form-field.wide :global(label) {
    margin-bottom: 0;
  }
</style>
