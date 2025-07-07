<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { Layout, Accordion } from "@budibase/bbui"
  import ConfigInput from "../ConfigInput.svelte"
  import type { DatasourceFieldType } from "@budibase/types"

  interface FieldValue {
    key: string
    value: any
    name: string
    type: DatasourceFieldType
    error?: string | null | undefined
    config?: any
    placeholder?: string
  }

  export let value: FieldValue[]
  export let name: string
  export let config: { openByDefault?: boolean } | undefined

  let dispatch = createEventDispatcher<{
    change: { key: string; value: string }[]
  }>()

  const handleChange = (
    updatedFieldKey: string,
    updatedFieldValue: string | number
  ) => {
    const updatedValue = value.map(field => {
      return {
        key: field.key,
        value: field.key === updatedFieldKey ? updatedFieldValue : field.value,
      }
    })

    dispatch("change", updatedValue)
  }
</script>

<Accordion
  initialOpen={config?.openByDefault ||
    Object.values(value).some(properties => !!properties.value)}
  header={name}
>
  <Layout gap="S">
    {#each value as field}
      <ConfigInput
        {...field}
        error={field.error ?? null}
        on:change={e => handleChange(field.key, e.detail)}
      />
    {/each}
  </Layout>
</Accordion>
