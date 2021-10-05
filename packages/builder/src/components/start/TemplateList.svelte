<script>
  import { Heading, Body } from "@budibase/bbui"
  import Spinner from "components/common/Spinner.svelte"
  import api from "builderStore/api"

  export let onSelect

  async function fetchTemplates() {
    const response = await api.get("/api/templates?type=app")
    return await response.json()
  }

  let templatesPromise = fetchTemplates()
</script>

<div class="root">
  {#await templatesPromise}
    <div class="spinner-container">
      <Spinner size="30" />
    </div>
  {:then templates}
    <div class="templates">
      {#each templates as template}
        <div class="templates-card">
          <img
            alt="template"
            on:click={() => onSelect(template)}
            src={template.image}
            width="100%"
          />
          <Heading size="XS">{template.name}</Heading>
          <Body size="S" black>{template.description}</Body>
        </div>
      {/each}
    </div>
  {:catch err}
    <h1 style="color:red">{err}</h1>
  {/await}
</div>

<style>
  .templates {
    display: grid;
    width: 100%;
    grid-template-columns: 1fr 1fr;
    grid-gap: var(--layout-m);
    justify-content: start;
  }

  .templates-card {
    background-color: var(--background);
  }

  img {
    height: 135px;
    width: 278px;
    margin-bottom: var(--layout-m);
    cursor: pointer;
  }
</style>
