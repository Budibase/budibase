<script lang="ts">
  import { Icon } from "@budibase/bbui"
  import Field from "./Field.svelte"
  import { FieldType } from "@budibase/types"
  import type { FieldSchema } from "@budibase/types"
  import type { FieldApi, FieldState, FieldValidation } from "@/types"

  type Size = "XS" | "S" | "M" | "L" | "XL"
  type IconType = "star" | "heart"
  type ColourVariant =
    | "Primary"
    | "Secondary"
    | "Mono"
    | "Gold"
    | "Red"
    | "Custom"

  export let colour: string = ""
  export let disabled: boolean = false
  export let readonly: boolean = false
  export let field: string
  export let label: string
  export let numberOfStars: number = 5
  export let size: Size = "L"
  export let type: IconType = "star"
  export let variant: ColourVariant = "Primary"

  export let validation: FieldValidation
  export let onChange: (_event: { value: number }) => void

  let hoverRating: number | null = null
  let fieldState: FieldState
  let fieldApi: FieldApi
  let fieldSchema: FieldSchema

  const colourVariants: Record<ColourVariant, string> = {
    Primary: "var(--primaryColor)",
    Secondary: "var(--primaryColorHover)",
    Mono: "var(--spectrum-global-color-gray-900)",
    Gold: "var(--spectrum-global-color-yellow-500)",
    Red: "var(--spectrum-global-color-red-500)",
    Custom: "var(--primaryColor)",
  }

  $: ratingColour =
    variant === "Custom" && colour
      ? colour
      : colourVariants[variant] || "var(--primaryColor)"

  const sizeSpacing: Record<Size, number> = {
    XS: 0.25,
    S: 0.5,
    M: 1,
    L: 1.5,
    XL: 2,
  }

  $: spacing = sizeSpacing[size] || sizeSpacing.M
  $: enabled = !fieldState?.disabled && !fieldState?.readonly

  const handleClick = (value: number): void => {
    if (enabled) {
      const changed = fieldApi?.setValue(value)
      if (onChange && changed) {
        onChange({ value })
      }
    }
  }

  const isRated = (value: number | null, index: number): boolean => {
    return typeof value === "number" && value >= index + 1
  }
</script>

<Field
  {label}
  {field}
  {disabled}
  {readonly}
  {validation}
  type={FieldType.NUMBER}
  defaultValue="0"
  bind:fieldState
  bind:fieldApi
  bind:fieldSchema
>
  <div class="rating-container">
    {#each { length: numberOfStars } as _, i}
      <button
        type="button"
        class="rating-icon-wrapper"
        class:disabled={fieldState?.disabled}
        style="padding: 0 {spacing}px;"
        on:mouseover={enabled ? () => (hoverRating = i + 1) : null}
        on:mouseleave={enabled ? () => (hoverRating = null) : null}
        on:focus={enabled ? () => (hoverRating = i + 1) : null}
        on:blur={enabled ? () => (hoverRating = null) : null}
        on:keydown={e => enabled && e.key === "Enter" && handleClick(i + 1)}
        on:click={() => handleClick(i + 1)}
      >
        <div
          class="icon-container"
          class:hover-preview={isRated(hoverRating, i) &&
            !isRated(fieldState?.value, i)}
        >
          <Icon
            name={type}
            {size}
            color={ratingColour}
            weight={isRated(hoverRating, i) || isRated(fieldState?.value, i)
              ? "fill"
              : "regular"}
          />
        </div>
      </button>
    {/each}
  </div>
</Field>

<style>
  .rating-container {
    display: inline-flex;
    align-items: center;
    flex-wrap: nowrap;
    overflow: hidden;
  }
  .rating-icon-wrapper {
    cursor: pointer;
    display: flex;
    align-items: center;
    background: none;
    border: none;
    flex: 0 0 auto;
  }
  .rating-icon-wrapper.disabled {
    cursor: default;
    opacity: 0.75;
  }
  .icon-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .icon-container.hover-preview :global(i) {
    opacity: 0.2;
    filter: contrast(0.5);
  }
</style>
