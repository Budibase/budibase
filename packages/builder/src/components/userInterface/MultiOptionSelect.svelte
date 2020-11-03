<script>
  import { Multiselect } from "@budibase/bbui"

  export let options = []
  export let value = []
  export let styleBindingProperty
  export let onChange = () => {}

  let boundValue = getValidOptions(value, options)
  $: setValue(boundValue)
  $: sanitiseOptions(options)

  function getValidOptions(selectedOptions, allOptions) {
    return selectedOptions.filter(val => allOptions.indexOf(val) !== -1)
  }

  function setValue(val) {
    onChange(val)
  }

  function sanitiseOptions(options) {
    boundValue = getValidOptions(value, options)
  }
</script>

<div>
  <Multiselect extraThin secondary bind:value={boundValue}>
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
