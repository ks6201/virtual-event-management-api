import type { Response } from "express";
import { isInDevelopmentMode } from "../../libs/utils";
import type { ObjectValidationError } from "@d3vtool/utils";
import type { HttpClientError } from "../../libs/http-response-code";


export function validationError(
    error: ObjectValidationError,
    res: Response,
    clientError: HttpClientError
) {
    const response = {
        status: "error",
        error: clientError.errorName,
        message: `Key ${error.key}: ${error.message}`,
        stackTrace: isInDevelopmentMode() ?  error.stack : undefined
    }

    res.status(clientError.statusCode).json(response);
}
