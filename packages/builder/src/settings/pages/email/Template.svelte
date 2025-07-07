<script lang="ts">
  import { onMount, tick, getContext } from "svelte"
  import {
    Button,
    Heading,
    Body,
    Layout,
    notifications,
    Tabs,
    Tab,
  } from "@budibase/bbui"
  import { email } from "@/stores/portal"
  import Editor from "@/components/integration/QueryEditor.svelte"
  import TemplateBindings from "@/settings/pages/email/_components/TemplateBindings.svelte"
  import { type Routing } from "@/types/routing"
  import { type Readable } from "svelte/store"
  import { type GlobalTemplateBinding, type Template } from "@budibase/types"
  import { routeActions } from ".."

  export let template

  const routing: Readable<Routing> = getContext("routing")

  // Temp Override
  $: params = $routing?.params
  $: template = params?.templateId

  let htmlEditor: Editor
  let mounted = false

  $: selectedTemplate = $email.templates?.find(
    ({ purpose }) => purpose === template
  )
  $: name = $email.definitions?.info[template]?.name
  $: description = $email.definitions?.info[template]?.description
  $: baseTemplate = $email.templates?.find(({ purpose }) => purpose === "base")
  $: templateBindings = selectedTemplate?.purpose
    ? $email.definitions?.bindings?.[selectedTemplate?.purpose]
    : []
  $: previewContent = makePreviewContent(baseTemplate, selectedTemplate)

  async function saveTemplate() {
    try {
      if (!selectedTemplate) {
        throw new Error("No valid template selected")
      }
      // Save your template config
      await email.saveTemplate(selectedTemplate)
      notifications.success("Template saved")
    } catch (error) {
      notifications.error("Failed to update template settings")
    }
  }

  function setTemplateBinding(binding: GlobalTemplateBinding) {
    if (!selectedTemplate) {
      return
    }
    htmlEditor.update((selectedTemplate.contents += `{{ ${binding.name} }}`))
  }

  const makePreviewContent = (
    baseTemplate: Template | undefined,
    selectedTemplate: Template | undefined
  ) => {
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

  async function fixMountBug(e: CustomEvent) {
    if (e.detail === "Edit") {
      await tick()
      mounted = true
    } else {
      mounted = false
    }
  }
</script>

<Layout gap="S" noPadding>
  <Layout gap="XS" noPadding>
    <Heading size="XS">{name}</Heading>
    <Body size="S">
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
                if (!selectedTemplate) return
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
                    bindings={templateBindings}
                    onBindingClick={setTemplateBinding}
                  />
                </Tab>
                <Tab title="Common">
                  <TemplateBindings
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

  <div use:routeActions>
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
