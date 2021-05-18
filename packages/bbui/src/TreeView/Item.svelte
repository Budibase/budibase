<script>
  export let selected = false
  export let open = false
  export let href = false
  export let title
  export let icon
</script>

<li
  class:is-selected={selected}
  class:is-open={open}
  class="spectrum-TreeView-item"
>
  <a on:click class="spectrum-TreeView-itemLink" {href}>
    {#if $$slots.default}
      <svg
        class="spectrum-Icon spectrum-UIIcon-ChevronRight100 spectrum-TreeView-itemIndicator"
        focusable="false"
        aria-hidden="true"
      >
        <use xlink:href="#spectrum-css-icon-Chevron100" />
      </svg>
    {/if}
    {#if icon}
      <svg
        class="spectrum-TreeView-itemIcon spectrum-Icon spectrum-Icon--sizeM"
        focusable="false"
        aria-hidden="true"
        aria-label="Layers"
      >
        <use xlink:href="#spectrum-icon-18-{icon}" />
      </svg>
    {/if}
    <span class="spectrum-TreeView-itemLabel">{title}</span>
  </a>
  {#if $$slots.default}
    <ul class="spectrum-TreeView">
      <slot />
    </ul>
  {/if}
</li>
