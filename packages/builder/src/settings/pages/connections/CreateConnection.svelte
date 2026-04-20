<script lang="ts">
  import { restTemplates } from "@/stores/builder/restTemplates"
  import { bb } from "@/stores/bb"
  import { Heading, Button, CollapsibleSearch } from "@budibase/bbui"
  import RouteActions from "@/settings/components/RouteActions.svelte"

  let searchValue: string = ""

  $: connectionCards = restTemplates.flatTemplates
    .filter(t => {
      if (!searchValue) return true
      return t.name.toLowerCase().includes(searchValue.toLowerCase())
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  const handleSelect = (id: string) => {
    bb.settings(`/connections/apis/new/${id}`)
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
          bb.settings("/connections/apis/new")
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
      {#each connectionCards as card (card.id)}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div class="connection" on:click={() => handleSelect(card.id)}>
          <div class="connection-icon">
            <img src={card.icon} alt={card.name} />
          </div>
          {card.name}
        </div>
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
