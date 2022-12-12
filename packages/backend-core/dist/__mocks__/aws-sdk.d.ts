/// <reference types="jest" />
declare const AWS: {
    S3: jest.Mock<{
        headBucket: jest.Mock<any, any>;
        deleteObject: jest.Mock<any, any>;
        deleteObjects: jest.Mock<any, any>;
        createBucket: jest.Mock<any, any>;
        listObjects: jest.Mock<any, any>;
        promise: jest.Mock<any, any>;
        catch: jest.Mock<any, any>;
    }, []>;
};
export default AWS;
