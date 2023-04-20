<script>
  import { Body, ModalContent, Table, Icon } from "@budibase/bbui"
  import PasswordCopyTableRenderer from "./PasswordCopyTableRenderer.svelte"
  import { parseToCsv } from "helpers/data/utils"
  import { onMount } from "svelte"

  import { _ } from "../../../../../../../lang/i18n"

  export let userData
  export let createUsersResponse

  let hasSuccess
  let hasFailure
  let title
  let failureMessage

  let userDataIndex
  let successfulUsers
  let unsuccessfulUsers

  const setTitle = () => {
    if (hasSuccess) {
      title = $_(
        "pages.builder.portal.users.users._components.PasswordModal.Users_created"
      )
    } else if (hasFailure) {
      title = $_(
        "pages.builder.portal.users.users._components.PasswordModal.Oops"
      )
    }
  }

  const setFailureMessage = () => {
    if (hasSuccess) {
      failureMessage = $_(
        "pages.builder.portal.users.users._components.PasswordModal.problem_creating"
      )
    } else {
      failureMessage = $_(
        "pages.builder.portal.users.users._components.PasswordModal.was_problem"
      )
    }
  }

  const setUsers = () => {
    userDataIndex = userData.reduce((prev, current) => {
      prev[current.email] = current
      return prev
    }, {})

    successfulUsers = createUsersResponse.successful.map(user => {
      return {
        email: user.email,
        password: userDataIndex[user.email].password,
      }
    })

    unsuccessfulUsers = createUsersResponse.unsuccessful.map(user => {
      return {
        email: user.email,
        reason: user.reason,
      }
    })
  }

  onMount(() => {
    hasSuccess = createUsersResponse.successful.length
    hasFailure = createUsersResponse.unsuccessful.length
    setTitle()
    setFailureMessage()
    setUsers()
  })

  const successSchema = {
    email: {},
    password: {},
  }

  const failedSchema = {
    email: {},
    reason: {},
  }

  const downloadCsvFile = () => {
    const fileName = "passwords.csv"
    const content = parseToCsv(["email", "password"], successfulUsers)

    download(fileName, content)
  }

  const download = (filename, text) => {
    const element = document.createElement("a")
    element.setAttribute(
      "href",
      "data:text/csv;charset=utf-8," + encodeURIComponent(text)
    )
    element.setAttribute("download", filename)

    element.style.display = "none"
    document.body.appendChild(element)

    element.click()

    document.body.removeChild(element)
  }
</script>

<ModalContent
  size="M"
  {title}
  confirmText={$_(
    "pages.builder.portal.users.users._components.PasswordModal.Done"
  )}
  showCancelButton={false}
  cancelText={$_(
    "pages.builder.portal.users.users._components.PasswordModal.Cancel"
  )}
  showCloseIcon={false}
>
  {#if hasFailure}
    <Body size="XS">
      {failureMessage}
    </Body>
    <Table
      schema={failedSchema}
      data={unsuccessfulUsers}
      allowEditColumns={false}
      allowEditRows={false}
      allowSelectRows={false}
    />
  {/if}
  {#if hasSuccess}
    <Body size="XS">
      {$_(
        "pages.builder.portal.users.users._components.PasswordModal.can_accessed"
      )}
    </Body>

    <div class="container" on:click={downloadCsvFile}>
      <div class="inner">
        <Icon name="Download" />

        <div style="margin-left: var(--spacing-m)">
          <Body size="XS"
            >{$_(
              "pages.builder.portal.users.users._components.PasswordModal.Passwords_CSV"
            )}</Body
          >
        </div>
      </div>
    </div>

    <Table
      schema={successSchema}
      data={successfulUsers}
      allowEditColumns={false}
      allowEditRows={false}
      allowSelectRows={false}
      customRenderers={[
        { column: "password", component: PasswordCopyTableRenderer },
      ]}
    />
  {/if}
</ModalContent>

<style>
  .inner {
    display: flex;
  }

  .container {
    width: 100%;
    height: var(--spectrum-alias-item-height-l);
    background: #009562;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
