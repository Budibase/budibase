<script>
  import { RoleUtils } from "@budibase/frontend-core"
  import { Handle, Position, useSvelteFlow } from "@xyflow/svelte"
  import { Icon } from "@budibase/bbui"
  import { Roles } from "constants/backend"
  import { NodeWidth, NodeHeight } from "./constants"
  import { getContext, tick } from "svelte"

  export let data
  export let isConnectable
  export let id

  const { autoLayout } = getContext("flow")
  const flow = useSvelteFlow()
  const { label, description, custom } = data

  $: color = RoleUtils.getRoleColour(id)

  const deleteNode = async () => {
    flow.deleteElements({
      nodes: [{ id }],
    })
    await tick()
    autoLayout()
  }
</script>

<div
  class="node"
  class:selected={false}
  style={`--color:${color}; --width:${NodeWidth}px; --height:${NodeHeight}px;`}
>
  <div class="color" />
  <div class="content">
    <div class="title">
      <div class="label">
        {label}
      </div>
      {#if custom}
        <div class="buttons">
          <Icon size="S" name="Edit" hoverable />
          <Icon size="S" name="Delete" hoverable on:click={deleteNode} />
        </div>
      {/if}
    </div>
    {#if description}
      <div class="description">
        {description}
      </div>
    {/if}
  </div>
  {#if id !== Roles.BASIC}
    <Handle type="target" position={Position.Left} {isConnectable} />
  {/if}
  {#if id !== Roles.ADMIN}
    <Handle type="source" position={Position.Right} {isConnectable} />
  {/if}
</div>

<style>
  .node {
    position: relative;
    background: var(--node-background);
    border-radius: 4px;
    border: 1px solid transparent;
    width: var(--width);
    height: var(--height);
    display: flex;
    flex-direction: column;
  }
  .node.selected {
    background: var(--spectrum-global-color-blue-100);
  }
  .color {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    height: 8px;
    width: 100%;
    background: var(--color);
  }
  .content {
    flex: 1 1 auto;
    padding: 0 14px 0 14px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    gap: 2px;
    border: 1px solid var(--border-color);
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
  .node.selected .content {
    border-color: transparent;
  }
  .title,
  .buttons {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
  }
  .title {
    justify-content: space-between;
  }
  .buttons {
    display: none;
  }
  .title :global(.spectrum-Icon) {
    color: var(--spectrum-global-color-gray-600);
  }
  .label {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .description {
    color: var(--spectrum-global-color-gray-600);
    font-size: 12px;
  }
  .node:hover .buttons {
    display: flex;
  }
</style>
