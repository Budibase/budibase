<script>
  import {
    notifications,
    Button,
    Layout,
    Body,
    Heading,
    Icon,
    FancyForm,
    FancyInput,
  } from "@budibase/bbui"
  import { organisation, auth, translations } from "@/stores/portal"
  import Logo from "assets/bb-emblem.svg"
  import { onMount } from "svelte"
  import { goto } from "@roxi/routify"
  import { resolveTranslationGroup } from "@budibase/shared-core"

  let email = ""
  let form
  let error
  let submitted = false

  $: translationOverrides = (() => {
    if (!$translations.loaded) {
      return {}
    }
    const locale = $translations.config.defaultLocale
    return $translations.config.locales[locale]?.overrides ?? {}
  })()
  $: forgotLabels = resolveTranslationGroup(
    "forgotPassword",
    translationOverrides
  )

  async function forgot() {
    form.validate()
    if (error) {
      return
    }
    submitted = true
    try {
      await auth.forgotPassword(email)
      notifications.success(forgotLabels.success)
    } catch (err) {
      submitted = false
      notifications.error("Unable to send reset password link")
    }
  }

  onMount(async () => {
    try {
      await Promise.all([
        organisation.init(),
        translations.init({ public: true }),
      ])
    } catch (error) {
      notifications.error("Error getting org config")
    }
  })
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="page-container">
  <div class="content">
    <Layout gap="S" noPadding>
      <img alt="logo" src={$organisation.logoUrl || Logo} />
      <span class="heading-wrap">
        <Heading size="M">
          <div class="heading-content">
            <span class="back-chev" on:click={() => $goto("../")}>
              <Icon name="caret-left" size="XL" />
            </span>
            {forgotLabels.heading}
          </div>
        </Heading>
      </span>
      <Layout gap="XS" noPadding>
        <Body size="M">
          {forgotLabels.description}
        </Body>
      </Layout>

      <Layout gap="S" noPadding>
        <FancyForm bind:this={form}>
          <FancyInput
            label={forgotLabels.emailLabel}
            value={email}
            on:change={e => {
              email = e.detail
            }}
            validate={() => {
              if (!email) {
                return forgotLabels.emailError
              }
              return null
            }}
            {error}
            disabled={submitted}
          />
        </FancyForm>
      </Layout>
      <div>
        <Button
          size="L"
          disabled={!email || error || submitted}
          cta
          on:click={forgot}
        >
          {forgotLabels.submit}
        </Button>
      </div>
    </Layout>
  </div>
</div>

<style>
  .page-container {
    height: 100vh;
    display: grid;
    place-items: center;
    padding: 40px;
    overflow-y: auto;
  }
  .content {
    width: 100%;
    max-width: 400px;
    min-height: 480px;
  }
  img {
    width: 46px;
  }
  .back-chev {
    display: inline-block;
    cursor: pointer;
    margin-left: -5px;
  }
  .heading-content {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
  }
</style>
