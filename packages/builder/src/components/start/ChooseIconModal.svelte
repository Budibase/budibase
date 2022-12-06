<script>
  import {
    ModalContent,
    Modal,
    Icon,
    ColorPicker,
    Label,
    notifications,
  } from "@budibase/bbui"
  import { apps } from "stores/portal"

  export let app
  let modal
  $: selectedIcon = app?.icon?.name || "Apps"
  $: selectedColor = app?.icon?.color

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
  export const show = () => {
    modal.show()
  }
  export const hide = () => {
    modal.hide()
  }

  const onCancel = () => {
    selectedIcon = ""
    selectedColor = ""
    hide()
  }

  const changeColor = val => {
    selectedColor = val
  }

  const save = async () => {
    try {
      await apps.update(app.instance._id, {
        icon: {
          name: selectedIcon,
          color: selectedColor,
        },
      })
    } catch (error) {
      notifications.error("Error updating app")
    }
  }
</script>

<Modal bind:this={modal} on:hide={onCancel}>
  <ModalContent
    title={"Edit Icon"}
    confirmText={"Save"}
    onConfirm={() => save()}
  >
    <div class="scrollable-icons">
      <div class="title-spacing">
        <Label>Select an icon</Label>
      </div>
      <div class="grid">
        {#each iconsList as item}
          <div
            class="icon-item"
            class:selected={item === selectedIcon}
            on:click={() => (selectedIcon = item)}
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
        <ColorPicker
          bind:value={selectedColor}
          on:change={e => changeColor(e.detail)}
        />
      </div>
    </div>
  </ModalContent>
</Modal>

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
