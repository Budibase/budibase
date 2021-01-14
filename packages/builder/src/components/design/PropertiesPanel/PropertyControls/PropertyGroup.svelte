<script>
  import PropertyControl from "./PropertyControl.svelte"
  import { DetailSummary } from "@budibase/bbui"

  export let name = ""
  export let styleCategory = "normal"
  export let properties = []
  export let componentInstance = {}
  export let onStyleChanged = () => {}
  export let open = false

  const hasPropChanged = (style, prop) => {
    return style[prop.key] != null && style[prop.key] !== ""
  }

  $: style = componentInstance["_styles"][styleCategory] || {}
  $: changed = properties.some(prop => hasPropChanged(style, prop))
</script>

<DetailSummary name={`${name}${changed ? ' *' : ''}`} on:open show={open} thin>
  {#if open}
    <div>
      {#each properties as prop}
        <PropertyControl
          label={`${prop.label}${hasPropChanged(style, prop) ? ' *' : ''}`}
          control={prop.control}
          key={prop.key}
          value={style[prop.key]}
          onChange={(key, value) => onStyleChanged(styleCategory, key, value)}
          props={{ options: prop.options, placeholder: prop.placeholder }} />
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
