import { get, derived } from "svelte/store"
import { cloneDeep } from "lodash/fp"
import { API } from "@/api"
import { Helpers } from "@budibase/bbui"
import analytics, { Events } from "@/analytics"
import { makePropSafe as safe } from "@budibase/string-templates"
import {
  findComponentPath,
  findClosestMatchingComponent,
  findComponent,
  findComponentParent,
  findAllMatchingComponents,
  makeComponentUnique,
} from "@/helpers/components"
import { getComponentFieldOptions } from "@/helpers/formFields"
import { selectedScreen } from "./screens"
import {
  screenStore,
  appStore,
  previewStore,
  tables,
  componentTreeNodesStore,
} from "@/stores/builder"
import { buildFormSchema, getSchemaForDatasource } from "@/dataBinding"
import {
  BUDIBASE_INTERNAL_DB_ID,
  DEFAULT_BB_DATASOURCE_ID,
  DB_TYPE_INTERNAL,
  DB_TYPE_EXTERNAL,
} from "@/constants/backend"
import { BudiStore } from "../BudiStore"
import { Utils } from "@budibase/frontend-core"
import { Component, FieldType, Screen, Table } from "@budibase/types"
import { utils } from "@budibase/shared-core"

interface ComponentDefinition {
  component: string
  name: string
  friendlyName?: string
  hasChildren?: boolean
  settings?: ComponentSetting[]
  features?: Record<string, boolean>
  typeSupportPresets?: Record<string, any>
}

interface ComponentSetting {
  key: string
  type: string
  section?: string
  name?: string
  defaultValue?: any
  selectAllFields?: boolean
  resetOn?: string | string[]
  settings?: ComponentSetting[]
}

interface ComponentState {
  components: Record<string, ComponentDefinition>
  customComponents: string[]
  selectedComponentId: string | null
  componentToPaste?: Component | null
  settingsCache: Record<string, ComponentSetting[]>
  selectedScreenId?: string | null
}

export const INITIAL_COMPONENTS_STATE: ComponentState = {
  components: {},
  customComponents: [],
  selectedComponentId: null,
  componentToPaste: null,
  settingsCache: {},
}

export class ComponentStore extends BudiStore<ComponentState> {
  constructor() {
    super(INITIAL_COMPONENTS_STATE)

    this.reset = this.reset.bind(this)
    this.refreshDefinitions = this.refreshDefinitions.bind(this)
    this.getDefinition = this.getDefinition.bind(this)
    this.getDefaultDatasource = this.getDefaultDatasource.bind(this)
    this.enrichEmptySettings = this.enrichEmptySettings.bind(this)
    this.createInstance = this.createInstance.bind(this)
    this.create = this.create.bind(this)
    this.patch = this.patch.bind(this)
    this.delete = this.delete.bind(this)
    this.copy = this.copy.bind(this)
    this.paste = this.paste.bind(this)
    this.select = this.select.bind(this)
    this.getPrevious = this.getPrevious.bind(this)
    this.getNext = this.getNext.bind(this)
    this.selectPrevious = this.selectPrevious.bind(this)
    this.selectNext = this.selectNext.bind(this)
    this.moveUp = this.moveUp.bind(this)
    this.moveDown = this.moveDown.bind(this)
    this.updateStyle = this.updateStyle.bind(this)
    this.updateStyles = this.updateStyles.bind(this)
    this.updateCustomStyle = this.updateCustomStyle.bind(this)
    this.updateConditions = this.updateConditions.bind(this)
    this.requestEjectBlock = this.requestEjectBlock.bind(this)
    this.handleEjectBlock = this.handleEjectBlock.bind(this)
    this.updateSetting = this.updateSetting.bind(this)
    this.updateComponentSetting = this.updateComponentSetting.bind(this)
    this.addParent = this.addParent.bind(this)
    this.isCached = this.isCached.bind(this)
    this.cacheSettings = this.cacheSettings.bind(this)
    this.getComponentSettings = this.getComponentSettings.bind(this)
  }

  /**
   * Reset the component store to default values
   */
  reset() {
    this.store.set({ ...INITIAL_COMPONENTS_STATE })
  }

  /**
   *
   * @param {string} appId
   * @returns
   */
  async refreshDefinitions(appId: string) {
    if (!appId) {
      return
    }

    // Fetch definitions and filter out custom component definitions so we
    // can flag them
    const components: any = await API.fetchComponentLibDefinitions(appId)
    const customComponents = Object.keys(components).filter(key =>
      key.startsWith("plugin/")
    )

    // Update store
    this.update(state => ({
      ...state,
      components,
      customComponents,
    }))

    // Sync client features to app store
    appStore.syncClientFeatures(components.features)
    appStore.syncClientTypeSupportPresets(components?.typeSupportPresets ?? {})

    return components
  }

