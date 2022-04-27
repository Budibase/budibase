<script>
  import { Layout, Toggle } from "@budibase/bbui"
  import DevToolsStat from "./DevToolsStat.svelte"
  import { componentStore } from "stores/index.js"
  import { getSettingsDefinition } from "utils/componentProps.js"

  let showEnrichedSettings = true

  $: selectedInstance = $componentStore.selectedComponentInstance
  $: settingsDefinition = getSettingsDefinition(
    $componentStore.selectedComponentDefinition
  )
  $: rawSettings = selectedInstance?.getRawSettings()
  $: settings = selectedInstance?.getSettings()
</script>

<Layout noPadding gap="S">
  <Toggle text="Show enriched settings" bind:value={showEnrichedSettings} />
  <Layout noPadding gap="XS">
    {#each settingsDefinition as setting}
      <DevToolsStat
        copyable
        label={setting.label}
        value={JSON.stringify(
          (showEnrichedSettings ? settings : rawSettings)?.[setting.key]
        )}
      />
    {/each}
  </Layout>
</Layout>
