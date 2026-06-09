<script lang="ts">
  import { Badge, Icon, StatusLight } from "@budibase/bbui"

  let {
    live = false,
    hoverable = false,
    showMenuIcon = false,
  }: {
    live?: boolean
    hoverable?: boolean
    showMenuIcon?: boolean
  } = $props()
</script>

<div class="operation-live-badge">
  <Badge size="S" {hoverable}>
    <span class="operation-status-pill-content">
      <StatusLight size="S" positive={live} negative={!live} />
      <span>{live ? "Live" : "Stopped"}</span>
      {#if showMenuIcon}
        <Icon name="dots-three" size="XS" />
      {/if}
    </span>
  </Badge>
</div>

<style>
  .operation-live-badge :global(.spectrum-Label) {
    background-color: var(--spectrum-global-color-gray-200);
    color: var(--spectrum-global-color-gray-900);
  }

  .operation-live-badge :global(.spectrum-Label.hoverable:hover) {
    background-color: var(--spectrum-global-color-gray-300);
  }

  .operation-status-pill-content {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
</style>
