<script>
  import { onMount } from "svelte"
  import { fade } from "svelte/transition"
  import {
    Label,
    DatePicker,
    Input,
    Select,
    Button,
    Toggle,
  } from "@budibase/bbui"
  import Dropzone from "./attachments/Dropzone.svelte"
  import LinkedRowSelector from "./LinkedRowSelector.svelte"
  import debounce from "lodash.debounce"
  import ErrorsBox from "./ErrorsBox.svelte"
  import { capitalise } from "./helpers"

  export let _bb
  export let table
  export let title
  export let buttonText
  export let wide = false

  const TYPE_MAP = {
    string: "text",
    boolean: "checkbox",
    number: "number",
  }

  const DEFAULTS_FOR_TYPE = {
    string: "",
    boolean: false,
    number: null,
    link: [],
  }

  let row
  let store = _bb.store
  let schema = {}
  let tableDef = {}
  let saved = false
  let rowId
  let isNew = true
  let errors = {}

  $: fields = schema ? Object.keys(schema) : []
  $: if (table && table.length !== 0) {
    fetchTable()
  }

  async function fetchTable() {
    const FETCH_TABLE_URL = `/api/tables/${table}`
    const response = await _bb.api.get(FETCH_TABLE_URL)
    tableDef = await response.json()
    schema = tableDef.schema
    row = {
      tableId: table,
    }
  }

  const save = debounce(async () => {
    for (let field of fields) {
      // Assign defaults to empty fields to prevent validation issues
      if (!(field in row)) {
        row[field] = DEFAULTS_FOR_TYPE[schema[field].type]
      }
    }

    const SAVE_ROW_URL = `/api/${table}/rows`
    const response = await _bb.api.post(SAVE_ROW_URL, row)

    const json = await response.json()

    if (response.status === 200) {
      store.update(state => {
        state[table] = state[table] ? [...state[table], json] : [json]
        return state
      })

      errors = {}

      // wipe form, if new row, otherwise update
      // table to get new _rev
      row = isNew ? { tableId: table } : json

      // set saved, and unset after 1 second
      // i.e. make the success notifier appear, then disappear again after time
      saved = true
      setTimeout(() => {
        saved = false
      }, 3000)
    }

    if (response.status === 400) {
      errors = Object.keys(json.errors)
        .map(k => ({ dataPath: k, message: json.errors[k] }))
        .flat()
    }
  })

  onMount(async () => {
    const routeParams = _bb.routeParams()
    rowId =
      Object.keys(routeParams).length > 0 && (routeParams.id || routeParams[0])
    isNew = !rowId || rowId === "new"

    if (isNew) {
      row = { tableId: table }
      return
    }

    const GET_ROW_URL = `/api/${table}/rows/${rowId}`
    const response = await _bb.api.get(GET_ROW_URL)
    row = await response.json()
  })
</script>

<form class="form" on:submit|preventDefault>
  {#if title}
    <h1>{title}</h1>
  {/if}
  <div class="form-content">
    <ErrorsBox {errors} />
    {#each fields as field}
      <div class="form-field" class:wide>
        {#if !(schema[field].type === 'boolean' && !wide)}
          <Label extraSmall={!wide} grey={!wide}>
            {capitalise(schema[field].name)}
          </Label>
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
    <div class="buttons">
      <Button primary on:click={save} green={saved}>
        {#if saved}Success{:else}{buttonText || 'Submit Form'}{/if}
      </Button>
    </div>
  </div>
</form>

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

  .buttons {
    display: flex;
    justify-content: flex-end;
  }
</style>
