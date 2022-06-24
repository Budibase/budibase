<script>
  import { Avatar } from "@budibase/bbui"
  export let value
</script>

<div class="align">
  {#if value?.name}
    <div class="spacing">
      <Avatar size="L" initials="PC" />
    </div>
    {value.name}
  {:else}
    <div class="text">Invite pending...</div>
  {/if}
</div>

<style>
  .align {
    display: flex;
  }

  .spacing {
    margin-right: var(--spacing-m);
  }

  .text {
    opacity: 0.8;
  }
</style>
