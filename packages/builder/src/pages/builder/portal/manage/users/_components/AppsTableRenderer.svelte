<script>
  import { Icon } from "@budibase/bbui"
  export let value
</script>

<div class="align">
  <div class="spacing">
    <Icon name="Apps" />
  </div>
  {#if value?.apps?.length === 0}
    <div>
      <div>No groups</div>
    </div>
  {:else if value?.apps?.length === 1}
    {value?.groups[0]?.name}
  {:else}
    {parseInt(value?.apps?.length) || 0}
  {/if}
</div>

<style>
  .align {
    display: flex;
  }

  .spacing {
    margin-right: var(--spacing-m);
  }
</style>
