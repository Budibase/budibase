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

<form class="form" on:submit|preventDefault>
  <div class="form-content">
    {#each fields as field}
      <div class="form-item">
        <label class="form-label" for="form-stacked-text">{field}</label>
        <input
          class="input"
          placeholder={field}
          type={schema[field].type === 'string' ? 'text' : schema[field].type}
          on:change={handleInput(field)} />
      </div>
      <hr />
    {/each}
    <div class="button-block">
      <button on:click={save}>Submit Form</button>
    </div>
  </div>
</form>

<style>
  .form {
    align-items: center;
    width: 100%;
  }

  .form-content {
    margin-bottom: 20px;
    justify-content: space-between;
    align-items: baseline;
  }

  .input {
    width: 600px;
    height: 40px;
    border-radius: 5px;
    border: 1px solid #e6e6e6;
    padding: 6px 12px 6px 12px;
    font-size: 16px;
  }

  .form-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .form-label {
    font-weight: bold;
    margin-bottom: 8px;
  }

  hr {
    border: 1px solid #fafafa;
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
    font-family: roboto;
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

  button:hover {
    background-color: white;
    border-color: #393c44;
    color: #393c44;
  }
</style>
