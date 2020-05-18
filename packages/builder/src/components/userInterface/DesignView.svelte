<script>
  import PropertyGroup from "./PropertyGroup.svelte"
  import FlatButtonGroup from "./FlatButtonGroup.svelte"

  export let panelDefinition = {}
  export let componentInstance = {}
  export let componentDefinition = {}
  export let onPropChanged = () => {}

  let selectedCategory = "desktop"

  const getProperties = name => panelDefinition.properties[name]

  function onChange(category) {
    selectedCategory = category
  }

  const buttonProps = [
    { value: "desktop", text: "Desktop" },
    { value: "mobile", text: "Mobile" },
    { value: "hover", text: "Hover" },
    { value: "active", text: "Active" },
    { value: "selected", text: "Selected" },
  ]

  $: propertyGroupNames =
    !!panelDefinition.properties && Object.keys(panelDefinition.properties)
</script>

<div class="design-view-container">

  <div class="design-view-state-categories">
    <FlatButtonGroup value={selectedCategory} {buttonProps} {onChange} />
  </div>

  <div class="design-view-property-groups">
    {#each propertyGroupNames as groupName}
      <PropertyGroup
        name={groupName}
        properties={getProperties(groupName)}
        {onPropChanged}
        {componentDefinition}
        {componentInstance} />
    {/each}
  </div>
</div>

<style>
  .design-view-container {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .design-view-state-categories {
    flex: 0 0 50px;
  }

  .design-view-property-groups {
    flex: 1;
  }
</style>
