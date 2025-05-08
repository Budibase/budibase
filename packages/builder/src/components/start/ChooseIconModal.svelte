<script lang="ts">
  import { ColorPicker, Icon, Label, ModalContent } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"

  export let name: string
  export let color: string

  const dispatch = createEventDispatcher()

  let iconsList = [
    "Apps",
    "Actions",
    "ConversionFunnel",
    "App",
    "Briefcase",
    "Money",
    "ShoppingCart",
    "Form",
    "Help",
    "Monitoring",
    "Sandbox",
    "Project",
    "Organisations",
    "Magnify",
    "Launch",
    "Car",
    "Camera",
    "Bug",
    "Channel",
    "Calculator",
    "Calendar",
    "GraphDonut",
    "GraphBarHorizontal",
    "Demographic",
  ]

  const save = async () => {
    dispatch("change", { color, name })
    return
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<ModalContent title="Edit Icon" confirmText="Save" onConfirm={save}>
  <div class="scrollable-icons">
    <div class="title-spacing">
      <Label>Select an icon</Label>
    </div>
    <div class="grid">
      {#each iconsList as item}
        <div
          class="icon-item"
          class:selected={item === name}
          on:click={() => (name = item)}
        >
          <Icon name={item} />
        </div>
      {/each}
    </div>
  </div>
  <div class="color-selection">
    <div>
      <Label>Select a color</Label>
    </div>
    <div class="color-selection-item">
      <ColorPicker bind:value={color} on:change={e => (color = e.detail)} />
    </div>
  </div>
</ModalContent>

<style>
  .scrollable-icons {
    overflow-y: auto;
    height: 230px;
  }

  .grid {
    display: grid;
    grid-gap: 20px;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  }

  .color-selection {
    display: flex;
    align-items: center;
  }

  .color-selection-item {
    margin-left: 20px;
  }

  .title-spacing {
    margin-bottom: 20px;
  }

  .icon-item {
    cursor: pointer;
  }
  .icon-item.selected {
    color: var(--spectrum-global-color-blue-600);
  }
</style>
