<script>
  import { componentStore } from "../store"
  import { buildStyle, getValidProps } from "../utils"

  export let props
  export let children
  export let component
  export let styles

  $: componentConstructor = componentStore.actions.getComponent(component)
  $: console.log("Rendering: " + component)
</script>

{#if componentConstructor}
  <div
    style={buildStyle(styles)}
    data-bb-component={component}
    data-bb-name={component._instanceName}>
    <svelte:component this={componentConstructor} {...props}>
      {#if children && children.length}
        {#each children as child}
          <svelte:self
            props={getValidProps(child)}
            component={child._component}
            children={child._children}
            styles={child._styles.normal} />
        {/each}
      {/if}
    </svelte:component>
  </div>
{/if}
