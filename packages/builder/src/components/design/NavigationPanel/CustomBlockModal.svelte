<script>
  import {
    ModalContent,
    Body,
    Button,
    Select,
    Input,
    Helpers,
    Multiselect,
    Heading,
    notifications,
  } from "@budibase/bbui"
  import { componentMap } from "../PropertiesPanel/PropertyControls/componentSettings"
  import { selectedComponent } from "builderStore"
  import {
    findComponent,
    getComponentSettings,
  } from "builderStore/componentUtils"
  import { cloneDeep } from "lodash/fp"
  import { store } from "builderStore"

  let settings = []
  let blockName
  const typeOptions = Object.keys(componentMap).map(Helpers.capitalise)

  $: allComponentSettings = getAllComponentSettings($selectedComponent)
  $: console.log("custom blocks", $store.customBlocks)

  const createCustomBlock = async () => {
    // Insert HBS bindings for settings inside the component definition
    let definition = cloneDeep($selectedComponent)
    settings.forEach(setting => {
      setting.componentSettings.forEach(componentSetting => {
        const [id, key] = componentSetting.split(".")
        const component = findComponent(definition, id)
        if (component) {
          component[key] = `{{ [block].[${setting.name}] }}`
        }
      })
    })

    try {
      await store.actions.blocks.create({
        name: blockName,
        definition,
        settings,
      })
      notifications.success("Custom block created successfully")
    } catch (error) {
      notifications.error("Error saving custom block")
      console.error(error)
      return false
    }
  }

  const addSetting = () => {
    settings = [...settings, {}]
  }

  const getAllComponentSettings = component => {
    let settings = []
    if (!component) {
      return settings
    }
    const componentSettings = getComponentSettings(component._component)
    componentSettings?.forEach(setting => {
      settings.push({
        label: `${component._instanceName} - ${setting.label}`,
        value: `${component._id}.${setting.key}`,
        type: setting.type,
      })
    })
    if (!component._children?.length) {
      return settings
    }
    component._children.forEach(child => {
      const childSettings = getAllComponentSettings(child)
      settings = [...settings, ...childSettings]
    })
    return settings
  }

  const getAllComponentSettingsOfType = type => {
    if (!type) {
      return []
    }
    return allComponentSettings.filter(x => x.type === type.toLowerCase())
  }
</script>

<ModalContent
  title="Save custom block"
  size="XL"
  confirmText="Create"
  onConfirm={createCustomBlock}
>
  <Body size="S">Create a new custom block from the selected component.</Body>
  <div class="settings">
    <Input bind:value={blockName} label="Block name" />
  </div>
  <Heading size="XS">Settings</Heading>
  <Body size="S">
    Configure the settings you would like your block to have, and map them to
    the component settings inside your block.
    <br />
    Any settings not defined as configurable will use the values they currently have.
  </Body>
  {#if settings.length}
    <div class="settings">
      {#each settings as setting}
        <Input label="Setting name" bind:value={setting.name} />
        <Select
          label="Setting type"
          bind:value={setting.type}
          options={typeOptions}
        />
        <Multiselect
          label="Component settings"
          bind:value={setting.componentSettings}
          options={getAllComponentSettingsOfType(setting.type)}
          getOptionValue={x => x.value}
          getOptionLabel={x => x.label}
          disabled={!setting.type}
          placeholder={!setting.type
            ? "Choose the setting type first"
            : "Choose some options"}
        />
      {/each}
    </div>
  {/if}
  <div>
    <Button primary on:click={addSetting}>Add setting</Button>
  </div>
</ModalContent>

<style>
  .settings {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-l);
  }
</style>
