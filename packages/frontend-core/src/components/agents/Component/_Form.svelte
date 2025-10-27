<script lang="ts">
  import type { ComponentPayload } from "@budibase/types"
  import FormField from "./_FormField.svelte"

  export let data: ComponentPayload

  const fields = Array.isArray(data.children) ? data.children : []
  const description =
    typeof data.props?.description === "string" ? data.props.description : ""
  const showHeader = typeof data.slot === "string" && data.slot.trim().length
</script>

<div class="form-preview">
  {#if showHeader}
    <h3 class="form-preview__title">{data.slot}</h3>
  {/if}
  {#if description}
    <p class="form-preview__description">{description}</p>
  {/if}

  {#if fields.length}
    <div class="form-preview__fields">
      {#each fields as field, index (field.name + index)}
        <FormField data={field} />
      {/each}
    </div>
  {:else}
    <p class="form-preview__empty">This form has no fields yet.</p>
  {/if}
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
