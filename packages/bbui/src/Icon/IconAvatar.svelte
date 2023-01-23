<script>
  import Icon from "./Icon.svelte"

  export let icon
  export let background
  export let color
  export let size = "M"
</script>

<div
  class="icon size--{size}"
  style="background: {background || `transparent`};"
  class:filled={!!background}
>
  <Icon name={icon} color={background ? "white" : color} />
</div>

<style>
  .icon {
    width: 28px;
    height: 28px;
    flex: 0 0 28px;
    display: grid;
    place-items: center;
    border-radius: 50%;
  }
  .icon :global(.spectrum-Icon) {
    width: 22px;
    height: 22px;
  }
  .icon.filled :global(.spectrum-Icon) {
    width: 16px;
    height: 16px;
  }
  .icon.size--S {
    width: 22px;
    height: 22px;
    flex: 0 0 22px;
  }
  .icon.size--S :global(.spectrum-Icon) {
    width: 16px;
    height: 16px;
  }
  .icon.size--S.filled :global(.spectrum-Icon) {
    width: 12px;
    height: 12px;
  }
  .icon.size--L {
    width: 40px;
    height: 40px;
    flex: 0 0 40px;
  }
  .icon.size--L :global(.spectrum-Icon) {
    width: 28px;
    height: 28px;
  }
  .icon.size--L.filled :global(.spectrum-Icon) {
    width: 22px;
    height: 22px;
  }
</style>
