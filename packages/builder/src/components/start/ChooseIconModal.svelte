<script lang="ts">
  import { ColorPicker, Icon, Label, ModalContent } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { getPhosphorIcon } from "@budibase/bbui/utils/iconMapping"

  export let name: string
  export let color: string

  const dispatch = createEventDispatcher()

  let iconsList = [
    "Apps", // dots-nine
    "Actions", // pencil-ruler?
    "ConversionFunnel", //funnel-simple
    "App", // app-store-logo
    "Briefcase", //briefcase
    "Money", //money
    "ShoppingCart", //shopping-cart
    "Form", //list
    "Help", //question
    "Monitoring", //monitor
    "Sandbox", //columns
    "Project", //folder
    "Organisations", //city
    "Magnify", //magnifying-glass
    "Launch", //rocket-launch
    "Car", //car
    "Camera", //camera
    "Bug", //bug
    "Channel", //snowflake
    "Calculator", //calculator
    "Calendar", //calendar-dots
    "GraphDonut", //chart-donut
    "GraphBarHorizontal", //chart-bar-horizontal
    "Demographic", //users-three
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
          <Icon name={getPhosphorIcon(item)} />
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
