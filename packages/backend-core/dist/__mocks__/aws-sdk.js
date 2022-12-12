"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mockS3 = {
    headBucket: jest.fn().mockReturnThis(),
    deleteObject: jest.fn().mockReturnThis(),
    deleteObjects: jest.fn().mockReturnThis(),
    createBucket: jest.fn().mockReturnThis(),
    listObjects: jest.fn().mockReturnThis(),
    promise: jest.fn().mockReturnThis(),
    catch: jest.fn(),
};
const AWS = {
    S3: jest.fn(() => mockS3),
};
exports.default = AWS;
//# sourceMappingURL=aws-sdk.js.map