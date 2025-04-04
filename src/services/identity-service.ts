import { BACKEND } from "../config";
import { isUUID, type UUID } from "../libs/types";
import { UserModel } from "../models/users-model";
import { UserRoles } from "../models/user_roles-model";
import type { CreateUser, LoginUser } from "../v-schemas/user";
import { ClientError } from "../errors/error-classes/client-error";
import { ServerError } from "../errors/error-classes/server-error";
import { HttpClientError, HttpServerError } from "../libs/http-response-code";
import { bcryptCompare, bcryptHash, isInDevelopmentMode } from "../libs/utils";
import { createExpiry, createIssueAt, DirtyJwtSignature, ExpiredJwt, InvalidJwt, signJwt, verifyJwt } from "@d3vtool/utils";
import type { TUser, TUserRoles } from "../db/schema";

export type CustomClaims = {
    userId: TUser["userId"],
    role: TUserRoles["role"]
}

export class IdentityService {

    static #JWT_SEC = process.env.JWT_SEC!;

    static async create(
        user: CreateUser
    ) {

        try {
            const userId = await this.getUserIdByEmail(user.email);

            const roles = (await UserRoles.getRolesById(userId)).map(role => role.role);
            
            if(roles.includes(user.role as any)) {
                throw new ClientError(
                    `A user with the email ${user.email} is already registered as ${user.role}.`,
                    HttpClientError.Conflict
                );
            }

            await UserRoles.create(
                user.role as any,
                userId
            )
        } catch(err: unknown) {
            if(!(err instanceof ClientError && err.statusCode === 404)) {   
                throw err;
            }

            const hashedPassword = await this.hashPassword(user.password);
            
            await UserModel.create({
                ...user,
                password: hashedPassword
            });
        }        
    }


    static async getUserIdByEmail(
        userEmail: TUser["email"]
    ) {
        const result = await UserModel.fetchColsByEmail(
            userEmail,
            ["userId"]
        );

        return result?.userId;
    }

    static async hashPassword(
        password: string
    ) {
        const hashedPassword = await bcryptHash(password, 10);

        return hashedPassword;
    }


    static async authenticateUser(
        loginCreds: LoginUser,
        userRole: TUserRoles["role"]
    ) {
        const result = await UserModel.fetchColsByEmail(
            loginCreds.email,
            ["userId", "password"]
        );
        
        try {
            const isOkay = await bcryptCompare(loginCreds.password, result.password);

            if(!isOkay) {
                throw new ClientError(
                    "Invalid login credentials.",
                    HttpClientError.Unauthorized
                );
            }

            
            const doesRoleExists = (await UserRoles.getRolesById(result.userId as UUID))
                .some(role => role.role === userRole);
            
            if(!doesRoleExists) {
                throw new ClientError(
                    "You do not have the required role to access this resource.",
                    HttpClientError.Unauthorized
                );
            }

            return {
                userId: result.userId,
                role: userRole,
            };
        } catch(err: unknown) {
            if(err instanceof ClientError) {
                throw err;
            }

            throw new ServerError(
                "Something went wrong while authenticating, Please try after sometime.",
                HttpServerError.InternalServerError
            );
        }
    }


    static async generateJwtFor(
        audience: string,
        subject: string,
        customClaims: Record<string, string>
    ) {

        const token = await signJwt(
            {
                aud: audience,
                iss: BACKEND.URL,
                exp: createExpiry("1h"),
                sub: subject,
                iat: createIssueAt(new Date(Date.now())),
            },
            customClaims,
            this.#JWT_SEC
        );

        return token;
    }

    /**
     * Verifies the validity of a given JWT (JSON Web Token).
     * 
     * @param token - The JWT to be verified.
     * @returns A promise that resolves to the decoded payload if the token is valid, or throws an error if the token is invalid or expired.
     */
    static async verifyJwt<T extends Record<string, string> & Object>(
        token: string
    ) {
        try {
            return await verifyJwt<T>(token, this.#JWT_SEC);
        } catch(error) {
            if (error instanceof DirtyJwtSignature) {
                throw new ServerError(
                    "JWT signature is invalid or has been tampered with.",
                    HttpClientError.BadRequest
                );
            } else if (error instanceof ExpiredJwt) {
                throw new ServerError(
                    "JWT has expired.",
                    HttpClientError.Unauthorized
                );
            } else if (error instanceof InvalidJwt) {
                throw new ServerError(
                    "JWT is malformed or cannot be decoded.",
                    HttpClientError.BadRequest
                );
            } else {
                throw new ServerError(
                    `${isInDevelopmentMode() ? error : "Error occured while verifying jwt token."}`,
                    HttpServerError.InternalServerError
                );
            }
        }
    }
}
