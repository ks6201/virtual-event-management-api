import { ObjectValidationError } from "@d3vtool/utils";
import type { Request, Response } from "express";
import { validationError } from "../../errors/error-handlers/validation-error";
import { HttpClientError } from "../../libs/http-response-code";
import { defaultServerError } from "../../errors/error-handlers/default-server-error";


/**
 * Handles errors that occur during the event creation process.
 * 
 * @param {unknown} error - The error object.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
export function createEventError(
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