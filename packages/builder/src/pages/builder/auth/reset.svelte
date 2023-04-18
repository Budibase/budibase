<script>
  import { Body, Button, Heading, Layout, notifications } from "@budibase/bbui"
  import { goto, params } from "@roxi/routify"
  import { auth, organisation } from "stores/portal"
  import Logo from "assets/bb-emblem.svg"
  import { TestimonialPage } from "@budibase/frontend-core/src/components"
  import { FancyForm, FancyInput } from "@budibase/bbui"
  import { onMount } from "svelte"
  import { handleError, passwordsMatch } from "./_components/utils"

  import { _ } from "../../../../lang/i18n"

  const resetCode = $params["?code"]
  let form
  let formData = {}
  let errors = {}
  let loaded = false

  $: submitted = false
  $: forceResetPassword = $auth?.user?.forceResetPassword

  async function reset() {
    form.validate()
    if (Object.keys(errors).length > 0) {
      return
    }
    submitted = true
    try {
      if (forceResetPassword) {
        await auth.updateSelf({
          password: formData.password,
          forceResetPassword: false,
        })
        $goto("../portal/")
      } else {
        await auth.resetPassword(formData.password, resetCode)
        notifications.success(
          $_("pages.builder.auth.reset.notificationsSuccess")
        )
        // send them to login if reset successful
        $goto("./login")
      }
    } catch (err) {
      submitted = false
      notifications.error(
        $_("pages.builder.auth.reset.notificationsErrorUnable")
      )
    }
  }

  onMount(async () => {
    try {
      await auth.getSelf()
      await organisation.init()
    } catch (error) {
      notifications.error($_("pages.builder.auth.reset.notificationsErrorOrg"))
    }
    loaded = true
  })
</script>

<TestimonialPage>
  <Layout gap="S" noPadding>
    {#if loaded}
      <img alt="logo" src={$organisation.logoUrl || Logo} />
    {/if}
    <Layout gap="XS" noPadding>
      <Heading size="M"
        >{$_("pages.builder.auth.reset.TestimonialPage.heading")}</Heading
      >
      <Body size="M">{$_("pages.builder.auth.reset.TestimonialPage.body")}</Body
      >
    </Layout>

    <Layout gap="S" noPadding>
      <FancyForm bind:this={form}>
        <FancyInput
          label={$_("pages.builder.auth.reset.TestimonialPage.labelPassword")}
          value={formData.password}
          type="password"
          on:change={e => {
            formData = {
              ...formData,
              password: e.detail,
            }
          }}
          validate={() => {
            let fieldError = {}

            fieldError["password"] = !formData.password
              ? $_(
                  "pages.builder.auth.reset.TestimonialPage.passwordErrorEnter"
                )
              : undefined

            fieldError["confirmationPassword"] =
              !passwordsMatch(
                formData.password,
                formData.confirmationPassword
              ) && formData.confirmationPassword
                ? $_(
                    "pages.builder.auth.reset.TestimonialPage.passwordErrorMatch"
                  )
                : undefined

            errors = handleError({ ...errors, ...fieldError })
          }}
          error={errors.password}
          disabled={submitted}
        />
        <FancyInput
          label={$_("pages.builder.auth.reset.TestimonialPage.passwordRepeat")}
          value={formData.confirmationPassword}
          type="password"
          on:change={e => {
            formData = {
              ...formData,
              confirmationPassword: e.detail,
            }
          }}
          validate={() => {
            const isValid =
              !passwordsMatch(
                formData.password,
                formData.confirmationPassword
              ) && formData.password

            let fieldError = {
              confirmationPassword: isValid
                ? $_(
                    "pages.builder.auth.reset.TestimonialPage.passwordErrorMatch"
                  )
                : null,
            }

            errors = handleError({ ...errors, ...fieldError })
          }}
          error={errors.confirmationPassword}
          disabled={submitted}
        />
      </FancyForm>
    </Layout>
    <div>
      <Button
        disabled={Object.keys(errors).length > 0 ||
          (forceResetPassword ? false : !resetCode)}
        cta
        on:click={reset}
        >{$_("pages.builder.auth.reset.TestimonialPage.heading")}</Button
      >
    </div>
  </Layout>
</TestimonialPage>

<style>
  img {
    width: 48px;
  }
</style>
