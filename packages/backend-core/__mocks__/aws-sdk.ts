const mockS3 = {
  headBucket: jest.fn().mockReturnThis(),
  deleteObject: jest.fn().mockReturnThis(),
  deleteObjects: jest.fn().mockReturnThis(),
  createBucket: jest.fn().mockReturnThis(),
  getObject: jest.fn().mockReturnThis(),
  listObject: jest.fn().mockReturnThis(),
  getSignedUrl: jest.fn((operation: string, params: any) => {
    return `http://s3.example.com/${params.Bucket}/${params.Key}`
  }),
  promise: jest.fn().mockReturnThis(),
  catch: jest.fn(),
}

const AWS = {
  S3: jest.fn(() => mockS3),
}

export default AWS
