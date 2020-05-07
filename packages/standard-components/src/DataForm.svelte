<script>
  import { onMount } from "svelte"

  export let _bb
  export let _instanceId
  export let model

  let username
  let password
  let newModel = {
    modelId: model._id
  }
  let store = _bb.store

  $: fields = Object.keys(model.schema)

  async function save() {
    const SAVE_RECORD_URL = `/api/${_instanceId}/records`
    const response = await _bb.api.post(SAVE_RECORD_URL, newModel);
    const json = await response.json();

    store.update(state => {
      state[model._id] = [
        ...state[model._id],
        json
      ]
      return state
    });
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
  <h4>{model.name}</h4>
  <div>
    {#each fields as field}
      <div class="uk-margin">
        <label class="form-label" for="form-stacked-text">{field}</label>
        <input 
          class="uk-input" 
          type={model.schema[field].type === "string" ? "text" : model.schema[field].type}
          on:change={handleInput(field)}
        />
      </div>
    {/each}
  </div>
  <button on:click={save}>
    SAVE
  </button>
</form>

<style>
  .form-label {
    font-weight: bold;
  }
</style>
