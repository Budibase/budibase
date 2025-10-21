<script lang="ts">
  import {
    type AutomationStep,
    type AutomationTrigger,
    type EnrichedBinding,
  } from "@budibase/types"
  import { PropField } from "."
  import { type SchemaConfigProps } from "@/types/automations"

  export let block: AutomationStep | AutomationTrigger | undefined = undefined
  export let context: {} | undefined
  export let bindings: EnrichedBinding[] | undefined = undefined
  export let layout: SchemaConfigProps[] | undefined
</script>

{#if layout}
  {#each layout as config}
    {#if config.wrapped === false}
      <svelte:component
        this={config.comp}
        {...config?.props ? config.props() : {}}
        {bindings}
        {block}
        {context}
        on:change={e => {
          if (config?.onChange) config.onChange(e)
        }}
      />
    {:else}
      <PropField
        label={config.title}
        labelTooltip={config.tooltip || ""}
        fullWidth
      >
        <svelte:component
          this={config.comp}
          {...config?.props ? config.props() : {}}
          {bindings}
          {block}
          {context}
          on:change={e => {
            if (config?.onChange) config.onChange(e)
          }}
        />
      </PropField>
    {/if}
  {/each}
{/if}
