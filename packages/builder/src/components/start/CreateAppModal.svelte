<script>
  import { writable, get as svelteGet } from "svelte/store"
  import { notifications } from "@budibase/bbui"
  import { store, automationStore, hostingStore } from "builderStore"
  import { string, object } from "yup"
  import api, { get } from "builderStore/api"
  import Spinner from "components/common/Spinner.svelte"
  import { Info, User } from "./Steps"
  import Indicator from "./Indicator.svelte"
  import { Button } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import { fade } from "svelte/transition"
  import { post } from "builderStore/api"
  import analytics from "analytics"
  import { onMount } from "svelte"
  import Logo from "/assets/bb-logo.svg"

  export let template

  const currentStep = writable(0)
  const values = writable({ roleId: "ADMIN" })
  const errors = writable({})
  const touched = writable({})
  const steps = [Info, User]
  let validators = [
    {
      applicationName: string().required("Your application must have a name."),
    },
    {
      email: string()
        .email()
        .required("Your application needs a first user."),
      password: string().required(
        "Please enter a password for your first user."
      ),
      roleId: string()
        .nullable()
        .required("You need to select a role for your user."),
    },
  ]

  let submitting = false
  let valid = false
  $: checkValidity($values, validators[$currentStep])

  onMount(async () => {
    const hostingInfo = await hostingStore.actions.fetch()
    if (hostingInfo.type === "self") {
      await hostingStore.actions.fetchDeployedApps()
      const existingAppNames = svelteGet(hostingStore).deployedAppNames
      validators[0].applicationName = string()
        .required("Your application must have a name.")
        .test(
          "non-existing-app-name",
          "App with same name already exists. Please try another app name.",
          value =>
            !existingAppNames.some(
              appName => appName.toLowerCase() === value.toLowerCase()
            )
        )
    }
  })

  const checkValidity = async (values, validator) => {
    const obj = object().shape(validator)
    Object.keys(validator).forEach(key => ($errors[key] = null))
    try {
      await obj.validate(values, { abortEarly: false })
    } catch (validationErrors) {
      validationErrors.inner.forEach(error => {
        $errors[error.path] = error.message
      })
    }
    valid = await obj.isValid(values)
  }

  async function createNewApp() {
    submitting = true
    try {
      // Create form data to create app
      let data = new FormData()
      data.append("name", $values.applicationName)
      data.append("useTemplate", template != null)
      if (template) {
        data.append("templateName", template.name)
        data.append("templateKey", template.key)
        data.append("templateFile", template.file)
      }

      // Create App
      const appResp = await post("/api/applications", data, {})
      const appJson = await appResp.json()
      if (!appResp.ok) {
        throw new Error(appJson.message)
      }

      analytics.captureEvent("App Created", {
        name: $values.applicationName,
        appId: appJson._id,
        template,
      })

      // Select Correct Application/DB in prep for creating user
      const applicationPkg = await get(
        `/api/applications/${appJson._id}/appPackage`
      )
      const pkg = await applicationPkg.json()
      if (applicationPkg.ok) {
        await store.actions.initialise(pkg)
        await automationStore.actions.fetch()
      } else {
        throw new Error(pkg)
      }

      // Create user
      const user = {
        email: $values.email,
        password: $values.password,
        roleId: $values.roleId,
      }
      const userResp = await api.post(`/api/users`, user)
      await userResp.json()
      $goto(`./${appJson._id}`)
    } catch (error) {
      console.error(error)
      notifications.error(error)
      submitting = false
    }
  }
</script>

<div class="container">
  <div class="sidebar">
    {#each steps as component, i}
      <Indicator
        active={$currentStep === i}
        done={i < $currentStep}
        step={i + 1} />
    {/each}
  </div>
  <div class="body">
    <div class="heading">
      <h3 class="header">Get Started with Budibase</h3>
    </div>
    <div class="step">
      {#each steps as component, i (i)}
        <div class:hidden={$currentStep !== i}>
          <svelte:component
            this={component}
            {template}
            {values}
            {errors}
            {touched} />
        </div>
      {/each}
    </div>
    <div class="footer">
      {#if $currentStep > 0}
        <Button medium secondary on:click={() => $currentStep--}>Back</Button>
      {/if}
      {#if $currentStep < steps.length - 1}
        <Button medium blue on:click={() => $currentStep++} disabled={!valid}>
          Next
        </Button>
      {/if}
      {#if $currentStep === steps.length - 1}
        <Button
          medium
          blue
          on:click={createNewApp}
          disabled={!valid || submitting}>
          {submitting ? 'Loading...' : 'Submit'}
        </Button>
      {/if}
    </div>
  </div>
  <img src={Logo} alt="budibase icon" />
  {#if submitting}
    <div in:fade class="spinner-container">
      <Spinner />
      <span class="spinner-text">Creating your app...</span>
    </div>
  {/if}
</div>

<style>
  .container {
    min-height: 600px;
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
    background: var(--grey-1);
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
    align-items: center;
    grid-template-rows: auto 1fr auto;
  }
  .footer {
    display: grid;
    grid-gap: 15px;
    grid-template-columns: auto auto;
    justify-content: end;
  }
  .spinner-container {
    background: var(--background);
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

  .hidden {
    display: none;
  }
  img {
    position: absolute;
    top: 20px;
    left: 20px;
    height: 40px;
  }
</style>
