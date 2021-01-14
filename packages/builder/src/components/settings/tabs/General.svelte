<script>
  import { Input, TextArea } from "@budibase/bbui"
  import { store, hostingStore } from "builderStore"
  import api from "builderStore/api"
  import { object, string } from "yup"
  import { onMount } from "svelte"
  import { get } from "svelte/store"

  let nameValidation, nameError
  let urlValidation, urlError

  $: checkName($store.name)
  $: checkUrl($store.url)

  async function updateApplication(data) {
    const response = await api.put(`/api/applications/${$store.appId}`, data)
    await response.json()
    store.update(state => {
      state = {
        ...state,
        ...data,
      }
      return state
    })
  }

  async function checkValidation(input, validation) {
    if (!input || !validation) {
      return
    }
    try {
      await object(validation).validate(input, { abortEarly: false })
    } catch (error) {
      if (!error || !error.inner) return ""
      return error.inner.reduce((acc, err) => {
        return acc + err.message
      }, "")
    }
  }

  async function checkName(name) {
    nameError = await checkValidation({ name }, nameValidation)
  }

  async function checkUrl(url) {
    urlError = await checkValidation({ url: url.toLowerCase() }, urlValidation)
  }

  onMount(async () => {
    const nameError = "Your application must have a name.",
      urlError = "Your application must have a URL."
    let hostingInfo = await hostingStore.actions.fetch()
    if (hostingInfo.type === "self") {
      await hostingStore.actions.fetchDeployedApps()
      const existingAppNames = get(hostingStore).deployedAppNames
      const existingAppUrls = get(hostingStore).deployedAppUrls
      existingAppNames.splice(existingAppNames.indexOf(get(store).name), 1)
      existingAppUrls.splice(existingAppUrls.indexOf(get(store).url), 1)
      nameValidation = {
        name: string()
          .required(nameError)
          .notOneOf(existingAppNames),
      }
      urlValidation = {
        url: string()
          .required(urlError)
          .notOneOf(existingAppUrls),
      }
    } else {
      nameValidation = { name: string.required(nameError) }
    }
  })
</script>

<div class="container">
  <Input
    on:save={e => updateApplication({ name: e.detail })}
    thin
    edit
    bind:value={$store.name}
    bind:error={nameError}
    label="App Name" />
  {#if $hostingStore.hostingInfo.type === 'self'}
    <Input
      on:save={e => updateApplication({ url: e.detail })}
      thin
      edit
      bind:value={$store.url}
      bind:error={urlError}
      label="App URL" />
  {/if}
  <TextArea
    on:save={e => updateApplication({ description: e.detail })}
    thin
    edit
    value={$store.description}
    label="App Description" />
</div>

<style>
  .container {
    display: grid;
    grid-gap: var(--spacing-xl);
  }
</style>
