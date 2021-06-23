<script>
  import PropertyGroup from "./PropertyControls/PropertyGroup.svelte"
  import * as ComponentStyles from "./componentStyles"

  export let componentDefinition
  export let componentInstance

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
    return styles
  }

  $: styles = getStyles(componentDefinition)
</script>

{#if styles?.length > 0}
  {#each styles as style}
    <PropertyGroup
      {style}
      name={style.label}
      inline={style.inline}
      properties={style.settings}
      {componentInstance}
    />
  {/each}
{/if}