  /**
   * Retrieve the component definition object
   * @param {string} componentType
   * @example
   * '@budibase/standard-components/container'
   * @returns {object}
   */
  getDefinition(componentType: string) {
    if (!componentType) {
      return null
    }
    return get(this.store).components[componentType]
  }

  /**
   *
   * @returns {object}
   */
  getDefaultDatasource() {
    // Ignore users table
    const validTables = get(tables).list.filter(x => x._id !== "ta_users")

    // Try to use their own internal table first
    let table = validTables.find(table => {
      return (
        table.sourceId === BUDIBASE_INTERNAL_DB_ID &&
        table.sourceType === DB_TYPE_INTERNAL
      )
    })
    if (table) {
      return table
    }

    // Then try sample data
    table = validTables.find(table => {
      return (
        table.sourceId === DEFAULT_BB_DATASOURCE_ID &&
        table.sourceType === DB_TYPE_INTERNAL
      )
    })
    if (table) {
      return table
    }

    // Finally try an external table
    return validTables.find(table => table.sourceType === DB_TYPE_EXTERNAL)
  }

  /**
   * Takes an enriched component instance and applies any required migration
   * logic
   * @param {object} enrichedComponent
   * @returns {object} migrated Component
   */
  migrateSettings(enrichedComponent: Component) {
    const componentPrefix = "@budibase/standard-components"
    let migrated = false

    if (enrichedComponent?._component === `${componentPrefix}/formblock`) {
      // Use default config if the 'buttons' prop has never been initialised
      if (!("buttons" in enrichedComponent)) {
        enrichedComponent["buttons"] =
          Utils.buildFormBlockButtonConfig(enrichedComponent)
        migrated = true
      } else if (enrichedComponent["buttons"] == null) {
        // Ignore legacy config if 'buttons' has been reset by 'resetOn'
        const { _id, actionType, dataSource } = enrichedComponent
        enrichedComponent["buttons"] = Utils.buildFormBlockButtonConfig({
          _id,
          actionType,
          dataSource,
        })
        migrated = true
      }

      // Ensure existing Formblocks position their buttons at the top.
      if (!("buttonPosition" in enrichedComponent)) {
        enrichedComponent["buttonPosition"] = "top"
        migrated = true
      }
    }

    if (!enrichedComponent?._component) {
      return migrated
    }

    const def = this.getDefinition(enrichedComponent?._component)
    const filterableTypes = def?.settings?.filter(setting =>
      setting?.type?.startsWith("filter")
    )
    for (let setting of filterableTypes || []) {
      const isLegacy = Array.isArray(enrichedComponent[setting.key])
      if (isLegacy) {
        const processedSetting = utils.processSearchFilters(
          enrichedComponent[setting.key]
        )
        enrichedComponent[setting.key] = processedSetting
        migrated = true
      }
    }
    return migrated
  }

