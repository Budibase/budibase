<script lang="ts">
  import type { FormPayload } from "@budibase/types"
  import FormField from "./_FormField.svelte"
  import { Button } from "@budibase/bbui"

  export let data: FormPayload

  $: submitted = false
  $: props = data.props
</script>

<div class="form-preview">
  {#if props.title}
    <h3 class="form-preview__title">{props.title}</h3>
  {/if}
  {#if props.message}
    <p class="form-preview__description">{props.message}</p>
  {/if}

  {#if props.fields.length}
    <div class="form-preview__fields">
      {#each props.fields as field, index (field.name + index)}
        <FormField props={field} {submitted} />
      {/each}
    </div>
  {:else}
    <p class="form-preview__empty">This form has no fields yet.</p>
  {/if}
  <Button>{props.submitButtonText}</Button>
</div>

<style>
  .form-preview {
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 12px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    background: var(--background, #fff);
    width: min(480px, 100%);
  }

  .form-preview__title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--spectrum-global-color-gray-900);
  }

  .form-preview__description {
    margin: 0;
    font-size: 14px;
    color: var(--spectrum-global-color-gray-600);
  }

  .form-preview__fields {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .form-preview__empty {
    margin: 0;
    font-size: 14px;
    color: var(--spectrum-global-color-gray-600);
  }
</style>
