const SHAREPOINT_DRIVE_PATH_PREFIX = "drive:"

export const buildSharePointDriveFilterPath = (
  driveId: string,
  relativePath?: string
) => {
  const drivePath = `${SHAREPOINT_DRIVE_PATH_PREFIX}${encodeURIComponent(
    driveId
  )}`
  return relativePath ? `${drivePath}/${relativePath}` : drivePath
}
