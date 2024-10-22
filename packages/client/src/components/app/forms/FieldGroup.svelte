<script>
  import { getContext, setContext } from "svelte"
  import Section from "../deprecated/Section.svelte"

  export let labelPosition = "above"
  export let type = "oneColumn"

  const { styleable } = getContext("sdk")
  const component = getContext("component")
  setContext("field-group", { labelPosition })
</script>

<div class="wrapper" use:styleable={$component.styles}>
  <div
    class="spectrum-Form"
    class:spectrum-Form--labelsAbove={labelPosition === "above"}
  >
    {#if labelPosition === "above" && type !== "oneColumn"}
      <Section {type}>
        <slot />
      </Section>
    {:else}
      <slot />
    {/if}
  </div>
</div>

<style>
  .wrapper {
    width: 100%;
    position: relative;
  }
  .spectrum-Form {
    width: 100%;
  }
  .spectrum-Form--labelsAbove {
    gap: var(--spectrum-global-dimension-size-100);
  }
</style>
