<script>
  import { onMount } from "svelte"
  import { Input, TextArea, Spacer } from "@budibase/bbui"
  import api from "builderStore/api"

  const INTEGRATION_ICON_MAP = {
    POSTGRES: "ri-database-2-line",
  }

  export let integration = {}

  let integrationsPromise = fetchIntegrations()
  let selectedIntegration
  let integrations = []

  async function fetchIntegrations() {
    const response = await api.get("/api/integrations")
    const json = await response.json()
    integrations = json
    return json
  }

  onMount(() => {
    fetchIntegrations()
  })
</script>

<section>
  <div class="integration-list">
    {#each Object.keys(integrations) as integrationType}
      <div
        class="integration hoverable"
        class:selected={integration.type === integrationType}
        on:click={() => {
          selectedIntegration = integrations[integrationType].datasource
          integration = { type: integrationType, ...Object.keys(selectedIntegration).reduce(
              (acc, next) => {
                return {
                  ...acc,
                  [next]: selectedIntegration[next].default,
                }
              },
              {}
            ) }
        }}>
        <i class="ri-database-2-line" />
        <span>{integrationType}</span>
      </div>
    {/each}
  </div>

  {#if selectedIntegration}
    {#each Object.keys(selectedIntegration) as configKey}
      <Input
        thin
        type={selectedIntegration[configKey].type}
        label={configKey}
        bind:value={integration[configKey]} />
      <Spacer medium />
    {/each}
  {/if}
</section>

<style>
  section {
    display: grid;
  }

  .integration-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: var(--spacing-m);
  }

  .integration {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 5px;
    transition: 0.3s all;
    border-radius: var(--border-radius-s);
  }

  span {
    font-size: var(--font-size-xs);
    margin-bottom: var(--spacing-xs);
  }

  .integration:hover,
  .selected {
    background-color: var(--grey-3);
  }
</style>
