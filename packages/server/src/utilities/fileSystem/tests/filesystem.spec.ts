import fs from "fs"
import path from "path"
import { budibaseTempDir } from "../../budibaseDir"
import {
  createTempFolder,
  deleteFolderFileSystem,
  extractTarball,
} from "../filesystem"

describe("filesystem", () => {
  describe("createTempFolder", () => {
    it("should keep temporary folders inside the Budibase temp directory", () => {
      const folder = createTempFolder("../../../etc/cron.d/plugin")

      expect(folder.startsWith(`${budibaseTempDir()}${path.sep}`)).toBe(true)
      expect(folder).not.toContain(`${path.sep}etc${path.sep}cron.d`)
      expect(fs.existsSync(folder)).toBe(true)

      deleteFolderFileSystem(folder)
    })
  })

  describe("extractTarball", () => {
    it("should reject extraction targets outside the Budibase temp directory", async () => {
      const outsidePath = path.resolve(budibaseTempDir(), "..", "outside")

      await expect(
        extractTarball("/tmp/does-not-matter.tar.gz", outsidePath)
      ).rejects.toThrow("Path must be within the Budibase temp directory.")
    })
  })

  describe("deleteFolderFileSystem", () => {
    it("should reject deleting paths outside the Budibase temp directory", () => {
      const outsidePath = path.resolve(budibaseTempDir(), "..", "outside")

      expect(() => deleteFolderFileSystem(outsidePath)).toThrow(
        "Path must be within the Budibase temp directory."
      )
    })
  })
})
