<script>
  import {
    ActionButton,
    Body,
    Button,
    Divider,
    Heading,
    Layout,
    notifications,
    Link,
    FancyForm,
    FancyInput,
  } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import {
    auth,
    organisation,
    oidc,
    admin,
    translations,
  } from "@/stores/portal"
  import { resolveTranslationGroup } from "@budibase/shared-core"
  import GoogleButton from "./_components/GoogleButton.svelte"
  import OIDCButton from "./_components/OIDCButton.svelte"
  import { handleError } from "./_components/utils"
  import Logo from "assets/bb-emblem.svg"
  import { onMount } from "svelte"
  import { pushNumSessionsInvalidated } from "../../../../../frontend-core/src"
  import { CookieUtils, Constants } from "@budibase/frontend-core"

  let loaded = false
  let form
  let errors = {}
  let formData = {}

  $: company = $organisation.company || "Budibase"
  $: cloud = $admin.cloud
  $: translationOverrides = (() => {
    if (!$translations.loaded) {
      return {}
    }
    const locale = $translations.config.defaultLocale
    return $translations.config.locales[locale]?.overrides ?? {}
  })()
  $: loginLabels = resolveTranslationGroup("login", translationOverrides)

  async function login() {
    form.validate()
    if (Object.keys(errors).length > 0) {
      console.error("errors", errors)
      return
    }
    try {
      const loginResult = await auth.login(
        formData?.username.trim(),
        formData?.password
      )
      if ($auth?.user?.forceResetPassword) {
        $goto("./reset")
      } else {
        notifications.success("Logged in successfully")
        pushNumSessionsInvalidated(loginResult.invalidatedSessionCount || 0)

        // Check for return URL cookie and redirect there if it exists
        const returnUrl = CookieUtils.getCookie(Constants.Cookies.ReturnUrl)
        if (returnUrl) {
          CookieUtils.removeCookie(Constants.Cookies.ReturnUrl)
          if (returnUrl.startsWith("/builder")) {
            $goto(returnUrl)
          } else {
            window.location.assign(returnUrl)
          }
        } else {
          $goto("/builder")
        }
      }
    } catch (err) {
      notifications.error(err.message ? err.message : "Invalid credentials")
    }
  }

  function handleKeydown(evt) {
    if (evt.key === "Enter") login()
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
    loaded = true
  })
</script>

<svelte:window on:keydown={handleKeydown} />
{#if loaded}
  <div class="page-container">
    <div class="content">
      <Layout gap="L" noPadding>
        <Layout justifyItems="center" noPadding>
          {#if loaded}
            <img alt="logo" src={$organisation.logoUrl || Logo} />
          {/if}
          <Heading size="M" textAlign="center">
            {$organisation.loginHeading || "Log in to Budibase"}
          </Heading>
        </Layout>
        <Layout gap="S" noPadding>
          {#if loaded && ($organisation.google || $organisation.oidc)}
            <FancyForm>
              <OIDCButton
                oidcIcon={$oidc.logo}
                oidcName={$oidc.name}
                samePage
              />
              <GoogleButton samePage />
            </FancyForm>
          {/if}
          {#if !$organisation.isSSOEnforced}
            <Divider />
            <FancyForm bind:this={form}>
              <FancyInput
                label={loginLabels.emailLabel}
                value={formData.username}
                on:change={e => {
                  formData = {
                    ...formData,
                    username: e.detail,
                  }
                }}
                validate={() => {
                  let fieldError = {
                    username: !formData.username
                      ? loginLabels.emailError
                      : undefined,
                  }
                  errors = handleError({ ...errors, ...fieldError })
                }}
                error={errors.username}
              />
              <FancyInput
                label={loginLabels.passwordLabel}
                value={formData.password}
                type="password"
                on:change={e => {
                  formData = {
                    ...formData,
                    password: e.detail,
                  }
                }}
                validate={() => {
                  let fieldError = {
                    password: !formData.password
                      ? loginLabels.passwordError
                      : undefined,
                  }
                  errors = handleError({ ...errors, ...fieldError })
                }}
                error={errors.password}
              />
            </FancyForm>
          {/if}
        </Layout>
        {#if !$organisation.isSSOEnforced}
          <Layout gap="XS" noPadding justifyItems="center">
            <Button
              size="L"
              cta
              disabled={Object.keys(errors).length > 0}
              on:click={login}
            >
              {$organisation.loginButton || `Log in to ${company}`}
            </Button>
          </Layout>
          <Layout gap="XS" noPadding justifyItems="center">
            <div class="user-actions">
              <ActionButton size="L" quiet on:click={() => $goto("./forgot")}>
                {loginLabels.forgotPassword}
              </ActionButton>
            </div>
          </Layout>
        {/if}

        {#if cloud}
          <Body size="xs" textAlign="center">
            By using Budibase Cloud
            <br />
            you are agreeing to our
            <Link
              href="https://budibase.com/eula"
              target="_blank"
              secondary={true}
            >
              License Agreement
            </Link>
          </Body>
        {/if}
      </Layout>
    </div>
  </div>
{/if}

<style>
  .user-actions {
    display: flex;
    align-items: center;
  }
  img {
    width: 48px;
  }
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
</style>
