<script>
  import { join } from "lodash/fp"

  export let values
  export let label

  const inputChanged = ev => {
    try {
      values = ev.target.value.split("\n")
    } catch (_) {
      values = []
    }
  }

  $: valuesText = join("\n")(values)
</script>

<div class="values-main">
  <label class="label">{label}</label>
  <div class="uk-form-controls">
    <textarea value={valuesText} on:change={inputChanged} />
  </div>
</div>

<style>
  textarea {
    width: 95%;
    height: 100px;
    border-radius: 3px;
    border-color: #DBDBDB;
    font-size: 14px;
    padding: 10px;
    margin-top: 5px;
  }
</style>
