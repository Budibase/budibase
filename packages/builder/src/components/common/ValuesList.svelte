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

<div class="margin">
  <label class="label">{label}</label>

  <textarea value={valuesText} on:change={inputChanged} />

</div>

<style>
  .margin {
    margin-bottom: 16px;
    display: grid;
  }
  .label {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 8px;
  }
  textarea {
    font-size: 14px;
    height: 200px;
    width: 100%;
    border-radius: 5px;
    border: none;
    cursor: text;
    background: var(--grey-2);
    padding: 12px;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    font-family: Inter;
  }
</style>
