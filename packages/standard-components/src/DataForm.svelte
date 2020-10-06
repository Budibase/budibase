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
  import LinkedRecordSelector from "./LinkedRecordSelector.svelte"
  import debounce from "lodash.debounce"
  import ErrorsBox from "./ErrorsBox.svelte"
  import { capitalise } from "./helpers"

  export let _bb
  export let model
  export let title
  export let buttonText

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

  let record
  let store = _bb.store
  let schema = {}
  let modelDef = {}
  let saved = false
  let recordId
  let isNew = true
  let errors = {}

  $: fields = schema ? Object.keys(schema) : []
  $: if (model && model.length !== 0) {
    fetchModel()
  }

  async function fetchModel() {
    const FETCH_MODEL_URL = `/api/models/${model}`
    const response = await _bb.api.get(FETCH_MODEL_URL)
    modelDef = await response.json()
    schema = modelDef.schema
    record = {
      modelId: model,
    }
  }

  const save = debounce(async () => {
    for (let field of fields) {
      // Assign defaults to empty fields to prevent validation issues
      if (!(field in record)) {
        record[field] = DEFAULTS_FOR_TYPE[schema[field].type]
      }
    }

    const SAVE_RECORD_URL = `/api/${model}/records`
    const response = await _bb.api.post(SAVE_RECORD_URL, record)

    const json = await response.json()

    if (response.status === 200) {
      store.update(state => {
        state[model] = state[model] ? [...state[model], json] : [json]
        return state
      })

      errors = {}

      // wipe form, if new record, otherwise update
      // model to get new _rev
      record = isNew ? { modelId: model } : json

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
    recordId =
      Object.keys(routeParams).length > 0 && (routeParams.id || routeParams[0])
    isNew = !recordId || recordId === "new"

    if (isNew) {
      record = { modelId: model }
      return
    }

    const GET_RECORD_URL = `/api/${model}/records/${recordId}`
    const response = await _bb.api.get(GET_RECORD_URL)
    record = await response.json()
  })
</script>

<form class="form" on:submit|preventDefault>
  {#if title}
    <h1>{title}</h1>
  {/if}
  <div class="form-content">
    <ErrorsBox {errors} />
    {#each fields as field}
      {#if schema[field].type === 'options'}
        <Select
          secondary
          label={capitalise(schema[field].name)}
          bind:value={record[field]}>
          <option value="">Choose an option</option>
          {#each schema[field].constraints.inclusion as opt}
            <option>{opt}</option>
          {/each}
        </Select>
      {:else if schema[field].type === 'datetime'}
        <DatePicker
          label={capitalise(schema[field].name)}
          bind:value={record[field]} />
      {:else if schema[field].type === 'boolean'}
        <Toggle
          text={capitalise(schema[field].name)}
          bind:checked={record[field]} />
      {:else if schema[field].type === 'number'}
        <Input
          label={capitalise(schema[field].name)}
          type="number"
          bind:value={record[field]} />
      {:else if schema[field].type === 'string'}
        <Input
          label={capitalise(schema[field].name)}
          bind:value={record[field]} />
      {:else if schema[field].type === 'attachment'}
        <div>
          <Label extraSmall grey>{schema[field].name}</Label>
          <Dropzone bind:files={record[field]} />
        </div>
      {:else if schema[field].type === 'link'}
        <LinkedRecordSelector
          secondary
          bind:linkedRecords={record[field]}
          schema={schema[field]} />
      {/if}
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

  .buttons {
    display: flex;
    justify-content: flex-end;
  }
</style>
