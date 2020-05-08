<script>
  import { onMount } from "svelte"
  export let value = ""
  export let onChange = value => {}
  export let options = []
  export let initialValue = ""
  export let styleBindingProperty = ""

  $: bindOptionToStyle = !!styleBindingProperty

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
  {#each options as { value, label }}
    {#if bindOptionToStyle}
      <option
        style={`${styleBindingProperty}: ${value || label};`}
        value={value || label}>
        {label}
      </option>
    {:else}
      <option value={value || label}>{label}</option>
    {/if}
  {/each}
</select>