  /**
   *
   * @param {object} component
   * @param {object} opts
   * @returns
   */
  enrichEmptySettings(component: Component, opts: any) {
    if (!component?._component) {
      return
    }
    const defaultDS = this.getDefaultDatasource()
    const settings = this.getComponentSettings(component._component)
    const { parent, screen, useDefaultValues } = opts || {}
    const treeId = parent?._id || component._id
    if (!screen) {
      return
    }
    settings.forEach((setting: ComponentSetting) => {
      const value = component[setting.key]

      // Fill empty settings
      if (value == null || value === "") {
        if (setting.type === "multifield" && setting.selectAllFields) {
          // Select all schema fields where required
          component[setting.key] = Object.keys(defaultDS?.schema || {})
        } else if (
          (setting.type === "dataSource" || setting.type === "table") &&
          defaultDS
        ) {
          // Select default datasource where required
          component[setting.key] = {
            label: defaultDS.name,
            tableId: defaultDS._id,
            resourceId: defaultDS._id,
            type: "table",
          }
        } else if (setting.type === "dataProvider") {
          // Pick closest data provider where required
          const path = findComponentPath(screen.props, treeId)
          const providers = path.filter((component: Component) =>
            component._component?.endsWith("/dataprovider")
          )
          if (providers.length) {
            const id = providers[providers.length - 1]?._id
            component[setting.key] = `{{ literal ${safe(id)} }}`
          }
        } else if (setting.type.startsWith("field/")) {
          // Autofill form field names
          // Get all available field names in this form schema
          let fieldOptions = getComponentFieldOptions(
            screen.props,
            treeId,
            setting.type,
            false
          )

          // Get all currently used fields
          const form = findClosestMatchingComponent(
            screen.props,
            treeId,
            (x: Component) =>
              x._component === "@budibase/standard-components/form"
          )
          const usedFields = Object.keys(buildFormSchema(form) || {})

          // Filter out already used fields
          fieldOptions = fieldOptions.filter(x => !usedFields.includes(x))

          // Set field name and also assume we have a label setting
          if (fieldOptions[0]) {
            component[setting.key] = fieldOptions[0]
            component.label = fieldOptions[0]
          }
        } else if (useDefaultValues && setting.defaultValue !== undefined) {
          // Use default value where required
          component[setting.key] = setting.defaultValue
        }
      }

      // Validate non-empty settings
      else {
        if (setting.type === "dataProvider") {
          // Validate data provider exists, or else clear it
          const providers = findAllMatchingComponents(
            screen?.props,
            (x: Component) =>
              x._component === "@budibase/standard-components/dataprovider"
          )
          const valid = providers?.some(dp => value.includes?.(dp._id))
          if (!valid) {
            if (providers.length) {
              const id = providers[providers.length - 1]?._id
              component[setting.key] = `{{ literal ${safe(id)} }}`
            } else {
              delete component[setting.key]
            }
          }
        }
      }
    })

    // Add default bindings to card blocks
    if (component._component.endsWith("/cardsblock")) {
      // Only proceed if the card is empty, i.e. we just changed datasource or
      // just created the card
      const cardKeys = ["cardTitle", "cardSubtitle", "cardDescription"]
      if (cardKeys.every(key => !component[key]) && !component.cardImageURL) {
        const { _id, dataSource } = component
        if (dataSource) {
          const {
            schema,
            table,
          }: { schema: Record<string, any>; table: Table } =
            getSchemaForDatasource(screen, dataSource, {})

          // Finds fields by types from the schema of the configured datasource
          const findFieldTypes = (fieldTypes: any) => {
            if (!Array.isArray(fieldTypes)) {
              fieldTypes = [fieldTypes]
            }
            return Object.entries(schema || {})
              .filter(([name, fieldSchema]) => {
                return (
                  fieldTypes.includes(fieldSchema.type) &&
                  !fieldSchema.autoColumn &&
                  name !== table?.primaryDisplay &&
                  !name.startsWith("_")
                )
              })
              .map(([name]) => name)
          }

          // Inserts a card binding for a certain setting
          const addBinding = (
            key: string,
            fallback: string | null,
            ...parts: any[]
          ) => {
            if (parts.some(x => x == null)) {
              component[key] = fallback
            } else {
              parts.unshift(`${_id}-repeater`)
              component[key] = `{{ ${parts.map(safe).join(".")} }}`
            }
          }

          // Extract good field candidates to prefill our cards with.
          // Use the primary display as the best field, if it exists.
          const shortFields = [
            ...findFieldTypes(FieldType.STRING),
            ...findFieldTypes(FieldType.OPTIONS),
            ...findFieldTypes(FieldType.ARRAY),
            ...findFieldTypes(FieldType.NUMBER),
          ]
          const longFields = findFieldTypes(FieldType.LONGFORM)
          if (table?.primaryDisplay && schema?.[table.primaryDisplay]) {
            shortFields.unshift(table.primaryDisplay)
          }

          // Fill title and subtitle with short fields
          addBinding("cardTitle", "Title", shortFields[0])
          addBinding("cardSubtitle", "Subtitle", shortFields[1])

          // Fill description with a long field if possible
          const longField = longFields[0] ?? shortFields[2]
          addBinding("cardDescription", "Description", longField)

          // Attempt to fill the image setting.
          // Check single attachment fields first.
          let imgField = findFieldTypes(FieldType.ATTACHMENT_SINGLE)[0]
          if (imgField) {
            addBinding("cardImageURL", null, imgField, "url")
          } else {
            // Then try multi-attachment fields if no single ones exist
            imgField = findFieldTypes(FieldType.ATTACHMENTS)[0]
            if (imgField) {
              addBinding("cardImageURL", null, imgField, 0, "url")
            }
          }
        }
      }
    }
  }

