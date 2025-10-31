<script lang="ts">
  import {
    Checkbox,
    Input,
    Select,
    TextArea,
    Toggle,
    Label,
  } from "@budibase/bbui"
  import type { FormFieldPayload } from "@budibase/types"
  import { FormFieldType } from "@budibase/types"

  export let props: FormFieldPayload
</script>

<div class="form-field">
  {#if props.name}
    <Label>{props}</Label>
  {/if}

  {#if props.type === FormFieldType.Input}
    <Input />
  {:else if props.type === FormFieldType.TextArea}
    <TextArea />
  {:else if props.type === FormFieldType.Select}
    <Select />
  {:else if props.type === FormFieldType.Checkbox}
    <Checkbox />
  {:else if props.type === FormFieldType.Toggle}
    <Toggle />
  {:else}
    <p class="unsupported">Unsupported field: {props.name}</p>
  {/if}

  {#if props.helpText}
    <p class="form-field__help">{props.helpText}</p>
  {/if}
  {#if props.errorText}
    <p class="form-field__error">{props.errorText}</p>
  {/if}
</div>

<style>
  .form-field {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s, 8px);
  }

  .form-field__help {
    margin: 0;
    font-size: 12px;
    color: var(--spectrum-global-color-gray-600);
  }

  .form-field__error {
    margin: 0;
    font-size: 12px;
    color: var(--spectrum-global-color-red-600);
  }

  .unsupported {
    margin: 0;
    font-size: 14px;
    color: var(--spectrum-global-color-gray-700);
  }
</style>
