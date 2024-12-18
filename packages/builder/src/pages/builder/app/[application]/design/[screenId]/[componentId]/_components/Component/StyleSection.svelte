<script>
  import PropertyControl from "@/components/design/settings/controls/PropertyControl.svelte"
  import { DetailSummary, notifications } from "@budibase/bbui"
  import { componentStore } from "@/stores/builder"

  export let name
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
      await componentStore.updateStyle(key, val)
    } catch (error) {
      notifications.error("Error updating style")
    }
  }
</script>

<DetailSummary collapsible={false} name={`${name}${changed ? " *" : ""}`}>
  <div class="styles">
    {#each properties as prop (`${componentInstance._id}-${prop.key}-${prop.label}`)}
      <PropertyControl
        label={`${prop.label}${hasPropChanged(style, prop) ? " *" : ""}`}
        control={prop.control}
        key={prop.key}
        value={style[prop.key]}
        onChange={val => updateStyle(prop.key, val)}
        props={getControlProps(prop)}
        {bindings}
      />
    {/each}
  </div>
</DetailSummary>

<style>
  .styles {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: 8px;
  }
</style>