  /**
   *
   * @param {string} componentName
   * @param {object} presetProps
   * @param {object} parent
   * @returns
   */
  createInstance(componentName: string, presetProps: any, parent: any) {
    const definition = this.getDefinition(componentName)
    if (!definition) {
      return null
    }

    // Generate basic component structure
    let instance = {
      _id: Helpers.uuid(),
      _component: definition.component,
      _styles: {
        normal: {},
        hover: {},
        active: {},
      },
      _instanceName: `New ${definition.friendlyName || definition.name}`,
      ...presetProps,
    }

    // Standard post processing
    this.enrichEmptySettings(instance, {
      parent,
      screen: get(selectedScreen),
      useDefaultValues: true,
    })

    try {
      this.migrateSettings(instance)
    } catch (e) {
      console.error(e)
      throw e
    }

    // Custom post processing for creation only
    let extras: any = {}
    if (definition.hasChildren) {
      extras._children = []
    }

    // Add step name to form steps
    if (componentName.endsWith("/formstep")) {
      const parentForm = findClosestMatchingComponent(
        get(selectedScreen).props,
        get(selectedComponent)._id,
        (component: Component) => component._component.endsWith("/form")
      )
      const formSteps = findAllMatchingComponents(
        parentForm,
        (component: Component) => component._component.endsWith("/formstep")
      )
      extras.step = formSteps.length + 1
      extras._instanceName = `Step ${formSteps.length + 1}`
    }

    return {
      ...cloneDeep(instance),
      ...extras,
    }
  }

  /**
   *
   * @param {string} componentName
   * @param {object} presetProps
   * @param {object} parent
   * @param {number} index
   * @returns
   */
  async create(
    componentName: string,
    presetProps: any,
    parent: any,
    index: number
  ) {
    const state = get(this.store)
    const componentInstance = this.createInstance(
      componentName,
      presetProps,
      parent
    )
    if (!componentInstance) {
      return
    }

    // Insert in position if specified
    if (parent && index != null) {
      await screenStore.patch((screen: Screen) => {
        let parentComponent = findComponent(screen.props, parent)
        if (!parentComponent._children?.length) {
          parentComponent._children = [componentInstance]
        } else {
          parentComponent._children.splice(index, 0, componentInstance)
        }
      }, null)
    }

    // Otherwise we work out where this component should be inserted
    else {
      await screenStore.patch((screen: Screen) => {
        // Find the selected component
        let selectedComponentId = state.selectedComponentId
        if (selectedComponentId?.startsWith(`${screen._id}-`)) {
          selectedComponentId = screen.props._id || null
        }
        const currentComponent = findComponent(
          screen.props,
          selectedComponentId
        )
        if (!currentComponent) {
          return false
        }

        // Find parent node to attach this component to
        let parentComponent
        if (currentComponent) {
          // Use selected component as parent if one is selected
          const definition = this.getDefinition(currentComponent._component)
          if (definition?.hasChildren) {
            // Use selected component if it allows children
            parentComponent = currentComponent
          } else {
            // Otherwise we need to use the parent of this component
            parentComponent = findComponentParent(
              screen.props,
              currentComponent._id
            )
          }
        } else {
          // Use screen or layout if no component is selected
          parentComponent = screen.props
        }

        // Attach new component
        if (!parentComponent) {
          return false
        }
        if (!parentComponent._children) {
          parentComponent._children = []
        }
        parentComponent._children.push(componentInstance)
      }, null)
    }

    // Select new component
    this.update(state => {
      state.selectedComponentId = componentInstance._id
      return state
    })

    componentTreeNodesStore.makeNodeVisible(componentInstance._id)

    // Log event
    analytics.captureEvent(Events.COMPONENT_CREATED, {
      name: componentInstance._component,
    })

    return componentInstance
  }

  /**
   *
   * @param {function} patchFn
   * @param {string} componentId
   * @param {string} screenId
   * @returns
   */
  async patch(
    patchFn: (component: Component, screen: Screen) => any,
    componentId?: string,
    screenId?: string
  ) {
    // Use selected component by default
    if (!componentId || !screenId) {
      const state = get(this.store)
      componentId = componentId ?? state.selectedComponentId ?? undefined
      const screenState = get(screenStore)
      screenId = screenId || screenState.selectedScreenId
    }
    if (!componentId || !screenId || !patchFn) {
      return
    }
    const patchScreen = (screen: Screen) => {
      let component = findComponent(screen.props, componentId)
      if (!component) {
        return false
      }

      // Mutates the fetched component with updates
      const patchResult = patchFn(component, screen)

      // Post processing
      const migrated = this.migrateSettings(component)

      // Returning an explicit false signifies that we should skip this
      // update. If we migrated something, ensure we never skip.
      return migrated ? null : patchResult
    }
    await screenStore.patch(patchScreen, screenId)
  }

