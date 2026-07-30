<script lang="ts">
  import Icon from "../Icon/Icon.svelte"

  export let small: boolean = false
  export let disabled: boolean = false
  export let tabindex: number | undefined = undefined
</script>

<button
  type="button"
  on:click
  class="spectrum-ClearButton"
  class:spectrum-ClearButton--small={small}
  {disabled}
  {tabindex}
>
  <Icon name="x" size={small ? "XS" : "S"} />
</button>
