<script>
  import { Select } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  const dispatch = createEventDispatcher()

  export let value
  export let options

  $: dispatch("change", value)
</script>

<Select label={false} bind:value>
  <option value="">Choose an option</option>
  {#each options as option}
    <option value={option}>{option}</option>
  {/each}
</Select>
