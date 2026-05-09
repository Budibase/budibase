<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { queries } from "@/stores/builder"
  import { DetailSummary, Divider } from "@budibase/bbui"
  import DrawerBindableInput from "@/components/common/bindings/DrawerBindableInput.svelte"
  import AutomationBindingPanel from "@/components/common/bindings/ServerBindingPanel.svelte"
  import PropField from "../PropField.svelte"
  import {
    type APIRequestStepInputs,
    type EnrichedBinding,
    type QueryParameter,
  } from "@budibase/types"
  import { type AutomationContext } from "@/stores/builder/automations"
  import { runtimeToReadableBinding } from "@/dataBinding"

  const dispatch = createEventDispatcher()

  export let value: Partial<APIRequestStepInputs["query"]> | undefined =
    undefined
  export let bindings: EnrichedBinding[] | undefined = undefined
  export let context: AutomationContext | undefined = undefined

  const onChange = (e: CustomEvent, field: QueryParameter) => {
    if (!value) value = {}
    value[field.name] = e.detail
    dispatch("change", value)
  }

  $: parameters = query?.parameters ?? []

  $: query = $queries.list.find(query => query._id === value?.queryId)

  const getFieldDefault = (name: string) => {
    if (!query?.fields) {
      return
    }
    const field = query?.parameters?.find(f => f.name === name)
    return runtimeToReadableBinding(bindings, field?.default)
  }
</script>

{#if parameters.length}
  <div class="wrap">
    <Divider noMargin />
    <DetailSummary name="Bindings" padded={false} initiallyShow>
      <span class="request-props">
        <div>
          Override your query bindings below. If no overrides are added, binding
          defaults will be used.
        </div>
        {#each parameters as field}
          <PropField label={field.name} fullWidth>
            <DrawerBindableInput
              placeholder={getFieldDefault(field.name)}
              {context}
              panel={AutomationBindingPanel}
              value={value?.[field.name]}
              on:change={e => onChange(e, field)}
              {bindings}
              updateOnChange={false}
            />
          </PropField>
        {/each}
      </span>
    </DetailSummary>
  </div>
{/if}

<style>
  .wrap,
  .request-props {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
  }

  .wrap :global(label) {
    text-transform: capitalize;
  }
</style>
