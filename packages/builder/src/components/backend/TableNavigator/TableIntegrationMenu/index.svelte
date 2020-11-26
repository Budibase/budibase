<script>
  import { onMount } from "svelte"
  import { Input, TextArea } from "@budibase/bbui"
  import api from "builderStore/api"

  export let integration = {}

  let integrationsPromise = fetchIntegrations()
  let selectedIntegration

  async function fetchIntegrations() {
    const INTEGRATIONS_URL = `/api/integrations`
    const response = await api.get(INTEGRATIONS_URL)
    const json = await response.json()
    return json
  }
</script>

<section>
  {#await integrationsPromise}
    Loading integrations...
  {:then integrations}
    {#each Object.keys(integrations) as integrationType}
      <div
        on:click={() => {
          selectedIntegration = integrations[integrationType]
          integration.type = integrationType
        }}>
        <h6>{integrationType}</h6>
      </div>
    {/each}
  {:catch}
    shit itself
  {/await}

  {#if selectedIntegration}
    {#each Object.keys(selectedIntegration) as configKey}
      <Input
        thin
        type={configKey.type}
        label={configKey}
        bind:value={integration[configKey]} />
    {/each}
    <TextArea label={'Query'} bind:value={integration.query} />
  {/if}
</section>

<style>
  section {
    display: grid;
  }
</style>
