<script lang="ts">
  import Button from "./_Button.svelte"
  import Form from "./_Form.svelte"
  import MultiButton from "./_MultiButton.svelte"
  import type { ComponentPayload } from "@budibase/types"

  export let data: ComponentPayload
</script>

<div class="component-preview">
  {#if data.type === "Button"}
    <Button {data} />
  {:else if data.type === "Form"}
    <Form {data} />
  {:else if data.type === "MultiButton"}
    <MultiButton {data} />
  {:else}
    <p class="unsupported">Unsupported component: {data.type}</p>
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
