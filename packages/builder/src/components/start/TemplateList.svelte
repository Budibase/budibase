<script>
  import { Button, Heading, Body } from "@budibase/bbui"
  import Spinner from "components/common/Spinner.svelte"
  import api from "builderStore/api"
  import { _ as t } from "svelte-i18n"

  export let onSelect

  async function fetchTemplates() {
    const response = await api.get("/api/templates?type=app")
    return await response.json()
  }

  let templatesPromise = fetchTemplates()
</script>

<div class="root">
  <Heading size="M">{ $t('start-with-a-template') }</Heading>
  {#await templatesPromise}
    <div class="spinner-container">
      <Spinner size="30" />
    </div>
  {:then templates}
    <div class="templates">
      {#each templates as template}
        <div class="templates-card">
          <Heading size="S">{template.name}</Heading>
          <Body size="M" grey>{template.category}</Body>
          <Body size="S" black>{template.description}</Body>
          <div><img alt="template" src={template.image} width="100%" /></div>
          <div class="card-footer">
            <Button secondary on:click={() => onSelect(template)}>
              { $t('create') }
              {template.name}
            </Button>
          </div>
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
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    grid-gap: var(--layout-m);
    justify-content: start;
  }

  .templates-card {
    background-color: var(--background);
    padding: var(--spacing-xl);
    border-radius: var(--border-radius-m);
    border: var(--border-dark);
  }

  .card-footer {
    margin-top: var(--spacing-m);
  }
</style>
