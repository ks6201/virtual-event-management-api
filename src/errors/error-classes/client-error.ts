import type { HttpClientError } from "../../libs/http-response-code";

/**
 * Creates an instance of ServerError.
 * 
 * @param message - The error message describing the server issue.
 * @param statusCode - Http response code.
 */
export class ClientError extends Error {
    statusCode;
    
    constructor(
        message: string,
        httpError: HttpClientError
    ) {
        super(message);
        this.name = httpError.errorName;
        this.statusCode = httpError.statusCode;
    }
}
