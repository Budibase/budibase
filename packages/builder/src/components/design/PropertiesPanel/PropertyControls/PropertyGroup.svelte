<script>
  import PropertyControl from "./PropertyControl.svelte"
  import { DetailSummary } from "@budibase/bbui"

  export let name = ""
  export let styleCategory = "normal"
  export let properties = []
  export let componentInstance = {}
  export let onStyleChanged = () => {}
  export let open = false

  $: style = componentInstance["_styles"][styleCategory] || {}
  $: changed = properties.some(prop => hasPropChanged(style, prop))

  const hasPropChanged = (style, prop) => {
    return style[prop.key] != null && style[prop.key] !== ""
  }

  const getControlProps = props => {
    const { label, key, control, ...otherProps } = props || {}
    return otherProps || {}
  }
</script>

<DetailSummary name={`${name}${changed ? ' *' : ''}`} on:open show={open} thin>
  {#if open}
    <div>
      {#each properties as prop (`${componentInstance._id}-${prop.key}`)}
        <PropertyControl
          bindable={false}
          label={`${prop.label}${hasPropChanged(style, prop) ? ' *' : ''}`}
          control={prop.control}
          key={prop.key}
          value={style[prop.key]}
          onChange={value => onStyleChanged(styleCategory, prop.key, value)}
          props={getControlProps(prop)} />
      {/each}
    </div>
  {/if}
</DetailSummary>

<style>
  div {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-s);
  }
</style>
