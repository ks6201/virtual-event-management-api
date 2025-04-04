import type { Events, TUser, UpdateEvents } from "../db/schema";
import { ClientError } from "../errors/error-classes/client-error";
import { HttpClientError } from "../libs/http-response-code";
import type { UUID } from "../libs/types";
import { AttendeesEventMapModel } from "../models/attendees-event-map-model";
import { EventModel } from "../models/event-model";
import { UserModel } from "../models/users-model";
import type { CreateEvent } from "../v-schemas/event";



export class EventService {


    static async create(
        organizerId: UUID,
        eventInfo: CreateEvent
    ) {
        await EventModel.create(
            organizerId,
            eventInfo
        );
    }

    static async fetchAll(
        organizerId: UUID
    ) {
        return await EventModel.fetchAll(
            organizerId
        );
    }

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

    static async deleteById(
        organizerId: UUID,
        eventId: UUID,
    ) {

        await EventModel.deleteEventById(
            organizerId,
            eventId,
        );
    }


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

    static async getAllAttendeesByEventId(
        eventId: Events["eventId"]
    ) {
        return await AttendeesEventMapModel
            .getAllAttendees(eventId);
    }

    static async getAllEventByAttendeeId(
        attendeeId: TUser["userId"]
    ) {
        return await AttendeesEventMapModel
            .getEventsByAttendeeId(attendeeId);
    }
}
