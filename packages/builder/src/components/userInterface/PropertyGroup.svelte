<script>
  import { excludeProps } from "./propertyCategories.js"
  import PropertyControl from "./PropertyControl.svelte"
  import { DetailSummary } from "@budibase/bbui"

  export let name = ""
  export let styleCategory = "normal"
  export let properties = []
  export let componentInstance = {}
  export let onStyleChanged = () => {}
  export let open = false

  const hasPropChanged = prop => {
    if (prop.initialValue !== undefined) {
      return style[prop.key] !== prop.initialValue
    }
    return style[prop.key] != null && style[prop.key] !== ""
  }

  $: style = componentInstance["_styles"][styleCategory] || {}
  $: changed = properties.some(prop => hasPropChanged(prop))
</script>

<DetailSummary name={`${name}${changed ? ' *' : ''}`} on:open show={open} thin>
  <div>
    {#each properties as prop}
      <PropertyControl
        label={`${prop.label}${hasPropChanged(prop) ? ' *' : ''}`}
        control={prop.control}
        key={prop.key}
        value={style[prop.key]}
        onChange={(key, value) => onStyleChanged(styleCategory, key, value)}
        props={{ ...excludeProps(prop, ['control', 'label']) }} />
    {/each}
  </div>
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
