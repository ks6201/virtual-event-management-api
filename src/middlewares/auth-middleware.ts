import type { NextFunction, Request, Response } from "express";
import { IdentityService } from "../services/identity-service";
import { ClientError } from "../errors/error-classes/client-error";
import { HttpClientError } from "../libs/http-response-code";


/**
 * Middleware function that handles authentication for incoming requests.
 * 
 * @param req - The HTTP request object.
 * @param _res - The HTTP response object.
 * @param next - The function to call to pass control to the next middleware or route handler.
 */
export async function authMiddleware(
    req: Request,
    _res: Response,
    next: NextFunction
) {
    const authHeader = req.get('Authorization');

    const token = authHeader?.split(" ")[1]?.trim();

    if(!token) {
        throw new ClientError(
            "Auth token not found.",
            HttpClientError.Unauthorized
        );
    }

    const claims = await IdentityService.verifyJwt(token);

    (req as any).claims = claims;

    next();
}