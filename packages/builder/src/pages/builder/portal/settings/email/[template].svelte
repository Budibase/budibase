<script>
  import { onMount, tick } from "svelte"
  import {
    Button,
    Heading,
    Body,
    Layout,
    notifications,
    Tabs,
    Tab,
  } from "@budibase/bbui"
  import { url } from "@roxi/routify"
  import { email } from "@/stores/portal"
  import Editor from "@/components/integration/QueryEditor.svelte"
  import TemplateBindings from "./_components/TemplateBindings.svelte"
  import { Breadcrumbs, Breadcrumb } from "@/components/portal/page"

  // this is the email purpose
  export let template

  let htmlEditor
  let mounted = false

  $: selectedTemplate = $email.templates?.find(
    ({ purpose }) => purpose === template
  )
  $: name = $email.definitions?.info[template]?.name
  $: description = $email.definitions?.info[template]?.description
  $: baseTemplate = $email.templates?.find(({ purpose }) => purpose === "base")
  $: templateBindings =
    $email.definitions?.bindings?.[selectedTemplate?.purpose] || []
  $: previewContent = makePreviewContent(baseTemplate, selectedTemplate)

  async function saveTemplate() {
    try {
      // Save your template config
      await email.saveTemplate(selectedTemplate)
      notifications.success("Template saved")
    } catch (error) {
      notifications.error("Failed to update template settings")
    }
  }

  function setTemplateBinding(binding) {
    htmlEditor.update((selectedTemplate.contents += `{{ ${binding.name} }}`))
  }

  const makePreviewContent = (baseTemplate, selectedTemplate) => {
    if (!selectedTemplate) {
      return ""
    }
    if (selectedTemplate.purpose === "base") {
      return selectedTemplate.contents
    }
    const base = baseTemplate?.contents ?? ""
    return base.replace("{{ body }}", selectedTemplate?.contents ?? "")
  }

  onMount(() => {
    mounted = true
  })

  async function fixMountBug({ detail }) {
    if (detail === "Edit") {
      await tick()
      mounted = true
    } else {
      mounted = false
    }
  }
</script>

<Layout gap="L" noPadding>
  <Breadcrumbs>
    <Breadcrumb url={$url("./")} text="Email" />
    <Breadcrumb text={name} />
  </Breadcrumbs>

  <Layout gap="XS" noPadding>
    <Heading size="M">{name}</Heading>
    <Body>
      {description}
      <br />
      Change the email template here. Add dynamic content by using the bindings menu
      on the right.
    </Body>
  </Layout>

  <div>
    <Tabs noHorizPadding selected="Edit" on:select={fixMountBug}>
      <Tab title="Edit">
        <div class="template-editor">
          <div class="template-text-editor">
            <Editor
              editorHeight={640}
              bind:this={htmlEditor}
              mode="handlebars"
              on:change={e => {
                selectedTemplate.contents = e.detail.value
              }}
              value={selectedTemplate?.contents}
            />
          </div>
          <div class="bindings-editor">
            <Heading size="XS">Bindings</Heading>
            {#if mounted}
              <Tabs noHorizPadding selected="Template">
                <Tab title="Template">
                  <TemplateBindings
                    title="Template Bindings"
                    bindings={templateBindings}
                    onBindingClick={setTemplateBinding}
                  />
                </Tab>
                <Tab title="Common">
                  <TemplateBindings
                    title="Common Bindings"
                    bindings={$email?.definitions?.bindings?.common}
                    onBindingClick={setTemplateBinding}
                  />
                </Tab>
              </Tabs>
            {/if}
          </div>
        </div>
      </Tab>
      <Tab title="Preview">
        <div class="preview">
          <iframe title="preview" srcdoc={previewContent} />
        </div>
      </Tab>
    </Tabs>
  </div>

  <div>
    <Button cta on:click={saveTemplate}>Save</Button>
  </div>
</Layout>

<style>
  .template-editor {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    flex-wrap: wrap;
    grid-gap: var(--spacing-xl);
    margin-top: var(--spacing-xl);
    overflow: hidden;
    height: 640px;
  }
  .template-text-editor {
    flex: 1 1 0;
    min-width: 250px;
    margin-top: calc(-1 * var(--spacing-s));
  }
  .bindings-editor {
    flex: 0 0 300px;
  }

  .preview {
    height: 640px;
    margin-top: var(--spacing-xl);
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  }
  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
</style>
