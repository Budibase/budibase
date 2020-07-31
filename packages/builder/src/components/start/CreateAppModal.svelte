<script>
  import Spinner from "components/common/Spinner.svelte"
  import { API, Info, User } from "./Steps"
  import Indicator from "./Indicator.svelte"
  import { Input, TextArea, Button } from "@budibase/bbui"
  import { goto } from "@sveltech/routify"
  import { AppsIcon, InfoIcon, CloseIcon } from "components/common/Icons/"
  import { getContext } from "svelte"
  import { fade } from "svelte/transition"
  import { post } from "builderStore/api"
  import analytics from "../../analytics"

  export let hasAPIKey = false

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

        analytics.captureEvent("web_app_created", {
          name,
          description,
          appId: res._id,
        })
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

  let currentStep = 0
  let steps = [
    { title: "Setup your API Key" },
    { title: "Create your first web app" },
    { title: "Create new user" },
  ]
</script>

<div class="container">
  <div class="sidebar">
    {#each steps as { active, done }, i}
      <Indicator
        active={currentStep === i}
        done={i < currentStep}
        step={i + 1} />
    {/each}
  </div>
  <div class="body">
    <div class="heading">
      <h3 class="header">Get Started with Budibase</h3>
    </div>
    <div class="step">
      <Input
        error={error.name}
        name="name"
        label="Name"
        placeholder="Enter application name"
        on:change={e => (name = e.target.value)}
        on:input={e => (name = e.target.value)} />
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
      {#if currentStep !== 0}
        <Button primary thin on:click={_onOkay}>Back</Button>
      {/if}
      <Button primary thin on:click={_onOkay}>Next</Button>
      {#if currentStep + 1 === steps.length}
        <Button primary thin on:click={_onOkay}>Launch</Button>
      {/if}
    </div>
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
    display: grid;
    grid-template-columns: 80px 1fr;
    position: relative;
  }
  .sidebar {
    display: grid;
    border-bottom-left-radius: 0.5rem;
    border-top-left-radius: 0.5rem;
    grid-gap: 30px;
    align-content: center;
    background: #f5f5f5;
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
  .header {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
  }
  .body {
    padding: 40px 60px 60px 60px;
    display: grid;
    grid-template-rows: auto 1fr auto;
  }
  .footer {
    display: grid;
    grid-gap: 15px;
    grid-template-columns: auto auto;
    justify-content: end;
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
