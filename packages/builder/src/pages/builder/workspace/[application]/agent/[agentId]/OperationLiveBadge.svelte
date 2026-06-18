<script lang="ts">
  import { Badge, Icon, StatusLight } from "@budibase/bbui"

  let {
    live = false,
    showMenuIcon = false,
    onclick,
  }: {
    live?: boolean
    showMenuIcon?: boolean
    onclick?: (event: MouseEvent) => void
  } = $props()

  let ariaLabel = $derived(live ? "Stop operation" : "Set operation live")
</script>

{#snippet badgeContent()}
  <Badge size="S">
    <span class="operation-status-pill-content">
      <span class="operation-status-light">
        <StatusLight size="S" positive={live} negative={!live} />
      </span>
      <span>{live ? "Live" : "Stopped"}</span>
      {#if showMenuIcon}
        <Icon name="dots-three" size="XS" />
      {/if}
    </span>
  </Badge>
{/snippet}

{#if onclick}
  <button
    type="button"
    class="operation-live-badge interactive"
    aria-label={ariaLabel}
    {onclick}
  >
    {@render badgeContent()}
  </button>
{:else}
  <div class="operation-live-badge">
    {@render badgeContent()}
  </div>
{/if}

<style>
  .operation-status-light {
    padding-bottom: 2px;
  }
  .operation-live-badge.interactive {
    border: 0;
    padding: 0;
    background: transparent;
    cursor: pointer;
  }

  .operation-live-badge :global(.spectrum-Label) {
    background-color: var(--spectrum-global-color-gray-200);
    color: var(--spectrum-global-color-gray-900);
  }

  .operation-live-badge.interactive:hover :global(.spectrum-Label) {
    background-color: var(--spectrum-global-color-gray-300);
  }

  .operation-live-badge.interactive :global(*) {
    pointer-events: none;
  }

  .operation-status-pill-content {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
</style>
