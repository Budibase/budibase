<script>
  import { Button, Heading } from "@budibase/bbui"
  import AppCard from "./AppCard.svelte"
  import Spinner from "components/common/Spinner.svelte"
  import api from "builderStore/api"

  export let onSelect

  async function fetchTemplates() {
    const response = await api.get("/api/templates?type=app")
    return await response.json()
  }

  let templatesPromise = fetchTemplates()
</script>

{#await templatesPromise}
  <div class="spinner-container">
    <Spinner />
  </div>
{:then templates}
  <div class="root">
    <Heading small black>Budibase Templates</Heading>
    <div class="templates">
      {#each templates as template}
        <div class="templates-card">
          <h3 class="template-title">{template.name}</h3>
          <Heading extraSmall black>{template.description}</Heading>
          <div class="card-footer">
            <Button secondary on:click={() => onSelect(template)}>
              Create {template.name}
            </Button>
          </div>
        </div>
      {/each}
    </div>
  </div>
{:catch err}
  <h1 style="color:red">{err}</h1>
{/await}

<style>
  .templates {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    grid-gap: var(--layout-m);
    justify-content: start;
  }

  .templates-card {
    background-color: var(--white);
    padding: var(--spacing-xl);
    max-width: 300px;
    max-height: 150px;
    border-radius: var(--border-radius-m);
    border: var(--border-dark);
  }

  h3 {
    font-size: var(--font-size-l);
    font-weight: 600;
    color: var(--ink);
    text-transform: capitalize;
  }

  .root {
    margin: 20px 80px;
  }
</style>
