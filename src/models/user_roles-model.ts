import { eq, type ExtractTablesWithRelations } from "drizzle-orm";
import { db } from "../db";
import { userRoles, type TUserRoles } from "../db/schema";
import type { UUID } from "../libs/types";
import { ServerError } from "../errors/error-classes/server-error";
import { HttpClientError, HttpServerError } from "../libs/http-response-code";
import { ClientError } from "../errors/error-classes/client-error";
import { DatabaseError } from "../errors/error-classes/database-errors";
import { Memoize } from "@d3vtool/ex-frame";
import type { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import type { PgTransaction } from "drizzle-orm/pg-core";

type PGTX = PgTransaction<NodePgQueryResultHKT, Record<string, never>, ExtractTablesWithRelations<Record<string, never>>>

export class UserRoles {

    static async create(
        role: TUserRoles["role"],
        userId: TUserRoles["userId"]
    ) {
        await db.insert(userRoles).values({
            role,
            userId
        });
    }

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