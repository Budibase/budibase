<script>
  import { Button, Icon, DrawerContent, Layout, Select } from "@budibase/bbui"
  import { flip } from "svelte/animate"
  import { dndzone } from "svelte-dnd-action"
  import { generate } from "shortid"
  import DrawerBindableInput from "../../../common/bindings/DrawerBindableInput.svelte"
  import ColorPicker from "./ColorPicker.svelte"
  import { OperatorOptions, getValidOperatorsForType } from "helpers/lucene"
  import { getBindableProperties } from "../../../../builderStore/dataBinding"
  import { currentAsset, selectedComponent, store } from "builderStore"
  import { getComponentForSettingType } from "./componentSettings"
  import PropertyControl from "./PropertyControl.svelte"

  export let conditions = []

  const flipDurationMs = 150
  const actionOptions = [
    {
      label: "Show component",
      value: "show",
    },
    {
      label: "Hide component",
      value: "hide",
    },
    {
      label: "Update component setting",
      value: "update",
    },
  ]

  $: definition = store.actions.components.getDefinition(
    $selectedComponent?._component
  )
  $: settings = (definition?.settings ?? []).map(setting => {
    return {
      label: setting.label,
      value: setting.key,
    }
  })
  $: operatorOptions = getValidOperatorsForType("string")
  $: bindableProperties = getBindableProperties(
    $currentAsset,
    $store.selectedComponentId
  )
  $: conditions.forEach(link => {
    if (!link.id) {
      link.id = generate()
    }
  })

  const getSettingDefinition = key => {
    return definition?.settings?.find(setting => {
      return setting.key === key
    })
  }

  const getComponentForSetting = key => {
    const settingDefinition = getSettingDefinition(key)
    return getComponentForSettingType(settingDefinition?.type || "text")
  }

  const addCondition = () => {
    conditions = [
      ...conditions,
      {
        action: "show",
        operator: OperatorOptions.Equals.value,
      },
    ]
  }

  const removeLink = id => {
    conditions = conditions.filter(link => link.id !== id)
  }

  const updateLinks = e => {
    conditions = e.detail.items
  }
</script>

<DrawerContent>
  <div class="container">
    <Layout noPadding>
      {#if conditions?.length}
        <div
          class="conditions"
          use:dndzone={{
            items: conditions,
            flipDurationMs,
            dropTargetStyle: { outline: "none" },
          }}
          on:finalize={updateLinks}
          on:consider={updateLinks}
        >
          {#each conditions as condition (condition.id)}
            <div class="condition" animate:flip={{ duration: flipDurationMs }}>
              <Select
                placeholder={null}
                options={actionOptions}
                bind:value={condition.action}
              />
              {#if condition.action === "update"}
                <Select options={settings} bind:value={condition.setting} />
                {#if getSettingDefinition(condition.setting)}
                  <div>TO</div>
                  <PropertyControl
                    type={getSettingDefinition(condition.setting).type}
                    control={getComponentForSetting(condition.setting)}
                    key={getSettingDefinition(condition.setting).key}
                    value={condition.settingValue}
                    componentInstance={$selectedComponent}
                    onChange={val => (condition.settingValue = val)}
                    props={{
                      options: getSettingDefinition(condition.setting).options,
                      placeholder: getSettingDefinition(condition.setting)
                        .placeholder,
                    }}
                  />
                {/if}
              {/if}
              <div>IF</div>
              <DrawerBindableInput
                bindings={bindableProperties}
                placeholder="Value"
                value={condition.newValue}
                on:change={e => (condition.newValue = e.detail)}
              />
              <Select
                placeholder={null}
                options={operatorOptions}
                bind:value={condition.operator}
              />
              <DrawerBindableInput
                bindings={bindableProperties}
                placeholder="Value"
                value={condition.referenceValue}
                on:change={e => (condition.referenceValue = e.detail)}
              />
              <Icon
                name="Close"
                hoverable
                size="S"
                on:click={() => removeLink(condition.id)}
              />
            </div>
          {/each}
        </div>
      {/if}
      <div class="button-container">
        <Button secondary icon="Add" on:click={addCondition}>
          Add condition
        </Button>
      </div>
    </Layout>
  </div>
</DrawerContent>

<style>
  .container {
    width: 100%;
    max-width: 1200px;
  }
  .conditions {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-s);
  }
  .condition {
    gap: var(--spacing-l);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-radius: var(--border-radius-s);
    transition: background-color ease-in-out 130ms;
  }
  .condition:hover {
    background-color: var(--spectrum-global-color-gray-100);
  }
  .condition > :global(.spectrum-Form-item) {
    flex: 1 1 auto;
    width: 0;
  }
  .button-container {
  }
</style>
