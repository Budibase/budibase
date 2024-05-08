import { objectStore } from "../../../../src/index"

export async function getSignedUrlFromTestFile(filename: string) {
  let bucket = "testbucket"
  await objectStore.upload({
    bucket,
    filename,
    body: Buffer.from("test data"),
  })
  let presignedUrl = await objectStore.getPresignedUrl(bucket, filename, 60000)

  return presignedUrl
}
