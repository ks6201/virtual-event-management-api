import type { NextFunction, Request, Response } from "express";
import type { CustomClaims, IdentityService } from "../services/identity-service";
import { UserRoles } from "../models/user_roles-model";
import { ClientError } from "../errors/error-classes/client-error";
import { HttpClientError } from "../libs/http-response-code";
import type { TUserRoles } from "../db/schema";



export type Claim = Awaited<ReturnType<typeof IdentityService.verifyJwt<CustomClaims>>>;

export function verifyRole(
    userRole: TUserRoles["role"]
) {
    return async function(
        req: Request,
        _res: Response,
        next: NextFunction
    ) {
        const claims = (req as any).claims as Claim;
    
        const isOkay = (await UserRoles.getRolesById(claims.userId))
            .some(role => (role.role === userRole)  && (claims.role === userRole));
            
        if(!isOkay) {
            throw new ClientError(
                `You do not have permission to access this resource with the role ${claims.role}.`,
                HttpClientError.Forbidden
            );
        }
    
        next();
    }
}
