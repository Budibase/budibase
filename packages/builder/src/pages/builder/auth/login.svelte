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
  import { goto as gotoStore } from "@roxi/routify"
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

  $: goto = $gotoStore

  let loaded = false
  let form
  let errors = {}
  let formData = {}

  $: company = $organisation.company || "Budibase"
  $: loginFontUrl = $organisation.loginFontUrl
  $: cloud = $admin.cloud
  $: translationOverrides = (() => {
    if (!$translations.loaded) {
      return {}
    }
    const locale = $translations.config.defaultLocale
    return $translations.config.locales[locale]?.overrides ?? {}
  })()
  $: loginLabels = resolveTranslationGroup("login", translationOverrides)
  $: passwordBlankError = loginLabels.passwordError
  $: passwordIncorrectError =
    loginLabels.passwordIncorrectError || loginLabels.invalidCredentials

  const buildContainerStyle = ({
    backgroundColor,
    backgroundImageUrl,
    textColor,
    fontFamily,
    inputBackgroundColor,
    inputTextColor,
    primaryColor,
  }) => {
    const styles = []
    if (backgroundColor) {
      styles.push(`background-color: ${backgroundColor}`)
    }
    if (backgroundImageUrl) {
      styles.push(`background-image: url("${backgroundImageUrl}")`)
      styles.push("background-size: cover")
      styles.push("background-position: center")
      styles.push("background-repeat: no-repeat")
    }
    if (textColor) {
      styles.push(`color: ${textColor}`)
      styles.push(`--login-text-color: ${textColor}`)
    }
    if (fontFamily) {
      styles.push(`font-family: ${fontFamily}`)
      styles.push(`--login-font-family: ${fontFamily}`)
      styles.push(`--font-sans: ${fontFamily}`)
    }
    if (inputBackgroundColor) {
      styles.push(`--login-input-bg: ${inputBackgroundColor}`)
    }
    if (inputTextColor) {
      styles.push(`--login-input-text: ${inputTextColor}`)
    }
    if (primaryColor) {
      styles.push(`--login-primary-color: ${primaryColor}`)
    }
    return styles.join("; ")
  }

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
        goto("./reset")
      } else {
        notifications.success("Logged in successfully")
        pushNumSessionsInvalidated(loginResult.invalidatedSessionCount || 0)

        // Check for return URL cookie and redirect there if it exists
        const returnUrl = CookieUtils.getCookie(Constants.Cookies.ReturnUrl)
        if (returnUrl) {
          CookieUtils.removeCookie(Constants.Cookies.ReturnUrl)
          if (returnUrl.startsWith("/builder")) {
            goto(returnUrl)
          } else {
            window.location.assign(returnUrl)
          }
        } else {
          goto("/builder")
        }
      }
    } catch (err) {
      notifications.error(
        passwordIncorrectError || err?.message || "Invalid credentials"
      )
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

  $: loginContainerStyle = buildContainerStyle({
    backgroundColor: $organisation.loginBackgroundColor,
    backgroundImageUrl: $organisation.loginBackgroundImageUrl,
    textColor: $organisation.loginTextColor,
    fontFamily: $organisation.loginFontFamily,
    inputBackgroundColor: $organisation.loginInputBackgroundColor,
    inputTextColor: $organisation.loginInputTextColor,
    primaryColor: $organisation.loginPrimaryColor,
  })
</script>

<svelte:window on:keydown={handleKeydown} />
<svelte:head>
  {#if loginFontUrl}
    <link rel="stylesheet" href={loginFontUrl} />
  {/if}
</svelte:head>
{#if loaded}
  <div class="page-container" style={loginContainerStyle}>
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
                      ? passwordBlankError
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
              <ActionButton size="L" quiet on:click={() => goto("./forgot")}>
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
    font-family: var(--login-font-family, inherit);
  }
  .content {
    width: 100%;
    max-width: 400px;
    min-height: 480px;
  }

  .page-container :global(.spectrum-Button--cta.new-styles) {
    background: var(
      --login-primary-color,
      var(--spectrum-global-color-gray-800)
    );
    border-color: transparent;
    color: var(--spectrum-global-color-gray-50);
  }

  .page-container
    :global(.spectrum-Button--cta.new-styles:not(.is-disabled):hover) {
    background: var(
      --login-primary-color,
      var(--spectrum-global-color-gray-900)
    );
    filter: brightness(0.95);
  }

  .page-container :global(.spectrum-Textfield) {
    background: var(--login-input-bg, transparent);
    border-radius: var(--border-radius-s);
  }

  .page-container :global(.spectrum-Textfield-input) {
    background: var(--login-input-bg, transparent);
    color: var(--login-input-text, inherit);
  }

  .page-container :global(.spectrum-Textfield-input::placeholder) {
    color: var(--login-input-text, var(--grey-7));
    opacity: 0.7;
  }

  .page-container :global(.fancy-field) {
    background: var(--login-input-bg, var(--spectrum-global-color-gray-75));
    border-color: var(--spectrum-global-color-gray-300);
    color: var(--login-input-text, var(--spectrum-global-color-gray-800));
  }

  .page-container :global(.spectrum-Heading) {
    color: var(--login-text-color, var(--spectrum-global-color-gray-900));
    font-family: var(--login-font-family, var(--font-sans));
  }

  .page-container :global(.spectrum-Body) {
    font-family: var(--login-font-family, var(--font-sans));
  }

  .page-container :global(.spectrum-Button-label) {
    font-family: var(--login-font-family, var(--font-sans));
  }

  .page-container :global(.spectrum-ActionButton-label) {
    font-family: var(--login-font-family, var(--font-sans));
  }

  .page-container :global(.fancy-field .field > div) {
    color: var(--login-input-text, var(--spectrum-global-color-gray-600));
  }

  .page-container :global(.fancy-field.focused) {
    border-color: var(
      --login-primary-color,
      var(--spectrum-global-color-blue-400)
    );
  }

  .page-container :global(.fancy-field input) {
    background: transparent;
    color: var(--login-input-text, var(--spectrum-global-color-gray-900));
    font-family: var(--login-font-family, var(--font-sans));
  }

  .page-container :global(.fancy-field input::placeholder) {
    color: var(--login-input-text, var(--spectrum-global-color-gray-600));
    opacity: 0.6;
  }

  .page-container :global(.fancy-field .field > div) {
    font-family: var(--login-font-family, var(--font-sans));
  }
</style>
