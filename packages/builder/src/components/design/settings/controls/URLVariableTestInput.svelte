<script>
  import { onMount } from "svelte"
  import { Input } from "@budibase/bbui"
  import { previewStore } from "@/stores/builder"

  export let baseRoute = ""
  export let testValue = ""

  // Extract route parameters (anything starting with :)
  $: routeParams = baseRoute.match(/:[a-zA-Z]+/g) || []
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
  <div class="label">URL Variable Testing</div>
  <div class="url-pattern">Pattern: {baseRoute}</div>
  <div class="url-test-container">
    <div class="base-input">
      <Input disabled={true} value={`/${baseRoute.split("/")[1]}/`} />
    </div>
    <div class="variable-input">
      <Input
        value={testValue}
        on:change={onVariableChange}
        placeholder={routeParams.length
          ? `e.g. ${routeParams.map(p => p.slice(1)).join("/")}`
          : "Add test values"}
      />
    </div>
  </div>
</div>

<style>
  .url-test-section {
    width: 100%;
    margin-top: var(--spacing-xl);
  }

  .label {
    font-size: var(--spectrum-global-dimension-font-size-75);
    font-weight: 500;
    margin-bottom: var(--spacing-s);
  }

  .url-pattern {
    font-size: var(--spectrum-global-dimension-font-size-75);
    color: var(--spectrum-global-color-gray-700);
    margin-bottom: var(--spacing-xs);
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

  /* Override input styles to make them look connected */
  .url-test-container :global(.spectrum-Textfield:focus-within) {
    z-index: 1;
  }
</style>
