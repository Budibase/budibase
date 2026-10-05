<svelte:options runes={true} />

<script lang="ts">
  import { Body, Input, Select } from "@budibase/bbui"
  import { isJSBinding } from "@budibase/string-templates"
  import type {
    EnrichedBinding,
    FunctionInputDefinition,
    JSONValue,
  } from "@budibase/types"
  import {
    DrawerBindableInput,
    DrawerBindableSlot,
    ServerBindingPanel as AutomationBindingPanel,
  } from "@/components/common/bindings"
  import CodeEditor from "@/components/common/CodeEditor/CodeEditor.svelte"
  import {
    bindingsToCompletions,
    EditorModes,
    hbAutocomplete,
  } from "@/components/common/CodeEditor"
  import {
    readableToRuntimeBinding,
    runtimeToReadableBinding,
  } from "@/dataBinding"
  import PropField from "./PropField.svelte"
  import { parseFunctionInputValue } from "./functionInputs"

  interface Props {
    inputSchema: FunctionInputDefinition[]
    value?: Record<string, JSONValue>
    bindings?: EnrichedBinding[]
    context?: object
    onchange?: (value: Record<string, JSONValue>) => void
  }

  let {
    inputSchema,
    value,
    bindings = [],
    context,
    onchange = () => {},
  }: Props = $props()
  const booleanOptions = [
    { label: "True", value: "true" },
    { label: "False", value: "false" },
  ]
  let completions = $derived([
    hbAutocomplete(bindingsToCompletions(bindings, EditorModes.Handlebars)),
  ])
  let errors = $state<Record<string, string | undefined>>({})

  const save = ({
    input,
    text,
  }: {
    input: FunctionInputDefinition
    text: string | number | null | undefined
  }) => {
    const result = parseFunctionInputValue({ input, text: String(text ?? "") })
    errors[input.name] = result.error
    if (result.error) {
      return
    }
    const inputs = { ...value }
    if (result.value === undefined) {
      delete inputs[input.name]
    } else {
      inputs[input.name] = result.value
    }
    onchange(inputs)
  }

  const displayValue = (inputValue: JSONValue | undefined) => {
    if (inputValue === undefined) {
      return ""
    }
    return typeof inputValue === "string"
      ? inputValue
      : JSON.stringify(inputValue, null, 2)
  }
</script>

<div class="inputs-editor">
  {#each inputSchema as input (input.name)}
    <PropField label={input.name} labelTooltip={input.description} fullWidth>
      {#if input.type === "string"}
        <DrawerBindableInput
          title={input.name}
          value={displayValue(value?.[input.name])}
          inputType="text"
          {bindings}
          {context}
          panel={AutomationBindingPanel}
          allowJS
          updateOnChange={false}
          on:change={(event: CustomEvent<string | number | null>) =>
            save({ input, text: event.detail })}
        />
      {:else if input.type === "number"}
        <DrawerBindableSlot
          title={input.name}
          type="number"
          value={displayValue(value?.[input.name])}
          {bindings}
          {context}
          panel={AutomationBindingPanel}
          allowJS
          updateOnChange={false}
          on:change={(event: CustomEvent<string>) =>
            save({ input, text: event.detail })}
        >
          <Input
            type="number"
            value={displayValue(value?.[input.name])}
            updateOnChange={false}
            on:change={(event: CustomEvent<string | number | null>) =>
              save({ input, text: event.detail })}
          />
        </DrawerBindableSlot>
      {:else}
        <DrawerBindableSlot
          title={input.name}
          type={input.type === "boolean" ? "boolean" : "json"}
          value={displayValue(value?.[input.name])}
          {bindings}
          {context}
          panel={AutomationBindingPanel}
          allowJS
          updateOnChange={false}
          showComponent={input.type !== "boolean" &&
            !isJSBinding(value?.[input.name])}
          on:change={(event: CustomEvent<string>) =>
            save({ input, text: event.detail })}
        >
          {#if input.type === "boolean"}
            <Select
              value={displayValue(value?.[input.name])}
              options={booleanOptions}
              on:change={(event: CustomEvent<string | undefined>) =>
                save({ input, text: event.detail })}
            />
          {:else}
            <div class="json-field">
              <CodeEditor
                value={runtimeToReadableBinding(
                  bindings,
                  displayValue(value?.[input.name])
                )}
                mode={EditorModes.JSON}
                {completions}
                {bindings}
                jsBindingWrapping={false}
                aiEnabled={false}
                lineWrapping
                on:blur={(event: CustomEvent<string>) =>
                  save({
                    input,
                    text: readableToRuntimeBinding(bindings, event.detail),
                  })}
              />
            </div>
          {/if}
        </DrawerBindableSlot>
      {/if}
      {#if errors[input.name]}
        <div role="alert">
          <Body size="S" color="var(--spectrum-global-color-red-700)">
            {errors[input.name]}
          </Body>
        </div>
      {/if}
    </PropField>
  {:else}
    <Body size="S">This Function has no inputs.</Body>
  {/each}
</div>

<style>
  .json-field {
    height: 120px;
    overflow: hidden;
    border: 1px solid var(--spectrum-global-color-gray-400);
    border-radius: var(--radius-m);
  }
  .inputs-editor {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }
</style>