  /**
   *
   * @param {object} component
   * @returns
   */
  async delete(component: Component) {
    if (!component) {
      return
    }

    // Determine the next component to select, and select it before deletion
    // to avoid an intermediate state of no component selection
    const state = get(this.store)
    let nextId: string | null = ""
    if (state.selectedComponentId === component._id) {
      nextId = this.getNext()
      if (!nextId) {
        nextId = this.getPrevious()
      }
    }
    if (nextId) {
      // If this is the nav, select the screen instead
      if (nextId.endsWith("-navigation")) {
        nextId = nextId.replace("-navigation", "-screen")
      }
      this.update(state => {
        state.selectedComponentId = nextId
        return state
      })
    }

    // Patch screen
    await screenStore.patch((screen: Screen) => {
      // Check component exists
      component = findComponent(screen.props, component._id)
      if (!component) {
        return false
      }

      // Check component has a valid parent
      const parent = findComponentParent(screen.props, component._id)
      if (!parent) {
        return false
      }
      parent._children = parent._children.filter(
        (child: Component) => child._id !== component._id
      )
    }, null)
  }

  copy(component: Component, cut = false, selectParent = true) {
    // Update store with copied component
    this.update(state => {
      state.componentToPaste = cloneDeep(component)
      state.componentToPaste.isCut = cut
      state.componentToPaste.screenId = get(screenStore).selectedScreenId
      return state
    })

    // Select the parent if cutting
    if (cut && selectParent) {
      const screen = get(selectedScreen)
      const parent = findComponentParent(screen?.props, component._id)
      if (parent) {
        this.update(state => {
          state.selectedComponentId = parent._id
          return state
        })
      }
    }
  }

  /**
   *
   * @param {string} componentId
   */
  select(componentId: string) {
    this.update(state => {
      state.selectedComponentId = componentId
      return state
    })
  }

  /**
   *
   * @param {object} targetComponent
   * @param {string} mode
   * @param {object} targetScreen
   * @returns
   */
  async paste(
    targetComponent: Component,
    mode: string,
    targetScreen: Screen,
    selectComponent = true
  ) {
    const state = get(this.store)
    if (!state.componentToPaste) {
      return
    }
    let newComponentId: string | null = ""

    // Remove copied component if cutting, regardless if pasting works
    let componentToPaste = cloneDeep(state.componentToPaste)
    if (componentToPaste.isCut) {
      this.update(state => {
        delete state.componentToPaste
        return state
      })
    }

    // Patch screen
    const patch = (screen: Screen) => {
      // Get up to date ref to target
      targetComponent = findComponent(screen.props, targetComponent._id)
      if (!targetComponent) {
        return false
      }
      const cut = componentToPaste.isCut
      const sourceScreenId = componentToPaste.screenId
      const originalId = componentToPaste._id
      delete componentToPaste.isCut
      delete componentToPaste.screenId

      // Make new component unique if copying
      if (!cut) {
        componentToPaste = makeComponentUnique(componentToPaste)
      }
      newComponentId = componentToPaste._id!

      // Strip grid position metadata if pasting into a new screen, but keep
      // alignment metadata
      if (sourceScreenId && sourceScreenId !== screen._id) {
        for (let style of Object.keys(componentToPaste._styles?.normal || {})) {
          if (
            style.startsWith("--grid") &&
            (style.endsWith("-start") || style.endsWith("-end"))
          ) {
            delete componentToPaste._styles.normal[style]
          }
        }
      }

      // Delete old component if cutting
      if (cut) {
        const parent = findComponentParent(screen.props, originalId)
        if (parent?._children) {
          parent._children = parent._children.filter(
            (component: Component) => component._id !== originalId
          )
        }
      }

      // Check inside is valid
      if (mode === "inside") {
        const definition = this.getDefinition(targetComponent._component)
        if (!definition?.hasChildren) {
          mode = "below"
        }
      }

      // Paste new component
      if (mode === "inside") {
        // Paste inside target component if chosen
        if (!targetComponent._children) {
          targetComponent._children = []
        }
        targetComponent._children.push(componentToPaste)
      } else {
        // Otherwise paste in the correct order in the parent's children
        const parent = findComponentParent(screen.props, targetComponent._id)
        if (!parent?._children) {
          return false
        }
        const targetIndex = parent._children.findIndex(
          (component: Component) => {
            return component._id === targetComponent._id
          }
        )
        const index = mode === "above" ? targetIndex : targetIndex + 1
        parent._children.splice(index, 0, componentToPaste)
      }
    }
    const targetScreenId = targetScreen?._id ?? state.selectedScreenId ?? null
    await screenStore.patch(patch, targetScreenId)

    // Select the new component
    if (selectComponent) {
      this.update(state => {
        state.selectedScreenId = targetScreenId
        state.selectedComponentId = newComponentId
        return state
      })
    }

    componentTreeNodesStore.makeNodeVisible(newComponentId)
  }

