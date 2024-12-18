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
  import { organisation, auth } from "@/stores/portal"
  import Logo from "assets/bb-emblem.svg"
  import { onMount } from "svelte"
  import { goto } from "@roxi/routify"
  import { TestimonialPage } from "@budibase/frontend-core/src/components"

  let email = ""
  let form
  let error
  let submitted = false

  async function forgot() {
    form.validate()
    if (error) {
      return
    }
    submitted = true
    try {
      await auth.forgotPassword(email)
      notifications.success("Email sent - please check your inbox")
    } catch (err) {
      submitted = false
      notifications.error("Unable to send reset password link")
    }
  }

  onMount(async () => {
    try {
      await organisation.init()
    } catch (error) {
      notifications.error("Error getting org config")
    }
  })
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<TestimonialPage enabled={$organisation.testimonialsEnabled}>
  <Layout gap="S" noPadding>
    <img alt="logo" src={$organisation.logoUrl || Logo} />
    <span class="heading-wrap">
      <Heading size="M">
        <div class="heading-content">
          <span class="back-chev" on:click={() => $goto("../")}>
            <Icon name="ChevronLeft" size="XL" />
          </span>
          Forgot your password?
        </div>
      </Heading>
    </span>
    <Layout gap="XS" noPadding>
      <Body size="M">
        No problem! Just enter your account's email address and we'll send you a
        link to reset it.
      </Body>
    </Layout>

    <Layout gap="S" noPadding>
      <FancyForm bind:this={form}>
        <FancyInput
          label="Email"
          value={email}
          on:change={e => {
            email = e.detail
          }}
          validate={() => {
            if (!email) {
              return "Please enter your email"
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
        Reset password
      </Button>
    </div>
  </Layout>
</TestimonialPage>

<style>
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
