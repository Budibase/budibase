<script>
  import { onMount } from "svelte"
  import api from "builderStore/api"
  import ICONS from "../icons"

  export let integration = {}

  let schema
  let integrations = []

  async function fetchIntegrations() {
    const response = await api.get("/api/integrations")
    const json = await response.json()

    integrations = json
    return json
  }

  function selectIntegration(integrationType) {
    schema = integrations[integrationType].datasource
    integration = {
      type: integrationType,
      ...Object.keys(schema).reduce(
        (acc, next) => ({ ...acc, [next]: schema[next].default }),
        {}
      ),
    }
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
        on:click={() => selectIntegration(integrationType)}>
        <svelte:component
          this={ICONS[integrationType]}
          height="100"
          width="100" />
        <span>{integrationType}</span>
      </div>
    {/each}
  </div>
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
    height: 75px;
    width: 200px;
  }

  span {
    font-size: var(--font-size-xs);
    margin-top: var(--spacing-m);
    margin-bottom: var(--spacing-xs);
  }

  .integration:hover,
  .selected {
    background-color: var(--grey-3);
  }
</style>
