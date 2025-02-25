<script lang="ts">
  export let small: boolean = false
  export let disabled: boolean = false
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
