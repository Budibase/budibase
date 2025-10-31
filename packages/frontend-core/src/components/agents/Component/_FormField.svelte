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
  export let submitted: boolean
  export let value: any

  $: type = props.type
</script>

<div class="form-field">
  {#if props.name}
    <Label>{props.name}</Label>
  {/if}

  {#if props.type === FormFieldType.Input}
    <Input bind:value />
  {:else if props.type === FormFieldType.InputNumber}
    <Input bind:value type="number" />
  {:else if props.type === FormFieldType.TextArea}
    <TextArea bind:value />
  {:else if props.type === FormFieldType.Select}
    <Select bind:value options={props.options} />
  {:else if props.type === FormFieldType.Checkbox}
    <Checkbox bind:value />
  {:else if props.type === FormFieldType.Toggle}
    <Toggle bind:value />
  {:else}
    <p class="unsupported">Unsupported field: {type}</p>
  {/if}

  {#if props.helpText}
    <p class="form-field__help">{props.helpText}</p>
  {/if}
  {#if props.errorText && submitted}
    <!-- <p class="form-field__error">{props.errorText}</p> -->
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

  /* .form-field__error {
    margin: 0;
    font-size: 12px;
    color: var(--spectrum-global-color-red-600);
  } */

  .unsupported {
    margin: 0;
    font-size: 14px;
    color: var(--spectrum-global-color-gray-700);
  }
</style>
