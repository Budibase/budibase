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

<Badge size="S" grey {hoverable}>
  <span class="operation-status-pill-content">
    <span class="operation-status-dot">
      <StatusLight size="XS" positive={live} negative={!live} square />
    </span>
    <span>{live ? "Live" : "Stopped"}</span>
    {#if showMenuIcon}
      <Icon name="dots-three" size="XS" />
    {/if}
  </span>
</Badge>

<style>
  .operation-status-pill-content {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .operation-status-dot {
    display: inline-flex;
  }

  :global(.spectrum-Label--grey) {
    font-weight: unset !important;
  }
</style>
