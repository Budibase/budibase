<script>
  import {
    ModalContent,
    Icon,
    ColorPicker,
    Label,
    notifications,
  } from "@budibase/bbui"
  import { apps } from "stores/portal"
  import { createEventDispatcher } from "svelte"

  export let app
  export let name
  export let color
  export let autoSave = false

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
    if (!autoSave) {
      dispatch("change", { color, name })
      return
    }
    try {
      await apps.update(app.instance._id, {
        icon: { name, color },
      })
    } catch (error) {
      notifications.error("Error updating app")
    }
  }
</script>

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
