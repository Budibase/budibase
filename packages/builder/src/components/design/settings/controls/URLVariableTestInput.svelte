<script lang="ts">
  import { onMount } from "svelte"
  import {
    Input,
    Icon,
    Body,
    AbsTooltip,
    TooltipPosition,
  } from "@budibase/bbui"
  import { previewStore, selectedScreen } from "@/stores/builder"
  import { ComponentContext } from "@budibase/types"

  export let baseRoute = ""

  let testValue: string | undefined

  $: placeholder = getPlaceholder(baseRoute)
  $: baseInput = createBaseInput(baseRoute)
  $: updateTestValueFromContext($previewStore.selectedComponentContext)
  $: if ($selectedScreen) {
    testValue = ""
  }

  const getPlaceholder = (route: string) => {
    const trimmed = route.replace(/\/$/, "")
    if (trimmed.startsWith("/:")) {
      return "1"
    }
    const segments = trimmed.split("/").slice(2)
    let count = 1
    return segments
      .map(segment => (segment.startsWith(":") ? count++ : segment))
      .join("/")
  }

  // This function is needed to repopulate the test value from componentContext
  // when a user navigates to another component and then back again
  const updateTestValueFromContext = (context: ComponentContext | null) => {
    if (context?.url && !testValue) {
      const { wild, ...urlParams } = context.url
      const queryParams = context.query
      if (Object.values(urlParams).some(v => Boolean(v))) {
        let value = baseRoute
          .split("/")
          .slice(2)
          .map(segment =>
            segment.startsWith(":")
              ? urlParams[segment.slice(1)] || ""
              : segment
          )
          .join("/")
        const qs = new URLSearchParams(queryParams).toString()
        if (qs) {
          value += `?${qs}`
        }
        testValue = value
      }
    }
  }

  const createBaseInput = (baseRoute: string) => {
    return baseRoute === "/" || baseRoute.split("/")[1]?.startsWith(":")
      ? "/"
      : `/${baseRoute.split("/")[1]}/`
  }

  const onVariableChange = (e: CustomEvent) => {
    previewStore.updateUrl({ route: baseRoute, testValue: e.detail })
  }

  onMount(() => {
    previewStore.requestComponentContext()
  })
</script>

<div class="url-test-section">
  <div class="info">
    <Body size="XS">URL Variable Testing</Body>
    <AbsTooltip
      text="Test how your screen behaves with different URL parameters. Enter values in the format shown in the placeholder below."
      position={TooltipPosition.Top}
      noWrap
    >
      <div class="icon">
        <Icon name="InfoOutline" size="S" disabled hoverable />
      </div>
    </AbsTooltip>
  </div>
  <div class="url-test-container">
    <div class="base-input">
      <Input disabled={true} value={baseInput} />
    </div>
    <div class="variable-input">
      <Input
        value={testValue}
        on:change={onVariableChange}
        placeholder={`${placeholder}`}
      />
    </div>
  </div>
</div>

<style>
  .url-test-section {
    width: 100%;
    margin-top: var(--spacing-xl);
  }

  .info {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    margin-bottom: var(--spacing-s);
  }

  .url-test-container {
    display: flex;
    width: 100%;
  }

  .base-input {
    width: 40%;
    margin-right: -1px;
  }

  .base-input :global(.spectrum-Textfield-input) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    background-color: var(--spectrum-global-color-gray-200);
    color: var(--spectrum-global-color-gray-600);
  }

  .variable-input {
    flex: 1;
  }

  .variable-input :global(.spectrum-Textfield-input) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
</style>
