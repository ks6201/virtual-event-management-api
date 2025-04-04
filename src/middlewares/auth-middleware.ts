import type { NextFunction, Request, Response } from "express";
import { IdentityService } from "../services/identity-service";
import { ClientError } from "../errors/error-classes/client-error";
import { HttpClientError } from "../libs/http-response-code";



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