<script>
  import { getContext } from "svelte"
  const multilevel = getContext("sidenav-type")
  export let href = ""
  export let external = false
  export let heading = ""
  export let icon = ""
  export let selected = false
  export let disabled = false
</script>

<li
  class="spectrum-SideNav-item"
  class:is-selected={selected}
  class:is-disabled={disabled}
  on:click
>
  {#if heading}
    <h2 class="spectrum-SideNav-heading" id="nav-heading-{heading}">
      {heading}
    </h2>
  {/if}
  <a
    target={external ? "_blank" : ""}
    {href}
    class="spectrum-SideNav-itemLink"
    aria-current="page"
  >
    {#if icon}
      <svg
        class="spectrum-Icon spectrum-Icon--sizeM spectrum-SideNav-itemIcon"
        focusable="false"
        aria-hidden="true"
      >
        <use xlink:href="#spectrum-icon-18-{icon}" />
      </svg>
    {/if}
    <slot />
  </a>
  {#if multilevel && $$slots.subnav}
    <ul class="spectrum-SideNav">
      <slot name="subnav" />
    </ul>
  {/if}
</li>
