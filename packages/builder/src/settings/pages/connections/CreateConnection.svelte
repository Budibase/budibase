<script lang="ts">
  import { restTemplates } from "@/stores/builder/restTemplates"
  import { bb } from "@/stores/bb"
  import { Heading, Button, CollapsibleSearch } from "@budibase/bbui"
  import type {
    RestTemplate,
    RestTemplateGroup,
    RestTemplateGroupName,
  } from "@budibase/types"
  import RouteActions from "@/settings/components/RouteActions.svelte"
  import TemplateGroupSelect from "./_components/TemplateGroupSelect.svelte"

  type TemplateCard = {
    type: "template"
    template: RestTemplate
  }

  type GroupCard = {
    type: "group"
    group: RestTemplateGroup<RestTemplateGroupName>
  }

  type ConnectionCard = TemplateCard | GroupCard

  let searchValue: string = ""

  $: templates = $restTemplates?.templates || []
  $: templateGroups = $restTemplates?.templateGroups || []

  // Filter out templates that are already in a group
  $: groupedTemplateNames = new Set<string>(
    templateGroups.flatMap(group => group.templates.map(t => t.name))
  )
  $: visibleTemplates = templates.filter(t => !groupedTemplateNames.has(t.name))

  // Combine groups and templates into a single sorted list
  $: connectionCards = [
    ...templateGroups.map<ConnectionCard>(group => ({
      type: "group",
      group,
    })),
    ...visibleTemplates.map<ConnectionCard>(template => ({
      type: "template",
      template,
    })),
  ]
    .filter(card => {
      if (!searchValue) return true
      const query = searchValue.toLowerCase()
      if (card.type === "template") {
        return card.template.name.toLowerCase().includes(query)
      }
      return (
        card.group.name.toLowerCase().includes(query) ||
        card.group.templates.some(t => t.name.toLowerCase().includes(query))
      )
    })
    .sort((a, b) => {
      const nameA = a.type === "group" ? a.group.name : a.template.name
      const nameB = b.type === "group" ? b.group.name : b.template.name
      return nameA.localeCompare(nameB)
    })

  const handleTemplateSelect = (template: RestTemplate) => {
    bb.settings(`/connections/new/${template.id}`)
  }
</script>

<div class="connections">
  <RouteActions>
    <div class="header-buttons">
      <CollapsibleSearch
        placeholder="Search"
        value={searchValue}
        on:change={event => (searchValue = event.detail)}
      />
      <Button
        on:click={() => {
          bb.settings("/connections/new")
        }}
        icon="plus"
      >
        Create custom
      </Button>
    </div>
  </RouteActions>
  <div class="connection-group">
    <Heading size="XS">APIs</Heading>
    <div class="grid">
      {#each connectionCards as card}
        {#if card.type === "group"}
          <TemplateGroupSelect
            group={card.group}
            on:select={e => handleTemplateSelect(e.detail)}
          />
        {:else}
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <div
            class="connection"
            on:click={() => handleTemplateSelect(card.template)}
          >
            <div class="connection-icon">
              <img src={card.template.icon} alt={card.template.name} />
            </div>
            {card.template.name}
          </div>
        {/if}
      {/each}
    </div>
  </div>
</div>

<style>
  .header-buttons {
    display: flex;
    gap: var(--spacing-m);
  }
  .connection-group {
    display: flex;
    gap: var(--spacing-m);
    flex-direction: column;
  }

  .connections {
    display: flex;
    gap: 12px;
    flex-direction: column;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;
  }

  .connection {
    display: flex;
    height: 38px;
    padding: 6px 12px;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    cursor: pointer;
    font-size: 14px;
    border-radius: 8px;
    border: 1px solid var(--spectrum-global-color-gray-200);
    background-color: var(--spectrum-global-color-gray-100);
    position: relative;
  }

  .connection:hover {
    background-color: var(--spectrum-global-color-gray-300);
  }

  .connection-icon {
    border-radius: 4px;
    border: 1px solid var(--spectrum-global-color-gray-200);
    display: flex;
    width: 36px;
    height: 36px;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    margin-right: 10px;
  }

  .connection-icon img {
    width: 20px;
    height: 20px;
  }
</style>