  getPrevious() {
    const state = get(this.store)
    const componentId = state.selectedComponentId
    const screen = get(selectedScreen)
    const parent = findComponentParent(screen.props, componentId)
    const index = parent?._children.findIndex(
      (x: Component) => x._id === componentId
    )

    // Check for screen and navigation component edge cases
    const screenComponentId = `${screen._id}-screen`
    const navComponentId = `${screen._id}-navigation`
    if (componentId === screenComponentId) {
      return null
    }
    if (componentId === navComponentId) {
      return screenComponentId
    }
    if (parent._id === screen.props._id && index === 0) {
      return navComponentId
    }

    // If we have siblings above us, choose the sibling or a descendant
    if (index > 0) {
      // If sibling before us accepts children, and is not collapsed, select a descendant
      const previousSibling = parent._children[index - 1]
      if (
        previousSibling._children?.length &&
        componentTreeNodesStore.isNodeExpanded(previousSibling._id)
      ) {
        let target = previousSibling
        while (
          target._children?.length &&
          componentTreeNodesStore.isNodeExpanded(target._id)
        ) {
          target = target._children[target._children.length - 1]
        }
        return target._id
      }

      // Otherwise just select sibling
      return previousSibling._id
    }

    // If no siblings above us, select the parent
    return parent._id
  }

  getNext() {
    const state = get(this.store)
    const component = get(selectedComponent)
    const componentId = component?._id
    const screen = get(selectedScreen)
    const parent = findComponentParent(screen.props, componentId)
    const index = parent?._children.findIndex(
      (x: Component) => x._id === componentId
    )

    // Check for screen and navigation component edge cases
    const screenComponentId = `${screen._id}-screen`
    const navComponentId = `${screen._id}-navigation`
    if (state.selectedComponentId === screenComponentId) {
      return navComponentId
    }

    // If we have children, select first child, and the node is not collapsed
    if (
      component._children?.length &&
      (state.selectedComponentId === navComponentId ||
        componentTreeNodesStore.isNodeExpanded(component._id))
    ) {
      return component._children[0]._id
    } else if (!parent) {
      return null
    }

    // Otherwise select the next sibling if we have one
    if (index < parent._children.length - 1) {
      const nextSibling = parent._children[index + 1]
      return nextSibling._id
    }

    // Last child, select our parents next sibling
    let target = parent
    let targetParent = findComponentParent(screen.props, target._id)
    let targetIndex = targetParent?._children.findIndex(
      (child: Component) => child._id === target._id
    )
    while (
      targetParent != null &&
      targetIndex === targetParent._children?.length - 1
    ) {
      target = targetParent
      targetParent = findComponentParent(screen.props, target._id)
      targetIndex = targetParent?._children.findIndex(
        (child: Component) => child._id === target._id
      )
    }
    if (targetParent) {
      return targetParent._children[targetIndex + 1]._id
    } else {
      return null
    }
  }

  selectPrevious() {
    const previousId = this.getPrevious()
    if (previousId) {
      this.update(state => {
        state.selectedComponentId = previousId
        return state
      })
    }
  }

  selectNext() {
    const nextId = this.getNext()
    if (nextId) {
      this.update(state => {
        state.selectedComponentId = nextId
        return state
      })
    }
  }

  async moveUp(component: Component) {
    await screenStore.patch((screen: Screen) => {
      const componentId = component?._id
      const parent = findComponentParent(screen.props, componentId)

      // Check we aren't right at the top of the tree
      const index = parent?._children.findIndex(
        (x: Component) => x._id === componentId
      )
      if (!parent || (index === 0 && parent._id === screen.props._id)) {
        return
      }

      // Copy original component and remove it from the parent
      const originalComponent = cloneDeep(parent._children[index])
      parent._children = parent._children.filter(
        (component: Component) => component._id !== componentId
      )

      // If we have siblings above us, move up
      if (index > 0) {
        // If sibling before us accepts children, move to last child of
        // sibling
        const previousSibling = parent._children[index - 1]
        const definition = this.getDefinition(previousSibling._component)
        if (
          definition?.hasChildren &&
          componentTreeNodesStore.isNodeExpanded(previousSibling._id)
        ) {
          previousSibling._children.push(originalComponent)
        }

        // Otherwise just move component above sibling
        else {
          parent._children.splice(index - 1, 0, originalComponent)
        }
      }

      // If no siblings above us, go above the parent as long as it isn't
      // the screen
      else if (parent._id !== screen.props._id) {
        const grandParent = findComponentParent(screen.props, parent._id)
        const parentIndex = grandParent._children.findIndex(
          (child: Component) => child._id === parent._id
        )
        grandParent._children.splice(parentIndex, 0, originalComponent)
      }
    }, null)
  }

