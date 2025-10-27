<script lang="ts">
  import Button from "./_Button.svelte"
  import Form from "./_Form.svelte"
  import type { ComponentPayload } from "@budibase/types"

  export let data: ComponentPayload
</script>

<div class="component-preview">
  {#if data.name === "Button"}
    <Button {data} />
  {:else if data.name === "Form"}
    <Form {data} />
  {:else}
    <p class="unsupported">Unsupported component: {data.name}</p>
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
