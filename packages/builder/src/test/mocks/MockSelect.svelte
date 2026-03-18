<script lang="ts">
  export let label = ""
  export let value: any = ""
  export let options: any[] = []
  export let disabled = false
  export let getOptionLabel = (option: any) => option?.label ?? option
  export let getOptionValue = (option: any) => option?.value ?? option
</script>

<label>
  <span>{label}</span>
  <select aria-label={label} bind:value {disabled}>
    {#each options as option}
      <option value={getOptionValue(option)}>{getOptionLabel(option)}</option>
    {/each}
  </select>
</label>
