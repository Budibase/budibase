<script>
  import { Button, Icon, DropdownMenu, Spacer, Heading } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { store, backendUiStore } from "builderStore"
  import fetchBindableProperties from "../../builderStore/fetchBindableProperties"

  const dispatch = createEventDispatcher()
  let anchorRight, dropdownRight

  export let value = {}

  function handleSelected(selected) {
    dispatch("change", selected)
    dropdownRight.hide()
  }

  $: models = $backendUiStore.models.map(m => ({
    label: m.name,
    name: `all_${m._id}`,
    modelId: m._id,
    type: "model",
  }))

  $: views = $backendUiStore.models.reduce((acc, cur) => {
    let viewsArr = Object.entries(cur.views).map(([key, value]) => ({
      label: key,
      name: key,
      ...value,
      type: "view",
    }))
    return [...acc, ...viewsArr]
  }, [])

  $: bindableProperties = fetchBindableProperties({
    componentInstanceId: $store.currentComponentInfo._id,
    components: $store.components,
    screen: $store.currentPreviewItem,
    models: $backendUiStore.models,
  })

  $: links = bindableProperties
    .filter(x => x.fieldSchema.type === "link")
    .map(property => ({
      label: property.readableBinding,
      fieldName: property.fieldSchema.name,
      name: `all_${property.fieldSchema.modelId}`,
      modelId: property.fieldSchema.modelId,
      type: "link",
    }))
</script>

<div class="dropdownbutton" bind:this={anchorRight}>
  <Button secondary wide on:click={dropdownRight.show}>
    <span>{value.label ? value.label : 'Model / View'}</span>
    <Icon name="arrowdown" />
  </Button>
</div>
<DropdownMenu bind:this={dropdownRight} anchor={anchorRight}>
  <div class="dropdown">
    <div class="title">
      <Heading extraSmall>Tables</Heading>
    </div>
    <ul>
      {#each models as model}
        <li
          class:selected={value === model}
          on:click={() => handleSelected(model)}>
          {model.label}
        </li>
      {/each}
    </ul>
    <hr />
    <div class="title">
      <Heading extraSmall>Views</Heading>
    </div>
    <ul>
      {#each views as view}
        <li
          class:selected={value === view}
          on:click={() => handleSelected(view)}>
          {view.label}
        </li>
      {/each}
    </ul>
    <hr />
    <div class="title">
      <Heading extraSmall>Relationships</Heading>
    </div>
    <ul>
      {#each links as link}
        <li
          class:selected={value === link}
          on:click={() => handleSelected(link)}>
          {link.label}
        </li>
      {/each}
    </ul>
  </div>
</DropdownMenu>

<style>
  .dropdownbutton {
    width: 100%;
  }
  .dropdown {
    padding: var(--spacing-m) 0;
    z-index: 99999999;
  }
  .title {
    padding: 0 var(--spacing-m) var(--spacing-xs) var(--spacing-m);
  }

  hr {
    margin: var(--spacing-m) 0 var(--spacing-xl) 0;
  }

  ul {
    list-style: none;
    padding-left: 0px;
    margin: 0px;
  }

  li {
    cursor: pointer;
    margin: 0px;
    padding: var(--spacing-s) var(--spacing-m);
    font-size: var(--font-size-xs);
  }

  .selected {
    background-color: var(--grey-4);
  }

  li:hover {
    background-color: var(--grey-4);
  }
</style>
