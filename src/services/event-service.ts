import type { Events, TUser, UpdateEvents } from "../db/schema";
import { ClientError } from "../errors/error-classes/client-error";
import { HttpClientError } from "../libs/http-response-code";
import type { UUID } from "../libs/types";
import { AttendeesEventMapModel } from "../models/attendees-event-map-model";
import { EventModel } from "../models/event-model";
import { UserModel } from "../models/users-model";
import type { CreateEvent } from "../v-schemas/event";



export class EventService {


    /**
     * Creates a new event in the system.
     * 
     * @param {UUID} organizerId - The ID of the organizer who is creating the event.
     * @param {CreateEvent} eventInfo - An object containing the details of the event.
     */
    static async create(
        organizerId: UUID,
        eventInfo: CreateEvent
    ) {
        await EventModel.create(
            organizerId,
            eventInfo
        );
    }

    /**
     * Fetches all events associated with a specific organizer.
     * 
     * @param {UUID} organizerId - The ID of the organizer whose events are to be fetched.
     */
    static async fetchAll(
        organizerId: UUID
    ) {
        return await EventModel.fetchAll(
            organizerId
        );
    }


    /**
     * Updates an event by its ID for a specific organizer.
     *
     * @param {UUID} organizerId - The ID of the organizer who owns the event.
     * @param {UUID} eventId - The ID of the event to update.
     * @param {UpdateEvents} updateEventInfo - The updated event information.
     */
    static async updateById(
        organizerId: UUID,
        eventId: UUID,
        updateEventInfo: UpdateEvents
    ) {
        await EventModel.updateEventById(
            organizerId,
            eventId,
            updateEventInfo
        );
    }


    /**
     * Deletes an event by its ID for a specific organizer.
     *
     * @param {UUID} organizerId - The ID of the organizer who owns the event.
     * @param {UUID} eventId - The ID of the event to delete.
     */
    static async deleteById(
        organizerId: UUID,
        eventId: UUID,
    ) {

        await EventModel.deleteEventById(
            organizerId,
            eventId,
        );
    }


    /**
     * Registers an attendee for a specific event.
     *
     * @param {UUID} eventId - The ID of the event to register for.
     * @param {UUID} attendeeId - The ID of the attendee registering for the event.
     */
    static async registerAttendeeForEvent(
        eventId: Events["eventId"],
        attendeeId: TUser["userId"]
    ) {

        const isPresent = (await AttendeesEventMapModel.isAttendeAlreadyRegistered(
            attendeeId
        )).some(resl => resl.eventId === eventId);
        
        if(isPresent) {
            throw new ClientError(
                "The attendee is already registered for this event.",
                HttpClientError.Conflict
            );
        }

        await AttendeesEventMapModel.create(
            eventId,
            attendeeId
        );

        const eventInfo = await EventModel.fetchEventById(
            eventId,
            ["name", "date", "time"]
        );

        const result = await UserModel.fetchColsByCol(
            "userId",
            attendeeId,
            ["email", "name"]
        );

        return {
            user: result,
            event: eventInfo
        };
    }

    /**
     * Retrieves all attendees for a specific event.
     *
     * @param {UUID} eventId - The ID of the event to get attendees for.
     */
    static async getAllAttendeesByEventId(
        eventId: Events["eventId"]
    ) {
        return await AttendeesEventMapModel
            .getAllAttendees(eventId);
    }

    /**
     * Retrieves all events that a specific attendee is registered for.
     *
     * @param {UUID} attendeeId - The ID of the attendee to get events for.
     */
    static async getAllEventByAttendeeId(
        attendeeId: TUser["userId"]
    ) {
        return await AttendeesEventMapModel
            .getEventsByAttendeeId(attendeeId);
    }
}
