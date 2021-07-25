<script>
  import { Tag, Tags } from "@budibase/bbui"
  export let value

  const displayLimit = 5

  $: roles = value?.filter(role => role != null).map(role => role.name) ?? []
  $: tags = roles.slice(0, displayLimit)
  $: leftover = roles.length - tags.length
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
