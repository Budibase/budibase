<script>
  import { Body } from "@budibase/bbui"
  import { onMount } from "svelte"
  import api from "builderStore/api"
  import ICONS from "../icons"

  export let integration = {}
  let integrations = []
  const INTERNAL = "BUDIBASE"

  async function fetchIntegrations() {
    const response = await api.get("/api/integrations")
    const json = await response.json()

    integrations = {
      [INTERNAL]: { datasource: {}, name: "INTERNAL/CSV" },
      ...json,
    }
    return json
  }

  function selectIntegration(integrationType) {
    const selected = integrations[integrationType]

    // build the schema
    const schema = {}
    for (let key of Object.keys(selected.datasource)) {
      schema[key] = selected.datasource[key].default
    }

    integration = {
      type: integrationType,
      plus: selected.plus,
      ...schema,
    }
  }

  onMount(() => {
    fetchIntegrations()
  })
</script>

<section>
  <div class="integration-list">
    {#each Object.entries(integrations) as [integrationType, schema]}
      <div
        class="integration hoverable"
        class:selected={integration.type === integrationType}
        on:click={() => selectIntegration(integrationType)}
      >
        <svelte:component
          this={ICONS[integrationType]}
          height="50"
          width="50"
        />
        <Body size="XS">{schema.name || integrationType}</Body>
      </div>
    {/each}
  </div>
</section>

<style>
  .integration-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    grid-gap: var(--spectrum-alias-grid-baseline);
  }

  .integration {
    display: grid;
    background: var(--background-alt);
    place-items: center;
    grid-gap: var(--spectrum-alias-grid-margin-xsmall);
    padding: var(--spectrum-alias-item-padding-s);
    transition: 0.3s all;
    border-radius: var(--spectrum-alias-item-rounded-border-radius-s);
  }

  .integration:hover,
  .selected {
    background: var(--spectrum-alias-background-color-tertiary);
  }
</style>
