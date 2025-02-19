<script lang="ts">
  import { onMount } from "svelte"
  import { Input, Label } from "@budibase/bbui"
  import { previewStore, selectedScreen } from "@/stores/builder"
  import type { AppContext } from "@budibase/types"

  export let baseRoute = ""

  let testValue: string | undefined

  $: routeParams = baseRoute.match(/:[a-zA-Z]+/g) || []
  $: hasUrlParams = routeParams.length > 0
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
  const updateTestValueFromContext = (context: AppContext | null) => {
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
    previewStore.setUrlTestData({ route: baseRoute, testValue: e.detail })
  }

  onMount(() => {
    previewStore.requestComponentContext()
  })
</script>

{#if hasUrlParams}
  <div class="url-test-section">
    <div class="info">
      <Label size="M">Set temporary URL variables for design preview</Label>
    </div>
    <div class="url-test-container">
      <div class="base-input">
        <Input disabled={true} value={baseInput} />
      </div>
      <div class="variable-input">
        <Input value={testValue} on:change={onVariableChange} {placeholder} />
      </div>
    </div>
  </div>
{/if}

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
    width: 98px;
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
