<script>
  import { onMount } from "svelte"

  export let _bb
  export let _instanceId
  export let model

  let username
  let password
  let newModel = {
    modelId: model,
  }
  let store = _bb.store
  let schema = {}
  let modelDef = {}

  $: if (model && model.length !== 0) {
    fetchModel()
  }

  $: fields = Object.keys(schema)

  async function fetchModel() {
    const FETCH_MODEL_URL = `/api/${_instanceId}/models/${model}`
    const response = await _bb.api.get(FETCH_MODEL_URL)
    modelDef = await response.json()
    schema = modelDef.schema
  }

  async function save() {
    const SAVE_RECORD_URL = `/api/${_instanceId}/${model}/records`
    const response = await _bb.api.post(SAVE_RECORD_URL, newModel)
    const json = await response.json()

    store.update(state => {
      state[model._id] = [...state[model], json]
      return state
    })
  }

  const handleInput = field => event => {
    let value

    if (event.target.type === "checkbox") {
      value = event.target.checked
      newModel[field] = value
      return
    }

    if (event.target.type === "number") {
      value = parseInt(event.target.value)
      newModel[field] = value
      return
    }

    value = event.target.value
    newModel[field] = value
  }
</script>

<form class="uk-form" on:submit|preventDefault>
  <h4>{modelDef.name}</h4>
  <div>
    {#each fields as field}
      <div class="uk-margin">
        <label class="form-label" for="form-stacked-text">{field}</label>
        <input
          class="uk-input"
          type={schema[field].type === 'string' ? 'text' : schema[field].type}
          on:change={handleInput(field)} />
      </div>
    {/each}
  </div>
  <button on:click={save}>SAVE</button>
</form>

<style>
  .form-label {
    font-weight: bold;
  }
</style>
