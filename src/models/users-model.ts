import { db } from "../db";
import type { CreateUser } from "../v-schemas/user";
import { users, userRoles, type TUser } from "../db/schema";
import { DatabaseError } from "../errors/error-classes/database-errors";
import { PG_ERROR_CODE_MAP } from "../errors/error-configs/pg-error-map";
import pg from "pg";
import { ServerError } from "../errors/error-classes/server-error";
import { HttpClientError, HttpServerError } from "../libs/http-response-code";
import { eq } from "drizzle-orm";
import { ClientError } from "../errors/error-classes/client-error";

const { DatabaseError: PG_DBERROR } = pg;


export class UserModel {

    /**
     * 
     * @param {CreateUser} user  
    */
    static async create(
        user: CreateUser
    ) {
        try {
            await db.transaction(async(tx) => {
                const userResult = await tx.insert(users).values({
                    email: user.email,
                    name: user.name,
                    password: user.password
                }).returning({id: users.userId});
    
                const userId = userResult[0].id;
                
                await tx.insert(userRoles).values({
                    role: user.role as any,
                    userId: userId
                });
            });
        } catch(error: unknown) {
            if (error instanceof PG_DBERROR) {

                const errorMsg = PG_ERROR_CODE_MAP[error.code as string];
                
                if (errorMsg === "Duplicate" && error.detail) {
                    const matches = [...error.detail.matchAll(/\(([^)]+)\)/g)];
                    
                    if (matches.length < 2) {
                        throw new ServerError(
                            "Something went wrong while creating user account, Please try after sometime.",
                            HttpServerError.InternalServerError
                        );
                    }

                    const col = matches[0][1];
                    const value = matches[1][1];

                    throw new ClientError(
                        `User with record ${col}: ${value} already exists.`,
                        HttpClientError.Conflict
                    );
                }
            }
            

            throw new ServerError(
                "Something went wrong while creating user account, Please try after sometime.",
                HttpServerError.InternalServerError
            );
        }
    }
    
    static async fetchColsByCol<K extends keyof TUser>(
        colName: K,
        colValue: TUser[K],
        colsToFetch: (keyof TUser)[]
    ) {
        try {
            const fetchObj = colsToFetch.reduce((acc, col) => {
                acc[col] = users[col as keyof TUser];
    
                return acc;
            }, {} as Record<string, any>);
    
            const result = await db.select(fetchObj).from(users).where(eq(users[colName], colValue));

            if(result.length === 0) {
                throw new ClientError(
                    `User with '${colValue}' doesn't exists`,
                    HttpClientError.NotFound
                );
            }

            return result[0];
        } catch(err: unknown) {
            if(
                err instanceof DatabaseError ||
                err instanceof ServerError ||
                err instanceof ClientError
            ) {
                throw err;
            }

            throw new ServerError(
                "Something went wrong, Please try after sometime.",
                HttpServerError.InternalServerError
            );
        }

    }


    static async fetchColsByEmail<K extends keyof TUser>(
        email: TUser["email"],
        colsToFetch: K[]
    ) {
        try {
            const result = await this.fetchColsByCol(
                "email",
                email,
                colsToFetch
            ) as Pick<TUser, K>;

            if(!colsToFetch.every(item => item in result)) {
                throw new ClientError(
                    `User with email: '${email}' doesn't exists.`,
                    HttpClientError.NotFound
                );
            }

            return result;
        } catch(err: unknown) {
            if(
                err instanceof DatabaseError ||
                err instanceof ServerError ||
                err instanceof ClientError
            ) {
                throw err;
            }

            throw new ServerError(
                "Something went wrong, Please try after sometime.",
                HttpServerError.InternalServerError
            );
        }
    }
};
