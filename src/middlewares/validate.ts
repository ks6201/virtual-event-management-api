import { ObjectValidationError, type ObjectValidator } from "@d3vtool/utils";
import type { NextFunction, Request, Response } from "express";
import { ClientError } from "../errors/error-classes/client-error";
import { HttpClientError } from "../libs/http-response-code";

type Key = "query" | "body" | "params"

/**
 * Validates an object against the specified schema.
 *
 * @param schema - The schema against which the object will be validated.
 * @param key - The key indicating where the Request data is located. It can be one of "query", "body", or "params".
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
                    `For key '${err.key}': ${err.message}`,
                    HttpClientError.BadRequest
                );
            }

            throw err;
        }
        next();
    };
}