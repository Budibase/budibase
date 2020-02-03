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

<div class="uk-margin">
  <label class="uk-form-label">{label}</label>
  <div class="uk-form-controls">
    <textarea value={valuesText} on:change={inputChanged} />
  </div>
</div>

<style>
  textarea {
    width: 300px;
    height: 200px;
  }
</style>
