import type { Request, Response } from "express";
import { ObjectValidationError } from "@d3vtool/utils";
import { HttpClientError } from "../../libs/http-response-code";
import { validationError } from "../../errors/error-handlers/validation-error";
import { defaultServerError } from "../../errors/error-handlers/default-server-error";


/**
 * Handles errors that occur during the signup process.
 * 
 * @param error - The error object, which could be of any type (unknown).
 * @param req - The HTTP request object containing request data.
 * @param res - The HTTP response object used to send a response to the client.
 */
export function signupError(
    error: unknown,
    req: Request,
    res: Response
) {
    if(error instanceof ObjectValidationError) {
        return validationError(
            error,
            res,
            HttpClientError.BadRequest
        );
    }

    defaultServerError(
        error,
        req,
        res
    );
}


/**
 * Handles errors that occur during the login process.
 * 
 * @param error - The error object, which could be of any type (unknown).
 * @param req - The HTTP request object containing request data.
 * @param res - The HTTP response object used to send a response to the client.
 */
export function loginError(
    error: unknown,
    req: Request,
    res: Response
) {
    if(error instanceof ObjectValidationError) {
        return validationError(
            error,
            res,
            HttpClientError.Unauthorized
        );
    }

    defaultServerError(
        error,
        req,
        res
    );
}
