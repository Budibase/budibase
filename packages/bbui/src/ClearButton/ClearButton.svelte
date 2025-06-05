<script lang="ts">
  import Icon from "../Icon/Icon.svelte"

  export let small: boolean = false
  export let disabled: boolean = false
</script>

<button
  on:click
  class="spectrum-ClearButton"
  class:spectrum-ClearButton--small={small}
  {disabled}
>
  <Icon name="x" size={small ? "XS" : "S"} />
</button>
