<script lang="ts">
  import { onMount } from "svelte"
  import {
    Button,
    Heading,
    Icon,
    Modal,
    notifications,
    Search,
  } from "@budibase/bbui"
  import { bb } from "@/stores/bb"
  import { sortedIntegrations as integrations } from "@/stores/builder/sortedIntegrations"
  import { restTemplates } from "@/stores/builder/restTemplates"
  import { IntegrationTypes } from "@/constants/backend"
  import RouteActions from "@/settings/components/RouteActions.svelte"
  import ImportRestTemplateModal from "./_components/ImportRestTemplateModal.svelte"
  import { createImportedRestConnection } from "./_components/createImportedRestConnection"

  $: locked = $bb.settings.locked
  $: restIntegration = ($integrations || []).find(
    integration => integration.name === IntegrationTypes.REST
  )

  let searchValue = ""
  let importTemplateModal: Modal

  onMount(() => {
    restTemplates.fetchCustom().catch(() => {
      notifications.error("There was a problem loading custom API templates")
    })
  })

  $: connectionCards = $restTemplates.templates
    .filter(template => {
      if (!searchValue) return true
      return template.name.toLowerCase().includes(searchValue.toLowerCase())
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  const handleSelect = (id: string) => {
    bb.settings(`/connections/apis/new/${id}`)
  }
</script>

<div class="connections">
  <RouteActions>
    {#if locked}
      <Button secondary on:click={() => bb.clearSettings()}>Cancel</Button>
    {/if}
  </RouteActions>

  <div class="content">
    <div class="actions">
      <button
        class="action-card"
        type="button"
        on:click={() => bb.settings("/connections/apis/new")}
      >
        <span class="action-icon"><Icon name="code" size="M" /></span>
        <span class="action-copy">
          <span class="action-title">Custom connection</span>
          <span class="action-description"
            >Configure a reusable API connection.</span
          >
        </span>
        <Icon name="caret-right" size="S" />
      </button>

      <button
        class="action-card"
        type="button"
        on:click={() => importTemplateModal.show()}
      >
        <span class="action-icon"><Icon name="upload-simple" size="M" /></span>
        <span class="action-copy">
          <span class="action-title">Import OpenAPI</span>
          <span class="action-description">Import an OpenAPI spec.</span>
        </span>
        <Icon name="caret-right" size="S" />
      </button>
    </div>

    <div class="integration-header">
      <Heading size="XS">Browse integrations</Heading>
      <div class="integration-search">
        <Search
          placeholder="Search integrations"
          value={searchValue}
          on:change={event => (searchValue = event.detail)}
        />
      </div>
    </div>

    <div class="integrations">
      {#each connectionCards as card (card.id)}
        <button
          class="integration"
          type="button"
          on:click={() => handleSelect(card.id)}
        >
          <span class="integration-icon">
            {#if card.custom}
              <Icon name="globe-simple" size="S" />
            {:else if card.icon}
              <img src={card.icon} alt="" />
            {:else}
              <Icon name="globe-simple" size="S" />
            {/if}
          </span>
          <span class="integration-name">{card.name}</span>
          <span class="integration-description">{card.description}</span>
        </button>
      {/each}
    </div>
  </div>
</div>

<Modal bind:this={importTemplateModal}>
  <ImportRestTemplateModal
    onCancel={() => importTemplateModal.hide()}
    onUploaded={async template => {
      if (!restIntegration) {
        throw new Error("REST integration unavailable")
      }
      const datasource = await createImportedRestConnection({
        template,
        integration: restIntegration,
      })
      importTemplateModal.hide()
      bb.settings(`/connections/apis/${datasource._id}`)
    }}
  />
</Modal>

<style>
  .connections {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: 16px;
  }

  .content {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: 16px;
  }

  .actions {
    display: grid;
    min-width: 0;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .action-card {
    display: flex;
    width: 100%;
    min-width: 0;
    min-height: 48px;
    box-sizing: border-box;
    padding: 8px 12px;
    align-items: center;
    gap: 10px;
    color: var(--spectrum-global-color-gray-900);
    font: inherit;
    text-align: left;
    cursor: pointer;
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 8px;
    background: var(--background-alt);
  }

  .action-card:hover,
  .integration:hover {
    background: var(--spectrum-global-color-gray-300);
  }

  .action-icon {
    display: flex;
    width: 32px;
    height: 32px;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--spectrum-global-color-gray-700);
    border-radius: 50%;
    background: var(--spectrum-global-color-gray-300);
  }

  .action-copy {
    display: flex;
    min-width: 0;
    flex: 1;
    flex-direction: column;
    gap: 4px;
  }

  .action-title {
    font-size: 13px;
    font-weight: 500;
  }

  .action-description,
  .integration-description {
    overflow: hidden;
    color: var(--spectrum-global-color-gray-700);
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .integration-header {
    display: flex;
    min-height: 32px;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .integration-search {
    width: 220px;
    min-width: 120px;
    max-width: 220px;
  }

  .integration-search :global(.spectrum-Form-item) {
    width: 100%;
  }

  .integrations {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 6px;
  }

  .integration {
    display: flex;
    width: 100%;
    min-width: 0;
    min-height: 28px;
    box-sizing: border-box;
    padding: 3px 10px;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    color: var(--spectrum-global-color-gray-900);
    font: inherit;
    font-size: 12px;
    text-align: left;
    border: 0;
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
    background-color: var(--spectrum-global-color-gray-100);
  }

  .integration:last-child {
    border-bottom: 0;
  }

  .integration-icon {
    display: flex;
    width: 22px;
    height: 22px;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 4px;
  }

  .integration-icon img {
    width: 14px;
    height: 14px;
  }

  .integration-name {
    width: 140px;
    flex-shrink: 0;
  }

  .integration-description {
    min-width: 0;
    flex: 1;
  }

  @media (max-width: 720px) {
    .actions {
      grid-template-columns: 1fr;
    }

    .integration-description {
      display: none;
    }

    .integration-search {
      flex: 1;
    }
  }
</style>
