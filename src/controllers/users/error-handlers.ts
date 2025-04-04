import type { Request, Response } from "express";
import { ObjectValidationError } from "@d3vtool/utils";
import { HttpClientError } from "../../libs/http-response-code";
import { validationError } from "../../errors/error-handlers/validation-error";
import { defaultServerError } from "../../errors/error-handlers/default-server-error";



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
