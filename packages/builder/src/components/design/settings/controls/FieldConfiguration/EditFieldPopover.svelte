<!-- FormBlockFieldSettingsPopover -->
<script>
  import { Icon, Popover, Layout } from "@budibase/bbui"
  import { store } from "builderStore"
  import { cloneDeep } from "lodash/fp"

  import ComponentSettingsSection from "../../../../../pages/builder/app/[application]/design/[screenId]/components/[componentId]/_components/settings/ComponentSettingsSection.svelte"

  export let anchor
  export let field

  export let componentBindings
  export let bindings
  export let parent

  let popover

  $: sudoComponentInstance = buildSudoInstance(field)
  $: componentDef = store.actions.components.getDefinition(field._component)
  $: parsedComponentDef = processComponentDefinitionSettings(componentDef)

  const buildSudoInstance = instance => {
    let clone = cloneDeep(instance)

    // only do this IF necessary
    const instanceCheck = store.actions.components.createInstance(
      clone._component,
      {
        _instanceName: instance.displayName,
        field: instance.name, //Must be fixed
        label: instance.displayName,
        placeholder: instance.displayName,
      },
      {} //?
    )

    // mutating on load would achieve this.
    // Would need to replace the entire config at this point
    // console.log(instanceCheck)

    return instanceCheck
  }

  // Ensures parent bindings are pushed down
  // Confirm this
  const processComponentDefinitionSettings = componentDef => {
    const clone = cloneDeep(componentDef)
    clone.settings.forEach(setting => {
      if (setting.type === "text") {
        setting.nested = true
      }
    })
    return clone
  }

  // Current core update setting fn
  const updateSetting = async (setting, value) => {
    console.log("Custom Save Setting", setting, value)
    console.log("The parent", parent)

    //updateBlockFieldSetting in frontend?
    const nestedFieldInstance = cloneDeep(sudoComponentInstance)

    // Parse the current fields on load and check for unbuilt instances
    // This is icky
    let parentFieldsSettings = parent.fields.find(
      pSetting => pSetting.name === nestedFieldInstance.field
    )

    //In this scenario it may be best to extract
    store.actions.tester(setting.key, value)(nestedFieldInstance) //mods the internal val

    parentFieldsSettings = cloneDeep(nestedFieldInstance)

    console.log("UPDATED nestedFieldInstance", nestedFieldInstance)

    //Overwrite all the fields
    await store.actions.components.updateSetting("fields", parent.fields)

    /*
      ignore/disabled _instanceName > this will be handled in the new header field.
      ignore/disabled field > this should be populated and hidden.
    */
  }
</script>

<Icon
  name="Settings"
  hoverable
  size="S"
  on:click={() => {
    popover.show()
  }}
/>

<Popover bind:this={popover} {anchor} align="left-outside">
  <Layout noPadding>
    <!--
      property-group-container - has a border, is there a scenario where it doesnt render?

      FormBlock Default behaviour.
        
        validation: field.validation,
        field: field.name,
        label: field.displayName,
        placeholder: field.displayName,

      Block differences
        _instanceName:
          Filtered as it has been moved to own area.
        field:
          Fixed - not visible.

      componentBindings 
        These appear to be removed/invalid

      Bindings
        {bindings} - working
        {componentBindings}
          componentdefinition.settings[x].nested needs to be true
          Are these appropriate for the form block

      FormBlock will have to pull the settings from fields:[]
      
      Frontend Store > updateSetting: async (name, value)
        Performs a patch for the component settings change
      
      PropertyControl
        Would this behaviour require a flag?
          highlighted={$store.highlightedSettingKey === setting.key}
          propertyFocus={$store.propertyFocus === setting.key}

      Mode filtering of fields
        Create
        Update 
        View > do we filter fields here or disable them?
          Default value?? Makes no sense

      Drawer actions 
        CRUD - how to persist to the correct location?
        Its just not a thing now
        - Validation
        - Bindings
        - Custom options.

      ** Options source - should this be shaped too?
        Schema,
        Datasource
        Custom
    -->

    <ComponentSettingsSection
      componentInstance={sudoComponentInstance}
      componentDefinition={parsedComponentDef}
      isScreen={false}
      {bindings}
      {componentBindings}
      onUpdateSetting={updateSetting}
    />
  </Layout>
</Popover>
