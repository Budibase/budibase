<script>
  import {
    Button,
    Detail,
    Heading,
    notifications,
    Icon,
    Page,
    Tabs,
    Tab,
  } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import { fade } from "svelte/transition"
  import { email } from "stores/portal"
  import Editor from "components/integration/QueryEditor.svelte"
  import TemplateBindings from "./_components/TemplateBindings.svelte"

  const ConfigTypes = {
    SMTP: "smtp",
  }

  export let template

  let selected = "Edit"
  let selectedBindingTab = "Template"
  let htmlEditor

  $: selectedTemplate = $email.templates.find(
    ({ purpose }) => purpose === template
  )
  $: templateBindings =
    $email.definitions?.bindings[selectedTemplate.purpose] || []

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
</script>

<Page wide gap="L">
  <div class="backbutton" on:click={() => $goto("./")}>
    <Icon name="BackAndroid" />
    <span>Back</span>
  </div>
  <header>
    <Heading>
      Email Template: {template}
    </Heading>
    <Button cta on:click={saveTemplate}>Save</Button>
  </header>
  <Tabs {selected}>
    <Tab title="Edit">
      <div class="template-editor">
        <Editor
          editorHeight={800}
          bind:this={htmlEditor}
          mode="handlebars"
          on:change={e => {
            selectedTemplate.contents = e.detail.value
          }}
          value={selectedTemplate.contents}
        />
        <div class="bindings-editor">
          <Detail size="L">Bindings</Detail>
          <Tabs selected={selectedBindingTab}>
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
                bindings={$email.definitions.bindings.common}
                onBindingClick={setTemplateBinding}
              />
            </Tab>
          </Tabs>
        </div>
      </div></Tab
    >
    <Tab title="Preview">
      <div class="preview" transition:fade>
        {@html selectedTemplate.contents}
      </div>
    </Tab>
  </Tabs>
</Page>

<style>
  .template-editor {
    display: grid;
    grid-template-columns: 1fr 20%;
    grid-gap: var(--spacing-xl);
    margin-top: var(--spacing-xl);
  }

  header {
    display: flex;
    width: 100%;
    justify-content: space-between;
    margin-bottom: var(--spacing-l);
    margin-top: var(--spacing-l);
  }

  .preview {
    background: white;
    height: 800px;
    padding: var(--spacing-xl);
  }

  .backbutton {
    display: flex;
    gap: var(--spacing-m);
    margin-bottom: var(--spacing-xl);
    cursor: pointer;
  }
</style>
