<script lang="ts">
  import { Body, Button, Icon, ModalContent } from "@budibase/bbui"
  import type {
    ImportProjectResponse,
    ProjectImportRequirement,
  } from "@budibase/types"

  interface Props {
    response: ImportProjectResponse
    onOpenResource: (_requirement: ProjectImportRequirement) => void
    isSetupReview?: boolean
  }

  let { response, onOpenResource, isSetupReview = false }: Props = $props()

  const setupDetails = {
    agent_ai_config: {
      label: "Agent",
      icon: "robot",
      action: "Configure",
      instruction: "Choose an AI model for this agent.",
    },
    agent_secrets: {
      label: "Agent",
      icon: "robot",
      action: "Configure",
      instruction: "Reconnect integrations in the Deployment tab.",
    },
    datasource_secrets: {
      label: "Data source",
      icon: "database",
      action: "Connect",
      instruction: "Add connection credentials for this data source.",
    },
    automation_credentials: {
      label: "Automation",
      icon: "lightning",
      action: "Reconnect",
      instruction: "Reconnect the mailbox before enabling this automation.",
    },
  }

  const resourceRequirements = $derived.by(() => {
    const groups = new Map<string, ProjectImportRequirement[]>()
    for (const requirement of response.requirements) {
      const existing = groups.get(requirement.resourceId) || []
      groups.set(requirement.resourceId, [...existing, requirement])
    }
    return [...groups.values()]
  })
</script>

<div class="import-result">
  <ModalContent
    confirmText="View project"
    showCancelButton={false}
    showDivider={false}
    size="M"
  >
    <span slot="header" class="result-heading">
      <span class="heading-icon" class:success-icon={!isSetupReview}>
        <Icon
          name={isSetupReview ? "list-checks" : "check-circle"}
          weight={isSetupReview ? "regular" : "fill"}
          size="XL"
          hidden
        />
      </span>
      {isSetupReview ? "Project setup" : "Project imported"}
    </span>

    <div class="import-summary">
      <Body size="S">
        <strong>{response.project.name}</strong>
        {#if !isSetupReview}
          is now in your workspace.
        {/if}
      </Body>
    </div>

    {#if resourceRequirements.length}
      <section class="setup-section" aria-labelledby="import-setup-heading">
        <div class="setup-intro">
          <h2 id="import-setup-heading">
            {resourceRequirements.length}
            {resourceRequirements.length === 1 ? "item needs" : "items need"} setup
          </h2>
          <Body size="S" color="var(--spectrum-global-color-gray-700)">
            {#if isSetupReview}
              Complete these steps to use all your project’s features.
            {:else}
              You can finish setup later from “Project setup” in the project
              menu.
            {/if}
          </Body>
        </div>
        <ul class="setup-list">
          {#each resourceRequirements as requirements (requirements[0].resourceId)}
            {@const resource = requirements[0]}
            {@const details = setupDetails[resource.type]}
            <li class="resource-requirements">
              <span class="resource-icon">
                <Icon name={details.icon} size="M" hidden />
              </span>
              <div class="resource-info">
                <span class="resource-type">{details.label}</span>
                <h3>{resource.name}</h3>
                <ul class="instructions">
                  {#each requirements as requirement}
                    <li>{setupDetails[requirement.type].instruction}</li>
                  {/each}
                </ul>
              </div>
              <div class="resource-action">
                <Button
                  secondary
                  on:click={() => onOpenResource(resource)}
                  size="S"
                >
                  {details.action}<span class="visually-hidden">
                    {resource.name}
                  </span>
                </Button>
              </div>
            </li>
          {/each}
        </ul>
      </section>
    {:else if isSetupReview}
      <Body size="S">No setup items remaining.</Body>
    {/if}

    {#if response.unsupportedContent.length}
      <details class="excluded-content">
        <summary>
          <span class="disclosure-icon">
            <Icon name="caret-right" size="S" hidden />
          </span>
          What wasn’t imported
        </summary>
        <ul class="excluded-list">
          {#each response.unsupportedContent as content}
            <li>
              <Body size="S" color="var(--spectrum-global-color-gray-700)">
                {content.reason} ({content.count})
              </Body>
            </li>
          {/each}
        </ul>
      </details>
    {/if}
  </ModalContent>
</div>

<style>
  .import-result :global(.spectrum-Dialog) {
    min-width: 0;
    max-width: 100%;
  }

  .import-result :global(.spectrum-Dialog-content) {
    max-height: calc(100dvh - 280px);
    overflow-y: auto;
    overflow-wrap: anywhere;
  }

  .result-heading {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
  }

  .heading-icon {
    color: var(--spectrum-global-color-gray-700);
  }

  .success-icon {
    color: var(--spectrum-semantic-positive-color-status);
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .setup-intro {
    margin-bottom: var(--spacing-m);
  }

  h2,
  h3 {
    margin: 0;
    color: var(--spectrum-global-color-gray-900);
    font-size: var(--font-size-s);
    font-weight: 600;
    line-height: 20px;
  }

  h2 {
    margin-bottom: var(--spacing-xs);
  }

  .setup-list {
    display: grid;
    gap: var(--spacing-s);
  }

  .resource-requirements {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: start;
    gap: var(--spacing-m);
    padding: var(--spacing-l);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: var(--border-radius-m);
  }

  .resource-icon {
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    border-radius: var(--border-radius-s);
    background: var(--spectrum-global-color-gray-100);
    color: var(--spectrum-global-color-gray-700);
  }

  .resource-type {
    display: block;
    margin-bottom: var(--spacing-xs);
    color: var(--spectrum-global-color-gray-700);
    font-size: var(--font-size-xs);
    line-height: 16px;
  }

  .instructions {
    margin-top: var(--spacing-s);
    color: var(--spectrum-global-color-gray-700);
    font-size: var(--font-size-s);
    line-height: 20px;
  }

  .instructions li + li {
    margin-top: var(--spacing-xs);
  }

  .resource-action {
    padding-top: var(--spacing-s);
  }

  .excluded-content {
    padding-top: var(--spacing-l);
    border-top: 1px solid var(--spectrum-global-color-gray-200);
  }

  summary {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    width: fit-content;
    color: var(--spectrum-global-color-gray-700);
    cursor: pointer;
    font-size: var(--font-size-s);
    font-weight: 500;
    line-height: 20px;
    list-style: none;
  }

  summary::-webkit-details-marker {
    display: none;
  }

  summary:focus-visible {
    outline: 2px solid var(--spectrum-global-color-blue-500);
    outline-offset: var(--spacing-xs);
    border-radius: var(--border-radius-s);
  }

  details[open] .disclosure-icon {
    transform: rotate(90deg);
  }

  .excluded-list {
    margin-top: var(--spacing-m);
    padding-left: var(--spacing-xl);
  }

  .excluded-list li + li {
    margin-top: var(--spacing-s);
  }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
  }

  @media (max-width: 480px) {
    .import-result :global(.spectrum-Dialog) {
      --spectrum-dialog-confirm-padding: var(--spacing-xl);
    }

    .resource-requirements {
      grid-template-columns: auto minmax(0, 1fr);
      padding: var(--spacing-m);
    }

    .resource-action {
      grid-column: 2;
      padding-top: 0;
    }
  }
</style>
