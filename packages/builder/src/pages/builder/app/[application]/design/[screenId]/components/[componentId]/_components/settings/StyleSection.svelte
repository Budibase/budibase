<script>
  import PropertyControl from "components/design/settings/controls/PropertyControl.svelte"
  import { DetailSummary, notifications } from "@budibase/bbui"
  import { store } from "builderStore"

  export let name
  export let columns
  export let properties
  export let componentInstance
  export let bindings = []

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

  const updateStyle = async (key, val) => {
    try {
      await store.actions.components.updateStyle(key, val)
    } catch (error) {
      notifications.error("Error updating style")
    }
  }
</script>

<DetailSummary collapsible={false} name={`${name}${changed ? " *" : ""}`}>
  <div class="group-content" style="grid-template-columns: {columns || '1fr'}">
    {#each properties as prop (`${componentInstance._id}-${prop.key}-${prop.label}`)}
      <div style="grid-column: {prop.column || 'auto'}">
        <PropertyControl
          label={`${prop.label}${hasPropChanged(style, prop) ? " *" : ""}`}
          control={prop.control}
          key={prop.key}
          value={style[prop.key]}
          onChange={val => updateStyle(prop.key, val)}
          props={getControlProps(prop)}
          {bindings}
        />
      </div>
    {/each}
  </div>
</DetailSummary>

<style>
  .group-content {
    display: grid;
    align-items: stretch;
    gap: var(--spacing-l);
  }
</style>
