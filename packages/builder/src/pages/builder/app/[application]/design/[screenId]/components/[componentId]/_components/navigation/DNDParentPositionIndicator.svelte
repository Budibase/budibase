<script>
</script>

{#if $dndStore.targetParent?._id === component._id && $dndStore.dropPosition !== DropPosition.INSIDE}
  <div
    class="inside drop-item"
    style="--indicatorX: {indicatorX}px; --indicatorY:{indicatorY}px;"
  />
{/if}
