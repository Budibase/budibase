<script>
  import { Avatar } from "@budibase/bbui"

  export let value
</script>

<div class="align">
  {#if value}
    <div class="spacing">
      <Avatar
        size="L"
        initials={value
          .split(" ")
          .map(x => x[0])
          .join("")}
      />
    </div>
    {value}
  {:else}
    <div class="text">-</div>
  {/if}
</div>

<style>
  .align {
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  .spacing {
    margin-right: var(--spacing-m);
  }

  .text {
    opacity: 0.8;
  }
</style>
