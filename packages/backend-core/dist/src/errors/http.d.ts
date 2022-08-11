export class HTTPError extends GenericError {
    constructor(message: any, httpStatus: any, code?: string, type?: string);
    status: any;
}
import { GenericError } from "./generic";
