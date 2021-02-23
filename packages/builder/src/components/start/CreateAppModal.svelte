<script>
  import { writable, get as svelteGet } from "svelte/store"
  import { notifier } from "builderStore/store/notifications"
  import {
    store,
    automationStore,
    backendUiStore,
    hostingStore,
  } from "builderStore"
  import { string, object } from "yup"
  import api, { get } from "builderStore/api"
  import Form from "@svelteschool/svelte-forms"
  import Spinner from "components/common/Spinner.svelte"
  import { API, Info, User } from "./Steps"
  import Indicator from "./Indicator.svelte"
  import { Button } from "@budibase/bbui"
  import { goto } from "@sveltech/routify"
  import { fade } from "svelte/transition"
  import { post } from "builderStore/api"
  import analytics from "analytics"
  import { onMount } from "svelte"

  //Move this to context="module" once svelte-forms is updated so that it can bind to stores correctly
  const createAppStore = writable({ currentStep: 0, values: {} })

  export let template

  let lastApiKey
  let fetchApiKeyPromise

  const infoValidation = {
    applicationName: string().required("Your application must have a name."),
  }
  const userValidation = {
    email: string()
      .email()
      .required("Your application needs a first user."),
    password: string().required("Please enter a password for your first user."),
    roleId: string().required("You need to select a role for your user."),
  }

  let submitting = false
  let errors = {}
  let validationErrors = {}
  let validationSchemas = [infoValidation, userValidation]

  function buildStep(component) {
    return {
      component,
      errors,
    }
  }

  // steps need to be initialized for cypress from the get go
  let steps = [buildStep(Info), buildStep(User)]

  onMount(async () => {
    let hostingInfo = await hostingStore.actions.fetch()
    // re-init the steps based on whether self hosting or cloud hosted
    if (hostingInfo.type === "self") {
      await hostingStore.actions.fetchDeployedApps()
      const existingAppNames = svelteGet(hostingStore).deployedAppNames
      infoValidation.applicationName = string()
        .required("Your application must have a name.")
        .test(
          "non-existing-app-name",
          "App with same name already exists. Please try another app name.",
          value =>
            !existingAppNames.some(appName =>
              new RegExp(appName, "ig").test(value)
            )
        )

      steps = [buildStep(Info), buildStep(User)]
      validationSchemas = [infoValidation, userValidation]
    }
  })

  // Handles form navigation
  const back = () => {
    if ($createAppStore.currentStep > 0) {
      $createAppStore.currentStep -= 1
    }
  }
  const next = () => {
    $createAppStore.currentStep += 1
  }

  // $: errors = validationSchemas.validate(values);
  $: getErrors(
    $createAppStore.values,
    validationSchemas[$createAppStore.currentStep]
  )

  async function getErrors(values, schema) {
    try {
      validationErrors = {}
      await object(schema).validate(values, { abortEarly: false })
    } catch (error) {
      validationErrors = extractErrors(error)
    }
  }

  const checkValidity = async (values, currentStep) => {
    const validity = await object()
      .shape(validationSchemas[currentStep])
      .isValid(values)
    currentStepIsValid = validity

    // Check full form on last step
    if (currentStep === steps.length - 1) {
      // Make one big schema from all the small ones
      const fullSchema = Object.assign({}, ...validationSchemas)

      // Check full form schema
      const formIsValid = await object()
        .shape(fullSchema)
        .isValid(values)
      fullFormIsValid = formIsValid
    }
  }

  async function createNewApp() {
    submitting = true
    try {
      // Create App
      const appResp = await post("/api/applications", {
        name: $createAppStore.values.applicationName,
        template,
      })
      const appJson = await appResp.json()

      if (!appResp.ok) {
        throw new Error(appJson.message)
      }

      analytics.captureEvent("App Created", {
        name: $createAppStore.values.applicationName,
        appId: appJson._id,
        template,
      })

      // Select Correct Application/DB in prep for creating user
      const applicationPkg = await get(
        `/api/applications/${appJson._id}/appPackage`
      )
      const pkg = await applicationPkg.json()
      if (applicationPkg.ok) {
        backendUiStore.actions.reset()
        await store.actions.initialise(pkg)
        await automationStore.actions.fetch()
      } else {
        throw new Error(pkg)
      }

      // Create user
      const user = {
        email: $createAppStore.values.email,
        password: $createAppStore.values.password,
        roleId: $createAppStore.values.roleId,
      }
      const userResp = await api.post(`/api/users`, user)
      const json = await userResp.json()
      $goto(`/${appJson._id}`)
    } catch (error) {
      console.error(error)
      notifier.danger(error)
      submitting = false
    }
  }

  async function updateKey([key, value]) {
    const response = await api.put(`/api/keys/${key}`, { value })
    const res = await response.json()
    return res
  }

  function extractErrors({ inner }) {
    if (!inner) return {}
    return inner.reduce((acc, err) => {
      return { ...acc, [err.path]: err.message }
    }, {})
  }

  let currentStepIsValid = false
  let fullFormIsValid = false
  $: checkValidity($createAppStore.values, $createAppStore.currentStep)

  let onChange = () => {}
</script>

<div class="container">
  <div class="sidebar">
    {#each steps as { active, done }, i}
      <Indicator
        active={$createAppStore.currentStep === i}
        done={i < $createAppStore.currentStep}
        step={i + 1} />
    {/each}
  </div>
  <div class="body">
    <div class="heading">
      <h3 class="header">Get Started with Budibase</h3>
    </div>
    <div class="step">
      <Form bind:values={$createAppStore.values}>
        {#each steps as step, i (i)}
          <div class:hidden={$createAppStore.currentStep !== i}>
            <svelte:component
              this={step.component}
              {template}
              {validationErrors}
              options={step.options}
              name={step.name} />
          </div>
        {/each}
      </Form>
    </div>
    <div class="footer">
      {#if $createAppStore.currentStep > 0}
        <Button medium secondary on:click={back}>Back</Button>
      {/if}
      {#if $createAppStore.currentStep < steps.length - 1}
        <Button medium blue on:click={next} disabled={!currentStepIsValid}>
          Next
        </Button>
      {/if}
      {#if $createAppStore.currentStep === steps.length - 1}
        <Button
          medium
          blue
          on:click={createNewApp}
          disabled={!fullFormIsValid || submitting}>
          {submitting ? 'Loading...' : 'Submit'}
        </Button>
      {/if}
    </div>
  </div>
  <img src="/_builder/assets/bb-logo.svg" alt="budibase icon" />
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
