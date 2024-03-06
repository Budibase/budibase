<script>
  import {
    Button,
    Drawer,
    Input,
    Icon,
    AbsTooltip,
    TooltipType,
  } from "@budibase/bbui"
  import BindingPanel from "components/common/bindings/BindingPanel.svelte"
  import { decodeJSBinding, encodeJSBinding } from "@budibase/string-templates"
  import { snippetStore } from "stores/builder"

  export let snippet

  export const show = () => drawer.show()
  export const hide = () => drawer.hide()

  const roughValidNameRegex = /^[_$A-Z\xA0-\uFFFF][_$A-Z0-9\xA0-\uFFFF]*$/i

  let drawer
  let name = ""
  let code = ""

  $: key = snippet?.name
  $: name = snippet?.name || "MySnippet"
  $: code = snippet?.code ? encodeJSBinding(snippet.code) : ""
  $: rawJS = decodeJSBinding(code)
  $: nameValid = validateName(name)

  const saveSnippet = async () => {
    await snippetStore.saveSnippet({
      name,
      code: rawJS,
    })
    drawer.hide()
  }

  const deleteSnippet = async () => {
    await snippetStore.deleteSnippet(snippet.name)
    drawer.hide()
  }

  // Validating function names is not as easy as you think. A simple regex does
  // not work, as there are a bunch of reserved words. The correct regex for
  // this is about 12K characters long.
  // Instead, we can run a simple regex to roughly validate it, then basically
  // try executing it and see if it's valid JS. The initial regex prevents
  // against any potential XSS attacks here.
  const validateName = name => {
    if (!roughValidNameRegex.test(name)) {
      return false
    }
    const js = `(function ${name}(){return true})()`
    try {
      return eval(js) === true
    } catch (error) {
      return false
    }
  }
</script>

<Drawer bind:this={drawer}>
  <svelte:fragment slot="title">
    {#if snippet}
      {snippet.name}
    {:else}
      <div class="name" class:invalid={!nameValid}>
        <span>Name</span>
        <Input bind:value={name} />
        {#if !nameValid}
          <AbsTooltip
            text="Alphanumeric characters only, with no spaces"
            type={TooltipType.Negative}
          >
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
      <Button warning on:click={deleteSnippet}>Delete</Button>
    {/if}
    <Button cta on:click={saveSnippet} disabled={!rawJS?.length || !nameValid}>
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
  .name.invalid :global(input) {
    width: 200px;
  }
  .name :global(.icon) {
    position: absolute;
    right: 10px;
  }
</style>
