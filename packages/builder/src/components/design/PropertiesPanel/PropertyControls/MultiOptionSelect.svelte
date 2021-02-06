<script>
  import { Multiselect } from "@budibase/bbui"

  export let options = []
  export let value = []
  export let onChange = () => {}

  let boundValue = getValidOptions(value, options)

  function getValidOptions(selectedOptions, allOptions) {
    // Fix the hardcoded default string value
    if (!Array.isArray(selectedOptions)) {
      selectedOptions = []
    }
    return selectedOptions.filter(val => allOptions.indexOf(val) !== -1)
  }

  function setValue(value) {
    boundValue = getValidOptions(value.detail, options)
    onChange(boundValue)
  }
</script>

<div>
  <Multiselect
    align="right"
    extraThin
    secondary
    value={boundValue}
    on:change={setValue}>
    {#each options as option}
      <option value={option}>{option}</option>
    {/each}
  </Multiselect>
</div>

<style>
  div {
    flex: 1 1 auto;
  }
</style>
