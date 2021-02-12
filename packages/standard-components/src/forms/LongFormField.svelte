<script>
  import { onMount } from "svelte"
  import { RichText } from "@budibase/bbui"
  import Field from "./Field.svelte"

  export let field
  export let label
  export let placeholder

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

<Field
  {label}
  {field}
  type="longform"
  bind:fieldState
  bind:fieldApi
  defaultValue="">
  {#if mounted}
    <div>
      <RichText bind:value {options} />
    </div>
  {/if}
</Field>

<style>
  div {
    background-color: white;
  }
  div :global(> div) {
    width: auto !important;
  }
  div :global(.ql-snow.ql-toolbar:after, .ql-snow .ql-toolbar:after) {
    display: none;
  }
  div :global(.ql-snow .ql-formats:after) {
    display: none;
  }
  div :global(.ql-editor p) {
    word-break: break-all;
  }
</style>
