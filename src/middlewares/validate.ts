import { ObjectValidationError, type ObjectValidator } from "@d3vtool/utils";
import type { NextFunction, Request, Response } from "express";
import { ClientError } from "../errors/error-classes/client-error";
import { HttpClientError } from "../libs/http-response-code";

type Key = "query" | "body" | "params"

/**
 * Middleware function that validates incoming data against a schema.
 * 
 * @param {Object} schema - The schema to validate the incoming data against.
 * @param {"query" | "body" | "params"} key - The key indicating where to find the data to validate.
 */
export function validate<T extends ObjectValidator<any>>(
    schema: T,
    key: Key
) {

    return (
        req: Request, 
        _res: Response, 
        next: NextFunction
    ) => {
        const data = (req as any)[key];

        try {
            schema.validate(data);
        } catch(err: unknown) {
            if(err instanceof ObjectValidationError) {
                throw new ClientError(
                    err.message,
                    HttpClientError.BadRequest
                );
            }

            throw err;
        }
        next();
    };
}