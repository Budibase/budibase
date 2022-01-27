<script>
  import { createEventDispatcher } from "svelte"
  import PropertyControl from "./PropertyControl.svelte"
  import { getComponentForSettingType } from "./componentSettings"
  import { Layout } from "@budibase/bbui"

  export let value
  export let componentInstance
  export let componentDefinition
  export let bindings

  const dispatch = createEventDispatcher()

  $: settings = componentInstance?.settings || []
</script>

<Layout noPadding gap="S">
  {#each settings as setting}
    <PropertyControl
      type={setting.type.toLowerCase()}
      control={getComponentForSettingType(setting.type.toLowerCase())}
      label={setting.name}
      key={setting.name}
      value={value?.[setting.name]}
      onChange={val => dispatch("change", { ...value, [setting.name]: val })}
      props={{
        options: [],
      }}
      {bindings}
      {componentInstance}
      {componentDefinition}
    />
  {/each}
</Layout>
