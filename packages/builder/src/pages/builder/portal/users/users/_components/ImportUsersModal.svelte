<script>
  import {
    Body,
    ModalContent,
    RadioGroup,
    Multiselect,
    notifications,
    Icon,
  } from "@budibase/bbui"
  import { groups, licensing, admin } from "stores/portal"
  import { emailValidator } from "helpers/validation"
  import { Constants } from "@budibase/frontend-core"
  import { capitalise } from "helpers"

  const BYTES_IN_MB = 1000000
  const FILE_SIZE_LIMIT = BYTES_IN_MB * 5
  const MAX_USERS_UPLOAD_LIMIT = 1000
  export let createUsersFromCsv

  let files = []
  let csvString = undefined
  let userEmails = []
  let userGroups = []
  let usersRole = null
  $: invalidEmails = []

  $: userCount = $licensing.userCount + userEmails.length
  $: exceed = licensing.usersLimitExceeded(userCount)

  $: importDisabled =
    !userEmails.length || !validEmails(userEmails) || !usersRole || exceed

  const validEmails = userEmails => {
    if ($admin.cloud && userEmails.length > MAX_USERS_UPLOAD_LIMIT) {
      notifications.error(
        `Max limit for upload is 1000 users. Please reduce file size and try again.`
      )
      return false
    }
    for (const email of userEmails) {
      if (emailValidator(email) !== true) invalidEmails.push(email)
    }

    if (!invalidEmails.length) return true

    notifications.error(
      `Error, please check the following email${
        invalidEmails.length > 1 ? "s" : ""
      }: ${invalidEmails.join(", ")}`
    )

    return false
  }

  async function handleFile(evt) {
    const fileArray = Array.from(evt.target.files)
    if (fileArray.some(file => file.size >= FILE_SIZE_LIMIT)) {
      notifications.error(
        `Files cannot exceed ${
          FILE_SIZE_LIMIT / BYTES_IN_MB
        }MB. Please try again with smaller files.`
      )
      return
    }

    // Read CSV as plain text to upload alongside schema
    let reader = new FileReader()
    reader.addEventListener("load", function (e) {
      csvString = e.target.result
      files = fileArray

      userEmails = csvString.split(/\r?\n/)
    })
    reader.readAsText(fileArray[0])
  }
</script>

<ModalContent
  size="M"
  title="Import users"
  confirmText="Done"
  cancelText="Cancel"
  showCloseIcon={false}
  onConfirm={() => createUsersFromCsv({ userEmails, usersRole, userGroups })}
  disabled={importDisabled}
>
  <Body size="S">Import your users email addresses from a CSV file</Body>

  <div class="dropzone">
    <input id="file-upload" accept=".csv" type="file" on:change={handleFile} />
    <label for="file-upload" class:uploaded={files[0]}>
      {#if files[0]}{files[0].name}{:else}Upload{/if}
    </label>
  </div>

  {#if exceed}
    <div class="user-notification">
      <Icon name="Info" />
      {capitalise($licensing.license.plan.type)} plan is limited to {$licensing.userLimit}
      users. Upgrade your plan to add more users
    </div>
  {/if}
  <RadioGroup
    bind:value={usersRole}
    options={Constants.BuilderRoleDescriptions}
  />

  {#if $licensing.groupsEnabled}
    <Multiselect
      bind:value={userGroups}
      placeholder="No groups"
      label="Groups"
      options={$groups}
      getOptionLabel={option => option.name}
      getOptionValue={option => option._id}
    />
  {/if}
</ModalContent>

<style>
  .user-notification {
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: var(--spacing-m);
  }

  .dropzone {
    text-align: center;
    display: flex;
    align-items: center;
    flex-direction: column;
    border-radius: 10px;
    transition: all 0.3s;
  }
  .uploaded {
    color: var(--blue);
  }

  label {
    font-weight: 600;
    box-sizing: border-box;
    overflow: hidden;
    border-radius: var(--border-radius-s);
    color: var(--ink);
    padding: var(--spacing-m) var(--spacing-l);
    display: inline-flex;
    text-rendering: optimizeLegibility;
    min-width: auto;
    outline: none;
    font-feature-settings: "case" 1, "rlig" 1, "calt" 0;
    -webkit-box-align: center;
    user-select: none;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 100%;
    background: var(--spectrum-global-color-gray-200);
    font-size: 12px;
    line-height: normal;
    border: var(--border-transparent);
    transition: background-color 130ms ease-out;
  }
  label:hover {
    background: var(--spectrum-global-color-gray-300);
    cursor: pointer;
  }

  input[type="file"] {
    display: none;
  }
</style>
