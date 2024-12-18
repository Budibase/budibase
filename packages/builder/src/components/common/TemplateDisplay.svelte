<script>
  import { Layout, Detail, Button, Modal } from "@budibase/bbui"
  import TemplateCard from "@/components/common/TemplateCard.svelte"
  import CreateAppModal from "@/components/start/CreateAppModal.svelte"
  import { licensing } from "@/stores/portal"
  import { Content, SideNav, SideNavItem } from "@/components/portal/page"

  export let templates

  let selectedCategory
  let creationModal
  let template

  $: categories = getCategories(templates)
  $: filteredCategories = getFilteredCategories(categories, selectedCategory)

  const getCategories = templates => {
    let categories = {}
    templates?.forEach(template => {
      if (!categories[template.category]) {
        categories[template.category] = []
      }
      categories[template.category].push(template)
    })
    categories = Object.entries(categories).map(
      ([category, categoryTemplates]) => {
        return {
          name: category,
          templates: categoryTemplates,
        }
      }
    )
    categories.sort((a, b) => {
      return a.name < b.name ? -1 : 1
    })
    return categories
  }

  const getFilteredCategories = (categories, selectedCategory) => {
    if (!selectedCategory) {
      return categories
    }
    return categories.filter(x => x.name === selectedCategory)
  }

  const stopAppCreation = () => {
    template = null
  }
</script>

<Content>
  <div slot="side-nav">
    <SideNav>
      <SideNavItem
        on:click={() => (selectedCategory = null)}
        text="All"
        active={selectedCategory == null}
      />
      {#each categories as category}
        <SideNavItem
          on:click={() => (selectedCategory = category.name)}
          text={category.name}
          active={selectedCategory === category.name}
        />
      {/each}
    </SideNav>
  </div>
  <div class="template-categories">
    <Layout gap="XL" noPadding>
      {#each filteredCategories as category}
        <div class="template-category">
          <Detail size="M">{category.name}</Detail>
          <div class="template-grid">
            {#each category.templates as templateEntry}
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
</Content>

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
