<script>
  import StyleSection from "./StyleSection.svelte"
  import * as ComponentStyles from "./componentStyles"
  import ComponentSettingsSection from "./ComponentSettingsSection.svelte"
  import ColorPicker from "@/components/design/settings/controls/ColorPicker.svelte"

  export let componentDefinition
  export let componentInstance
  export let bindings
  export let componentBindings

  const getStyles = def => {
    if (!def?.styles?.length) {
      return [...ComponentStyles.all]
    }
    let styles = [...ComponentStyles.all]
    def.styles.forEach(style => {
      if (ComponentStyles[style]) {
        styles.push(ComponentStyles[style])
      }
    })

    // Add section for CSS variables if present
    if (def?.cssVariables?.length) {
      styles.push({
        label: "Customization",
        settings: def.cssVariables.map(variable => ({
          label: variable.label,
          key: variable.variable,
          control: ColorPicker,
        })),
      })
    }

    return styles
  }

  $: styles = getStyles(componentDefinition)
</script>

<!--
  Load any general settings or sections tagged as "style"
-->
<ComponentSettingsSection
  {componentInstance}
  {componentDefinition}
  isScreen={false}
  showInstanceName={false}
  {bindings}
  {componentBindings}
  tag="style"
/>

{#if styles?.length > 0}
  {#each styles as style}
    <StyleSection
      {style}
      name={style.label}
      properties={style.settings}
      {componentInstance}
      {bindings}
    />
  {/each}
{/if}
