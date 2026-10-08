<script lang="ts">
  let { label, prefix }: { label?: string; prefix?: string } = $props()
  let value = $derived(prefix ? label?.slice(prefix.length + 2) : label)
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
