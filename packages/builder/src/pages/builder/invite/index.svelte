<script>
  import { Layout, Heading, Body, Button, notifications } from "@budibase/bbui"
  import { goto, params } from "@roxi/routify"
  import { users, organisation, auth } from "stores/portal"
  import Logo from "assets/bb-emblem.svg"
  import { TestimonialPage } from "@budibase/frontend-core/src/components"
  import { FancyForm, FancyInput } from "@budibase/bbui"
  import { onMount } from "svelte"
  import { handleError, passwordsMatch } from "../auth/_components/utils"

  import { _ } from "../../../../lang/i18n"

  const inviteCode = $params["?code"]
  let form
  let formData = {}
  let onboarding = false
  let errors = {}
  let loaded = false

  $: company = $organisation.company || "Budibase"

  async function acceptInvite() {
    form.validate()
    if (Object.keys(errors).length > 0) {
      return
    }
    onboarding = true
    try {
      const { password, firstName, lastName } = formData
      await users.acceptInvite(inviteCode, password, firstName, lastName)
      notifications.success(
        $_("pages.builder.invite.index.notificationsSuccess")
      )
      await login()
    } catch (error) {
      notifications.error(error.message)
      onboarding = false
    }
  }

  async function getInvite() {
    try {
      const invite = await users.fetchInvite(inviteCode)
      if (invite?.email) {
        formData.email = invite?.email
      }
      if ($organisation.isSSOEnforced) {
        // auto accept invite and redirect to login
        await users.acceptInvite(inviteCode)
        $goto("../auth")
      }
    } catch (error) {
      notifications.error(error.message)
    }
  }

  async function login() {
    try {
      await auth.login({
        username: formData.email.trim(),
        password: formData.password.trim(),
      })
      notifications.success($_("pages.builder.invite.index.loginSuccess"))
      $goto("../portal")
    } catch (err) {
      notifications.error(
        err.message
          ? err.message
          : $_("pages.builder.invite.index.notificationsErrorInvalid")
      ) //not likely, considering.
    }
  }

  onMount(async () => {
    try {
      await organisation.init()
      await getInvite()
      loaded = true
    } catch (error) {
      notifications.error(
        $_("pages.builder.invite.index.notificationsErrorConfig")
      )
    }
  })
</script>

{#if loaded}
  <TestimonialPage>
    <Layout gap="M" noPadding>
      <img alt="logo" src={$organisation.logoUrl || Logo} />
      <Layout gap="XS" noPadding>
        <Heading size="M"
          >{$_("pages.builder.invite.index.TestimonialPage.heading")}
          {company}</Heading
        >
        <Body size="M"
          >{$_("pages.builder.invite.index.TestimonialPage.body")}</Body
        >
      </Layout>

      <Layout gap="S" noPadding>
        <FancyForm bind:this={form}>
          <FancyInput
            label={$_("pages.builder.invite.index.TestimonialPage.labelEmail")}
            value={formData.email}
            disabled={true}
            error={errors.email}
          />
          <FancyInput
            label={$_(
              "pages.builder.invite.index.TestimonialPage.labelFirstName"
            )}
            value={formData.firstName}
            on:change={e => {
              formData = {
                ...formData,
                firstName: e.detail,
              }
            }}
            validate={() => {
              let fieldError = {
                firstName: !formData.firstName
                  ? $_(
                      "pages.builder.invite.index.TestimonialPage.labelFirstNameError"
                    )
                  : undefined,
              }

              errors = handleError({ ...errors, ...fieldError })
            }}
            error={errors.firstName}
            disabled={onboarding}
          />
          <FancyInput
            label={$_(
              "pages.builder.invite.index.TestimonialPage.labelLastName"
            )}
            value={formData.lastName}
            on:change={e => {
              formData = {
                ...formData,
                lastName: e.detail,
              }
            }}
            disabled={onboarding}
          />
          {#if !$organisation.isSSOEnforced}
            <FancyInput
              label={$_(
                "pages.builder.invite.index.TestimonialPage.labelPassword"
              )}
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
                      "pages.builder.invite.index.TestimonialPage.passwordErrorEnter"
                    )
                  : undefined

                fieldError["confirmationPassword"] =
                  !passwordsMatch(
                    formData.password,
                    formData.confirmationPassword
                  ) && formData.confirmationPassword
                    ? $_(
                        "pages.builder.invite.index.TestimonialPage.passwordErrorMatch"
                      )
                    : undefined

                errors = handleError({ ...errors, ...fieldError })
              }}
              error={errors.password}
              disabled={onboarding}
            />
            <FancyInput
              label={$_(
                "pages.builder.invite.index.TestimonialPage.passwordRepeat"
              )}
              value={formData.confirmationPassword}
              type="password"
              on:change={e => {
                formData = {
                  ...formData,
                  confirmationPassword: e.detail,
                }
              }}
              validate={() => {
                let fieldError = {
                  confirmationPassword:
                    !passwordsMatch(
                      formData.password,
                      formData.confirmationPassword
                    ) && formData.password
                      ? $_(
                          "pages.builder.invite.index.TestimonialPage.passwordErrorMatch"
                        )
                      : undefined,
                }

                errors = handleError({ ...errors, ...fieldError })
              }}
              error={errors.confirmationPassword}
              disabled={onboarding}
            />
          {/if}
        </FancyForm>
      </Layout>
      <div>
        <Button
          size="L"
          disabled={Object.keys(errors).length > 0 || onboarding}
          cta
          on:click={acceptInvite}
        >
          {$_("pages.builder.invite.index.TestimonialPage.button")}
        </Button>
      </div>
    </Layout>
  </TestimonialPage>
{/if}

<style>
  img {
    width: 40px;
  }
</style>
