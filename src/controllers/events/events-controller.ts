import type { UUID } from "../../libs/types";
import type { Events } from "../../db/schema";
import type { Request, Response } from "express";
import { createEventError } from "./error-handlers";
import { validate } from "../../middlewares/validate";
import { mailTemplate } from "../../libs/mail-template";
import { mailService } from "../../services/mail-service";
import { HttpSuccess } from "../../libs/http-response-code";
import { EventService } from "../../services/event-service";
import { authMiddleware } from "../../middlewares/auth-middleware";
import { verifyRole, type Claim } from "../../middlewares/verify-role";
import { defaultServerError } from "../../errors/error-handlers/default-server-error";
import { Delete, ErrorHandler, Get, Middlewares, ParentRoute, Post, Put } from "@d3vtool/ex-frame";
import { vCreateEventSchema, vEventId, vUpdateEventSchema, type CreateEvent } from "../../v-schemas/event";

@ParentRoute("/events")
@ErrorHandler(defaultServerError)
export class EventsController {

    @Post("/")
    @Middlewares(
        validate(vCreateEventSchema, "body"),
        authMiddleware,
        verifyRole("organizer")
    )
    @ErrorHandler(createEventError)
    static async create(
        req: Request,
        res: Response
    ) {
        const eventInfo = req.body as CreateEvent;

        const claims = (req as any).claims as Claim;

        await EventService.create(
            claims.userId,
            eventInfo
        );
        
        res.status(HttpSuccess.Created.statusCode).json({
            status: "success"
        });
    }


    @Get("/")
    @Middlewares(
        authMiddleware,
        verifyRole("organizer")
    )
    static async getAllEvents(
        req: Request,
        res: Response
    ) {
        const claims = (req as any).claims as Claim;

        const events = await EventService.fetchAll(
            claims.userId
        );

        res.json({
            status: "success",
            events
        });
    }


    @Put("/:eventId")
    @Middlewares(
        validate(vEventId, "params"),
        validate(vUpdateEventSchema, "body"),
        authMiddleware,
        verifyRole("organizer")
    )
    static async updateEvent(
        req: Request,
        res: Response
    ) {
        const eventId = req.params.eventId as UUID;
        const updateEventInfo = req.body;

        const claims = (req as any).claims as Claim;

        await EventService.updateById(
            claims.userId,
            eventId,
            updateEventInfo
        );

        res.json({
            status: "success"
        });
    }


    @Delete("/:eventId")
    @Middlewares(
        validate(vEventId, "params"),
        authMiddleware,
        verifyRole("organizer")
    )
    static async deleteEvent(
        req: Request,
        res: Response
    ) {
        const eventId = req.params.eventId as UUID;

        const claims = (req as any).claims as Claim;

        await EventService.deleteById(
            claims.userId,
            eventId
        );

        res.json({
            status: "success"
        });
    }



    @Post("/:eventId/register")
    @Middlewares(
        validate(vEventId, "params"),
        authMiddleware,
        verifyRole("attendee")
    )
    static async registerForEvent(
        req: Request,
        res: Response
    ) {
        const claims = (req as any).claims as Claim;

        const eventId = req.params.eventId as Events["eventId"];

        const attendeeInfo = await EventService.registerAttendeeForEvent(
            eventId,
            claims.userId,
        );

        await mailService.sendMail(
            "VEM (Virtual Event Management)",
            attendeeInfo.user.email,
            "Registration Confirmation",
            mailTemplate(
                attendeeInfo.user.name,
                attendeeInfo.event
            )
        );

        res.json({
            status: "success"
        });
    }


    @Get("/:eventId/attendees")
    @Middlewares(
        validate(vEventId, "params"),
        authMiddleware,
        verifyRole("organizer")
    )
    static async getAttendees(
        req: Request,
        res: Response
    ) {
        const eventId = req.params.eventId as Events["eventId"];
        
        const attendees = await EventService.getAllAttendeesByEventId(
            eventId
        );

        res.json({
            status: "success",
            attendees
        });
    }
}
