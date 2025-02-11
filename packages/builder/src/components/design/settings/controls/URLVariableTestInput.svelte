<script>
  import { onMount } from "svelte"
  import { Input, Icon, Body, AbsTooltip } from "@budibase/bbui"
  import { previewStore } from "@/stores/builder"

  export let baseRoute = ""
  export let testValue = ""

  $: routeParams = baseRoute.match(/:[a-zA-Z]+/g) || []
  $: placeholder = (() => {
    // Helper function to extract the route parameters
    // e.g /employees/:id/:name becomes /employees/1/John for the placeholder
    if (!routeParams.length) return "Add test values"
    const segments = baseRoute.split("/").slice(2)
    let paramCount = 1
    return segments
      .map(segment => {
        if (segment.startsWith(":")) {
          return paramCount++
        }
        return segment
      })
      .join("/")
  })()

  $: {
    if ($previewStore.selectedComponentContext?.url?.testValue !== undefined) {
      testValue = $previewStore.selectedComponentContext.url.testValue
    }
  }

  const onVariableChange = e => {
    previewStore.updateUrl({ route: baseRoute, testValue: e.detail })
    previewStore.requestComponentContext()
  }

  onMount(() => {
    previewStore.requestComponentContext()
  })
</script>

<div class="url-test-section">
  <div class="info">
    <Body size="XS">URL Variable Testing</Body>
    <AbsTooltip
      text="Test how your screen behaves with different URL parameters. Enter values in the format shown in the placeholder."
      position={"bottom"}
      noWrap
    >
      <div class="icon">
        <Icon name="InfoOutline" size="S" disabled hoverable />
      </div>
    </AbsTooltip>
  </div>
  <div class="url-test-container">
    <div class="base-input">
      <Input disabled={true} value={`/${baseRoute.split("/")[1]}/`} />
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
