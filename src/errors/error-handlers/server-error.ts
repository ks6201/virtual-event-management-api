import type { Response } from "express";
import { isInDevelopmentMode } from "../../libs/utils";
import type { ServerError } from "../error-classes/server-error";


/**
 * Handles server errors and sends an appropriate error response.
 * 
 * @param error - The server-side error object.
 * @param res - The response object used to send the error response.
 */
export function serverError(
    error: ServerError,
    res: Response
) {
        const response = {
            status: "error",
            error: error.name,
            message: error.message,
            stackTrace: isInDevelopmentMode() ?  error.stack : undefined
        }

        res.status(error.statusCode).json(response);
}
