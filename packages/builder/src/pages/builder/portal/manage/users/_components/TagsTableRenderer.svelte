<script>
  import { Tag, Tags } from "@budibase/bbui"
  export let value

  const displayLimit = 5

  $: roles = value?.filter(role => role != null) ?? []
  $: tags = roles.slice(0, displayLimit)
  $: leftover = roles.length - tags.length
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
