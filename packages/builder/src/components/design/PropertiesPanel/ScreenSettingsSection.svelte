<script>
  import { get } from "svelte/store"
  import { get as deepGet, setWith } from "lodash"
  import { Input, DetailSummary, notifications } from "@budibase/bbui"
  import PropertyControl from "./PropertyControls/PropertyControl.svelte"
  import LayoutSelect from "./PropertyControls/LayoutSelect.svelte"
  import RoleSelect from "./PropertyControls/RoleSelect.svelte"
  import { currentAsset, store } from "builderStore"
  import { FrontendTypes } from "constants"
  import sanitizeUrl from "builderStore/store/screenTemplates/utils/sanitizeUrl"
  import { allScreens, selectedAccessRole } from "builderStore"
  import ButtonActionEditor from "./PropertyControls/ButtonActionEditor/ButtonActionEditor.svelte"
  import { getBindableProperties } from "builderStore/dataBinding"

  export let componentInstance
  export let bindings

  let errors = {}

  const routeTaken = url => {
    const roleId = get(selectedAccessRole) || "BASIC"
    return get(allScreens).some(
      screen =>
        screen.routing.route.toLowerCase() === url.toLowerCase() &&
        screen.routing.roleId === roleId
    )
  }

  const roleTaken = roleId => {
    const url = get(currentAsset)?.routing.route
    return get(allScreens).some(
      screen =>
        screen.routing.route.toLowerCase() === url.toLowerCase() &&
        screen.routing.roleId === roleId
    )
  }

  const setAssetProps = (name, value, parser, validate) => {
    if (parser) {
      value = parser(value)
    }
    if (validate) {
      const error = validate(value)
      errors = {
        ...errors,
        [name]: error,
      }
      if (error) {
        return
      }
    } else {
      errors = {
        ...errors,
        [name]: null,
      }
    }

    const selectedAsset = get(currentAsset)
    store.update(state => {
      if (
        name === "_instanceName" &&
        state.currentFrontEndType === FrontendTypes.SCREEN
      ) {
        selectedAsset.props._instanceName = value
      } else {
        setWith(selectedAsset, name.split("."), value, Object)
      }
      return state
    })

    try {
      store.actions.preview.saveSelected()
    } catch (error) {
      notifications.error("Error saving settings")
    }
  }

  const screenSettings = [
    {
      key: "routing.route",
      label: "Route",
      control: Input,
      parser: val => {
        if (!val.startsWith("/")) {
          val = "/" + val
        }
        return sanitizeUrl(val)
      },
      validate: val => {
        const exisingValue = get(currentAsset)?.routing.route
        if (val !== exisingValue && routeTaken(val)) {
          return "That URL is already in use for this role"
        }
        return null
      },
    },
    {
      key: "routing.roleId",
      label: "Access",
      control: RoleSelect,
      validate: val => {
        const exisingValue = get(currentAsset)?.routing.roleId
        if (val !== exisingValue && roleTaken(val)) {
          return "That role is already in use for this URL"
        }
        return null
      },
    },
    { key: "layoutId", label: "Layout", control: LayoutSelect },
    {
      key: "onLoad",
      label: "On screen load",
      control: ButtonActionEditor,
    },
  ]
</script>

{#if $store.currentView !== "component" && $currentAsset && $store.currentFrontEndType === FrontendTypes.SCREEN}
  <DetailSummary name="Screen" collapsible={false}>
    {#each screenSettings as def (`${componentInstance._id}-${def.key}`)}
      <PropertyControl
        control={def.control}
        label={def.label}
        key={def.key}
        error="asdasds"
        value={deepGet($currentAsset, def.key)}
        onChange={val => setAssetProps(def.key, val, def.parser, def.validate)}
        {bindings}
        props={{ error: errors[def.key] }}
      />
    {/each}
  </DetailSummary>
{/if}
