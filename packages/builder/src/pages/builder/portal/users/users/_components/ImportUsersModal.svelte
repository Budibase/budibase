<script>
  import {
    Body,
    ModalContent,
    RadioGroup,
    Multiselect,
    notifications,
  } from "@budibase/bbui"
  import { groups, licensing, admin } from "stores/portal"
  import { emailValidator } from "helpers/validation"
  import { Constants } from "@budibase/frontend-core"

  import { _ } from "../../../../../../../lang/i18n"

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

  const validEmails = userEmails => {
    if ($admin.cloud && userEmails.length > MAX_USERS_UPLOAD_LIMIT) {
      notifications.error(
        s`${$_(
          "pages.builder.portal.users.users._components.ImportUsersModal.Max_limit"
        )}`
      )
      return false
    }
    for (const email of userEmails) {
      if (emailValidator(email) !== true) invalidEmails.push(email)
    }

    if (!invalidEmails.length) return true

    notifications.error(
      `${$_(
        "pages.builder.portal.users.users._components.ImportUsersModal.check_email"
      )}${invalidEmails.length > 1 ? "s" : ""}: ${invalidEmails.join(", ")}`
    )

    return false
  }

  async function handleFile(evt) {
    const fileArray = Array.from(evt.target.files)
    if (fileArray.some(file => file.size >= FILE_SIZE_LIMIT)) {
      notifications.error(
        `${$_(
          "pages.builder.portal.users.users._components.ImportUsersModal.Files_exceed"
        )} ${FILE_SIZE_LIMIT / BYTES_IN_MB}${$_(
          "pages.builder.portal.users.users._components.ImportUsersModal.MB"
        )} ${$_(
          "pages.builder.portal.users.users._components.ImportUsersModal.try_again"
        )}`
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
  title={$_(
    "pages.builder.portal.users.users._components.ImportUsersModal.Import_users"
  )}
  confirmText={$_(
    "pages.builder.portal.users.users._components.ImportUsersModal.Done"
  )}
  cancelText={$_(
    "pages.builder.portal.users.users._components.ImportUsersModal.Cancel"
  )}
  showCloseIcon={false}
  onConfirm={() => createUsersFromCsv({ userEmails, usersRole, userGroups })}
  disabled={!userEmails.length || !validEmails(userEmails) || !usersRole}
>
  <Body size="S"
    >{$_(
      "pages.builder.portal.users.users._components.ImportUsersModal.Import_email"
    )}</Body
  >

  <div class="dropzone">
    <input id="file-upload" accept=".csv" type="file" on:change={handleFile} />
    <label for="file-upload" class:uploaded={files[0]}>
      {#if files[0]}{files[0].name}{:else}{$_(
          "pages.builder.portal.users.users._components.ImportUsersModal.Upload"
        )}{/if}
    </label>
  </div>

  <RadioGroup
    bind:value={usersRole}
    options={Constants.BuilderRoleDescriptions}
  />

  {#if $licensing.groupsEnabled}
    <Multiselect
      bind:value={userGroups}
      placeholder={$_(
        "pages.builder.portal.users.users._components.ImportUsersModal.No_groups"
      )}
      label={$_(
        "pages.builder.portal.users.users._components.ImportUsersModal.Groups"
      )}
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
