<script>
  import {
    Body,
    ModalContent,
    RadioGroup,
    Multiselect,
    notifications,
  } from "@budibase/bbui"
  import { groups, auth, admin } from "stores/portal"
  import { emailValidator } from "../../../../../../helpers/validation"
  import { Constants } from "@budibase/frontend-core"

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
  $: hasGroupsLicense = $auth.user?.license.features.includes(
    Constants.Features.USER_GROUPS
  )

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

      userEmails = csvString.split("\n")
    })
    reader.readAsText(fileArray[0])
  }
</script>

<ModalContent
  size="M"
  title="Import users"
  confirmText="Done"
  showCancelButton={false}
  cancelText="Cancel"
  showCloseIcon={false}
  onConfirm={() => createUsersFromCsv({ userEmails, usersRole, userGroups })}
  disabled={!userEmails.length || !validEmails(userEmails) || !usersRole}
>
  <Body size="S">Import your users email addrresses from a CSV</Body>

  <div class="dropzone">
    <input id="file-upload" accept=".csv" type="file" on:change={handleFile} />
    <label for="file-upload" class:uploaded={files[0]}>
      {#if files[0]}{files[0].name}{:else}Upload{/if}
    </label>
  </div>

  <RadioGroup
    bind:value={usersRole}
    options={Constants.BuilderRoleDescriptions}
  />

  {#if hasGroupsLicense}
    <Multiselect
      bind:value={userGroups}
      placeholder="Select User Groups"
      label="User Groups"
      options={$groups}
      getOptionLabel={option => option.name}
      getOptionValue={option => option._id}
    />
  {/if}
</ModalContent>

<style>
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
    font-family: var(--font-sans);
    cursor: pointer;
    font-weight: 600;
    box-sizing: border-box;
    overflow: hidden;
    border-radius: var(--border-radius-s);
    color: var(--ink);
    padding: var(--spacing-m) var(--spacing-l);
    transition: all 0.2s ease 0s;
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
    background-color: var(--grey-2);
    font-size: var(--font-size-xs);
    line-height: normal;
    border: var(--border-transparent);
  }

  input[type="file"] {
    display: none;
  }
</style>
