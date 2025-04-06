import type { TUserRoles } from "../db/schema";
import type { NextFunction, Request, Response } from "express";
import { IdentityService, type CustomClaims } from "../services/identity-service";



export type Claim = Awaited<ReturnType<typeof IdentityService.verifyJwt<CustomClaims>>>;

/**
 * Middleware function that verifies if a user has the required role.
 * 
 * @param expectedUserRole - The role of the user to verify.
 */
export function verifyRole(
    expectedUserRole: TUserRoles["role"]
) {
    return async function(
        req: Request,
        _res: Response,
        next: NextFunction
    ) {
        const claims = (req as any).claims as Claim;
    
        await IdentityService.verifyRole(
            claims.userId,
            claims.role,
            expectedUserRole
        );
    
        next();
    }
}
