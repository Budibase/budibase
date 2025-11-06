<script lang="ts">
  import Button from "./_Button.svelte"
  import Form from "./_Form.svelte"
  import type { ComponentPayload } from "@budibase/types"

  export let data: ComponentPayload

  $: type = data.type
</script>

<div class="component-preview">
  {#if data.type === "Button"}
    <Button {...data.props} />
  {:else if data.type === "Form"}
    <Form {data} on:submit />
  {:else}
    <p class="unsupported">Unsupported component type: {type}</p>
  {/if}
</div>

<style>
  .component-preview {
    display: inline-flex;
  }

  .unsupported {
    margin: 0;
    font-size: 16px;
  }
</style>
