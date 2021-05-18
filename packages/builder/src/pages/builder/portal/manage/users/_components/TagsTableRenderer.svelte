<script>
  import { Tag, Tags } from "@budibase/bbui"
  export let value

  const displayLimit = 5

  $: tags = value?.slice(0, displayLimit) ?? []
  $: leftover = (value?.length ?? 0) - tags.length
</script>

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
