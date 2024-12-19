export class S3 {
  headBucket() {
    return jest.fn().mockReturnThis()
  }
  deleteObject() {
    return jest.fn().mockReturnThis()
  }
  deleteObjects() {
    return jest.fn().mockReturnThis()
  }
  createBucket() {
    return jest.fn().mockReturnThis()
  }
  getObject() {
    return jest.fn().mockReturnThis()
  }
  listObject() {
    return jest.fn().mockReturnThis()
  }
  getSignedUrl() {
    return jest.fn((operation: string, params: any) => {
      return `http://s3.example.com/${params.Bucket}/${params.Key}`
    })
  }
  promise() {
    return jest.fn().mockReturnThis()
  }
  catch() {
    return jest.fn()
  }
}

export const GetObjectCommand = jest.fn()
