<script lang="ts">
  import type { FormPayload } from "@budibase/types"
  import FormField from "./_FormField.svelte"
  import { Button } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"

  export let data: FormPayload

  const dispatch = createEventDispatcher<{
    submit: {
      componentId: string
      tableId: string
      values: Record<string, unknown>
    }
  }>()

  $: submitted = false
  $: props = data.props

  let formData: Record<string, unknown> = {}

  function submit() {
    submitted = true
    dispatch("submit", {
      componentId: data.componentId,
      tableId: props.tableId,
      values: { ...formData },
    })
  }
</script>

<form class="form-preview">
  {#if props.title}
    <h3 class="form-preview__title">{props.title}</h3>
  {/if}
  {#if props.message}
    <p class="form-preview__description">{props.message}</p>
  {/if}

  {#if props.fields.length}
    <div class="form-preview__fields">
      {#each props.fields as field, index (field.name + index)}
        <FormField
          bind:value={formData[field.name]}
          props={field}
          {submitted}
        />
      {/each}
    </div>
  {:else}
    <p class="form-preview__empty">This form has no fields yet.</p>
  {/if}
  <div class="form-submit">
    <Button type="submit" on:click={submit}>{props.submitButtonText}</Button>
  </div>
</form>

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

  .form-submit {
    display: flex;
    justify-content: flex-end;
  }
</style>
