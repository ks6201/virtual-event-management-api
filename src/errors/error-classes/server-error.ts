import type { HttpServerError } from "../../libs/http-response-code";

/**
 * Creates an instance of ServerError.
 * 
 * @param {string} message - The error message describing the server issue.
 * @param {number} statusCode - Http response code.
 */
export class ServerError extends Error {
    statusCode;
    
    constructor(
        message: string,
        httpError: HttpServerError 
    ) {
        super(message);
        this.name = httpError.errorName;
        this.statusCode = httpError.statusCode;
    }
}
