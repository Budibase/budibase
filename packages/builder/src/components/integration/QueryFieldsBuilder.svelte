<script>
  import {
    Button,
    TextArea,
    Label,
    Input,
    Heading,
    Select,
  } from "@budibase/bbui"
  import Editor from "./QueryEditor.svelte"

  export let fields = {}
  export let schema
  export let editable

  let draftField = {}

  $: fieldKeys = Object.keys(fields)
  $: schemaKeys = Object.keys(schema.fields)

  $: console.log({
    fields,
    schema
  })

  function updateCustomFields({ detail }) {
    fields.customData = detail.value
  }

  function updateSubfieldName({ names, definition }) {
    console.log(names, definition)
    const temp = definition[names.old]
    definition[names.new] = temp
    delete definition[names.old]
    // fields = fields
  }

  // function addCustomField() {

  // }

  // function removeCustomField() {

  // }
</script>

<form on:submit|preventDefault>
  <div class="field">
    {#each schemaKeys as field}
      <!-- New Stuff -->
      {#if schema.fields[field]?.type === "object"}
        <Label extraSmall grey>{field}</Label>
        <div class="inner-fields"> 
          {#each Object.keys(fields[field] || {}) as subfield}
            <Input outline thin on:change={e => updateSubfieldName({ 
                names: { 
                  new: e.target.value, 
                  old: subfield 
                }, 
                definition: fields[field] 
              })} 
            />
            <Input outline bind:value={fields[field][subfield]} />
            <i class="ri-close-circle-fill" on:click={() => { 
              delete fields[field][subfield] 
              fields[field] = fields[field]
            }} />
          {/each}
        </div>
        <i class="ri-add-circle-fill" on:click={() => {
          // set new empty field
          fields[field] = {
            ...fields[field] || {},
            [""]: ""
          }
        }} />
      {:else}
        <Input
          label={field}
          placeholder="Enter {field} name"
          outline
          disabled={!editable}
          type={schema.fields[field]?.type}
          required={schema.fields[field]?.required}
          bind:value={fields[field]} />
      {/if}
    {/each}
  </div>
</form>
{#if schema.customisable}
  <Editor
    label="Query"
    mode="json"
    on:change={updateCustomFields}
    readOnly={!editable}
    value={fields.customData} />
{/if}

<style>
  form {
    width: 600px;
  }

  .field {
    margin-bottom: var(--spacing-m);
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: var(--spacing-m);
    align-items: center;
  }

  .inner-fields {
    margin-bottom: var(--spacing-m);
    display: grid;
    grid-template-columns: 1fr 1fr 20px;
    grid-gap: var(--spacing-m);
    align-items: center;
  }
</style>
