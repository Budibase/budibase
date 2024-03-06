<script>
  import { Button, Drawer } from "@budibase/bbui"
  import BindingPanel from "components/common/bindings/BindingPanel.svelte"
  import { decodeJSBinding, encodeJSBinding } from "@budibase/string-templates"
  import { snippetStore } from "stores/builder"

  export let snippet

  let drawer
  let code = ""

  export const show = () => drawer.show()
  export const hide = () => drawer.hide()

  $: key = snippet?.name
  $: code = snippet?.code ? encodeJSBinding(snippet.code) : ""
  $: rawJS = decodeJSBinding(code)

  const saveSnippet = async () => {
    await snippetStore.saveSnippet({
      name:
        snippet?.name || "Snippet_" + Math.random().toString().substring(2, 5),
      code: rawJS,
    })
    drawer.hide()
  }

  const deleteSnippet = async () => {
    await snippetStore.deleteSnippet(snippet.name)
    drawer.hide()
  }
</script>

<Drawer title={snippet ? "Edit snippet" : "Create snippet"} bind:this={drawer}>
  <svelte:fragment slot="buttons">
    {#if snippet}
      <Button warning on:click={deleteSnippet}>Delete</Button>
    {/if}
    <Button cta on:click={saveSnippet} disabled={!rawJS?.length}>Save</Button>
  </svelte:fragment>
  <svelte:fragment slot="body">
    {#key key}
      <BindingPanel
        allowHBS={false}
        allowJS
        allowSnippets={false}
        placeholder="return function(input) &#10100; ... &#10101;"
        value={code}
        on:change={e => (code = e.detail)}
      />
    {/key}
  </svelte:fragment>
</Drawer>
