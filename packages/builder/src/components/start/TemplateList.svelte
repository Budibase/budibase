<script>
  import { Heading, Layout, Icon } from "@budibase/bbui"
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
        <div class="template" on:click={() => onSelect(template)}>
          <div
            class="background-icon"
            style={`background: ${template.background};`}
          >
            <Icon name={template.icon} />
          </div>
          <Heading size="XS">{template.name}</Heading>
          <p class="detail">{template?.category?.toUpperCase()}</p>
        </div>
      {/each}
      <div class="template start-from-scratch" on:click={() => onSelect(null)}>
        <div class="background-icon" style={`background: var(--background);`}>
          <Icon name="Add" />
        </div>
        <Heading size="XS">Start from scratch</Heading>
        <p class="detail">BLANK</p>
      </div>
    </div>
  {:catch err}
    <h1 style="color:red">{err}</h1>
  {/await}
</Layout>

<style>
  .templates {
    display: grid;
    width: 100%;
    grid-gap: var(--spacing-m);
    grid-template-columns: 1fr;
    justify-content: start;
    margin-top: 15px;
  }

  .background-icon {
    padding: 10px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    color: white;
  }

  .template {
    height: 60px;
    display: grid;
    grid-gap: var(--layout-m);
    grid-template-columns: 5% 1fr 15%;
    border: 1px solid #494949;
    align-items: center;
    cursor: pointer;
    border-radius: 4px;
    background: #1a1a1a;
    padding: 8px 16px;
  }

  .detail {
    text-align: right;
  }

  .start-from-scratch {
    background: var(--spectrum-global-color-gray-50);
    margin-top: 20px;
  }
</style>
