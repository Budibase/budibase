<script>
  import { Button, FancyForm, FancyInput } from "@budibase/bbui"
  import PanelHeader from "./PanelHeader.svelte"
  import { APP_URL_REGEX } from "constants"

  import { _ } from "../../../../../../../lang/i18n"

  export let name = ""
  export let url = ""
  export let onNext = () => {}

  const nameRegex = /^[a-zA-Z0-9\s]*$/
  let nameError = null
  let urlError = null

  $: isValid = name.length && url.length && !nameError && !urlError

  const validateName = name => {
    if (name.length < 1) {
      return $_(
        "pages.builder.portal.apps.onboarding._components.NamePanel.Name_must_be_provided"
      )
    }
    if (!nameRegex.test(name)) {
      return $_(
        "pages.builder.portal.apps.onboarding._components.NamePanel.No_special_characters_are_allowed"
      )
    }
  }

  const validateUrl = url => {
    if (url.length < 1) {
      return $_(
        "pages.builder.portal.apps.onboarding._components.NamePanel.URL_must_be_provided"
      )
    }

    if (!APP_URL_REGEX.test(url)) {
      return $_(
        "pages.builder.portal.apps.onboarding._components.NamePanel.Invalid_URL"
      )
    }
  }
</script>

<div>
  <PanelHeader
    title={$_(
      "pages.builder.portal.apps.onboarding._components.NamePanel.Build_your_first_app"
    )}
    subtitle={$_(
      "pages.builder.portal.apps.onboarding._components.NamePanel.Name_your_app"
    )}
  />
  <FancyForm>
    <FancyInput
      bind:value={name}
      bind:error={nameError}
      validate={validateName}
      label={$_(
        "pages.builder.portal.apps.onboarding._components.NamePanel.Name"
      )}
    />
    <FancyInput
      bind:value={url}
      bind:error={urlError}
      validate={validateUrl}
      label={$_(
        "pages.builder.portal.apps.onboarding._components.NamePanel.URL"
      )}
    />
  </FancyForm>
  {#if url}
    <p><span class="host">{window.location.origin}/app/</span>{url}</p>
  {:else}
    <p>‎</p>
  {/if}
  <Button size="L" cta disabled={!isValid} on:click={onNext}
    >{$_(
      "pages.builder.portal.apps.onboarding._components.NamePanel.Lets_go"
    )}</Button
  >
</div>

<style>
  p {
    color: white;
  }
  .host {
    color: #b0b0b0;
  }
</style>
