<script lang="ts">
  let { value, prefix }: { value?: string; prefix?: string } = $props()
  let label = $derived(prefix ? `${prefix}: ${value}` : value)
</script>

<span class="origin" title={label}>
  {#if prefix}<span class="prefix">{prefix}:</span>{" "}{/if}{value}
</span>

<style>
  .origin {
    color: var(--spectrum-alias-text-color);
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .prefix {
    color: var(--spectrum-global-color-gray-600);
  }
</style>
