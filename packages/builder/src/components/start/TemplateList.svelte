<script>
  import { Heading, Layout, Icon, Body } from "@budibase/bbui"
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
    {#if templates?.length > 0}
      <Body size="M">Select a template below, or start from scratch.</Body>
    {:else}
      <Body size="M">Start your app from scratch below.</Body>
    {/if}
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
    </div>
  {:catch err}
    <h1 style="color:red">{err}</h1>
  {/await}
  <div class="template start-from-scratch" on:click={() => onSelect(null)}>
    <div
      class="background-icon"
      style={`background: rgb(50, 50, 50); color: white;`}
    >
      <Icon name="Add" />
    </div>
    <Heading size="XS">Start from scratch</Heading>
    <p class="detail">BLANK</p>
  </div>
  <div
    class="template import"
    on:click={() => onSelect(null, { useImport: true })}
  >
    <div
      class="background-icon"
      style={`background: rgb(50, 50, 50); color: white;`}
    >
      <Icon name="Add" />
    </div>
    <Heading size="XS">Import an app</Heading>
    <p class="detail">BLANK</p>
  </div>
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
    min-height: 60px;
    display: grid;
    grid-gap: var(--layout-s);
    grid-template-columns: auto 1fr auto;
    border: 1px solid #494949;
    align-items: center;
    cursor: pointer;
    border-radius: 4px;
    background: var(--background-alt);
    padding: 8px 16px;
  }

  .detail {
    text-align: right;
  }

  .start-from-scratch {
    background: var(--spectrum-global-color-gray-50);
    margin-top: 20px;
  }

  .import {
    background: var(--spectrum-global-color-gray-50);
  }
</style>
