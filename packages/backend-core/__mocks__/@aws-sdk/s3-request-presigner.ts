export const getSignedUrl = jest.fn((_, cmd) => {
  const { inputs } = cmd
  return `http://s3.example.com/${inputs?.Bucket}/${inputs?.Key}`
})
