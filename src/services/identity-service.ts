import { BACKEND } from "../config";
import { compare, hash } from "bcryptjs";
import { type UUID } from "../libs/types";
import { UserModel } from "../models/users-model";
import { isInDevelopmentMode } from "../libs/utils";
import { UserRoles } from "../models/user_roles-model";
import type { TUser, TUserRoles } from "../db/schema";
import type { CreateUser, LoginUser } from "../v-schemas/user";
import { ClientError } from "../errors/error-classes/client-error";
import { ServerError } from "../errors/error-classes/server-error";
import { HttpClientError, HttpServerError } from "../libs/http-response-code";
import { createExpiry, createIssueAt, DirtyJwtSignature, ExpiredJwt, InvalidJwt, signJwt, verifyJwt } from "@d3vtool/utils";

export type CustomClaims = {
    userId: TUser["userId"],
    role: TUserRoles["role"]
}

export class IdentityService {

    static #JWT_SEC = process.env.JWT_SEC!;

    /**
     * Creates a new user in the system.
     * 
     * @param user - The user object containing the details of the new user.
     */
    static async create(
        user: CreateUser
    ) {

        try {
            const userId = await this.getUserIdByEmail(user.email);

            const roles = (await UserRoles.getRolesById(userId)).map(role => role.role);
            
            if(roles.includes(user.role as any)) {
                throw new ClientError(
                    `A user with the email '${user.email}' is already registered as '${user.role}'.`,
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


    /**
     * Retrieves the user ID associated with the provided email address.
     * 
     * @param userEmail - The email address of the user whose ID is to be retrieved.
     */
    static async getUserIdByEmail(
        userEmail: TUser["email"]
    ) {
        const result = await UserModel.fetchColsByEmail(
            userEmail,
            ["userId"]
        );

        return result?.userId;
    }

    /**
     * Hashes a given password using a bcrypt.
     * 
     * @param password - The plain text password that needs to be hashed.
     */
    static async hashPassword(
        password: string
    ) {
        const hashedPassword = await hash(password, 10);

        return hashedPassword;
    }

    /**
     * Verifies if a user has the expected role.
     * 
     * @param userId - The unique identifier of the user whose role is being verified.
     * @param claimedRole - The role claimed by the user.
     * @param expectedUserRole - The role that is expected for the user.
     * 
     */
    static async verifyRole(
        userId: TUser["userId"],
        claimedRole: TUserRoles["role"],
        expectedUserRole: TUserRoles["role"]
    ): Promise<void | never> {
        const isOkay = (await UserRoles.getRolesById(userId))
            .some(role => (role.role === expectedUserRole)  && (claimedRole === expectedUserRole));


        if(!isOkay) {
            throw new ClientError(
                `You do not have permission to access this resource with the role '${claimedRole}'.`,
                HttpClientError.Forbidden
            );
        }
    }


    /**
     * Authenticates a user based on login credentials and their role ("attendee" or "organizer").
     * 
     * @param loginCreds - The login credentials, including email, password, and role.
     * @param userRole - The role of the user to be authenticated (either "attendee" or "organizer").
     */
    static async authenticateUser(
        loginCreds: LoginUser,
        userRole: TUserRoles["role"]
    ) {
        const result = await UserModel.fetchColsByEmail(
            loginCreds.email,
            ["userId", "password"]
        );
        
        try {
            const isOkay = await compare(loginCreds.password, result.password);

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


    /**
     * Generates a JSON Web Token (JWT) for a specified audience and subject.
     * 
     * @param audience - The intended audience for the JWT, usually a service or system the token is meant for.
     * @param subject - The subject of the JWT, typically the user or entity the token represents.
     * @param customClaims - A set of custom claims to include in the JWT payload. Each claim should be a key-value pair.
     */
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
