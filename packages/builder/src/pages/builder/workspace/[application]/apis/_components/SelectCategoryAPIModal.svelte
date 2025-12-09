<script lang="ts">
  import { Button, Divider, Select } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import type {
    ConnectorCard,
    GroupTemplateName,
    RestTemplate,
    RestTemplateGroup,
    RestTemplateGroupName,
    RestTemplateName,
    TemplateSelection,
  } from "@budibase/types"
  import DescriptionViewer from "@/components/common/DescriptionViewer.svelte"

  export let templates: RestTemplate[] = []
  export let templateGroups: RestTemplateGroup<RestTemplateGroupName>[] = []
  export let loading = false
  export let customDisabled = false

  const dispatch = createEventDispatcher<{
    selectTemplate: TemplateSelection
    custom: void
  }>()

  let scrolling = false
  let page: HTMLDivElement | undefined
  let activeGroup: RestTemplateGroup<RestTemplateGroupName> | null = null
  let activeGroupTemplateName: GroupTemplateName | null = null

  $: groupedTemplateNames = new Set<RestTemplateName>(
    templateGroups.flatMap(group =>
      group.templates.map(template => template.name)
    )
  )
  $: visibleTemplates = (templates || []).filter(
    template => !groupedTemplateNames.has(template.name)
  )
  $: connectorCards = [
    ...templateGroups.map<ConnectorCard>(group => ({
      type: "group",
      name: group.name,
      icon: group.icon,
      key: `group-${group.name}`,
      group,
    })),
    ...visibleTemplates.map<ConnectorCard>(template => ({
      type: "template",
      name: template.name,
      icon: template.icon,
      key: `template-${template.name}`,
      template,
    })),
  ].sort((a, b) => a.name.localeCompare(b.name))
  $: activeGroupOptions = activeGroup
    ? activeGroup.templates.map(template => ({
        label: template.name,
        value: template.name,
        description: template.description,
      }))
    : []
  $: selectedGroupTemplate =
    activeGroup && activeGroupTemplateName
      ? activeGroup.templates.find(
          template => template.name === activeGroupTemplateName
        ) || null
      : null
  $: selectedGroupTemplateDescription = activeGroupOptions.find(
    option => option.value === activeGroupTemplateName
  )?.description

  const handleScroll = (event: Event) => {
    const target = event.target as HTMLDivElement
    scrolling = target?.scrollTop !== 0
  }

  const openTemplateGroup = (
    group: RestTemplateGroup<RestTemplateGroupName>
  ) => {
    if (loading) {
      return
    }
    activeGroup = group
    activeGroupTemplateName = group.templates[0]?.name || null
  }

  const resetGroupSelection = () => {
    activeGroup = null
    activeGroupTemplateName = null
  }

  const confirmGroupTemplateSelection = () => {
    if (!activeGroup || !selectedGroupTemplate) {
      return
    }
    dispatch("selectTemplate", {
      kind: "group",
      groupName: activeGroup.name,
      template: selectedGroupTemplate,
    })
  }

  const handleTemplateSelection = (template: RestTemplate) => {
    dispatch("selectTemplate", { kind: "template", template })
  }

  const handleCustomClick = () => {
    dispatch("custom")
  }
</script>

<div class="api-main" class:scrolling>
  <div class="api-header">
    <div>API connectors</div>
    {#if !activeGroup}
      <div>
        <Button
          secondary
          icon="plus"
          disabled={loading || customDisabled}
          on:click={handleCustomClick}
        >
          Custom REST API
        </Button>
      </div>
    {/if}
  </div>
  <Divider size={"S"} noMargin />
  <div class="contents-wrap" on:scroll={handleScroll}>
    <div class="shadow"></div>
    <div bind:this={page} class="contents">
      {#if activeGroup}
        <div class="group-step">
          <div class="group-step-summary">
            <div class="api-icon group-icon">
              <img src={activeGroup.icon} alt={activeGroup.name} />
            </div>
            <div>
              <div class="group-step-name">{activeGroup.name}</div>
              <div class="group-step-description">
                {activeGroup.description}
              </div>
            </div>
          </div>
          <div class="group-step-body">
            <Select
              label={`Select category`}
              options={activeGroupOptions}
              bind:value={activeGroupTemplateName}
              disabled={loading}
            />
            {#if selectedGroupTemplateDescription}
              <DescriptionViewer
                description={selectedGroupTemplateDescription}
                label={undefined}
              />
            {/if}
          </div>
          <div class="group-step-actions">
            <Button secondary on:click={resetGroupSelection} disabled={loading}>
              Back
            </Button>
            <Button
              cta
              on:click={confirmGroupTemplateSelection}
              disabled={!selectedGroupTemplate || loading}
            >
              Use template
            </Button>
          </div>
        </div>
      {:else}
        <div class="grid">
          {#each connectorCards as card (card.key)}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div
              class="api"
              class:disabled={loading}
              on:click={() => {
                if (card.type === "group") {
                  openTemplateGroup(card.group)
                } else {
                  handleTemplateSelection(card.template)
                }
              }}
            >
              <div class="api-icon">
                <img src={card.icon} alt={card.name} />
              </div>

              {card.name}
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;
  }

  .api {
    display: flex;
    height: 38px;
    padding: 6px 12px;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    cursor: pointer;
    font-size: 14px;
    border-radius: 8px;
    border: 1px solid var(--spectrum-global-color-gray-200);
    background-color: var(--spectrum-global-color-gray-100);
    position: relative;
  }

  .api:hover {
    background-color: var(--spectrum-global-color-gray-300);
  }

  .api.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  .api.disabled img {
    filter: grayscale(100%);
    opacity: 0.6;
  }

  .api img {
    width: 20px;
    height: 20px;
  }

  .api-icon {
    border-radius: 4px;
    border: 1px solid var(--spectrum-global-color-gray-200);
    display: flex;
    width: 36px;
    height: 36px;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    margin-right: 10px;
  }

  .api-icon.group-icon {
    width: 48px;
    height: 48px;
  }

  .api-header {
    padding: var(--spacing-l) var(--spectrum-dialog-confirm-padding);
    width: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--spectrum-global-color-gray-800);
    font-size: 16px;
    font-weight: 600;
  }

  .api-main .contents {
    padding-top: var(--spacing-xl);
    padding-left: var(--spectrum-dialog-confirm-padding);
    padding-right: var(--spectrum-dialog-confirm-padding);
  }

  .api-main :global(hr) {
    background-color: var(--spectrum-global-color-gray-300);
  }

  .contents-wrap {
    flex: 1 1 auto;
    overflow-y: auto;
    min-height: 0;
    position: relative;
  }

  .group-step {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
  }

  .group-step-summary {
    display: flex;
    gap: var(--spacing-m);
    align-items: center;
  }

  .group-step-name {
    font-size: 18px;
    font-weight: 600;
  }

  .group-step-description {
    color: var(--spectrum-global-color-gray-700);
    font-size: 14px;
    margin-top: var(--spacing-xs);
  }

  .group-step-description :global(.description-viewer) {
    padding: 0;
    border: none;
    background: none;
    font-family: inherit;
    color: inherit;
    gap: 4px;
  }

  .group-step-description :global(.description-content) {
    font-size: inherit;
    color: inherit;
  }

  .group-step-body {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .group-step-actions {
    margin-top: 12px;
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-l);
  }
</style>
