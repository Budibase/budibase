<script>
  import {
    Button,
    Drawer,
    Input,
    Icon,
    AbsTooltip,
    TooltipType,
    notifications,
  } from "@budibase/bbui"
  import BindingPanel from "components/common/bindings/BindingPanel.svelte"
  import { decodeJSBinding, encodeJSBinding } from "@budibase/string-templates"
  import { snippetStore } from "stores/builder"

  export let snippet

  export const show = () => drawer.show()
  export const hide = () => drawer.hide()

  const roughValidNameRegex = /^[_$A-Z\xA0-\uFFFF][_$A-Z0-9\xA0-\uFFFF]*$/i
  const firstCharNumberRegex = /^[0-9].*$/

  let drawer
  let name = ""
  let code = ""
  let loading = false

  $: key = snippet?.name
  $: name = snippet?.name || "MySnippet"
  $: code = snippet?.code ? encodeJSBinding(snippet.code) : ""
  $: rawJS = decodeJSBinding(code)
  $: nameError = validateName(name, $snippetStore)

  const saveSnippet = async () => {
    loading = true
    try {
      await snippetStore.saveSnippet({
        name,
        code: rawJS,
      })
      drawer.hide()
      notifications.success(`Snippet ${name} saved`)
    } catch (error) {
      notifications.error("Error saving snippet")
    }
    loading = false
  }

  const deleteSnippet = async () => {
    loading = true
    try {
      await snippetStore.deleteSnippet(snippet.name)
      drawer.hide()
    } catch (error) {
      notifications.error("Error deleting snippet")
    }
    loading = false
  }

  // Validating function names is not as easy as you think. A simple regex does
  // not work, as there are a bunch of reserved words. The correct regex for
  // this is about 12K characters long.
  // Instead, we can run a simple regex to roughly validate it, then basically
  // try executing it and see if it's valid JS. The initial regex prevents
  // against any potential XSS attacks here.
  const validateName = (name, snippets) => {
    if (!name?.length) {
      return "Name is required"
    }
    if (firstCharNumberRegex.test(name)) {
      return "Can't start with a number"
    }
    if (!roughValidNameRegex.test(name)) {
      return "No special characters or spaces"
    }
    if (snippets.some(snippet => snippet.name === name)) {
      return "That name is already in use"
    }
    const js = `(function ${name}(){return true})()`
    try {
      return eval(js) === true ? null : "Invalid name"
    } catch (error) {
      return "Invalid name"
    }
  }
</script>

<Drawer bind:this={drawer}>
  <svelte:fragment slot="title">
    {#if snippet}
      {snippet.name}
    {:else}
      <div class="name" class:invalid={nameError != null}>
        <span>Name</span>
        <Input bind:value={name} />
        {#if nameError}
          <AbsTooltip text={nameError} type={TooltipType.Negative}>
            <Icon
              name="Help"
              size="S"
              color="var(--spectrum-global-color-red-400)"
            />
          </AbsTooltip>
        {/if}
      </div>
    {/if}
  </svelte:fragment>
  <svelte:fragment slot="buttons">
    {#if snippet}
      <Button warning on:click={deleteSnippet} disabled={loading}>
        Delete
      </Button>
    {/if}
    <Button cta on:click={saveSnippet} disabled={loading || nameError != null}>
      Save
    </Button>
  </svelte:fragment>
  <svelte:fragment slot="body">
    {#key key}
      <BindingPanel
        allowHBS={false}
        allowJS
        allowSnippets={false}
        showTabBar={false}
        placeholder="return function(input) &#10100; ... &#10101;"
        value={code}
        on:change={e => (code = e.detail)}
      >
        <div slot="tabs">
          <Input placeholder="Name" />
        </div>
      </BindingPanel>
    {/key}
  </svelte:fragment>
</Drawer>

<style>
  .name {
    display: flex;
    gap: var(--spacing-l);
    align-items: center;
    position: relative;
  }
  .name :global(input) {
    width: 200px;
  }
  .name.invalid :global(input) {
    padding-right: 32px;
  }
  .name :global(.icon) {
    position: absolute;
    right: 10px;
  }
</style>
