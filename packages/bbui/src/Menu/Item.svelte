<script>
  export let dataCy
  export let icon = undefined
  export let disabled = undefined
</script>

<li
  data-cy={dataCy}
  on:click|preventDefault
  class="spectrum-Menu-item"
  class:is-disabled={disabled}
  role="menuitem"
  tabindex="0"
>
  {#if icon}
    <svg
      class="spectrum-Icon spectrum-Icon--sizeM spectrum-Menu-itemIcon"
      focusable="false"
      aria-hidden="true"
      aria-label={icon}
    >
      <use xlink:href="#spectrum-icon-18-{icon}" />
    </svg>
  {/if}
  <span class="spectrum-Menu-itemLabel"><slot /></span>
</li>
