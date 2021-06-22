<script>
  import { get } from "svelte/store"
  import { get as deepGet, setWith } from "lodash"
  import { Input, DetailSummary } from "@budibase/bbui"
  import PropertyControl from "./PropertyControls/PropertyControl.svelte"
  import LayoutSelect from "./PropertyControls/LayoutSelect.svelte"
  import RoleSelect from "./PropertyControls/RoleSelect.svelte"
  import { currentAsset, store } from "builderStore"
  import { FrontendTypes } from "constants"

  export let componentInstance
  export let openSection

  function setAssetProps(name, value) {
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
    store.actions.preview.saveSelected()
  }

  const screenSettings = [
    { key: "description", label: "Description", control: Input },
    { key: "routing.route", label: "Route", control: Input },
    { key: "routing.roleId", label: "Access", control: RoleSelect },
    { key: "layoutId", label: "Layout", control: LayoutSelect },
  ]
</script>

{#if $currentAsset && $store.currentFrontEndType === FrontendTypes.SCREEN}
  <DetailSummary name="Screen" on:open show={openSection === "screen"}>
    {#each screenSettings as def (`${componentInstance._id}-${def.key}`)}
      <PropertyControl
        bindable={false}
        control={def.control}
        label={def.label}
        key={def.key}
        value={deepGet($currentAsset, def.key)}
        onChange={val => setAssetProps(def.key, val)}
      />
    {/each}
  </DetailSummary>
{/if}