  async moveDown(component: Component) {
    await screenStore.patch((screen: Screen) => {
      const componentId = component?._id
      const parent = findComponentParent(screen.props, componentId)

      // Sanity check parent is found
      if (!parent?._children?.length) {
        return false
      }

      // Check we aren't right at the bottom of the tree
      const index = parent._children.findIndex(
        (x: Component) => x._id === componentId
      )
      if (
        index === parent._children.length - 1 &&
        parent._id === screen.props._id
      ) {
        return
      }

      // Copy the original component and remove from parent
      const originalComponent = cloneDeep(parent._children[index])
      parent._children = parent._children.filter(
        (component: Component) => component._id !== componentId
      )

      // Move below the next sibling if we are not the last sibling
      if (index < parent._children.length) {
        // If the next sibling has children, and is not collapsed, become the first child
        const nextSibling = parent._children[index]
        const definition = this.getDefinition(nextSibling._component)
        if (
          definition?.hasChildren &&
          componentTreeNodesStore.isNodeExpanded(nextSibling._id)
        ) {
          nextSibling._children.splice(0, 0, originalComponent)
        }

        // Otherwise move below next sibling
        else {
          parent._children.splice(index + 1, 0, originalComponent)
        }
      }

      // Last child, so move below our parent
      else {
        const grandParent = findComponentParent(screen.props, parent._id)
        const parentIndex = grandParent._children.findIndex(
          (child: Component) => child._id === parent._id
        )
        grandParent._children.splice(parentIndex + 1, 0, originalComponent)
      }
    }, null)
  }

  async updateStyle(name: string, value: string) {
    await this.patch((component: Component) => {
      if (value == null || value === "") {
        delete component._styles.normal[name]
      } else {
        component._styles.normal[name] = value
      }
    })
  }

  async updateStyles(styles: Record<string, string>, id: string) {
    const patchFn = (component: Component) => {
      component._styles.normal = {
        ...component._styles.normal,
        ...styles,
      }
    }
    await this.patch(patchFn, id)
  }

  async updateCustomStyle(style: Record<string, string>) {
    await this.patch((component: Component) => {
      component._styles.custom = style
    })
  }

  async updateConditions(conditions: Record<string, any>) {
    await this.patch((component: Component) => {
      component._conditions = conditions
    })
  }

  async updateSetting(name: string, value: any) {
    await this.patch(this.updateComponentSetting(name, value))
  }

  updateComponentSetting(name: string, value: any) {
    return (component: Component) => {
      if (!name || !component) {
        return false
      }
      // Skip update if the value is the same
      if (component[name] === value) {
        return false
      }

      const settings = this.getComponentSettings(component._component)
      const updatedSetting = settings.find(
        (setting: ComponentSetting) => setting.key === name
      )

      // Reset dependent fields
      settings.forEach((setting: ComponentSetting) => {
        const needsReset =
          name === setting.resetOn ||
          (Array.isArray(setting.resetOn) && setting.resetOn.includes(name))
        if (needsReset) {
          component[setting.key] = setting.defaultValue || null
        }
      })

      if (
        updatedSetting?.type === "dataSource" ||
        updatedSetting?.type === "table"
      ) {
        const { schema }: { schema: Record<string, any> } =
          getSchemaForDatasource(null, value, null)
        const columnNames = Object.keys(schema || {})
        const multifieldKeysToSelectAll = settings
          .filter((setting: ComponentSetting) => {
            return setting.type === "multifield" && setting.selectAllFields
          })
          .map((setting: ComponentSetting) => setting.key)

        multifieldKeysToSelectAll.forEach((key: string) => {
          component[key] = columnNames
        })
      }
      component[name] = value
      return true
    }
  }

  requestEjectBlock(componentId: string) {
    previewStore.sendEvent("eject-block", componentId)
  }

