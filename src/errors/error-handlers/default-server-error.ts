import type { Request, Response } from "express";
import { isInDevelopmentMode } from "../../libs/utils";
import { HttpServerError } from "../../libs/http-response-code";
import { ClientError } from "../error-classes/client-error";
import { ServerError } from "../error-classes/server-error";
import { clientError } from "./client-error";
import { serverError } from "./server-error";



export function defaultServerError(
    error: unknown,
    _req: Request,
    res: Response
) {

    // console.log(error);

    if(error instanceof ClientError) {
        return clientError(
            error,
            res
        );
    }

    if(error instanceof ServerError) {
        return serverError(
            error,
            res
        );
    }

    res.status(HttpServerError.InternalServerError.statusCode).json({
        status: "error",
        error: "Unknown",
        message: "Something went wrong!",
        stackTrace: 
            isInDevelopmentMode() && (error instanceof Error) ? 
                error.stack : undefined
    });
}
