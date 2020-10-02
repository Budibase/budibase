<script>
  import { onMount, createEventDispatcher } from "svelte"
  import { fade } from "svelte/transition"
  import { Button, Label, DatePicker } from "@budibase/bbui"
  import Dropzone from "../../attachments/Dropzone.svelte"
  import debounce from "lodash.debounce"
  const dispatch = createEventDispatcher()

  const DEFAULTS_FOR_TYPE = {
    string: "",
    boolean: false,
    number: null,
    link: [],
  }

  export let _bb
  export let model
  export let onClosed

  let record = { modelId: model._id }
  let store = _bb.store
  let schema = model.schema
  let saved = false
  let recordId
  let isNew = true
  let errors = {}

  $: fields = schema ? Object.keys(schema) : []

  $: errorMessages = Object.entries(errors).map(
    ([field, message]) => `${field} ${message}`
  )

  const save = debounce(async () => {
    for (let field of fields) {
      // Assign defaults to empty fields to prevent validation issues
      if (!(field in record)) {
        record[field] = DEFAULTS_FOR_TYPE[schema[field].type]
      }
    }

    const SAVE_RECORD_URL = `/api/${model._id}/records`
    const response = await _bb.api.post(SAVE_RECORD_URL, record)

    const json = await response.json()

    if (response.status === 200) {
      store.update(state => {
        state[model._id] = state[model._id]
          ? [...state[model._id], json]
          : [json]
        return state
      })

      errors = {}

      // wipe form, if new record, otherwise update
      // model to get new _rev
      record = isNew ? { modelId: model._id } : json

      onClosed()
      dispatch("newRecord")
    }

    if (response.status === 400) {
      errors = json.errors
    }
  })

  onMount(async () => {
    const routeParams = _bb.routeParams()
    recordId =
      Object.keys(routeParams).length > 0 && (routeParams.id || routeParams[0])
    isNew = !recordId || recordId === "new"

    if (isNew) {
      record = { modelId: model }
      return
    }

    const GET_RECORD_URL = `/api/${model._id}/records/${recordId}`
    const response = await _bb.api.get(GET_RECORD_URL)
    const json = await response.json()
    record = json
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
          <select bind:value={record[field]}>
            {#each schema[field].constraints.inclusion as opt}
              <option>{opt}</option>
            {/each}
          </select>
        {:else if schema[field].type === 'datetime'}
          <DatePicker bind:value={record[field]} />
        {:else if schema[field].type === 'boolean'}
          <input class="input" type="checkbox" bind:checked={record[field]} />
        {:else if schema[field].type === 'number'}
          <input class="input" type="number" bind:value={record[field]} />
        {:else if schema[field].type === 'string'}
          <input class="input" type="text" bind:value={record[field]} />
        {:else if schema[field].type === 'attachment'}
          <Dropzone bind:files={record[field]} />
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
