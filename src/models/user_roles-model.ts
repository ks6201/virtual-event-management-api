import { eq, type ExtractTablesWithRelations } from "drizzle-orm";
import { db } from "../db";
import { userRoles, type TUserRoles } from "../db/schema";
import type { UUID } from "../libs/types";
import { ServerError } from "../errors/error-classes/server-error";
import { HttpClientError, HttpServerError } from "../libs/http-response-code";
import { ClientError } from "../errors/error-classes/client-error";
import type { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import type { PgTransaction } from "drizzle-orm/pg-core";

type PGTX = PgTransaction<NodePgQueryResultHKT, Record<string, never>, ExtractTablesWithRelations<Record<string, never>>>

export class UserRoles {

    /**
     * To create new 'user_roles'.
     *  
     * @param {"organizer" | "attendee"} role
     * @param {string} userId
    */
    static async create(
        role: TUserRoles["role"],
        userId: TUserRoles["userId"]
    ) {
        await db.insert(userRoles).values({
            role,
            userId
        });
    }

    /**
     * To create new 'user_roles' using transaction client.
     *
     * @param {PgTransaction} tx 
     * @param {"organizer" | "attendee"} role
     * @param {string} userId
    */
    static async tCreate(
        tx: PGTX,
        role: TUserRoles["role"],
        userId: TUserRoles["userId"]
    ) {
        await tx.insert(userRoles).values({
            role,
            userId
        });
    }

    /**
     * Fetches the roles associated with a specific user by their ID.
     * 
     * @param {string} userId - The ID of the user whose roles are to be fetched.
     */
    static async getRolesById(
        userId: UUID
    ) {
        try {
            const result = await db.select({
                role: userRoles.role
            }).from(userRoles).where(eq(userRoles.userId, userId as string));
    
            if(result.length === 0) {
                throw new ClientError(
                    `User with User Id '${userId}' doesn't exists.`,
                    HttpClientError.NotFound
                );
            }

            return result;

        } catch(err: unknown) {            
            if(
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
}