<script>
  import "@spectrum-css/label/dist/index-vars.css"

  export let size = "M"
  export let grey = false
  export let red = false
  export let orange = false
  export let yellow = false
  export let seafoam = false
  export let green = false
  export let active = false
  export let inactive = false
  export let hoverable = false
</script>

<span
  on:click
  class="spectrum-Label"
  class:hoverable
  class:spectrum-Label--small={size === "S"}
  class:spectrum-Label--large={size === "L"}
  class:spectrum-Label--grey={grey}
  class:spectrum-Label--red={red}
  class:spectrum-Label--green={green}
  class:spectrum-Label--orange={orange}
  class:spectrum-Label--yellow={yellow}
  class:spectrum-Label--seafoam={seafoam}
  class:spectrum-Label--active={active}
  class:spectrum-Label--inactive={inactive}
>
  <slot />
</span>

<style>
  .spectrum-Label--grey {
    background-color: var(--spectrum-global-color-gray-500);
    font-weight: 600;
  }
  .hoverable:hover {
    cursor: pointer;
  }
</style>
