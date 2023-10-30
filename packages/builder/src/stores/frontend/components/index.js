import { writable, get, derived } from "svelte/store"
import { cloneDeep } from "lodash/fp"
import { API } from "api"
import { Helpers } from "@budibase/bbui"
import analytics, { Events } from "analytics"
import { makePropSafe as safe } from "@budibase/string-templates"
import {
  getComponentSettings,
  findComponentPath,
  findClosestMatchingComponent,
  findComponent,
  findComponentParent,
  findAllMatchingComponents,
  makeComponentUnique,
} from "../components/utils"
import { getComponentFieldOptions } from "helpers/formFields"
import { tables } from "stores/backend"
import { selectedScreen } from "../screens"
import { screenStore, appStore, previewStore } from "stores/frontend"
import { buildFormSchema, getSchemaForDatasource } from "builder/dataBinding"
import {
  BUDIBASE_INTERNAL_DB_ID,
  DB_TYPE_INTERNAL,
  DB_TYPE_EXTERNAL,
} from "constants/backend"

const INITIAL_COMPONENTS_STATE = {
  components: [],
  customComponents: [],
  selectedComponentId: null,
  componentToPaste: null,
}

export const createComponentStore = () => {
  const store = writable({
    ...INITIAL_COMPONENTS_STATE,
  })

  const reset = () => {
    store.set({ ...INITIAL_COMPONENTS_STATE })
  }

  const refreshDefinitions = async appId => {
    if (!appId) {
      appId = get(store).appId
    }

    // Fetch definitions and filter out custom component definitions so we
    // can flag them
    const components = await API.fetchComponentLibDefinitions(appId)
    const customComponents = Object.keys(components).filter(name =>
      name.startsWith("plugin/")
    )

    // Update store
    store.update(state => ({
      ...state,
      components,
      customComponents,
    }))

    // Sync client features to app store
    appStore.syncClientFeatures(components.features)

    return components
  }

  const getDefinition = componentName => {
    if (!componentName) {
      return null
    }
    return get(store).components[componentName]
  }

  const getDefaultDatasource = () => {
    // Ignore users table
    const validTables = get(tables).list.filter(x => x._id !== "ta_users")

    // Try to use their own internal table first
    let table = validTables.find(table => {
      return (
        table.sourceId !== BUDIBASE_INTERNAL_DB_ID &&
        table.type === DB_TYPE_INTERNAL
      )
    })
    if (table) {
      return table
    }

    // Then try sample data
    table = validTables.find(table => {
      return (
        table.sourceId === BUDIBASE_INTERNAL_DB_ID &&
        table.type === DB_TYPE_INTERNAL
      )
    })
    if (table) {
      return table
    }

    // Finally try an external table
    return validTables.find(table => table.type === DB_TYPE_EXTERNAL)
  }

  const enrichEmptySettings = (component, opts) => {
    if (!component?._component) {
      return
    }
    const defaultDS = getDefaultDatasource()
    const settings = getComponentSettings(component._component)
    const { parent, screen, useDefaultValues } = opts || {}
    const treeId = parent?._id || component._id
    if (!screen) {
      return
    }
    settings.forEach(setting => {
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
          const providers = path.filter(component =>
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
            x => x._component === "@budibase/standard-components/form"
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
          const treeId = parent?._id || component._id
          const path = findComponentPath(screen?.props, treeId)
          const providers = path.filter(component =>
            component._component?.endsWith("/dataprovider")
          )
          // Validate non-empty values
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
  }

  const createInstance = (componentName, presetProps, parent) => {
    const definition = getDefinition(componentName)
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

    // Enrich empty settings
    enrichEmptySettings(instance, {
      parent,
      screen: get(selectedScreen),
      useDefaultValues: true,
    })

    // Add any extra properties the component needs
    let extras = {}
    if (definition.hasChildren) {
      extras._children = []
    }
    if (componentName.endsWith("/formstep")) {
      const parentForm = findClosestMatchingComponent(
        get(selectedScreen).props,
        get(selectedComponent)._id,
        component => component._component.endsWith("/form")
      )
      const formSteps = findAllMatchingComponents(parentForm, component =>
        component._component.endsWith("/formstep")
      )
      extras.step = formSteps.length + 1
      extras._instanceName = `Step ${formSteps.length + 1}`
    }
    return {
      ...cloneDeep(instance),
      ...extras,
    }
  }

  const create = async (componentName, presetProps, parent, index) => {
    const state = get(store)
    const componentInstance = createInstance(componentName, presetProps, parent)
    if (!componentInstance) {
      return
    }

    // Insert in position if specified
    if (parent && index != null) {
      await screenStore.patch(screen => {
        let parentComponent = findComponent(screen.props, parent)
        if (!parentComponent._children?.length) {
          parentComponent._children = [componentInstance]
        } else {
          parentComponent._children.splice(index, 0, componentInstance)
        }
      })
    }

    // Otherwise we work out where this component should be inserted
    else {
      await screenStore.patch(screen => {
        // Find the selected component
        let selectedComponentId = state.selectedComponentId
        if (selectedComponentId.startsWith(`${screen._id}-`)) {
          selectedComponentId = screen?.props._id
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
          const definition = getDefinition(currentComponent._component)
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
      })
    }

    // Select new component
    store.update(state => {
      state.selectedComponentId = componentInstance._id
      return state
    })

    // Log event
    analytics.captureEvent(Events.COMPONENT_CREATED, {
      name: componentInstance._component,
    })

    return componentInstance
  }

  const patch = async (patchFn, componentId, screenId) => {
    // Use selected component by default
    if (!componentId || !screenId) {
      const state = get(store)
      componentId = componentId || state.selectedComponentId

      const screenState = get(screenStore)
      screenId = screenId || screenState.selectedScreenId
    }
    if (!componentId || !screenId || !patchFn) {
      return
    }
    const patchScreen = screen => {
      // findComponent looks in the tree not comp.settings[0]
      let component = findComponent(screen.props, componentId)
      if (!component) {
        return false
      }
      return patchFn(component, screen)
    }
    await screenStore.patch(patchScreen, screenId)
  }

  const deleteComponent = async component => {
    if (!component) {
      return
    }

    // Determine the next component to select after deletion
    const state = get(store)
    let nextSelectedComponentId
    if (state.selectedComponentId === component._id) {
      nextSelectedComponentId = getNext()
      if (!nextSelectedComponentId) {
        nextSelectedComponentId = getPrevious()
      }
    }

    // Patch screen
    await screenStore.patch(screen => {
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
        child => child._id !== component._id
      )
    })

    // Update selected component if required
    if (nextSelectedComponentId) {
      store.update(state => {
        state.selectedComponentId = nextSelectedComponentId
        return state
      })
    }
  }

  const copy = (component, cut = false, selectParent = true) => {
    // Update store with copied component
    store.update(state => {
      state.componentToPaste = cloneDeep(component)
      state.componentToPaste.isCut = cut
      return state
    })

    // Select the parent if cutting
    if (cut && selectParent) {
      const screen = get(selectedScreen)
      const parent = findComponentParent(screen?.props, component._id)
      if (parent) {
        store.update(state => {
          state.selectedComponentId = parent._id
          return state
        })
      }
    }
  }

  const select = componentId => {
    store.update(state => {
      state.selectedComponentId = componentId
      return state
    })
  }

  const paste = async (targetComponent, mode, targetScreen) => {
    const state = get(store)
    if (!state.componentToPaste) {
      return
    }
    let newComponentId

    // Remove copied component if cutting, regardless if pasting works
    let componentToPaste = cloneDeep(state.componentToPaste)
    if (componentToPaste.isCut) {
      store.update(state => {
        delete state.componentToPaste
        return state
      })
    }

    // Patch screen
    const patch = screen => {
      // Get up to date ref to target
      targetComponent = findComponent(screen.props, targetComponent._id)
      if (!targetComponent) {
        return false
      }
      const cut = componentToPaste.isCut
      const originalId = componentToPaste._id
      delete componentToPaste.isCut

      // Make new component unique if copying
      if (!cut) {
        componentToPaste = makeComponentUnique(componentToPaste)
      }
      newComponentId = componentToPaste._id

      // Delete old component if cutting
      if (cut) {
        const parent = findComponentParent(screen.props, originalId)
        if (parent?._children) {
          parent._children = parent._children.filter(
            component => component._id !== originalId
          )
        }
      }

      // Check inside is valid
      if (mode === "inside") {
        const definition = getDefinition(targetComponent._component)
        if (!definition.hasChildren) {
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
        const targetIndex = parent._children.findIndex(component => {
          return component._id === targetComponent._id
        })
        const index = mode === "above" ? targetIndex : targetIndex + 1
        parent._children.splice(index, 0, componentToPaste)
      }
    }
    const targetScreenId = targetScreen?._id || state.selectedScreenId
    await screenStore.patch(patch, targetScreenId)

    // Select the new component
    store.update(state => {
      state.selectedScreenId = targetScreenId
      state.selectedComponentId = newComponentId
      return state
    })
  }

  const getPrevious = () => {
    const state = get(store)
    const componentId = state.selectedComponentId
    const screen = get(selectedScreen)
    const parent = findComponentParent(screen.props, componentId)
    const index = parent?._children.findIndex(x => x._id === componentId)

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
      // If sibling before us accepts children, select a descendant
      const previousSibling = parent._children[index - 1]
      if (previousSibling._children?.length) {
        let target = previousSibling
        while (target._children?.length) {
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

  const getNext = () => {
    const state = get(store)
    const component = get(selectedComponent)
    const componentId = component?._id
    const screen = get(selectedScreen)
    const parent = findComponentParent(screen.props, componentId)
    const index = parent?._children.findIndex(x => x._id === componentId)

    // Check for screen and navigation component edge cases
    const screenComponentId = `${screen._id}-screen`
    const navComponentId = `${screen._id}-navigation`
    if (state.selectedComponentId === screenComponentId) {
      return navComponentId
    }

    // If we have children, select first child
    if (component._children?.length) {
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
      child => child._id === target._id
    )
    while (
      targetParent != null &&
      targetIndex === targetParent._children?.length - 1
    ) {
      target = targetParent
      targetParent = findComponentParent(screen.props, target._id)
      targetIndex = targetParent?._children.findIndex(
        child => child._id === target._id
      )
    }
    if (targetParent) {
      return targetParent._children[targetIndex + 1]._id
    } else {
      return null
    }
  }

  const selectPrevious = () => {
    const previousId = getPrevious()
    if (previousId) {
      store.update(state => {
        state.selectedComponentId = previousId
        return state
      })
    }
  }

  const selectNext = () => {
    const nextId = getNext()
    if (nextId) {
      store.update(state => {
        state.selectedComponentId = nextId
        return state
      })
    }
  }

  const moveUp = async component => {
    await screenStore.patch(screen => {
      const componentId = component?._id
      const parent = findComponentParent(screen.props, componentId)

      // Check we aren't right at the top of the tree
      const index = parent?._children.findIndex(x => x._id === componentId)
      if (!parent || (index === 0 && parent._id === screen.props._id)) {
        return
      }

      // Copy original component and remove it from the parent
      const originalComponent = cloneDeep(parent._children[index])
      parent._children = parent._children.filter(
        component => component._id !== componentId
      )

      // If we have siblings above us, move up
      if (index > 0) {
        // If sibling before us accepts children, move to last child of
        // sibling
        const previousSibling = parent._children[index - 1]
        const definition = getDefinition(previousSibling._component)
        if (definition.hasChildren) {
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
          child => child._id === parent._id
        )
        grandParent._children.splice(parentIndex, 0, originalComponent)
      }
    })
  }

  const moveDown = async component => {
    await screenStore.patch(screen => {
      const componentId = component?._id
      const parent = findComponentParent(screen.props, componentId)

      // Sanity check parent is found
      if (!parent?._children?.length) {
        return false
      }

      // Check we aren't right at the bottom of the tree
      const index = parent._children.findIndex(x => x._id === componentId)
      if (
        index === parent._children.length - 1 &&
        parent._id === screen.props._id
      ) {
        return
      }

      // Copy the original component and remove from parent
      const originalComponent = cloneDeep(parent._children[index])
      parent._children = parent._children.filter(
        component => component._id !== componentId
      )

      // Move below the next sibling if we are not the last sibling
      if (index < parent._children.length) {
        // If the next sibling has children, become the first child
        const nextSibling = parent._children[index]
        const definition = getDefinition(nextSibling._component)
        if (definition.hasChildren) {
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
          child => child._id === parent._id
        )
        grandParent._children.splice(parentIndex + 1, 0, originalComponent)
      }
    })
  }

  const updateStyle = async (name, value) => {
    await patch(component => {
      if (value == null || value === "") {
        delete component._styles.normal[name]
      } else {
        component._styles.normal[name] = value
      }
    })
  }

  const updateStyles = async (styles, id) => {
    const patchFn = component => {
      component._styles.normal = {
        ...component._styles.normal,
        ...styles,
      }
    }
    await patch(patchFn, id)
  }

  const updateCustomStyle = async style => {
    await patch(component => {
      component._styles.custom = style
    })
  }

  const updateConditions = async conditions => {
    await patch(component => {
      component._conditions = conditions
    })
  }

  const updateSetting = async (name, value) => {
    await patch(updateComponentSetting(name, value))
  }

  const updateComponentSetting = (name, value) => {
    return component => {
      if (!name || !component) {
        return false
      }
      // Skip update if the value is the same
      if (component[name] === value) {
        return false
      }

      const settings = getComponentSettings(component._component)
      const updatedSetting = settings.find(setting => setting.key === name)

      const resetFields = settings.filter(setting => name === setting.resetOn)
      resetFields?.forEach(setting => {
        component[setting.key] = null
      })

      if (
        updatedSetting?.type === "dataSource" ||
        updatedSetting?.type === "table"
      ) {
        const { schema } = getSchemaForDatasource(null, value)
        const columnNames = Object.keys(schema || {})
        const multifieldKeysToSelectAll = settings
          .filter(setting => {
            return setting.type === "multifield" && setting.selectAllFields
          })
          .map(setting => setting.key)

        multifieldKeysToSelectAll.forEach(key => {
          component[key] = columnNames
        })
      }
      component[name] = value
    }
  }

  const requestEjectBlock = componentId => {
    previewStore.sendEvent("eject-block", componentId)
  }

  const handleEjectBlock = async (componentId, ejectedDefinition) => {
    let nextSelectedComponentId

    await screenStore.patch(screen => {
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
        x => x._containsSlot
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
      const index = parent._children.findIndex(x => x._id === componentId)
      parent._children[index] = ejectedDefinition
      nextSelectedComponentId = ejectedDefinition._id
    })

    // Select new root component
    if (nextSelectedComponentId) {
      store.update(state => {
        state.selectedComponentId = nextSelectedComponentId
        return state
      })
    }
  }

  const addParent = async (componentId, parentType) => {
    if (!componentId || !parentType) {
      return
    }

    // Create new parent instance
    const newParentDefinition = createInstance(parentType, null, parent)
    if (!newParentDefinition) {
      return
    }

    // Replace component with a version wrapped in a new parent
    await screenStore.patch(screen => {
      // Get this component definition and parent definition
      let definition = findComponent(screen.props, componentId)
      let oldParentDefinition = findComponentParent(screen.props, componentId)
      if (!definition || !oldParentDefinition) {
        return false
      }

      // Replace component with parent
      const index = oldParentDefinition._children.findIndex(
        component => component._id === componentId
      )
      if (index === -1) {
        return false
      }
      oldParentDefinition._children[index] = {
        ...newParentDefinition,
        _children: [definition],
      }
    })

    // Select the new parent
    store.update(state => {
      state.selectedComponentId = newParentDefinition._id
      return state
    })
  }
  return {
    subscribe: store.subscribe,
    reset,
    update: store.update,
    refreshDefinitions,
    getDefinition,
    getDefaultDatasource,
    enrichEmptySettings,
    createInstance,
    create,
    patch,
    delete: deleteComponent,
    copy,
    paste,
    select,
    getPrevious,
    getNext,
    selectPrevious,
    selectNext,
    moveUp,
    moveDown,
    updateStyle,
    updateStyles,
    updateCustomStyle,
    updateConditions,
    requestEjectBlock,
    handleEjectBlock,
    updateSetting,
    updateComponentSetting,
    addParent,
  }
}

export const componentStore = createComponentStore()

export const selectedComponent = derived(
  [componentStore, selectedScreen],
  ([$componentStore, $selectedScreen]) => {
    if (
      $selectedScreen &&
      $componentStore.selectedComponentId?.startsWith(`${$selectedScreen._id}-`)
    ) {
      return $selectedScreen?.props
    }
    if (!$selectedScreen || !$componentStore.selectedComponentId) {
      return null
    }
    return findComponent(
      $selectedScreen?.props,
      $componentStore.selectedComponentId
    )
  }
)

export const selectedComponentPath = derived(
  [componentStore, selectedScreen],
  ([$componentStore, $selectedScreen]) => {
    return findComponentPath(
      $selectedScreen?.props,
      $componentStore.selectedComponentId
    ).map(component => component._id)
  }
)
