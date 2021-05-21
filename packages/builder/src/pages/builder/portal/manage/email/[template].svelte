<script>
  import { onMount, tick } from "svelte"
  import {
    Button,
    Detail,
    Heading,
    ActionButton,
    Body,
    Page,
    Layout,
    notifications,
    Tabs,
    Tab,
  } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import { email } from "stores/portal"
  import Editor from "components/integration/QueryEditor.svelte"
  import TemplateBindings from "./_components/TemplateBindings.svelte"

  export let template

  let htmlEditor
  let mounted = false

  $: selectedTemplate = $email?.templates?.find(
    ({ purpose }) => purpose === template
  )
  $: templateBindings =
    $email.definitions?.bindings?.[selectedTemplate.purpose] || []

  async function saveTemplate() {
    try {
      // Save your template config
      await email.templates.save(selectedTemplate)
      notifications.success(`Template saved.`)
    } catch (err) {
      notifications.error(`Failed to update template settings. ${err}`)
    }
  }

  function setTemplateBinding(binding) {
    htmlEditor.update((selectedTemplate.contents += `{{ ${binding.name} }}`))
  }
  onMount(() => {
    mounted = true
  })

  async function fixMountBug({ detail }) {
    console.log(detail)
    if (detail === "Edit") {
      await tick()
      mounted = true
    } else {
      mounted = false
    }
  }
</script>

<Page wide>
  <Layout gap="XS" noPadding>
    <div class="back">
      <ActionButton
        on:click={() => $goto("./")}
        quiet
        size="S"
        icon="BackAndroid"
      >
        Back to email settings
      </ActionButton>
    </div>
    <header>
      <Heading>
        Email Template: {template}
      </Heading>
      <Button cta on:click={saveTemplate}>Save</Button>
    </header>
    <Body
      >Change the email template here. Add dynamic content by using the bindings
      menu on the right.</Body
    >
  </Layout>
  <Tabs selected="Edit" on:select={fixMountBug}>
    <Tab title="Edit">
      <div class="template-editor">
        <Editor
          editorHeight={800}
          bind:this={htmlEditor}
          mode="handlebars"
          on:change={e => {
            selectedTemplate.contents = e.detail.value
          }}
          value={selectedTemplate?.contents}
        />
        <div class="bindings-editor">
          <Detail size="L">Bindings</Detail>
          {#if mounted}
            <Tabs selected="Template">
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
      </div></Tab
    >
    <Tab title="Preview">
      <div class="preview">
        {@html selectedTemplate?.contents}
      </div>
    </Tab>
  </Tabs>
</Page>

<style>
  .template-editor {
    display: grid;
    grid-template-columns: 1fr minmax(250px, 20%);
    grid-gap: var(--spacing-xl);
    margin-top: var(--spacing-xl);
  }

  header {
    display: flex;
    width: 100%;
    justify-content: space-between;
    margin-top: var(--spacing-l);
  }

  .preview {
    background: white;
    height: 800px;
    padding: var(--spacing-xl);
  }
</style>
