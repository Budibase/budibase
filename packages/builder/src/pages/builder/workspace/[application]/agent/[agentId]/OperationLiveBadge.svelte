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
    <StatusLight size="S" positive={live} negative={!live} />
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
    gap: 4px;
  }

  :global(.spectrum-Label--grey) {
    font-weight: unset !important;
    background-color: #2c2c2c !important;
    color: #c8c8c8 !important;
  }
</style>
