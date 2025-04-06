import { db } from "../db";
import { and, eq, is } from "drizzle-orm";
import type { UUID } from "../libs/types";
import type { CreateEvent } from "../v-schemas/event";
import { ServerError } from "../errors/error-classes/server-error";
import { ClientError } from "../errors/error-classes/client-error";
import { events, type Events, type UpdateEvents } from "../db/schema";
import { HttpClientError, HttpServerError } from "../libs/http-response-code";



export class EventModel {

    /**
     * Inserts a new event data in events table.
     * 
     * @param organizerId - The ID of the organizer creating the event.
     * @param eventInfo - The information about the event.
     */
    static async create(
        organizerId: UUID,
        eventInfo: CreateEvent
    ) {
        try {
            await db.insert(events).values({
                date: eventInfo.date,
                name: eventInfo.name,
                description: eventInfo.description,
                organizerId,
                time: eventInfo.time
            });
        } catch {
            throw new ServerError(
                "Something went wrong while creating new event.",
                HttpServerError.InternalServerError
            );
        }
    }
    

    /**
     * Fetches all events for a specific organizer.

    * @param organizerId - The ID of the organizer whose events are to be fetched.
     */
    static async fetchAll(
        organizerId: UUID
    ) {
        try {
            const result = await db.select()
                .from(events)
                .where(eq(events.organizerId, organizerId));
            return result;
        } catch {
            throw new ServerError(
                "Something went wrong while fetching all events.",
                HttpServerError.InternalServerError
            );
        }
    }


    /**
     * Fetches a specific event by its ID.
     * 
     * @param eventId - The ID of the event to fetch.
     * @param colsToFetch - An array of column names to fetch for the event.
     */
    static async fetchEventById(
        eventId: Events["eventId"],
        colsToFetch?: (keyof Events)[]
    ) {
        try {

            const colMap = colsToFetch?.reduce((acc, col) => {
                acc[col] = events[col]
                return acc;
            }, {} as any);

            const result = await db.select(colMap)
                .from(events)
                .where(eq(events.eventId, eventId));

            if(result.length === 0) {
                throw new ClientError(
                    `Event having id '${eventId}' not found.`,
                    HttpClientError.NotFound
                );
            }

            return result[0];
        } catch(err: unknown) {
            if(
                err instanceof ClientError 
            ) {
                throw err;
            }
            throw new ServerError(
                "Something went wrong while fetching all events.",
                HttpServerError.InternalServerError
            );
        }
    }


    /**
     * Updates a specific event by its ID.
     * 
     * @param organizerId - The ID of the organizer updating the event.
     * @param eventId - The ID of the event to update.
     * @param colsToValueMap - A map of column names to their new values for the event.
     */ 
    static async updateEventById(
        organizerId: UUID,
        eventId: Events["eventId"],
        colsToValueMap: Partial<UpdateEvents>,
    ) {
        try {

            await db.update(events)
                .set(colsToValueMap)
                .where(
                    and(
                        eq(events.eventId, eventId),
                        eq(events.organizerId, organizerId),
                    )
                );

        } catch {
            throw new ServerError(
                `Something went wrong while updating event having Id: '${eventId}'.`,
                HttpServerError.InternalServerError
            );
        }
    }


    /**
     * Deletes a specific event by its ID.
     * 
     * @param organizerId - The ID of the organizer deleting the event.
     * @param eventId - The ID of the event to delete.
     */
    static async deleteEventById(
        organizerId: UUID,
        eventId: Events["eventId"]
    ) {
        try {

            const results = await db.select({
                eventId: events.eventId
            }).from(events).where(eq(events.organizerId, organizerId));

            const isOkay = results.some(result => result.eventId === eventId);

            if(!isOkay) {
                throw new ClientError(
                    `Event with ID '${eventId}' is not found.`,
                    HttpClientError.NotFound
                ); 
            }
            
            await db.delete(events).where(
                and(
                    eq(events.eventId, eventId),
                    eq(events.organizerId, organizerId),
                )
            );

        } catch(err: unknown) {
            
            if(
                err instanceof ClientError
            ) {
                throw err;
            }

            throw new ServerError(
                `Something went wrong while removing event having Id: '${eventId}'.`,
                HttpServerError.InternalServerError
            );
        }
    }
}
