<script>
  import {
    Button,
    Heading,
    notifications,
    Layout,
    Body,
    FancyForm,
    FancyInput,
  } from "@budibase/bbui"
  import { BUILDER_URLS, validatePasswordPolicy } from "@budibase/shared-core"
  import { goto as gotoStore } from "@roxi/routify"
  import { API } from "@/api"
  import { admin, auth } from "@/stores/portal"
  import Logo from "assets/bb-emblem.svg"
  import { passwordsMatch, handleError } from "../auth/_components/utils"

  $: goto = $gotoStore

  let form
  let errors = {}
  let formData = {}
  let submitted = false

  $: tenantId = $auth.tenantId
  $: passwordPolicy = $admin.passwordPolicy

  async function save() {
    form.validate()
    if (Object.keys(errors).length > 0) {
      return
    }
    submitted = true
    try {
      let adminUser = { ...formData, tenantId }
      delete adminUser.confirmationPassword
      // Save the admin user
      await API.createAdminUser(adminUser)
      notifications.success("Admin user created")
      await admin.init()
      await auth.login(formData?.email.trim(), formData?.password)
      goto(BUILDER_URLS.WORKSPACES)
    } catch (error) {
      submitted = false
      notifications.error(error.message || "Failed to create admin user")
    }
  }

  const handleKeydown = evt => {
    if (evt.key === "Enter") {
      save()
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />
<div class="page-container">
  <div class="content">
    <Layout gap="M" noPadding>
      <Layout justifyItems="center" noPadding>
        <img alt="logo" src={Logo} />
        <Heading size="M">Create an admin user</Heading>
        <Body>The admin user has access to everything in Budibase.</Body>
      </Layout>
      <Layout gap="S" noPadding>
        <FancyForm bind:this={form}>
          <FancyInput
            label="Email"
            value={formData.email}
            on:change={e => {
              formData = {
                ...formData,
                email: e.detail,
              }
            }}
            validate={() => {
              let fieldError = {
                email: !formData.email
                  ? "Please enter a valid email"
                  : undefined,
              }
              errors = handleError({ ...errors, ...fieldError })
            }}
            disabled={submitted}
            error={errors.email}
          />
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

              if (!formData.password) {
                fieldError["password"] = "Please enter a password"
              } else {
                const result = validatePasswordPolicy({
                  password: formData.password,
                  policy: passwordPolicy,
                })
                fieldError["password"] = result.valid ? undefined : result.error
              }

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
            disabled={submitted}
          />
        </FancyForm>
      </Layout>
      <Layout gap="XS" noPadding justifyItems="center">
        <Button
          cta
          size="L"
          disabled={Object.keys(errors).length > 0 || submitted}
          on:click={save}
        >
          Create super admin user
        </Button>
      </Layout>
    </Layout>
  </div>
</div>

<style>
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
