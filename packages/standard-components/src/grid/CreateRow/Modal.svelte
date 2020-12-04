<script>
  import { getContext, onMount, createEventDispatcher } from "svelte"
  import { Button, Label, DatePicker, RichText } from "@budibase/bbui"
  import Dropzone from "../../attachments/Dropzone.svelte"
  import debounce from "lodash.debounce"

  const dispatch = createEventDispatcher()
  const { fetchRow, saveRow, routeStore } = getContext("sdk")

  const DEFAULTS_FOR_TYPE = {
    string: "",
    boolean: false,
    number: null,
    link: [],
  }

  export let table
  export let onClosed

  let row = { tableId: table._id }
  let schema = table.schema
  let saved = false
  let rowId
  let isNew = true
  let errors = {}

  $: fields = schema ? Object.keys(schema) : []

  $: errorMessages = Object.entries(errors).map(
    ([field, message]) => `${field} ${message}`
  )

  const save = debounce(async () => {
    for (let field of fields) {
      // Assign defaults to empty fields to prevent validation issues
      if (!(field in row)) {
        row[field] = DEFAULTS_FOR_TYPE[schema[field].type]
      }
    }

    const response = await saveRow(row)

    if (!response.error) {
      // store.update(state => {
      //   state[table._id] = state[table._id]
      //     ? [...state[table._id], json]
      //     : [json]
      //   return state
      // })

      errors = {}

      // wipe form, if new row, otherwise update
      // table to get new _rev
      row = isNew ? { tableId: table._id } : response

      onClosed()
      dispatch("newRow")
    } else {
      errors = [response.error]
    }
  })

  onMount(async () => {
    const routeParams = $routeStore.routeParams
    rowId =
      Object.keys(routeParams).length > 0 && (routeParams.id || routeParams[0])
    isNew = !rowId || rowId === "new"

    if (isNew) {
      row = { tableId: table }
      return
    }

    row = await fetchRow({ tableId: table._id, rowId })
  })
</script>

<div class="actions">
  {#each errorMessages as error}
    <p class="error">{error}</p>
  {/each}
  <form on:submit|preventDefault>
    {#each fields as field}
      <div class="form-item">
        <Label small forAttr={'form-stacked-text'}>{field}</Label>
        {#if schema[field].type === 'string' && schema[field].constraints.inclusion}
          <select bind:value={row[field]}>
            {#each schema[field].constraints.inclusion as opt}
              <option>{opt}</option>
            {/each}
          </select>
        {:else if schema[field].type === 'datetime'}
          <DatePicker bind:value={row[field]} />
        {:else if schema[field].type === 'boolean'}
          <input class="input" type="checkbox" bind:checked={row[field]} />
        {:else if schema[field].type === 'number'}
          <input class="input" type="number" bind:value={row[field]} />
        {:else if schema[field].type === 'string'}
          <input class="input" type="text" bind:value={row[field]} />
        {:else if schema[field].type === 'longform'}
          <RichText bind:value={row[field]} />
        {:else if schema[field].type === 'attachment'}
          <Dropzone bind:files={row[field]} />
        {/if}
      </div>
      <hr />
    {/each}
  </form>
</div>
<footer>
  <div class="button-margin-3">
    <Button secondary on:click={onClosed}>Cancel</Button>
  </div>
  <div class="button-margin-4">
    <Button primary on:click={save}>Save</Button>
  </div>
</footer>

<style>
  .actions {
    padding: var(--spacing-l) var(--spacing-xl);
  }

  footer {
    padding: 20px 30px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 20px;
    background: var(--grey-1);
    border-bottom-left-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
  }

  .button-margin-3 {
    grid-column-start: 3;
    display: grid;
  }

  .button-margin-4 {
    grid-column-start: 4;
    display: grid;
  }
</style>
