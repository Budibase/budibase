<script>
  import { ModalContent, Toggle, Input, Layout, Dropzone } from "@budibase/bbui"

  export let app

  $: disabled = (encrypted && !password) || !file
  let encrypted = false,
    password
  let file

  function updateApp() {
    console.log("confirm")
  }
</script>

<ModalContent
  title={`Update ${app.name}`}
  confirmText="Update"
  onConfirm={updateApp}
  bind:disabled
>
  <Layout noPadding gap="XS">
    <Dropzone
      gallery={false}
      label="App export"
      on:change={e => {
        file = e.detail?.[0]
      }}
    />
    <Toggle text="Encrypted" bind:value={encrypted} />
    {#if encrypted}
      <Input
        type="password"
        label="Password"
        placeholder="Type here..."
        bind:value={password}
      />
    {/if}
  </Layout>
</ModalContent>
