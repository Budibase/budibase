<script>
  import {
    Layout,
    Detail,
    Heading,
    Button,
    Modal,
    ActionGroup,
    ActionButton,
  } from "@budibase/bbui"
  import TemplateCard from "components/common/TemplateCard.svelte"
  import CreateAppModal from "components/start/CreateAppModal.svelte"
  import { licensing } from "stores/portal"

  export let templates

  let selectedTemplateCategory
  let creationModal
  let template

  const groupTemplatesByCategory = (templates, categoryFilter) => {
    let grouped = templates.reduce((acc, template) => {
      if (
        typeof categoryFilter === "string" &&
        [categoryFilter].indexOf(template.category) < 0
      ) {
        return acc
      }

      acc[template.category] = !acc[template.category]
        ? []
        : acc[template.category]
      acc[template.category].push(template)

      return acc
    }, {})
    return grouped
  }

  $: filteredTemplates = groupTemplatesByCategory(
    templates,
    selectedTemplateCategory
  )

  $: filteredTemplateCategories = filteredTemplates
    ? Object.keys(filteredTemplates).sort()
    : []

  $: templateCategories = templates
    ? Object.keys(groupTemplatesByCategory(templates)).sort()
    : []

  const stopAppCreation = () => {
    template = null
  }
</script>

<div class="template-header">
  <Layout noPadding gap="S">
    <Heading size="S">Templates</Heading>
    <div class="template-category-filters spectrum-ActionGroup">
      <ActionGroup>
        <ActionButton
          selected={!selectedTemplateCategory}
          on:click={() => {
            selectedTemplateCategory = null
          }}
        >
          All
        </ActionButton>
        {#each templateCategories as templateCategoryKey}
          <ActionButton
            dataCy={templateCategoryKey}
            selected={templateCategoryKey == selectedTemplateCategory}
            on:click={() => {
              selectedTemplateCategory = templateCategoryKey
            }}
          >
            {templateCategoryKey}
          </ActionButton>
        {/each}
      </ActionGroup>
    </div>
  </Layout>
</div>

<div class="template-categories">
  <Layout gap="XL" noPadding>
    {#each filteredTemplateCategories as templateCategoryKey}
      <div class="template-category" data-cy={templateCategoryKey}>
        <Detail size="M">{templateCategoryKey}</Detail>
        <div class="template-grid">
          {#each filteredTemplates[templateCategoryKey] as templateEntry}
            <TemplateCard
              name={templateEntry.name}
              imageSrc={templateEntry.image}
              backgroundColour={templateEntry.background}
              icon={templateEntry.icon}
            >
              {#if !($licensing?.usageMetrics?.apps >= 100)}
                <Button
                  cta
                  on:click={() => {
                    template = templateEntry
                    creationModal.show()
                  }}
                >
                  Use template
                </Button>
              {/if}
              <a
                href={templateEntry.url}
                target="_blank"
                class="overlay-preview-link spectrum-Button spectrum-Button--sizeM spectrum-Button--secondary"
                on:click|stopPropagation
              >
                Details
              </a>
            </TemplateCard>
          {/each}
        </div>
      </div>
    {/each}
  </Layout>
</div>

<Modal
  bind:this={creationModal}
  padding={false}
  width="600px"
  on:hide={stopAppCreation}
>
  <CreateAppModal {template} />
</Modal>

<style>
  .template-grid {
    padding-top: 10px;
    display: grid;
    grid-gap: var(--spacing-xl);
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }

  a:hover.spectrum-Button.spectrum-Button--secondary.overlay-preview-link {
    background-color: #c8c8c8;
    border-color: #c8c8c8;
    color: #505050;
  }

  a.spectrum-Button--secondary.overlay-preview-link {
    margin-top: 20px;
    border-color: #c8c8c8;
    color: #c8c8c8;
  }
</style>
