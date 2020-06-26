<script>
  import Spinner from "components/common/Spinner.svelte"
  import { Input, TextArea, Button } from "@budibase/bbui"
  import { goto } from "@sveltech/routify"
  import { AppsIcon, InfoIcon, CloseIcon } from "components/common/Icons/"
  import { getContext } from "svelte"
  import { fade } from "svelte/transition"
  import { post } from "builderStore/api"

  const { open, close } = getContext("simple-modal")

  let name = ""
  let description = ""
  let loading = false
  let error = {}

  const createNewApp = async () => {
    if ((name.length > 100 || name.length < 1) && description.length < 1) {
      error = {
        name: true,
        description: true,
      }
    } else if (description.length < 1) {
      error = {
        name: false,
        description: true,
      }
    } else if (name.length > 100 || name.length < 1) {
      error = {
        name: true,
      }
    } else {
      error = {}
      const data = { name, description }
      loading = true
      try {
        const response = await post("/api/applications", data)

        const res = await response.json()

        $goto(`./${res._id}`)
      } catch (error) {
        console.error(error)
      }
    }
  }

  let value
  let onChange = () => {}

  function _onCancel() {
    close()
  }

  async function _onOkay() {
    await createNewApp()
  }
</script>

<div class="container">
  <div class="body">
    <div class="heading">
      <span class="icon">
        <AppsIcon />
      </span>
      <h3>Create new web app</h3>
    </div>
    <Input
      name="name"
      label="Name"
      placeholder="Enter application name"
      on:change={e => (name = e.target.value)}
      on:input={e => (name = e.target.value)} />
    {#if error.name}
      <span class="error">You need to enter a name for your application.</span>
    {/if}
    <TextArea
      bind:value={description}
      name="description"
      label="Description"
      placeholder="Describe your application" />
    {#if error.description}
      <span class="error">
        Please enter a short description of your application
      </span>
    {/if}
  </div>
  <div class="footer">
    <a href="./#" class="info">
      <InfoIcon />
      How to get started
    </a>
    <Button outline thin on:click={_onCancel}>Cancel</Button>
    <Button primary thin on:click={_onOkay}>Save</Button>
  </div>
  <div class="close-button" on:click={_onCancel}>
    <CloseIcon />
  </div>
  {#if loading}
    <div in:fade class="spinner-container">
      <Spinner />
      <span class="spinner-text">Creating your app...</span>
    </div>
  {/if}
</div>

<style>
  .container {
    position: relative;
  }

  .close-button {
    cursor: pointer;
    position: absolute;
    top: 20px;
    right: 20px;
  }
  .close-button :global(svg) {
    width: 24px;
    height: 24px;
  }
  .heading {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 20px;
  }
  h3 {
    margin: 0;
    font-size: 24px;
    font-weight: bold;
  }
  .icon {
    display: grid;
    border-radius: 3px;
    align-content: center;
    justify-content: center;
    margin-right: 12px;
    height: 20px;
    width: 20px;
    padding: 10px;
    background-color: var(--blue-light);
  }
  .info {
    color: var(--blue);
    text-decoration-color: var(--blue);
  }
  .info :global(svg) {
    fill: var(--blue);
    margin-right: 8px;
    width: 24px;
    height: 24px;
  }
  .body {
    padding: 40px 40px 80px 40px;
    display: grid;
    grid-gap: 20px;
  }
  .footer {
    display: grid;
    grid-gap: 20px;
    align-items: center;
    grid-template-columns: 1fr auto auto;
    padding: 30px 40px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 50px;
    background-color: var(--grey-1);
  }
  .spinner-container {
    background: white;
    position: absolute;
    border-radius: 5px;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: grid;
    justify-items: center;
    align-content: center;
    grid-gap: 50px;
  }
  .spinner-text {
    font-size: 2em;
  }
  .error {
    color: var(--red);
    font-weight: bold;
    font-size: 0.8em;
  }
</style>
