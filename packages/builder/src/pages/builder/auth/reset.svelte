<script>
  import { Body, Button, Heading, Layout, notifications } from "@budibase/bbui"
  import { goto, params } from "@roxi/routify"
  import { auth, organisation } from "stores/portal"
  import Logo from "assets/bb-emblem.svg"
  import { TestimonialPage } from "@budibase/frontend-core/src/components"
  import { FancyForm, FancyInput } from "@budibase/bbui"
  import { onMount } from "svelte"
  import { handleError, passwordsMatch } from "./_components/utils"

  const resetCode = $params["?code"]
  let form

  let formData = {}
  let errors = {}
  $: console.log(errors)

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
        notifications.success("Password reset successfully")
        // send them to login if reset successful
        $goto("./login")
      }
    } catch (err) {
      submitted = false
      notifications.error("Unable to reset password")
    }
  }

  onMount(async () => {
    try {
      await auth.getSelf()
      await organisation.init()
    } catch (error) {
      notifications.error("Error getting org config")
    }
  })
</script>

<TestimonialPage>
  <Layout gap="M" noPadding>
    <img alt="logo" src={$organisation.logoUrl || Logo} />
    <Layout gap="XS" noPadding>
      <Heading size="M">Reset your password</Heading>
      <Body size="M">Please enter the new password you'd like to use.</Body>
    </Layout>

    <Layout gap="S" noPadding>
      <FancyForm bind:this={form}>
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
            handleError(() => {
              let err = {}

              err["password"] = !formData.password
                ? "Please enter a password"
                : undefined

              err["confirmationPassword"] =
                !passwordsMatch(
                  formData.password,
                  formData.confirmationPassword
                ) && formData.confirmationPassword
                  ? "Passwords must match"
                  : undefined

              return err
            }, errors)
          }}
          error={errors.password}
          disabled={submitted}
        />
        <FancyInput
          label="Repeat Password"
          value={formData.confirmationPassword}
          type="password"
          on:change={e => {
            formData = {
              ...formData,
              confirmationPassword: e.detail,
            }
          }}
          validate={() => {
            handleError(() => {
              return {
                confirmationPassword:
                  !passwordsMatch(
                    formData.password,
                    formData.confirmationPassword
                  ) && formData.password
                    ? "Passwords must match"
                    : undefined,
              }
            }, errors)
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
        on:click={reset}>Reset your password</Button
      >
    </div>
  </Layout>
</TestimonialPage>

<style>
  img {
    width: 48px;
  }
</style>
