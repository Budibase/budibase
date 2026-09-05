<script lang="ts">
  import { Body, Link, ModalContent } from "@budibase/bbui"
  import type {
    ImportProjectResponse,
    ProjectImportRequirement,
  } from "@budibase/types"

  interface Props {
    response: ImportProjectResponse
    resourceUrl: (_requirement: ProjectImportRequirement) => string
    onOpenResource: () => void
  }

  let { response, resourceUrl, onOpenResource }: Props = $props()

  const resourceRequirements = $derived.by(() => {
    const groups = new Map<string, ProjectImportRequirement[]>()
    for (const requirement of response.requirements) {
      const existing = groups.get(requirement.resourceId) || []
      groups.set(requirement.resourceId, [...existing, requirement])
    }
    return [...groups.values()]
  })
</script>

<ModalContent
  title="Project imported"
  confirmText="Done"
  showCancelButton={false}
  size="M"
>
  <Body size="S">
    Review <strong>{response.project.name}</strong> and complete any setup before
    publishing the imported resources.
  </Body>

  <div class="import-details">
    {#if resourceRequirements.length}
      <section>
        <Body size="S" weight="500">Setup required</Body>
        <ul>
          {#each resourceRequirements as requirements (requirements[0].resourceId)}
            {@const resource = requirements[0]}
            <li class="resource-requirements">
              <Link
                href={resourceUrl(resource)}
                on:click={onOpenResource}
                size="S"
              >
                {resource.name}
              </Link>
              {#each requirements as requirement}
                <Body size="S" color="var(--spectrum-global-color-gray-700)">
                  {requirement.reason}
                </Body>
              {/each}
            </li>
          {/each}
        </ul>
      </section>
    {/if}

    {#if response.unsupportedContent.length}
      <section>
        <Body size="S" weight="500">Not included</Body>
        <ul>
          {#each response.unsupportedContent as content}
            <li>
              <Body size="S" color="var(--spectrum-global-color-gray-700)">
                {content.reason}
              </Body>
            </li>
          {/each}
        </ul>
      </section>
    {/if}
  </div>
</ModalContent>

<style>
  .import-details {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
    max-height: 400px;
    overflow-y: auto;
  }

  ul {
    list-style: none;
    margin: var(--spacing-s) 0 0;
    padding: 0;
  }

  li + li {
    margin-top: var(--spacing-m);
  }

  .resource-requirements {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }
</style>
