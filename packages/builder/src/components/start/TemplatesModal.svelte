<script lang="ts">
  import { ModalContent, Layout } from "@budibase/bbui"
  import TemplateCard from "@/components/common/TemplateCard.svelte"
  import { templates } from "@/stores/portal"
  import type { TemplateMetadata } from "@budibase/types"

  export let onSelectTemplate: (_template: TemplateMetadata) => void

  let newTemplates: TemplateMetadata[] = []
  $: {
    const templateList = $templates as TemplateMetadata[]
    newTemplates = templateList?.filter(template => template.new) || []
  }
</script>

<ModalContent
  title="Choose a starting template"
  size="XL"
  showCancelButton={false}
  showConfirmButton={false}
>
  <Layout noPadding gap="M">
    <div class="template-grid">
      {#each newTemplates as template}
        <button
          class="template-wrapper"
          on:click={() => onSelectTemplate(template)}
        >
          <TemplateCard
            name={template.name}
            imageSrc={template.image}
            backgroundColour={template.background}
            icon={template.icon}
            description={template.description}
          />
        </button>
      {/each}
    </div>
  </Layout>
</ModalContent>

<style>
  .template-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-l);
    padding: var(--spacing-m);
  }

  .template-wrapper {
    cursor: pointer;
    transition: transform 0.2s ease;
    background: none;
    border: none;
    padding: 0;
    text-align: left;
    font-family: var(--font-sans);
  }

  .template-wrapper:hover {
    transform: translateY(-4px);
  }
</style>
