<script lang="ts">
  import type { ComponentPayload } from "@budibase/types"
  import ButtonComponent from "./_Button.svelte"

  export let data: ComponentPayload

  const layout =
    typeof data.props?.layout === "string" &&
    ["horizontal", "vertical"].includes(data.props.layout)
      ? (data.props.layout as "horizontal" | "vertical")
      : "horizontal"

  const inferredButtons: ComponentPayload[] = Array.isArray(data.children)
    ? data.children.filter(child => child?.name === "Button")
    : []

  const fallbackButtons: ComponentPayload[] = Array.isArray(data.props?.buttons)
    ? (data.props.buttons as Record<string, unknown>[]).map((button, index) => ({
        name: "Button",
        props: button,
        slot:
          typeof button?.label === "string"
            ? (button.label as string)
            : `Option ${index + 1}`,
      }))
    : []

  const buttons =
    inferredButtons.length > 0 ? inferredButtons : fallbackButtons
</script>

<div class="multi-button multi-button--{layout}">
  {#if buttons.length > 0}
    {#each buttons as button, index (button.slot || `${index}`)}
      <ButtonComponent data={button} />
    {/each}
  {:else}
    <p class="multi-button__empty">No buttons configured.</p>
  {/if}
</div>

<style>
  .multi-button {
    display: inline-flex;
    gap: var(--spacing-s, 8px);
    flex-wrap: wrap;
  }

  .multi-button--vertical {
    flex-direction: column;
    align-items: stretch;
  }

  .multi-button__empty {
    margin: 0;
    font-size: 14px;
    color: var(--spectrum-global-color-gray-600);
  }
</style>
