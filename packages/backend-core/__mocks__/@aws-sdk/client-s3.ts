export class S3 {
  headObject() {
    return jest.fn().mockReturnThis()
  }
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
  promise() {
    return jest.fn().mockReturnThis()
  }
  catch() {
    return jest.fn()
  }
}

export const GetObjectCommand = jest.fn(inputs => ({ inputs }))
