<script>
  import { getContext } from "svelte"
  import Manifest from "manifest.json"
  import { builderStore } from "stores"

  const { componentStore } = getContext("sdk")
  const component = getContext("component")

  export let text

  $: componentInstance = componentStore.actions.getComponentById($component.id)

  const getComponentKey = compId => {
    if (!compId) {
      return
    }
    const prefix = "@budibase/standard-components/"
    let componentKey = compId.replace(prefix, "")
    return componentKey
  }

  const emptyFields = (definition, options) => {
    if (!options) {
      return []
    }
    return definition?.settings
      ? definition.settings.filter(setting => {
          return (
            setting.required &&
            (!options[setting.key] || options[setting.key] == "")
          )
        })
      : []
  }
  const definition = Manifest[getComponentKey($component.type)]
  $: focus_setting = emptyFields(definition, componentInstance)[0]
</script>

{#if $builderStore.inBuilder}
  <div class="placeholder_wrap">
    {#if componentInstance && focus_setting}
      <div>
        <span>
          Add the <mark>{focus_setting?.label}</mark> setting to start using your
          component &nbsp;
        </span>
        <span
          class="showMe spectrum-Link"
          on:click={() => {
            builderStore.actions.setFocus([
              {
                location: "component_settings",
                key: focus_setting.key,
                target: $component.id,
              },
            ])
          }}
        >
          Show me
        </span>
      </div>
    {:else}
      {text || $component.name || "Placeholder"}
    {/if}
  </div>
{/if}

<style>
  div {
    color: var(--spectrum-global-color-gray-600);
    font-size: var(--font-size-s);
    padding: var(--spacing-xs);
  }
  :global(div.placeholder_wrap mark) {
    background-color: var(--spectrum-global-color-gray-400);
    padding: 0px 2px;
    border-radius: 2px;
  }
  :global(div.placeholder_wrap .showMe) {
    cursor: pointer;
  }
  :global(div.placeholder_wrap .showMe:hover) {
    text-decoration: underline;
    cursor: pointer;
  }
</style>
