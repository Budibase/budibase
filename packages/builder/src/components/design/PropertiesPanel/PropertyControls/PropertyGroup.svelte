<script>
  import PropertyControl from "./PropertyControl.svelte"
  import { DetailSummary } from "@budibase/bbui"
  import { store } from "builderStore"

  export let name
  export let inline = false
  export let properties
  export let componentInstance

  $: style = componentInstance._styles.normal || {}
  $: changed = properties?.some(prop => hasPropChanged(style, prop)) ?? false

  const hasPropChanged = (style, prop) => {
    return style[prop.key] != null && style[prop.key] !== ""
  }

  const getControlProps = props => {
    let controlProps = { ...(props || {}) }
    delete controlProps.label
    delete controlProps.key
    delete controlProps.control
    return controlProps
  }
</script>

<DetailSummary collapsible={false} name={`${name}${changed ? " *" : ""}`}>
  <div class="group-content" class:inline>
    {#each properties as prop (`${componentInstance._id}-${prop.key}-${prop.label}`)}
      <PropertyControl
        bindable={false}
        label={`${prop.label}${hasPropChanged(style, prop) ? " *" : ""}`}
        control={prop.control}
        key={prop.key}
        value={style[prop.key]}
        onChange={val => store.actions.components.updateStyle(prop.key, val)}
        props={getControlProps(prop)}
      />
    {/each}
  </div>
</DetailSummary>

<style>
  .group-content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-l);
  }
  .inline {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
</style>
