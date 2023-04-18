<script>
  import {
    notifications,
    Button,
    Layout,
    Body,
    Heading,
    Icon,
  } from "@budibase/bbui"
  import { organisation, auth } from "stores/portal"
  import Logo from "assets/bb-emblem.svg"
  import { onMount } from "svelte"
  import { goto } from "@roxi/routify"
  import { TestimonialPage } from "@budibase/frontend-core/src/components"
  import { FancyForm, FancyInput } from "@budibase/bbui"

  import { _ } from "../../../../lang/i18n"

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
      notifications.success(
        $_("pages.builder.auth.forgot.notificationsSuccess")
      )
    } catch (err) {
      submitted = false
      notifications.error(
        $_("pages.builder.auth.forgot.notificationsErrorUnable")
      )
    }
  }

  onMount(async () => {
    try {
      await organisation.init()
    } catch (error) {
      notifications.error($_("pages.builder.auth.forgot.notificationsErrorOrg"))
    }
  })
</script>

<TestimonialPage>
  <Layout gap="S" noPadding>
    <img alt="logo" src={$organisation.logoUrl || Logo} />
    <span class="heading-wrap">
      <Heading size="M">
        <div class="heading-content">
          <span class="back-chev" on:click={() => $goto("../")}>
            <Icon name="ChevronLeft" size="XL" />
          </span>
          {$_("pages.builder.auth.forgot.TestimonialPage.heading")}
        </div>
      </Heading>
    </span>
    <Layout gap="XS" noPadding>
      <Body size="M">
        {$_("pages.builder.auth.forgot.TestimonialPage.body")}
      </Body>
    </Layout>

    <Layout gap="S" noPadding>
      <FancyForm bind:this={form}>
        <FancyInput
          label={$_("pages.builder.auth.forgot.TestimonialPage.labelEmail")}
          value={email}
          on:change={e => {
            email = e.detail
          }}
          validate={() => {
            if (!email) {
              return $_("pages.builder.auth.forgot.TestimonialPage.email")
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
        {$_("pages.builder.auth.forgot.TestimonialPage.button")}
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
