<script lang="ts">
  import {
    Body,
    ModalContent,
    RadioGroup,
    Multiselect,
    notifications,
    Icon,
  } from "@budibase/bbui"
  import { groups } from "@/stores/portal/groups"
  import { licensing } from "@/stores/portal/licensing"
  import { admin } from "@/stores/portal/admin"
  import { emailValidator, Constants } from "@budibase/frontend-core"
  import { capitalise, parseUserEmailsFromCSV } from "@/helpers"
  const BYTES_IN_MB = 1000000
  const FILE_SIZE_LIMIT = BYTES_IN_MB * 5
  const MAX_USERS_UPLOAD_LIMIT = 1000

  export let createUsersFromCsv: (_data: {
    userEmails: string[]
    usersRole: string
    userGroups: string[]
  }) => void

  let files: File[] = []
  let csvString: string | undefined = undefined
  let userEmails: string[] = []
  let userGroups: string[] = []
  let usersRole: string | undefined = undefined
  let invalidEmails: string[] = []

  $: userCount = ($licensing?.userCount || 0) + userEmails.length
  $: exceed = licensing.usersLimitExceeded(userCount)
  $: importDisabled =
    !userEmails.length || !validEmails(userEmails) || !usersRole || exceed
  $: roleOptions = Constants.BudibaseRoleOptions.map(option => ({
    ...option,
    label: `${option.label} - ${option.subtitle}`,
  }))

  $: internalGroups = $groups?.filter(g => !g?.scimInfo?.isSync)

  const validEmails = (userEmails: string[]): boolean => {
    invalidEmails = [] // Reset invalid emails
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

  async function handleFile(evt: Event): Promise<void> {
    const target = evt.target as HTMLInputElement
    if (!target.files) return

    const fileArray = Array.from(target.files)
    if (fileArray.some(file => file.size >= FILE_SIZE_LIMIT)) {
      notifications.error(
        `Files cannot exceed ${
          FILE_SIZE_LIMIT / BYTES_IN_MB
        }MB. Please try again with smaller files.`
      )
      return
    }

    // Read CSV as plain text to upload alongside schema
    const reader = new FileReader()
    reader.addEventListener("load", function (e) {
      const result = e.target?.result
      if (typeof result === "string") {
        csvString = result
        files = fileArray
        userEmails = parseUserEmailsFromCSV(csvString)
      }
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
  onConfirm={() =>
    createUsersFromCsv({ userEmails, usersRole: usersRole || "", userGroups })}
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
      <Icon name="info" />
      {capitalise($licensing?.license?.plan?.type || "")} plan is limited to {$licensing?.userLimit}
      users. Upgrade your plan to add more users
    </div>
  {/if}
  <RadioGroup bind:value={usersRole} options={roleOptions} />

  {#if $licensing?.groupsEnabled && internalGroups?.length}
    <Multiselect
      bind:value={userGroups}
      placeholder="No groups"
      label="Groups"
      options={internalGroups}
      getOptionLabel={option => option?.name || ""}
      getOptionValue={option => option?._id || ""}
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
    font-feature-settings:
      "case" 1,
      "rlig" 1,
      "calt" 0;
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
