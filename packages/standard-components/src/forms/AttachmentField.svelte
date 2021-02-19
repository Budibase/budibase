<script>
  import Field from "./Field.svelte"
  import Dropzone from "../attachments/Dropzone.svelte"
  import { onMount } from "svelte"

  export let field
  export let label
  export let disabled = false

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
  {disabled}
  type="attachment"
  bind:fieldState
  bind:fieldApi
  defaultValue={[]}>
  {#if mounted}
    <div class:disabled={$fieldState.disabled}>
      <Dropzone bind:files={value} />
    </div>
  {/if}
</Field>

<style>
  div.disabled :global(> *) {
    background-color: var(--spectrum-global-color-gray-200) !important;
    pointer-events: none !important;
  }
</style>