  async handleEjectBlock(componentId: string, ejectedDefinition: Component) {
    let nextSelectedComponentId: string | null = null

    await screenStore.patch((screen: Screen) => {
      const block = findComponent(screen.props, componentId)
      const parent = findComponentParent(screen.props, componentId)

      // Sanity check
      if (!block || !parent?._children?.length) {
        return false
      }

      // Log event
      analytics.captureEvent(Events.BLOCK_EJECTED, {
        block: block._component,
      })

      // Attach block children back into ejected definition, using the
      // _containsSlot flag to know where to insert them
      const slotContainer = findAllMatchingComponents(
        ejectedDefinition,
        (x: Component) => x._containsSlot
      )[0]
      if (slotContainer) {
        delete slotContainer._containsSlot
        slotContainer._children = [
          ...(slotContainer._children || []),
          ...(block._children || []),
        ]
      }

      // Replace block with ejected definition
      ejectedDefinition = makeComponentUnique(ejectedDefinition)
      const index = parent._children.findIndex(
        (x: Component) => x._id === componentId
      )
      parent._children[index] = ejectedDefinition
      nextSelectedComponentId = ejectedDefinition._id ?? null
    }, null)

    // Select new root component
    if (nextSelectedComponentId) {
      this.update(state => {
        state.selectedComponentId = nextSelectedComponentId
        return state
      })
    }
  }

  async addParent(componentId: string, parentType: string) {
    if (!componentId || !parentType) {
      return
    }

    // Create new parent instance
    const newParentDefinition = this.createInstance(parentType, null, parent)
    if (!newParentDefinition) {
      return
    }

    // Replace component with a version wrapped in a new parent
    await screenStore.patch((screen: Screen) => {
      // Get this component definition and parent definition
      let definition = findComponent(screen.props, componentId)
      let oldParentDefinition = findComponentParent(screen.props, componentId)
      if (!definition || !oldParentDefinition) {
        return false
      }

      // Replace component with parent
      const index = oldParentDefinition._children.findIndex(
        (component: Component) => component._id === componentId
      )
      if (index === -1) {
        return false
      }
      oldParentDefinition._children[index] = {
        ...newParentDefinition,
        _children: [definition],
      }
    }, null)

    // Select the new parent
    this.update(state => {
      state.selectedComponentId = newParentDefinition._id
      return state
    })
  }

  /**
   * Check if the components settings have been cached
   * @param {string} componentType
   * @example
   * '@budibase/standard-components/container'
   * @returns {boolean}
   */
  isCached(componentType: string) {
    const settings = get(this.store).settingsCache
    return componentType in settings
  }

  /**
   * Cache component settings
   * @param {string} componentType
   * @param {object} definition
   * @example
   * '@budibase/standard-components/container'
   * @returns {array} the settings
   */
  cacheSettings(componentType: string, definition: ComponentDefinition | null) {
    let settings: ComponentSetting[] = []
    if (definition) {
      settings = definition.settings?.filter(setting => !setting.section) ?? []
      definition.settings
        ?.filter(setting => setting.section)
        .forEach(section => {
          settings = settings.concat(
            (section.settings || []).map(setting => ({
              ...setting,
              section: section.name,
            }))
          )
        })
    }
    this.update(state => ({
      ...state,
      settingsCache: {
        ...state.settingsCache,
        [componentType]: settings,
      },
    }))
    return settings
  }

  /**
   * Retrieve an array of the component settings.
   * These settings are cached because they cannot change at run time.
   *
   * Searches a component's definition for a setting matching a certain predicate.
   * @param {string} componentType
   * @example
   * '@budibase/standard-components/container'
   * @returns {Array<object>}
   */
  getComponentSettings(componentType: string) {
    if (!componentType) {
      return []
    }

    // Ensure whole component name is used
    if (
      !componentType.startsWith("plugin/") &&
      !componentType.startsWith("@budibase")
    ) {
      componentType = `@budibase/standard-components/${componentType}`
    }

    // Use cached value if possible
    const cachedValue = get(this.store).settingsCache[componentType]
    if (cachedValue) {
      return cachedValue
    }

    // Otherwise cache and return new value
    const def = this.getDefinition(componentType)
    return this.cacheSettings(componentType, def)
  }
}

export const componentStore = new ComponentStore()

export const selectedComponent = derived(
  [componentStore, selectedScreen],
  ([$store, $selectedScreen]) => {
    if (
      $selectedScreen &&
      $store.selectedComponentId?.startsWith(`${$selectedScreen._id}-`)
    ) {
      return $selectedScreen?.props
    }
    if (!$selectedScreen || !$store.selectedComponentId) {
      return null
    }
    const selected = findComponent(
      $selectedScreen?.props,
      $store.selectedComponentId
    )

    const clone = selected ? cloneDeep(selected) : selected
    componentStore.migrateSettings(clone)
    return clone
  }
)
