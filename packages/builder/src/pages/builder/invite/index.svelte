<script>
  import { Layout, Heading, Body, Button, notifications } from "@budibase/bbui"
  import { goto, params } from "@roxi/routify"
  import { users, organisation, auth } from "stores/portal"
  import Logo from "assets/bb-emblem.svg"
  import { TestimonialPage } from "@budibase/frontend-core/src/components"
  import { FancyForm, FancyInput } from "@budibase/bbui"
  import { onMount } from "svelte"
  import { handleError, passwordsMatch } from "../auth/_components/utils"

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
      notifications.success("Invitation accepted successfully")
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
      notifications.success("Logged in successfully")
      $goto("../portal")
    } catch (err) {
      notifications.error(err.message ? err.message : "Invalid credentials") //not likely, considering.
    }
  }

  onMount(async () => {
    try {
      await organisation.init()
      await getInvite()
      loaded = true
    } catch (error) {
      notifications.error("Error getting invite config")
    }
  })
</script>

{#if loaded}
  <TestimonialPage>
    <Layout gap="M" noPadding>
      <img alt="logo" src={$organisation.logoUrl || Logo} />
      <Layout gap="XS" noPadding>
        <Heading size="M">Join {company}</Heading>
        <Body size="M">Create your account to access your budibase apps!</Body>
      </Layout>

      <Layout gap="S" noPadding>
        <FancyForm bind:this={form}>
          <FancyInput
            label="Email"
            value={formData.email}
            disabled={true}
            error={errors.email}
          />
          <FancyInput
            label="First name"
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
                  ? "Please enter your first name"
                  : undefined,
              }

              errors = handleError({ ...errors, ...fieldError })
            }}
            error={errors.firstName}
            disabled={onboarding}
          />
          <FancyInput
            label="Last name (optional)"
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
              label="Password"
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
                  ? "Please enter a password"
                  : undefined

                fieldError["confirmationPassword"] =
                  !passwordsMatch(
                    formData.password,
                    formData.confirmationPassword
                  ) && formData.confirmationPassword
                    ? "Passwords must match"
                    : undefined

                errors = handleError({ ...errors, ...fieldError })
              }}
              error={errors.password}
              disabled={onboarding}
            />
            <FancyInput
              label="Repeat password"
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
                      ? "Passwords must match"
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
          Create account
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
