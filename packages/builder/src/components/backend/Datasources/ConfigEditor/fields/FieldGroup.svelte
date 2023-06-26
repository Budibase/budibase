<script>
  import { createEventDispatcher } from "svelte"
  import { Label, Input, Layout, Accordion } from "@budibase/bbui"

  export let value
  export let name

  let dispatch = createEventDispatcher()

  const handleChange = (updatedFieldKey, updatedFieldValue) => {
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
  initialOpen={Object.values(value).some(properties => !!properties.value)}
  header={name}
>
  <Layout gap="S">
    {#each value as field}
      <div class="form-row">
        <Label>{field.name}</Label>
        <Input
          type={field.type}
          on:change={e => handleChange(field.key, e.detail)}
          value={field.value}
        />
      </div>
    {/each}
  </Layout>
</Accordion>

<style>
  .form-row {
    display: grid;
    grid-template-columns: 20% 1fr;
    grid-gap: var(--spacing-l);
    align-items: center;
  }
</style>
