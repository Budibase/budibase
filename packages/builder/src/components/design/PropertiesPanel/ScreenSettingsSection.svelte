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

  export let componentInstance
  export let bindings

  function setAssetProps(name, value, parser) {
    if (parser && typeof parser === "function") {
      value = parser(value)
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
    // { key: "description", label: "Description", control: Input },
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
    },
    { key: "routing.roleId", label: "Access", control: RoleSelect },
    { key: "layoutId", label: "Layout", control: LayoutSelect },
  ]
</script>

{#if $store.currentView !== "component" && $currentAsset && $store.currentFrontEndType === FrontendTypes.SCREEN}
  <DetailSummary name="Screen" collapsible={false}>
    {#each screenSettings as def (`${componentInstance._id}-${def.key}`)}
      <PropertyControl
        control={def.control}
        label={def.label}
        key={def.key}
        value={deepGet($currentAsset, def.key)}
        onChange={val => setAssetProps(def.key, val, def.parser)}
        {bindings}
      />
    {/each}
  </DetailSummary>
{/if}
