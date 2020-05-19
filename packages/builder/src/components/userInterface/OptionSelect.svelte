<script>
  import { onMount } from "svelte"
  export let value = ""
  export let onChange = value => {}
  export let options = []
  export let initialValue = ""
  export let styleBindingProperty = ""

  const handleStyleBind = value =>
    !!styleBindingProperty ? { style: `${styleBindingProperty}: ${value}` } : {}

  $: isOptionsObject = options.every(o => typeof o === "object")

  onMount(() => {
    if (!value && !!initialValue) {
      value = initialValue
    }
  })
</script>

<select
  class="uk-select uk-form-small"
  {value}
  on:change={ev => onChange(ev.target.value)}>
  {#if isOptionsObject}
    {#each options as { value, label }}
      <option {...handleStyleBind(value || label)} value={value || label}>
        {label}
      </option>
    {/each}
  {:else}
    {#each options as value}
      <option {...handleStyleBind(value)} {value}>{value}</option>
    {/each}
  {/if}
</select>
