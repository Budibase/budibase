<script>
  import Field from "./Field.svelte"
  import Dropzone from "../attachments/Dropzone.svelte"
  import { onMount } from "svelte"

  export let field
  export let label

  let fieldState
  let fieldApi

  // Update form value from bound value after we've mounted
  let value
  let mounted = false
  $: mounted && fieldApi?.setValue(value)

  // Get the fields initial value after initialising
  onMount(() => {
    value = $fieldState?.value
    mounted = true
  })
</script>

<Field
  {label}
  {field}
  type="attachment"
  bind:fieldState
  bind:fieldApi
  defaultValue={[]}>
  {#if mounted}
    <Dropzone bind:files={value} />
  {/if}
</Field>
