<script lang="ts">
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
  import type { Template, GlobalTemplateBinding } from "@budibase/types"

  // QueryEditor component interface based on exposed methods
  interface QueryEditor {
    // eslint-disable-next-line no-unused-vars
    set: (newValue: string, opts?: string) => Promise<void>
    update: (_: string) => void
    resize: () => void
    focus: () => void
    insertAtCursor: (_: string) => void
  }

  // Tab select event interface
  interface TabSelectEvent {
    detail: string
  }

  // Binding tab select event handler
  function handleBindingTabSelect(event: TabSelectEvent): void {
    selectedBindingTab = event.detail
  }

  // Editor change event interface
  interface EditorChangeEvent {
    detail: {
      value: string
    }
  }

  // this is the email purpose
  export let template: string

  let htmlEditor: QueryEditor | null = null
  let mounted: boolean = false
  let selectedBindingTab: string = ""

  $: selectedTemplate = $email.templates?.find(
    ({ purpose }: Template) => purpose === template
  ) as Template | undefined
  $: name = $email.definitions?.info[template]?.name as string | undefined
  $: description = $email.definitions?.info[template]?.description as
    | string
    | undefined
  $: baseTemplate = $email.templates?.find(
    ({ purpose }: Template) => purpose === "base"
  ) as Template | undefined
  $: templateBindings = selectedTemplate?.purpose
    ? (($email.definitions?.bindings?.[selectedTemplate.purpose] ||
        []) as GlobalTemplateBinding[])
    : []
  $: previewContent = makePreviewContent(baseTemplate, selectedTemplate)

  async function saveTemplate(): Promise<void> {
    try {
      if (!selectedTemplate) {
        notifications.error("No template selected to save")
        return
      }
      // Save your template config
      await email.saveTemplate(selectedTemplate)
      notifications.success("Template saved")
    } catch (error) {
      notifications.error("Failed to update template settings")
    }
  }

  function setTemplateBinding(binding: GlobalTemplateBinding): void {
    if (!selectedTemplate) {
      console.warn("No template selected")
      return
    }
    if (!htmlEditor) {
      console.warn("Editor not available")
      return
    }

    // Insert the binding at the current cursor position
    const bindingText = `{{ ${binding.name} }}`
    htmlEditor.insertAtCursor(bindingText)
  }

  function makePreviewContent(
    baseTemplate: Template | undefined,
    selectedTemplate: Template | undefined
  ): string {
    if (!selectedTemplate) {
      return ""
    }
    if (selectedTemplate.purpose === "base") {
      return selectedTemplate.contents
    }
    const base: string = baseTemplate?.contents ?? ""
    return base.replace("{{ body }}", selectedTemplate?.contents ?? "")
  }

  // Set initial binding tab based on available bindings, only if not already set
  $: {
    if (!selectedBindingTab && templateBindings) {
      selectedBindingTab = templateBindings.length ? "Template" : "Common"
    }
  }

  onMount(() => {
    mounted = true
  })

  async function fixMountBug(event: TabSelectEvent): Promise<void> {
    const { detail } = event
    if (detail === "Edit") {
      await tick()
      mounted = true
    } else {
      mounted = false
    }
  }

  function handleEditorChange(event: EditorChangeEvent): void {
    if (selectedTemplate) {
      selectedTemplate.contents = event.detail.value
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
              on:change={handleEditorChange}
              value={selectedTemplate?.contents}
            />
          </div>
          <div class="bindings-editor">
            <Heading size="XS">Bindings</Heading>
            {#if mounted}
              <Tabs
                noHorizPadding
                selected={selectedBindingTab}
                on:select={handleBindingTabSelect}
              >
                <Tab title="Template">
                  <TemplateBindings
                    bindings={templateBindings}
                    onBindingClick={setTemplateBinding}
                  />
                </Tab>
                <Tab title="Common">
                  <TemplateBindings
                    bindings={$email?.definitions?.bindings?.common || []}
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
