import { db } from "../db";
import { eq } from "drizzle-orm";
import { EventModel } from "./event-model";
import type { UUID } from "../libs/types";
import { ServerError } from "../errors/error-classes/server-error";
import { ClientError } from "../errors/error-classes/client-error";
import { PG_ERROR_CODE_MAP } from "../errors/error-configs/pg-error-map";
import { attendeesEventMap, type Events, type TUser } from "../db/schema";
import { HttpClientError, HttpServerError } from "../libs/http-response-code";



export class AttendeesEventMapModel {
    
    static async create(
        eventId: Events["eventId"],
        attendeeId: TUser["userId"]   
    ) {
        try {
            await db.insert(attendeesEventMap).values({
                eventId,
                attendeeId
            });
        } catch(err: unknown) {
            if(PG_ERROR_CODE_MAP[(err as any)?.code] === "Foreign key violation") {
                throw new ClientError(
                    `EventId '${eventId}' not found.`,
                    HttpClientError.NotFound
                );
            }
            throw new ServerError(
                "Something went wrong while registering for event, Please try after sometime.",
                HttpServerError.InternalServerError
            )
        }
    }
    
    static async isAttendeAlreadyRegistered(
        attendeeId: TUser["userId"]
    ) {
        try {
            const result = await db.select({
                eventId: attendeesEventMap.eventId
            }).from(attendeesEventMap).where(eq(attendeesEventMap.attendeeId, attendeeId));

            return result;
        } catch {            
            throw new ServerError(
                "Something went wrong while registering for event, Please try after sometime.",
                HttpServerError.InternalServerError
            )
        }

    }
        
    static async getAllAttendees(
        eventId: Events["eventId"]
    ) {
        try {
            const result = await db.select({
                id: attendeesEventMap.id,
                eventId: attendeesEventMap.eventId,
                attendeeId: attendeesEventMap.attendeeId
            }).from(attendeesEventMap)
                .where(eq(attendeesEventMap.eventId, eventId));

            if(result.length === 0) {
                throw new ClientError(
                    `Event having id: '${eventId} doesn't exists.'`,
                    HttpClientError.NotFound
                )
            }

            return result;
        } catch(err) {
            if(
                err instanceof ClientError
            ) {
                throw err;
            }
                       
            throw new ServerError(
                "Something went wrong while registering for event, Please try after sometime.",
                HttpServerError.InternalServerError
            )
        }
    }

    static async getEventsByAttendeeId(
        attendeeId: TUser["userId"]
    ) {
        try {
            const result = await db.select({
                eventId: attendeesEventMap.eventId
            }).from(attendeesEventMap).where(eq(attendeesEventMap.attendeeId, attendeeId));
    
            const promises = result
                .map(resl => EventModel.fetchEventById(
                    resl.eventId as UUID,
                    ["name", "date", "time", "eventId"]
                ));
            
            const events = await Promise.all(promises);

            return events;
        } catch {
            throw new ServerError(
                "Something went wrong while registering for event, Please try after sometime.",
                HttpServerError.InternalServerError
            )
        }
    }
}
