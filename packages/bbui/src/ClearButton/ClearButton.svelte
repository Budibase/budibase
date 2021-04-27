<script>
  export let small = false
  export let disabled
</script>

<button
  on:click
  class="spectrum-ClearButton"
  class:spectrum-ClearButton--small={small}
  {disabled}
>
  <svg
    class="spectrum-Icon spectrum-UIIcon-Cross75"
    focusable="false"
    aria-hidden="true"
  >
    <use xlink:href="#spectrum-css-icon-Cross75" />
  </svg>
</button>
