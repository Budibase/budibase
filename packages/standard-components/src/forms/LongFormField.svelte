<script>
  import { RichText } from "@budibase/bbui"
  import SpectrumField from "./SpectrumField.svelte"

  export let field
  export let label
  export let placeholder

  let fieldState
  let fieldApi
  let previousValue = ""
  let value = ""

  $: {
    // Only actually update the value when it changes, so that we don't trigger
    // validation unnecessarily
    if (value !== previousValue) {
      fieldApi?.setValue(value)
      previousValue = value
    }
  }

  // Options for rich text component
  const options = {
    modules: {
      toolbar: [
        [
          {
            header: [1, 2, 3, false],
          },
        ],
        ["bold", "italic", "underline", "strike"],
      ],
    },
    placeholder: placeholder || "Type something...",
    theme: "snow",
  }
</script>

<SpectrumField {label} {field} bind:fieldState bind:fieldApi>
  {#if fieldState}
    <div>
      <RichText bind:value {options} />
    </div>
  {/if}
</SpectrumField>

<style>
  div {
    background-color: white;
  }
  div :global(.ql-snow.ql-toolbar:after, .ql-snow .ql-toolbar:after) {
    display: none;
  }
  div :global(.ql-snow .ql-formats:after) {
    display: none;
  }
</style>
