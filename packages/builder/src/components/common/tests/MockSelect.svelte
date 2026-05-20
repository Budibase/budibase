<script lang="ts">
  import { createEventDispatcher } from "svelte"

  export let label = ""
  export let value: any = ""
  export let options: any[] = []
  export let disabled = false
  export let placeholder: string | boolean = "Choose an option"
  export let getOptionLabel = (option: any) => option?.label ?? option
  export let getOptionValue = (option: any) => option?.value ?? option

  const dispatch = createEventDispatcher()

  const onChange = (event: Event) => {
    const target = event.target as HTMLSelectElement
    value = target.value
    dispatch("change", target.value)
  }
</script>

<label>
  <span>{label}</span>
  <select aria-label={label || "Select"} {disabled} {value} on:change={onChange}>
    {#if placeholder && value == null}
      <option value="">{placeholder}</option>
    {/if}
    {#each options as option}
      <option value={getOptionValue(option)}>{getOptionLabel(option)}</option>
    {/each}
  </select>
</label>
