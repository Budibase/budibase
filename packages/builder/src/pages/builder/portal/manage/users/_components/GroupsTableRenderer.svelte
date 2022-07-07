<script>
  import { Icon, Body } from "@budibase/bbui"
  export let value
</script>

<div class="align">
  <div class="spacing">
    <Icon name="UserGroup" />
  </div>
  {#if value?.length === 0}
    <div class="opacity">0</div>
  {:else if value?.length === 1}
    <div class="opacity">
      <Body size="S">{value[0]?.name}</Body>
    </div>
  {:else}
    <div class="opacity">
      {parseInt(value?.length) || 0} groups
    </div>
  {/if}
</div>

<style>
  .align {
    display: flex;
    overflow: hidden;
  }

  .opacity {
    opacity: 0.8;
  }

  .spacing {
    margin-right: var(--spacing-m);
  }
</style>
