<script>
  import { NodeWidth, NodeHeight } from "./constants"
</script>

<div class="node" style={`--width:${NodeWidth}px; --height:${NodeHeight}px;`}>
  Add custom roles for more granular control over permissions
</div>

<style>
  .node {
    border-radius: 4px;
    width: var(--width);
    height: var(--height);
    display: grid;
    place-items: center;
    font-size: 16px;
    text-align: center;
    color: var(--spectrum-global-color-gray-800);
    text-shadow: 4px 4px 10px var(--background-color),
      4px -4px 10px var(--background-color),
      -4px 4px 10px var(--background-color),
      -4px -4px 10px var(--background-color);
  }
</style>
