<script>
  import { Tag, Tags } from "@budibase/bbui"
  export let value

  const displayLimit = 5

  $: values = value?.filter(value => value != null) ?? []
  $: tags = values.slice(0, displayLimit)
  $: leftover = values.length - tags.length
</script>

<div class="tag-renderer">
  <Tags>
    {#each tags as tag}
      <Tag>
        {tag}
      </Tag>
    {/each}
    {#if leftover}
      <Tag>+{leftover} more</Tag>
    {/if}
  </Tags>
</div>

<style>
  .tag-renderer :global(.spectrum-Tags-item:hover) {
    color: var(--spectrum-alias-label-text-color);
    border-color: var(--spectrum-alias-border-color-darker-default);
    cursor: pointer;
  }
  .tag-renderer :global(.spectrum-Tags-itemLabel) {
    cursor: pointer;
  }
</style>
