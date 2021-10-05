<script>
  import { Heading, Body, Layout } from "@budibase/bbui"
  import Spinner from "components/common/Spinner.svelte"
  import api from "builderStore/api"

  export let onSelect

  async function fetchTemplates() {
    const response = await api.get("/api/templates?type=app")
    return await response.json()
  }

  let templatesPromise = fetchTemplates()
</script>

<Layout gap="XS" noPadding>
  {#await templatesPromise}
    <div class="spinner-container">
      <Spinner size="30" />
    </div>
  {:then templates}
    <div class="templates">
      {#each templates as template}
        <Layout gap="XS" noPadding>
          <img
            alt="template"
            on:click={() => onSelect(template)}
            src={template.image}
            width="100%"
          />
          <Heading size="XS">{template.name}</Heading>
          <Body size="S" black>{template.description}</Body>
        </Layout>
      {/each}
    </div>
  {:catch err}
    <h1 style="color:red">{err}</h1>
  {/await}
</Layout>

<style>
  .templates {
    display: grid;
    width: 100%;
    grid-template-columns: 1fr 1fr;
    grid-gap: var(--layout-m);
    justify-content: start;
    margin-top: var(--layout-s);
  }

  img {
    margin-bottom: var(--layout-s);
    cursor: pointer;
  }
</style>
