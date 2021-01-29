<script>
  import SpectrumField from "./SpectrumField.svelte"
  import Dropzone from "../attachments/Dropzone.svelte"

  export let field
  export let label

  let previousFiles = []
  let files = []
  $: {
    // Only actually update the value when it changes, so that we don't trigger
    // validation unnecessarily
    if (files !== previousFiles) {
      fieldApi?.setValue(files)
      previousFiles = files
    }
  }

  let fieldState
  let fieldApi
</script>

<SpectrumField {label} {field} bind:fieldState bind:fieldApi>
  {#if fieldState}
    <Dropzone bind:files />
  {/if}
</SpectrumField>
