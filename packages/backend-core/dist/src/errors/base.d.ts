export class BudibaseError extends Error {
    constructor(message: any, code: any, type: any);
    code: any;
    type: any;
}
