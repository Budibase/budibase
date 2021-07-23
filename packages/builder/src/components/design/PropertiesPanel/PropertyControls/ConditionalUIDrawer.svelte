<script>
  import {
    Button,
    Body,
    Icon,
    DrawerContent,
    Layout,
    Select,
  } from "@budibase/bbui"
  import { flip } from "svelte/animate"
  import { dndzone } from "svelte-dnd-action"
  import { generate } from "shortid"
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"
  import { OperatorOptions, getValidOperatorsForType } from "helpers/lucene"
  import { getBindableProperties } from "builderStore/dataBinding"
  import { currentAsset, selectedComponent, store } from "builderStore"
  import { getComponentForSettingType } from "./componentSettings"
  import PropertyControl from "./PropertyControl.svelte"

  export let conditions = []

  const flipDurationMs = 150
  const actionOptions = [
    {
      label: "Hide component",
      value: "hide",
    },
    {
      label: "Show component",
      value: "show",
    },
    {
      label: "Update setting",
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
        id: generate(),
        action: "hide",
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
            <div
              class="condition"
              class:update={condition.action === "update"}
              animate:flip={{ duration: flipDurationMs }}
            >
              <Icon name="DragHandle" size="XL" />
              <Select
                draggable={false}
                placeholder={null}
                options={actionOptions}
                bind:value={condition.action}
              />
              {#if condition.action === "update"}
                <Select options={settings} bind:value={condition.setting} />
                <div>TO</div>
                {#if getSettingDefinition(condition.setting)}
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
                {:else}
                  <Select disabled placeholder=" " />
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
      {:else}
        <Body size="S">Add your first condition to get started.</Body>
      {/if}
      <div>
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
    margin: 0 auto;
  }
  .conditions {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-m);
  }
  .condition {
    gap: var(--spacing-l);
    display: grid;
    align-items: center;
    grid-template-columns: auto 1fr auto 1fr 1fr 1fr auto;
    border-radius: var(--border-radius-s);
    transition: background-color ease-in-out 130ms;
  }
  .condition.update {
    grid-template-columns: auto 1fr 1fr auto 1fr auto 1fr 1fr 1fr auto;
  }
  .condition:hover {
    background-color: var(--spectrum-global-color-gray-100);
  }
</style>
