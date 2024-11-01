<script>
  import { Layout, Detail, Button, Modal } from "@budibase/bbui"
  import TemplateCard from "components/common/TemplateCard.svelte"
  import CreateAppModal from "components/start/CreateAppModal.svelte"
  import { licensing } from "stores/portal"
  import { Content, SideNav, SideNavItem } from "components/portal/page"

  export let templates

  let selectedCategory = null
  let creationModal
  let template
  let showV3Only = true // Default to showing only V3 templates

  // Calculate categories for sidebar (all categories, regardless of toggle)
  $: categories = getCategories(templates)

  // Calculate filtered categories based on selected category and showV3Only toggle
  $: filteredCategories = getFilteredCategories(
    categories,
    selectedCategory,
    showV3Only
  )

  // Get all categories (for display in sidebar) without filtering
  const getCategories = templates => {
    let categories = {}
    templates?.forEach(template => {
      if (!categories[template.category]) {
        categories[template.category] = []
      }
      categories[template.category].push(template)
    })
    categories = Object.entries(categories).map(
      ([category, categoryTemplates]) => ({
        name: category,
        templates: categoryTemplates,
      })
    )
    categories.sort((a, b) => (a.name < b.name ? -1 : 1))
    return categories
  }

  // Filter templates for main content based on category and toggle state
  const getFilteredCategories = (categories, selectedCategory, showV3Only) => {
    let filtered = categories
      .map(category => ({
        name: category.name,
        templates: category.templates.filter(template => {
          return showV3Only ? template.v3 === true : true
        }),
      }))
      .filter(category => category.templates.length > 0)

    // Show only the selected category or all if none is selected
    if (selectedCategory) {
      const selected = filtered.find(cat => cat.name === selectedCategory)
      return selected
        ? [selected]
        : [
            {
              name: selectedCategory,
              templates: [],
              emptyMessage: `No templates for category ${selectedCategory}. Try ${
                showV3Only ? "Classic" : "V3"
              } Templates.`,
            },
          ]
    }
    return filtered
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
    <div class="pill-container">
      <!-- Pill buttons for filtering templates -->
      <SideNavItem
        on:click={() => (showV3Only = false)}
        text="All"
        active={!showV3Only}
      />
      <SideNavItem
        on:click={() => (showV3Only = true)}
        text="V3 Templates"
        active={showV3Only}
      />
    </div>
    <Layout gap="XL" noPadding>
      {#each filteredCategories as category}
        <div class="template-category">
          <Detail size="M">{category.name}</Detail>
          {#if category.templates.length > 0}
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
          {:else}
            <!-- Empty State if selected category has no matching templates -->
            <div class="empty-state">
              <p>{category.emptyMessage}</p>
            </div>
          {/if}
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
  .pill-container {
    display: flex;
    gap: 4px;
    padding-bottom: 28px;
  }
  .template-grid {
    padding-top: 10px;
    display: grid;
    grid-gap: var(--spacing-xl);
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }

  .empty-state {
    font-size: 1.2em;
    color: var(--spectrum-global-color-gray-900);
    text-align: left;
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
