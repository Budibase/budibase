<script>
  import { Heading } from "@budibase/bbui"

  export let title
  export let wrap = true
</script>

<div class="header" class:wrap>
  <slot name="icon" />
  <Heading size="L">{title}</Heading>
  <div class="buttons">
    <slot name="buttons" />
  </div>
</div>

<style>
  .header {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-xl);
  }
  .header.wrap {
    flex-wrap: wrap;
  }
  .header :global(.spectrum-Heading) {
    flex: 1 1 auto;
    margin-top: -2px;
  }
  .header:not(.wrap) :global(.spectrum-Heading) {
    overflow: hidden;
    width: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-xl);
  }
  .buttons :global(> div) {
    display: contents;
  }
  @media (max-width: 640px) {
    .wrap .buttons {
      margin-bottom: var(--spacing-m);
    }
  }
</style>
