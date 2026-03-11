<script lang="ts">
  import MockSelect from "./MockSelect.svelte"

  export let value: any = ""
  export let options: any[] = []
  export let disabled = false
</script>

<MockSelect
  label="Select role"
  bind:value
  {options}
  {disabled}
  getOptionLabel={option => option.label}
  getOptionValue={option => option.value}
/>
