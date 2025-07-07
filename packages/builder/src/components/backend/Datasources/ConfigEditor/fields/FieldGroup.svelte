<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { Layout, Accordion } from "@budibase/bbui"
  import ConfigInput from "../ConfigInput.svelte"

  export let value: any[]
  export let name: string
  export let config: { openByDefault: boolean } | undefined

  let dispatch = createEventDispatcher<{ change: any }>()

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
        on:change={e => handleChange(field.key, e.detail)}
      />
    {/each}
  </Layout>
</Accordion>
