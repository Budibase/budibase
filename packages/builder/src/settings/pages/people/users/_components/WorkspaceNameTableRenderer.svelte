<svelte:options runes={true} />

<script lang="ts">
  import { IconAvatar } from "@budibase/bbui"

  interface Props {
    value: string
    row: {
      __skeleton?: boolean
      icon?: {
        name?: string
        color?: string
      }
    }
  }

  let { value, row }: Props = $props()
</script>

{#if !row?.__skeleton}
  <div class="align">
    <IconAvatar
      icon={row?.icon?.name || "squares-four"}
      color={row?.icon?.color}
    />
    <div class="text">
      {value}
    </div>
  </div>
{/if}

<style>
  .align {
    display: flex;
    align-items: center;
    overflow: hidden;
    gap: var(--spacing-m);
    max-width: var(--max-cell-width);
    flex: 1 1 auto;
    width: 0;
  }
  .text {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
