<script>
  import { onMount } from "svelte"
  import { fade } from "svelte/transition"
  import { Label, DatePicker } from "@budibase/bbui"
  import Dropzone from "./attachments/Dropzone.svelte"
  import debounce from "lodash.debounce"

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

  $: if (model && model.length !== 0) {
    fetchModel()
  }

  $: fields = schema ? Object.keys(schema) : []

  $: errorMessages = Object.entries(errors).map(
    ([field, message]) => `${field} ${message}`
  )

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
      }, 1000)
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

    const GET_RECORD_URL = `/api/${model}/records/${recordId}`
    const response = await _bb.api.get(GET_RECORD_URL)
    const json = await response.json()
    record = json
  })
</script>

<form class="form" on:submit|preventDefault>
  {#if title}
    <h1>{title}</h1>
  {/if}
  {#each errorMessages as error}
    <p class="error">{error}</p>
  {/each}
  <hr />
  <div class="form-content">
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
    <div class="button-block">
      <button on:click={save} class:saved>
        {#if saved}
          <div in:fade>
            <span class:saved>Success</span>
          </div>
        {:else}
          <div>{buttonText || 'Submit Form'}</div>
        {/if}
      </button>
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
    margin-bottom: 20px;
    width: 100%;
  }

  .input {
    border-radius: 5px;
    border: 1px solid #e6e6e6;
    padding: 1rem;
    font-size: 16px;
  }

  .form-item {
    display: flex;
    flex-direction: column;
    margin-bottom: 16px;
  }

  hr {
    border: 1px solid var(--grey-1);
    margin: 20px 0px;
  }

  hr:nth-last-child(2) {
    border: 1px solid #fff;
    margin: 20px 0px;
  }

  .button-block {
    display: flex;
    justify-content: flex-end;
  }

  button {
    font-size: 16px;
    padding: 0.4em;
    box-sizing: border-box;
    border-radius: 4px;
    color: white;
    background-color: #393c44;
    outline: none;
    width: 300px;
    height: 40px;
    cursor: pointer;
    transition: all 0.2s ease 0s;
    overflow: hidden;
    outline: none;
    user-select: none;
    white-space: nowrap;
    text-align: center;
  }

  button.saved {
    background-color: #84c991;
    border: none;
  }

  button:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  input[type="checkbox"] {
    width: 32px;
    height: 32px;
    padding: 0;
    margin: 0;
    vertical-align: bottom;
    position: relative;
    top: -1px;
    *overflow: hidden;
  }

  select::-ms-expand {
    display: none;
  }
  select {
    display: inline-block;
    cursor: pointer;
    align-items: baseline;
    box-sizing: border-box;
    padding: 1em 1em;
    border: 1px solid #eaeaea;
    border-radius: 5px;
    font: inherit;
    line-height: inherit;
    -webkit-appearance: none;
    -moz-appearance: none;
    -ms-appearance: none;
    appearance: none;
    background-repeat: no-repeat;
    background-image: linear-gradient(45deg, transparent 50%, currentColor 50%),
      linear-gradient(135deg, currentColor 50%, transparent 50%);
    background-position: right 17px top 1.5em, right 10px top 1.5em;
    background-size: 7px 7px, 7px 7px;
  }

  .error {
    color: red;
    font-weight: 500;
  }
</style>
