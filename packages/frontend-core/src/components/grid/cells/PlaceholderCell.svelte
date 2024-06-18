<script>
  import { OptionColours } from "../../../constants"
  import { FieldType } from "@budibase/types"

  export let rowIdx
  export let schema

  const ColorfulTypes = [FieldType.OPTIONS, FieldType.ARRAY, FieldType.LINK]

  $: rand = rowIdx + 1 + (schema?.name || "").length
  $: width = 60 + ((rand * rand * 123) % 17) * 4
  $: colorful = ColorfulTypes.includes(schema?.type)
  $: alignRight = schema?.type === FieldType.NUMBER
  $: color =
    schema?.type === FieldType.LINK
      ? OptionColours[0]
      : OptionColours[rand % OptionColours.length]
</script>

<div class="placeholder-cell" class:right={alignRight}>
  <div class="outer" class:colorful style="width:{width}px; --color:{color}">
    <div class="inner" />
  </div>
</div>

<style>
  .placeholder-cell {
    flex: 1 1 auto;
    display: flex;
    gap: 8px;
    height: var(--default-row-height);
    align-items: center;
    padding: var(--cell-padding);
    overflow: hidden;
  }
  .placeholder-cell.right {
    justify-content: flex-end;
  }
  .outer {
    position: relative;
    background-color: var(--spectrum-global-color-gray-300);
    overflow: hidden;
    border-radius: 4px;
    height: 20px;
    max-width: 100%;
  }
  .outer.colorful {
    background-color: var(--color);
    border-radius: var(--cell-padding);
  }
  .inner {
    position: absolute;
    left: -50%;
    height: 100%;
    width: 50%;
    animation: shimmer 1.5s infinite;
    position: relative;
    overflow: hidden;
    background: linear-gradient(
      to right,
      var(--spectrum-global-color-gray-300) 0%,
      var(--spectrum-global-color-gray-400) 40%,
      var(--spectrum-global-color-gray-400) 60%,
      var(--spectrum-global-color-gray-300) 100%
    );
  }
  .outer.colorful .inner {
    background: linear-gradient(
      to right,
      transparent 0%,
      rgba(255, 255, 255, 0.1) 40%,
      rgba(255, 255, 255, 0.1) 60%,
      transparent 100%
    );
  }

  @keyframes shimmer {
    0% {
      left: -50%;
    }
    100% {
      left: 100%;
    }
  }
</style>
