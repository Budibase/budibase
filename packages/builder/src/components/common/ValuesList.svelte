<script>
  import { join } from "lodash/fp"
  import { TextArea, Label } from "@budibase/bbui"

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

<div class="container">
  <TextArea {label} value={valuesText} thin on:change={inputChanged} />
</div>

<style>
  .container :global(textarea) {
    min-height: 100px;
  }
</style>
